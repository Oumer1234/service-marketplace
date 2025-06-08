'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const StarRating = ({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  className = '',
}: StarRatingProps) => {
  // Calculate full and partial stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Determine star size
  const starSizeClass = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }[size];

  // Generate stars
  const stars = [];

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`full-${i}`}
        className={`${starSizeClass} fill-primary text-primary`}
      />
    );
  }

  // Add half star if needed
  if (hasHalfStar && fullStars < maxRating) {
    stars.push(
      <div key="half" className="relative">
        <Star className={`${starSizeClass} text-muted-foreground`} />
        <div className="absolute inset-0 overflow-hidden w-1/2">
          <Star className={`${starSizeClass} fill-primary text-primary`} />
        </div>
      </div>
    );
  }

  // Add empty stars
  const emptyStarCount = maxRating - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStarCount; i++) {
    stars.push(
      <Star
        key={`empty-${i}`}
        className={`${starSizeClass} text-muted-foreground`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">{stars}</div>
      {showValue && (
        <span className="text-sm font-medium ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
