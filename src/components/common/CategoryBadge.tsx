import React from 'react';
import {
  Moon,
  Briefcase,
  Flame,
  Sprout,
  Utensils,
  Code2,
  GraduationCap,
  Rocket,
  Heart,
  Coffee,
  Bed,
  Sparkles
} from 'lucide-react';
import { ActivityCategory } from '../../types';
import { CATEGORIES } from '../../data/initialData';

interface CategoryBadgeProps {
  category: ActivityCategory;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

const CATEGORY_ICONS: Record<ActivityCategory, React.ComponentType<{ className?: string }>> = {
  prayer: Moon,
  work: Briefcase,
  exercise: Flame,
  gardening: Sprout,
  meals: Utensils,
  coding: Code2,
  learning: GraduationCap,
  personal_projects: Rocket,
  family: Heart,
  rest: Coffee,
  sleep: Bed,
  other: Sparkles
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  showIcon = true,
  size = 'md'
}) => {
  const meta = CATEGORIES[category] || CATEGORIES.other;
  const IconComponent = CATEGORY_ICONS[category] || Sparkles;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium border ${meta.bgColor} ${meta.darkBgColor} ${sizeClasses}`}
    >
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{meta.label}</span>
    </span>
  );
};
