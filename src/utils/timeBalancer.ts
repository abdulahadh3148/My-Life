import { Activity, FreeSlot, OverlapConflict, ProposedAdjustment } from '../types';
import { parseTimeToMinutes, minutesToTimeString, calculateDurationMinutes, formatDuration } from './time';

/**
 * Smart Time Balancer: Rule-based Schedule Assistant
 *
 * Rules:
 * 1. Check for overlapping activities.
 * 2. Preserve fixed activities (Never silently move fixed activities).
 * 3. Identify flexible activities.
 * 4. Calculate available time slots.
 * 5. Suggest alternative non-conflicting time slots for flexible activities.
 * 6. Explain every scheduling conflict with transparency.
 * 7. Require user confirmation before applying.
 */

export function detectOverlaps(activities: Activity[]): OverlapConflict[] {
  const conflicts: OverlapConflict[] = [];
  if (activities.length < 2) return conflicts;

  // Sort activities by start time
  const sorted = [...activities].sort((a, b) => {
    return parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime);
  });

  for (let i = 0; i < sorted.length; i++) {
    const actA = sorted[i];
    const startA = parseTimeToMinutes(actA.startTime);
    let endA = parseTimeToMinutes(actA.endTime);
    // Handle overnight crossing
    if (endA <= startA) endA += 1440;

    for (let j = i + 1; j < sorted.length; j++) {
      const actB = sorted[j];
      const startB = parseTimeToMinutes(actB.startTime);
      let endB = parseTimeToMinutes(actB.endTime);
      if (endB <= startB) endB += 1440;

      // Check if B starts before A ends
      if (startB < endA) {
        const overlapStart = Math.max(startA, startB);
        const overlapEnd = Math.min(endA, endB);
        const overlapMinutes = overlapEnd - overlapStart;

        if (overlapMinutes > 0) {
          let explanation = '';
          if (actA.isFixed && actB.isFixed) {
            explanation = `Double Fixed Conflict: "${actA.title}" and "${actB.title}" are both locked commitments. Neither can be shifted automatically without manual review.`;
          } else if (actA.isFixed && !actB.isFixed) {
            explanation = `"${actB.title}" is flexible and overlaps with locked event "${actA.title}" by ${overlapMinutes} minutes. It can be moved to an open slot.`;
          } else if (!actA.isFixed && actB.isFixed) {
            explanation = `"${actA.title}" is flexible and collides with locked event "${actB.title}" by ${overlapMinutes} minutes. It can be moved to an open slot.`;
          } else {
            explanation = `Both "${actA.title}" and "${actB.title}" are flexible and clash by ${overlapMinutes} minutes. One can be shifted to a later available window.`;
          }

          conflicts.push({
            id: `${actA.id}-${actB.id}`,
            activityA: actA,
            activityB: actB,
            overlapMinutes,
            explanation
          });
        }
      }
    }
  }

  return conflicts;
}

export function findFreeSlots(
  activities: Activity[],
  dayStartMinutes: number = 300, // 05:00 AM (Fajr/Wake)
  dayEndMinutes: number = 1380    // 11:00 PM (Bedtime)
): FreeSlot[] {
  if (activities.length === 0) {
    return [{
      start: minutesToTimeString(dayStartMinutes),
      end: minutesToTimeString(dayEndMinutes),
      durationMinutes: dayEndMinutes - dayStartMinutes
    }];
  }

  // Merge occupied intervals
  const occupiedIntervals: { start: number; end: number }[] = activities
    .map(act => {
      const s = parseTimeToMinutes(act.startTime);
      let e = parseTimeToMinutes(act.endTime);
      if (e <= s) e = 1440;
      return { start: Math.max(dayStartMinutes, s), end: Math.min(dayEndMinutes, e) };
    })
    .filter(i => i.end > i.start)
    .sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number }[] = [];
  for (const interval of occupiedIntervals) {
    if (merged.length === 0) {
      merged.push({ ...interval });
    } else {
      const last = merged[merged.length - 1];
      if (interval.start <= last.end) {
        last.end = Math.max(last.end, interval.end);
      } else {
        merged.push({ ...interval });
      }
    }
  }

  const freeSlots: FreeSlot[] = [];
  let currentCursor = dayStartMinutes;

  for (const interval of merged) {
    if (interval.start > currentCursor) {
      const gap = interval.start - currentCursor;
      if (gap >= 15) { // Minimum meaningful slot 15 mins
        freeSlots.push({
          start: minutesToTimeString(currentCursor),
          end: minutesToTimeString(interval.start),
          durationMinutes: gap
        });
      }
    }
    currentCursor = Math.max(currentCursor, interval.end);
  }

  if (dayEndMinutes > currentCursor) {
    const gap = dayEndMinutes - currentCursor;
    if (gap >= 15) {
      freeSlots.push({
        start: minutesToTimeString(currentCursor),
        end: minutesToTimeString(dayEndMinutes),
        durationMinutes: gap
      });
    }
  }

  return freeSlots;
}

export interface RebalanceResult {
  conflicts: OverlapConflict[];
  adjustments: ProposedAdjustment[];
  unresolvedCount: number;
  isBalanced: boolean;
  message: string;
}

export function generateRebalanceProposal(
  activities: Activity[],
  dayStartMinutes: number = 300,
  dayEndMinutes: number = 1380
): RebalanceResult {
  const conflicts = detectOverlaps(activities);
  if (conflicts.length === 0) {
    return {
      conflicts: [],
      adjustments: [],
      unresolvedCount: 0,
      isBalanced: true,
      message: 'Your schedule is currently harmonious. No overlapping activities detected.'
    };
  }

  const adjustments: ProposedAdjustment[] = [];
  const lockedIds = new Set<string>();

  // Fixed activities cannot be moved
  activities.forEach(act => {
    if (act.isFixed) {
      lockedIds.add(act.id);
    }
  });

  // Working copy of occupied slots initially populated by fixed activities
  const fixedActivities = activities.filter(a => a.isFixed);
  let tentativeSchedule = [...fixedActivities];

  // Activities to place: all flexible activities sorted by priority
  const priorityWeight: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  const flexibleActivities = activities
    .filter(a => !a.isFixed)
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

  let unresolvedCount = 0;

  for (const flexAct of flexibleActivities) {
    const duration = calculateDurationMinutes(flexAct.startTime, flexAct.endTime);
    const origStart = parseTimeToMinutes(flexAct.startTime);

    // Check if original slot is available in tentative schedule
    const hasCollisionAtOriginal = tentativeSchedule.some(other => {
      const oStart = parseTimeToMinutes(other.startTime);
      let oEnd = parseTimeToMinutes(other.endTime);
      if (oEnd <= oStart) oEnd += 1440;

      let myEnd = origStart + duration;
      return origStart < oEnd && myEnd > oStart;
    });

    if (!hasCollisionAtOriginal) {
      // Keep original slot without adjustment
      tentativeSchedule.push(flexAct);
    } else {
      // Need to find an open slot in tentativeSchedule
      const freeSlots = findFreeSlots(tentativeSchedule, dayStartMinutes, dayEndMinutes);
      // Prefer slot closest to original start time that fits duration
      const eligibleSlots = freeSlots.filter(s => s.durationMinutes >= duration);

      if (eligibleSlots.length > 0) {
        // Find slot closest to original start
        eligibleSlots.sort((s1, s2) => {
          const diff1 = Math.abs(parseTimeToMinutes(s1.start) - origStart);
          const diff2 = Math.abs(parseTimeToMinutes(s2.start) - origStart);
          return diff1 - diff2;
        });

        const chosenSlot = eligibleSlots[0];
        const newStartMin = parseTimeToMinutes(chosenSlot.start);
        const newEndMin = newStartMin + duration;
        const newStartStr = minutesToTimeString(newStartMin);
        const newEndStr = minutesToTimeString(newEndMin);

        adjustments.push({
          activityId: flexAct.id,
          activityTitle: flexAct.title,
          currentStart: flexAct.startTime,
          currentEnd: flexAct.endTime,
          proposedStart: newStartStr,
          proposedEnd: newEndStr,
          reason: `Moved away from conflicting slot to available free window (${formatDuration(duration)})`
        });

        // Add to tentative schedule so next flexible item doesn't overlap it
        tentativeSchedule.push({
          ...flexAct,
          startTime: newStartStr,
          endTime: newEndStr
        });
      } else {
        // Cannot fit
        unresolvedCount++;
      }
    }
  }

  // Double check if any conflicts exist between two fixed activities
  const hasDoubleFixedConflict = conflicts.some(c => c.activityA.isFixed && c.activityB.isFixed);

  const isBalanced = conflicts.length > 0 && unresolvedCount === 0 && !hasDoubleFixedConflict && adjustments.length > 0;

  let message = '';
  if (hasDoubleFixedConflict) {
    message = 'Scheduling conflict includes locked (Fixed) activities that cannot be automatically shifted. Please adjust one of the fixed activities manually.';
  } else if (unresolvedCount > 0) {
    message = `Found ${conflicts.length} conflict(s). Proposed ${adjustments.length} adjustment(s), but ${unresolvedCount} activity could not find enough free continuous time in the day.`;
  } else {
    message = `Smart Balancer successfully identified safe, non-conflicting time slots for ${adjustments.length} flexible activity(ies) while preserving all locked commitments.`;
  }

  return {
    conflicts,
    adjustments,
    unresolvedCount,
    isBalanced,
    message
  };
}

export function applyAdjustments(activities: Activity[], adjustments: ProposedAdjustment[]): Activity[] {
  const adjustmentMap = new Map<string, ProposedAdjustment>();
  adjustments.forEach(adj => adjustmentMap.set(adj.activityId, adj));

  return activities.map(act => {
    const adj = adjustmentMap.get(act.id);
    if (adj) {
      return {
        ...act,
        startTime: adj.proposedStart,
        endTime: adj.proposedEnd
      };
    }
    return act;
  });
}
