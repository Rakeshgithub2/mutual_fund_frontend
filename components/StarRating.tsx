'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  className?: string;
}

export function StarRating({
  value,
  onChange,
  disabled = false,
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number>(0);

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!disabled) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverValue(0);
    }
  };

  return (
    <div className={cn('flex gap-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverValue || value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            className={cn(
              'p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded',
              !disabled && 'hover:scale-110 cursor-pointer',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                'w-8 h-8 transition-all duration-200',
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-transparent text-gray-300 dark:text-gray-600',
                !disabled && hoverValue >= star && 'scale-110'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
