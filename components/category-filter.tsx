/**
 * Category Filter Component
 * Display and filter funds by 8 categories
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Building2,
  Layers,
  BarChart3,
  PiggyBank,
  Globe,
  Coins,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FUND_CATEGORIES, getCategoryColors } from '@/lib/constants';
import type { Category } from '@/lib/constants';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  showCounts?: boolean;
  variant?: 'tabs' | 'buttons' | 'pills';
  className?: string;
}

// Category icons mapping
const CATEGORY_ICONS: Record<string, any> = {
  equity: TrendingUp,
  debt: Building2,
  hybrid: Layers,
  index: BarChart3,
  elss: PiggyBank,
  international: Globe,
  commodity: Coins,
  solution_oriented: Target,
};

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  showCounts = true,
  variant = 'tabs',
  className = '',
}: CategoryFilterProps) {
  const handleCategoryClick = (categoryId: string) => {
    // Toggle: if clicking same category, clear filter
    if (selectedCategory === categoryId) {
      onCategoryChange(null);
    } else {
      onCategoryChange(categoryId);
    }
  };

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {/* All Funds */}
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="rounded-full"
        >
          All Funds
          {showCounts && (
            <Badge variant="secondary" className="ml-2">
              4,459
            </Badge>
          )}
        </Button>

        {/* Category Pills */}
        {FUND_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.id];
          const isActive = selectedCategory === category.id;

          return (
            <Button
              key={category.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryClick(category.id)}
              className="rounded-full"
            >
              <Icon className="mr-2 h-4 w-4" />
              {category.name}
              {showCounts && (
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div
        className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 ${className}`}
      >
        {/* All Funds Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCategoryChange(null)}
          className={`
            relative p-4 rounded-lg border-2 transition-all
            ${
              selectedCategory === null
                ? 'border-primary bg-primary/10 shadow-md'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
            }
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2
              className={`h-6 w-6 ${selectedCategory === null ? 'text-primary' : 'text-muted-foreground'}`}
            />
            <span className="font-semibold text-sm">All Funds</span>
            {showCounts && <Badge variant="secondary">4,459</Badge>}
          </div>
          {selectedCategory === null && (
            <div className="absolute top-2 right-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
          )}
        </motion.button>

        {/* Category Buttons */}
        {FUND_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.id];
          const isActive = selectedCategory === category.id;
          const colors = getCategoryColors(category.id);

          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(category.id)}
              className={`
                relative p-4 rounded-lg border-2 transition-all
                ${
                  isActive
                    ? `${colors.border} ${colors.bg} shadow-md`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon
                  className={`h-6 w-6 ${isActive ? colors.text : 'text-muted-foreground'}`}
                />
                <span
                  className={`font-semibold text-sm ${isActive ? colors.text : ''}`}
                >
                  {category.name}
                </span>
                {showCounts && (
                  <Badge variant={isActive ? 'default' : 'secondary'}>
                    {category.count}
                  </Badge>
                )}
              </div>
              {isActive && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className={`h-4 w-4 ${colors.text}`} />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    );
  }

  // Default: tabs variant
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* All Tab */}
      <Button
        variant={selectedCategory === null ? 'default' : 'ghost'}
        size="default"
        onClick={() => onCategoryChange(null)}
        className="flex items-center gap-2"
      >
        <span>All Funds</span>
        {showCounts && (
          <Badge variant={selectedCategory === null ? 'secondary' : 'outline'}>
            4,459
          </Badge>
        )}
      </Button>

      {/* Category Tabs */}
      {FUND_CATEGORIES.map((category) => {
        const Icon = CATEGORY_ICONS[category.id];
        const isActive = selectedCategory === category.id;

        return (
          <Button
            key={category.id}
            variant={isActive ? 'default' : 'ghost'}
            size="default"
            onClick={() => handleCategoryClick(category.id)}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            <span>{category.name}</span>
            {showCounts && (
              <Badge variant={isActive ? 'secondary' : 'outline'}>
                {category.count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}

/**
 * Compact Category Filter (for mobile)
 */
export function CompactCategoryFilter({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategoryObj = FUND_CATEGORIES.find(
    (c) => c.id === selectedCategory
  );

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <span>
          {selectedCategoryObj ? selectedCategoryObj.name : 'All Categories'}
        </span>
        <Badge variant="secondary">
          {selectedCategoryObj ? selectedCategoryObj.count : '4,459'}
        </Badge>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <button
            onClick={() => {
              onCategoryChange(null);
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
          >
            <span>All Funds</span>
            <Badge variant="secondary">4,459</Badge>
          </button>

          {FUND_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.id];
            return (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryChange(category.id);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </div>
                <Badge variant="secondary">{category.count}</Badge>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
