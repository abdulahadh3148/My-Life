import React from 'react';
import { LiveHeroCard } from './LiveHeroCard';
import { PrayerStrip } from './PrayerStrip';
import { QuickWorkWidget } from './QuickWorkWidget';
import { StatusPillsWidget } from './StatusPillsWidget';
import { TodayTimelineSnippet } from './TodayTimelineSnippet';
import { DailyHabitsWidget } from './DailyHabitsWidget';
import { WeeklyGoalsWidget } from './WeeklyGoalsWidget';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-5 pb-safe-nav animate-in fade-in">
      {/* Hero Summary & Momentum */}
      <LiveHeroCard />

      {/* Prayer Tracker Strip */}
      <PrayerStrip />

      {/* Work Focus & Daily Health/Garden Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <QuickWorkWidget />
        <StatusPillsWidget />
      </div>

      {/* Timeline & Habits / Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TodayTimelineSnippet />
        </div>
        <div className="space-y-4">
          <DailyHabitsWidget />
          <WeeklyGoalsWidget />
        </div>
      </div>
    </div>
  );
};
