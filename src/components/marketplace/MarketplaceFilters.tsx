'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { FilterOptions, SortOption } from '@/types';

interface MarketplaceFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

const MarketplaceFilters = ({
  onFilterChange,
  initialFilters = {},
}: MarketplaceFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilters.minPrice || 0,
    initialFilters.maxPrice || 200,
  ]);
  const [location, setLocation] = useState(initialFilters.location || '');
  const [rating, setRating] = useState<number | undefined>(
    initialFilters.minRating
  );
  const [sortBy, setSortBy] = useState<SortOption | undefined>(
    initialFilters.sortBy
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleApplyFilters = () => {
    const newFilters: FilterOptions = {
      ...filters,
      location: location || undefined,
      minRating: rating,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 200 ? priceRange[1] : undefined,
      sortBy,
    };

    onFilterChange(newFilters);
    setFilters(newFilters);
    setIsSheetOpen(false);
  };

  const handleClearFilters = () => {
    setPriceRange([0, 200]);
    setLocation('');
    setRating(undefined);
    setSortBy(undefined);

    const emptyFilters: FilterOptions = {};
    onFilterChange(emptyFilters);
    setFilters(emptyFilters);
  };

  const formatPriceLabel = (value: number) => {
    return `$${value}`;
  };

  return (
    <>
      {/* Mobile Filters */}
      <div className="flex items-center justify-between md:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Refine your search with these filters
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Location</h3>
                <Input
                  placeholder="Enter city or zip code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    defaultValue={priceRange}
                    max={200}
                    step={5}
                    onValueChange={(values) =>
                      setPriceRange(values as [number, number])
                    }
                  />
                  <div className="flex items-center justify-between">
                    <span>{formatPriceLabel(priceRange[0])}</span>
                    <span>{formatPriceLabel(priceRange[1])}</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Minimum Rating</h3>
                <RadioGroup
                  value={rating?.toString()}
                  onValueChange={(value) =>
                    setRating(value ? parseInt(value) : undefined)
                  }
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                      <Label htmlFor={`rating-${value}`}>{value}+ stars</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Sort By</h3>
                <RadioGroup
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as SortOption)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rating" id="sort-rating" />
                    <Label htmlFor="sort-rating">Highest Rated</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price_low" id="sort-price-low" />
                    <Label htmlFor="sort-price-low">Price: Low to High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price_high" id="sort-price-high" />
                    <Label htmlFor="sort-price-high">Price: High to Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="most_reviews" id="sort-reviews" />
                    <Label htmlFor="sort-reviews">Most Reviews</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <SheetFooter>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full sm:w-auto"
              >
                Clear Filters
              </Button>
              <Button onClick={handleApplyFilters} className="w-full sm:w-auto">
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <div className="flex flex-wrap gap-2">
          {Object.keys(filters).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear all
            </Button>
          )}
          {filters.minRating && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              {filters.minRating}+ stars
            </Button>
          )}
          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              {filters.minPrice !== undefined ? `$${filters.minPrice}` : '$0'} -
              {filters.maxPrice !== undefined ? `$${filters.maxPrice}` : '$200+'}
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">Filters</h3>
            {Object.keys(filters).length > 0 && (
              <Button
                variant="link"
                size="sm"
                onClick={handleClearFilters}
                className="flex items-center gap-1 px-0"
              >
                <X className="h-3 w-3" />
                Clear all filters
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Location</h4>
            <Input
              placeholder="Enter city or zip code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="max-w-[250px]"
            />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Price Range</h4>
            <div className="space-y-4 max-w-[250px]">
              <Slider
                defaultValue={priceRange}
                max={200}
                step={5}
                onValueChange={(values) =>
                  setPriceRange(values as [number, number])
                }
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">{formatPriceLabel(priceRange[0])}</span>
                <span className="text-sm">
                  {priceRange[1] === 200 ? '$200+' : formatPriceLabel(priceRange[1])}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Minimum Rating</h4>
            <RadioGroup
              value={rating?.toString()}
              onValueChange={(value) =>
                setRating(value ? parseInt(value) : undefined)
              }
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value.toString()} id={`rating-desktop-${value}`} />
                  <Label htmlFor={`rating-desktop-${value}`}>{value}+ stars</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Sort By</h4>
            <RadioGroup
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rating" id="sort-desktop-rating" />
                <Label htmlFor="sort-desktop-rating">Highest Rated</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price_low" id="sort-desktop-price-low" />
                <Label htmlFor="sort-desktop-price-low">Price: Low to High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price_high" id="sort-desktop-price-high" />
                <Label htmlFor="sort-desktop-price-high">Price: High to Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="most_reviews" id="sort-desktop-reviews" />
                <Label htmlFor="sort-desktop-reviews">Most Reviews</Label>
              </div>
            </RadioGroup>
          </div>

          <Button onClick={handleApplyFilters} className="w-full">Apply Filters</Button>
        </div>
      </div>
    </>
  );
};

export default MarketplaceFilters;
