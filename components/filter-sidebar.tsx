'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, X, SlidersHorizontal } from 'lucide-react';
import {
  FUND_CATEGORIES,
  type Category,
  type SubCategory,
} from '@/lib/data/fund-categories';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  selectedCategory: string;
  selectedSubCategory: string;
  onCategoryChange: (category: string) => void;
  onSubCategoryChange: (subCategory: string) => void;
  fundCounts?: Record<string, number>;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function FilterSidebar({
  selectedCategory,
  selectedSubCategory,
  onCategoryChange,
  onSubCategoryChange,
  fundCounts = {},
  isMobileOpen = false,
  onMobileClose,
}: FilterSidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    selectedCategory || null
  );

  const handleCategoryClick = (categoryValue: string) => {
    // If clicking the same category, toggle expansion
    if (expandedCategory === categoryValue) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryValue);
    }

    // Always change category selection
    onCategoryChange(categoryValue);
    onSubCategoryChange(''); // Reset subcategory when changing category
  };

  const handleSubCategoryClick = (subCategoryValue: string) => {
    onSubCategoryChange(subCategoryValue);
  };

  const clearFilters = () => {
    onCategoryChange('');
    onSubCategoryChange('');
    setExpandedCategory(null);
    onMobileClose?.();
  };

  const content = (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Filters
            </h2>
          </div>
          {(selectedCategory || selectedSubCategory) && (
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all
            </button>
          )}
          {/* Mobile close button */}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Category List */}
      <div className="px-2 py-2">
        {/* All Funds option */}
        <button
          onClick={() => {
            onCategoryChange('');
            onSubCategoryChange('');
            setExpandedCategory(null);
          }}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all',
            !selectedCategory
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          )}
        >
          <div className="flex items-center gap-2">
            <span>📁</span>
            <span>All Funds</span>
          </div>
          {fundCounts['all'] && (
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {fundCounts['all'].toLocaleString()}
            </span>
          )}
        </button>

        {/* Categories */}
        {FUND_CATEGORIES.map((category) => (
          <div key={category.value} className="mt-1">
            {/* Category Button */}
            <button
              onClick={() => handleCategoryClick(category.value)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all',
                selectedCategory === category.value
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              <div className="flex items-center gap-2">
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {fundCounts[category.value] && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    {fundCounts[category.value].toLocaleString()}
                  </span>
                )}
                {category.subCategories &&
                  category.subCategories.length > 0 &&
                  (expandedCategory === category.value ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  ))}
              </div>
            </button>

            {/* SubCategories - Shown when expanded */}
            {category.subCategories &&
              category.subCategories.length > 0 &&
              expandedCategory === category.value && (
                <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                  {category.subCategories.map((subCategory) => (
                    <button
                      key={subCategory.value}
                      onClick={() => handleSubCategoryClick(subCategory.value)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all',
                        selectedSubCategory === subCategory.value
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      )}
                    >
                      <span>{subCategory.label}</span>
                      {fundCounts[`${category.value}-${subCategory.value}`] && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {fundCounts[`${category.value}-${subCategory.value}`]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );

  // Mobile: Render as drawer/overlay
  if (isMobileOpen) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
        {/* Drawer */}
        <div className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 z-50 shadow-xl md:hidden animate-in slide-in-from-left duration-300">
          {content}
        </div>
      </>
    );
  }

  // Desktop: Render as sidebar
  return (
    <div className="hidden md:block w-64 lg:w-72 shrink-0">
      <div className="sticky top-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden max-h-[calc(100vh-6rem)]">
        {content}
      </div>
    </div>
  );
}
