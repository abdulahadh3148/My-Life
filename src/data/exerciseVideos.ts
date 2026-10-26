export interface ExerciseGuide {
  id: string;
  name: string;
  targetMuscle: string;
  category: 'abs' | 'full_body' | 'mobility';
  videoEmbedId: string; // YouTube verified embed video ID
  videoTitle: string;
  durationOrReps: string;
  techniqueCues: string[];
  commonMistakes: string[];
  breathingGuidance: string;
  svgIconType: 'plank' | 'crunch' | 'leg_raise' | 'bicycle' | 'climber' | 'squat' | 'pushup' | 'twist';
}

export const EXERCISE_GUIDES: Record<string, ExerciseGuide> = {
  'Forearm Plank with Squeeze': {
    id: 'guide-plank',
    name: 'Forearm Plank with Squeeze',
    targetMuscle: 'Transverse Abdominis, Glutes & Shoulder Girdle',
    category: 'abs',
    videoEmbedId: 'ASdvN_XEl_c',
    videoTitle: 'How to Do a Forearm Plank Correctly',
    durationOrReps: '45 seconds',
    techniqueCues: [
      'Elbows stacked directly underneath shoulders.',
      'Squeeze glutes and engage quads to create a rigid straight line.',
      'Pull navel firmly upward toward spine without arching lower back.',
      'Maintain neutral cervical spine; look at the floor between your hands.'
    ],
    commonMistakes: [
      'Sagging hips putting tension into lumbar spine.',
      'Piking hips too high in the air.',
      'Holding breath instead of deep rhythmic diaphragmatic breathing.'
    ],
    breathingGuidance: 'Exhale deliberately while drawing your abdominal wall inward; inhale calmly through your nose.',
    svgIconType: 'plank'
  },
  'Controlled Bicycle Crunches': {
    id: 'guide-bicycle',
    name: 'Controlled Bicycle Crunches',
    targetMuscle: 'Internal & External Obliques, Upper Rectus Abdominis',
    category: 'abs',
    videoEmbedId: '9FGilxCbdz8',
    videoTitle: 'How to Do Bicycle Crunches with Perfect Form',
    durationOrReps: '20 controlled reps',
    techniqueCues: [
      'Interlace fingers lightly behind ears, keeping elbows wide.',
      'Lift both shoulder blades completely off the floor before rotating.',
      'Slow 2-second rotation tempo per side rather than flailing frantically.',
      'Extend the non-working leg straight out at a 45-degree angle.'
    ],
    commonMistakes: [
      'Yanking neck forward with hands.',
      'Rushing the movement without feeling rotational oblique contraction.',
      'Letting the lower back arch away from the floor.'
    ],
    breathingGuidance: 'Exhale crisply as your armpit twists toward the opposite knee; inhale as you transition center.',
    svgIconType: 'bicycle'
  },
  'Lying Leg Raises with Hip Lift': {
    id: 'guide-leg-raise',
    name: 'Lying Leg Raises with Hip Lift',
    targetMuscle: 'Lower Rectus Abdominis & Hip Flexor Stabilizers',
    category: 'abs',
    videoEmbedId: 'l4kQd9eWclE',
    videoTitle: 'Proper Technique for Lying Leg Raises',
    durationOrReps: '15 repetitions',
    techniqueCues: [
      'Press your lower back firmly flat into the floor (posterior pelvic tilt).',
      'Keep legs straight or with a soft micro-bend in knees.',
      'Lower legs slowly under tension until 2 inches above the ground.',
      'At the top, perform a subtle 1-inch hip pulse lift straight toward the ceiling.'
    ],
    commonMistakes: [
      'Allowing lower back to hyperextend or arch off the mat.',
      'Swinging legs with momentum instead of abdominal force.',
      'Dropping legs too quickly on the eccentric lowering phase.'
    ],
    breathingGuidance: 'Inhale smoothly as you lower your legs; exhale forcefully as you drive them upward.',
    svgIconType: 'leg_raise'
  },
  'Standard Floor Crunches': {
    id: 'guide-crunch',
    name: 'Standard Floor Crunches',
    targetMuscle: 'Upper & Mid Rectus Abdominis',
    category: 'abs',
    videoEmbedId: 'Xyd_fa5zoEU',
    videoTitle: 'How to Do an Abdominal Floor Crunch',
    durationOrReps: '20 repetitions',
    techniqueCues: [
      'Feet flat on floor hip-width apart, knees bent at 90 degrees.',
      'Curl ribcage down toward pelvic bones, flexing the upper spine.',
      'Keep a fist-sized distance between chin and chest at all times.',
      'Hold the peak contraction at the top for 1 full second.'
    ],
    commonMistakes: [
      'Pulling on the back of the neck with hands.',
      'Lifting entire lower back off the ground like a sit-up.'
    ],
    breathingGuidance: 'Exhale completely at the top squeeze; inhale as you lower your upper back.',
    svgIconType: 'crunch'
  },
  'Mountain Climbers Pace Control': {
    id: 'guide-climber',
    name: 'Mountain Climbers Pace Control',
    targetMuscle: 'Core Endurance, Rectus Abdominis & Cardio',
    category: 'full_body',
    videoEmbedId: 'nmwgirgXLYM',
    videoTitle: 'How to Do Mountain Climbers with Core Engagement',
    durationOrReps: '35 seconds',
    techniqueCues: [
      'Start in a tall push-up plank with shoulders over wrists.',
      'Drive one knee straight toward chest without bouncing hips upward.',
      'Maintain an unbroken flat back line from head to heels.',
      'Light, rhythmic toe taps behind you.'
    ],
    commonMistakes: [
      'Bouncing hips wildly up and down.',
      'Letting shoulders drift backward behind wrists.'
    ],
    breathingGuidance: 'Maintain steady, paced breathing matching every second stride.',
    svgIconType: 'climber'
  },
  'Russian Twists': {
    id: 'guide-twist',
    name: 'Russian Twists',
    targetMuscle: 'Obliques, Rotational Core & Deep Hip Flexors',
    category: 'abs',
    videoEmbedId: 'wkD8rjkodUI',
    videoTitle: 'How to Do Russian Twists Correctly',
    durationOrReps: '24 repetitions',
    techniqueCues: [
      'Sit with knees bent, torso reclined at a 45-degree angle.',
      'Keep chest elevated and spine long; do not hunch shoulders.',
      'Rotate ribs and shoulders from side to side, touching hands to floor.',
      'Heels can rest lightly on floor for stability or elevate 2 inches for challenge.'
    ],
    commonMistakes: [
      'Only moving arms while torso remains stationary.',
      'Rounding the lower back into lumbar flexion.'
    ],
    breathingGuidance: 'Exhale on each lateral rotation; inhale through center transition.',
    svgIconType: 'twist'
  },
  'Bodyweight Air Squats': {
    id: 'guide-squat',
    name: 'Bodyweight Air Squats',
    targetMuscle: 'Quadriceps, Glutes, Hamstrings & Core Posture',
    category: 'full_body',
    videoEmbedId: 'aclHkVaku9U',
    videoTitle: 'How to Do a Proper Bodyweight Squat',
    durationOrReps: '20 repetitions',
    techniqueCues: [
      'Feet shoulder-width apart, toes turned slightly outward (5 to 15 degrees).',
      'Break at hips and knees simultaneously, descending until thighs are parallel.',
      'Keep knees tracking in line with second toes; do not allow knees to cave in.',
      'Torso stays proud and upright; drive through mid-foot and heels to stand.'
    ],
    commonMistakes: [
      'Knees collapsing inward (valgus collapse).',
      'Weight shifting onto toes, lifting heels off the floor.'
    ],
    breathingGuidance: 'Inhale during descent; exhale powerfully as you drive up to standing.',
    svgIconType: 'squat'
  },
  'Push-Up to Side Plank': {
    id: 'guide-pushup',
    name: 'Push-Up to Side Plank',
    targetMuscle: 'Pectorals, Anterior Deltoids, Triceps & Lateral Core',
    category: 'full_body',
    videoEmbedId: 'IODxDxX7oi4',
    videoTitle: 'How to Do Push-Ups & Side Plank Rotations',
    durationOrReps: '12 repetitions',
    techniqueCues: [
      'Hands slightly wider than shoulder-width, fingers spread.',
      'Lower chest until elbow is at 90 degrees, elbows tucked at 45-degree angle.',
      'Push up firmly, then rotate torso into a side plank, reaching top arm high.',
      'Alternate rotating to left and right sides.'
    ],
    commonMistakes: [
      'Flaring elbows out at 90 degrees straining shoulder joints.',
      'Sagging midsection during the push-up phase.'
    ],
    breathingGuidance: 'Inhale down; exhale as you push up and open into the side plank.',
    svgIconType: 'pushup'
  }
};

export function getExerciseGuide(exerciseName: string): ExerciseGuide {
  // Exact match
  if (EXERCISE_GUIDES[exerciseName]) {
    return EXERCISE_GUIDES[exerciseName];
  }

  // Substring match
  const lower = exerciseName.toLowerCase();
  for (const [key, guide] of Object.entries(EXERCISE_GUIDES)) {
    if (lower.includes('plank') && key.toLowerCase().includes('plank')) return guide;
    if (lower.includes('bicycle') && key.toLowerCase().includes('bicycle')) return guide;
    if (lower.includes('leg raise') && key.toLowerCase().includes('leg raise')) return guide;
    if (lower.includes('twist') && key.toLowerCase().includes('twist')) return guide;
    if (lower.includes('climber') && key.toLowerCase().includes('climber')) return guide;
    if (lower.includes('squat') && key.toLowerCase().includes('squat')) return guide;
    if (lower.includes('push') && key.toLowerCase().includes('push')) return guide;
    if (lower.includes('crunch') && key.toLowerCase().includes('crunch')) return guide;
  }

  // Default fallback to plank guide
  return EXERCISE_GUIDES['Forearm Plank with Squeeze'];
}
