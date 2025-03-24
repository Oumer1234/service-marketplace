'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import StarRating from '@/components/common/StarRating';
import { Review } from '@/types';

interface ReviewListProps {
  reviews: Review[];
  title?: string;
}

type SortOption = 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating';

const ReviewList = ({ reviews, title = 'Reviews' }: ReviewListProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [expanded, setExpanded] = useState(false);

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'highest_rating':
        return b.rating - a.rating;
      case 'lowest_rating':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  // Display only first 3 reviews if not expanded
  const displayedReviews = expanded ? sortedReviews : sortedReviews.slice(0, 3);

  const handleSort = (option: SortOption) => {
    setSortBy(option);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Calculate average rating
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  // Rating distribution
  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          {title}
          <span className="text-sm font-normal text-muted-foreground">
            ({reviews.length})
          </span>
        </h3>
        <div className="flex items-center mt-2 md:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Sort by
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort('newest')}>
                Newest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('oldest')}>
                Oldest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('highest_rating')}>
                Highest rating
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('lowest_rating')}>
                Lowest rating
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Rating summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center md:flex-row md:gap-6">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
                <StarRating rating={averageRating} size="lg" />
                <span className="text-sm text-muted-foreground mt-1">
                  {reviews.length} reviews
                </span>
              </div>

              <div className="mt-4 space-y-2 w-full md:mt-0">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="flex items-center w-12">
                      <span className="text-sm">{rating}</span>
                      <Star className="h-3 w-3 ml-1 fill-primary text-primary" />
                    </div>
                    <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(ratingCounts[rating as keyof typeof ratingCounts] / reviews.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm w-8 text-right">
                      {ratingCounts[rating as keyof typeof ratingCounts]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={review.userImage}
                    alt={review.userName}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-medium">{review.userName}</h4>
                    <span className="text-sm text-muted-foreground">
                      {format(parseISO(review.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <StarRating rating={review.rating} className="my-1" />
                  <p className="mt-2 text-sm">{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews.length > 3 && (
          <Button
            variant="ghost"
            className="w-full"
            onClick={toggleExpanded}
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Show all reviews <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

const Star = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default ReviewList;
