'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  variant?: 'tabs' | 'buttons';
}

const CategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
  variant = 'tabs',
}: CategoryFilterProps) => {
  const handleCategoryChange = (value: string) => {
    if (onCategoryChange) {
      onCategoryChange(value);
    }
  };

  // Get icon component by name
  const getIconByName = (iconName: string): LucideIcon => {
    const IconComponent = (LucideIcons as Record<string, LucideIcon>)[
      iconName.charAt(0).toUpperCase() + iconName.slice(1)
    ] || LucideIcons.LayoutGrid;
    return IconComponent;
  };

  if (variant === 'tabs') {
    return (
      <Tabs
        onValueChange={handleCategoryChange}
        value={activeCategory}
        className="w-full overflow-x-auto"
      >
        <TabsList className="h-auto w-full flex-wrap justify-start bg-transparent p-0 md:p-1">
          <TabsTrigger
            value="all"
            className="flex h-9 items-center gap-1 rounded-full px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <LucideIcons.LayoutGrid className="h-4 w-4" />
            All Categories
          </TabsTrigger>
          {categories.map((category) => {
            const Icon = getIconByName(category.icon);
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex h-9 items-center gap-1 rounded-full px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/marketplace">
        <Button
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          className="flex items-center gap-1"
        >
          <LucideIcons.LayoutGrid className="h-4 w-4" />
          All
        </Button>
      </Link>
      {categories.map((category) => {
        const Icon = getIconByName(category.icon);
        return (
          <Link
            key={category.id}
            href={`/marketplace?category=${category.id}`}
          >
            <Button
              variant={activeCategory === category.id ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-1"
            >
              <Icon className="h-4 w-4" />
              {category.name}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
