/**
 * Component Showcase Page
 * Demonstrates all new components with live examples
 */

'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { CategoryFilter } from '@/components/category-filter';
import { FundSearch } from '@/components/fund-search';
import { Pagination, PaginationInfo } from '@/components/pagination';
import {
  FundCardSkeleton,
  InlineLoader,
  ChartSkeleton,
} from '@/components/loading';
import { InlineError, NotFound } from '@/components/error-boundary';
import { ModernFundCard } from '@/components/modern-fund-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import type { Fund } from '@/lib/fundService';

export default function ComponentShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample fund data for demonstration
  const sampleFund: Fund = {
    _id: 'sample-123',
    schemeCode: '100001',
    schemeName: 'Sample HDFC Equity Fund - Direct Growth',
    amc: {
      name: 'HDFC Mutual Fund',
    },
    category: 'equity',
    subCategory: 'largecap',
    nav: {
      value: 850.5432,
      date: new Date().toISOString(),
      change: 5.23,
      changePercent: 0.62,
    },
    aum: 25000,
    expenseRatio: 0.75,
    returns: {
      oneMonth: 2.5,
      threeMonth: 8.3,
      sixMonth: 12.5,
      oneYear: 18.5,
      threeYear: 16.2,
      fiveYear: 14.8,
    },
    riskLevel: 'Moderately High',
    minInvestment: 5000,
    isPubliclyVisible: true,
    launchDate: new Date('2010-01-15').toISOString(),
    exitLoad: 'Nil',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold mb-2">Component Showcase</h1>
          <p className="text-xl text-blue-100">
            Interactive examples of all new components
          </p>
          <div className="mt-4 flex gap-2">
            <Badge variant="secondary">13 Components</Badge>
            <Badge variant="secondary">3,500+ Lines</Badge>
            <Badge variant="secondary">TypeScript</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <Tabs defaultValue="filters" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto">
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="pagination">Pagination</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="loading">Loading</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
          </TabsList>

          {/* Category Filters */}
          <TabsContent value="filters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Filter - Buttons Variant</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  variant="buttons"
                  showCounts={true}
                />
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm">
                    <strong>Selected:</strong>{' '}
                    {selectedCategory ? selectedCategory : 'All Funds'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Filter - Tabs Variant</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  variant="tabs"
                  showCounts={true}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Filter - Pills Variant</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  variant="pills"
                  showCounts={true}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Code Example</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {`import { CategoryFilter } from '@/components/category-filter';

<CategoryFilter
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
  variant="buttons"  // or "tabs" or "pills"
  showCounts={true}
/>`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fund Search with Autocomplete</CardTitle>
              </CardHeader>
              <CardContent>
                <FundSearch
                  onSearch={setSearchQuery}
                  placeholder="Try typing 'HDFC' or 'Equity'..."
                  showSuggestions={true}
                />
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm">
                    <strong>Current Query:</strong> {searchQuery || 'None'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: Search requires minimum 3 characters and 500ms
                    debounce
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">✓</Badge> Debounced search (500ms)
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">✓</Badge> Minimum 3 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">✓</Badge> Autocomplete suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">✓</Badge> Loading indicator
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">✓</Badge> Error handling
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">✓</Badge> Click outside to close
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Code Example</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {`import { FundSearch } from '@/components/fund-search';

<FundSearch
  onSearch={handleSearch}
  onFundSelect={(fund) => router.push(\`/fund/\${fund._id}\`)}
  placeholder="Search 4,459 funds..."
  showSuggestions={true}
/>`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pagination */}
          <TabsContent value="pagination" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pagination Component</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={90}
                  onPageChange={setCurrentPage}
                  maxVisible={5}
                  showFirstLast={true}
                />

                <PaginationInfo
                  currentPage={currentPage}
                  limit={50}
                  total={4459}
                />

                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm">
                    <strong>Current Page:</strong> {currentPage}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Code Example</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {`import { Pagination, PaginationInfo } from '@/components/pagination';

<Pagination
  currentPage={currentPage}
  totalPages={90}
  onPageChange={setCurrentPage}
  maxVisible={5}
  showFirstLast={true}
/>

<PaginationInfo
  currentPage={currentPage}
  limit={50}
  total={4459}
/>`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fund Cards */}
          <TabsContent value="cards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modern Fund Card</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-md">
                  <ModernFundCard fund={sampleFund} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Code Example</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {`import { ModernFundCard } from '@/components/modern-fund-card';

<ModernFundCard fund={fundData} language="en" />`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loading States */}
          <TabsContent value="loading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fund Card Skeleton</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-md">
                  <FundCardSkeleton />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inline Loader</CardTitle>
              </CardHeader>
              <CardContent>
                <InlineLoader message="Loading data..." size="md" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chart Skeleton</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartSkeleton />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Code Example</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {`import { 
  FundCardSkeleton, 
  InlineLoader, 
  ChartSkeleton 
} from '@/components/loading';

<FundCardSkeleton />
<InlineLoader message="Loading..." size="md" />
<ChartSkeleton />`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Error States */}
          <TabsContent value="errors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inline Error</CardTitle>
              </CardHeader>
              <CardContent>
                <InlineError
                  message="Failed to load funds. Please check your connection."
                  onRetry={() => alert('Retry clicked!')}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Not Found (404)</CardTitle>
              </CardHeader>
              <CardContent>
                <NotFound
                  title="Fund Not Found"
                  message="The fund you're looking for doesn't exist."
                  showHomeButton={true}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Code Example</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {`import { InlineError, NotFound, ErrorBoundary } from '@/components/error-boundary';

<InlineError
  message="Error message here"
  onRetry={handleRetry}
/>

<NotFound
  title="404"
  message="Page not found"
  showHomeButton={true}
/>

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Documentation Links */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📚 Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/FRONTEND_INTEGRATION_GUIDE.md"
                className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-semibold mb-1">Integration Guide</h3>
                <p className="text-sm text-muted-foreground">
                  Complete step-by-step integration guide
                </p>
              </a>

              <a
                href="/QUICK_REFERENCE.md"
                className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-semibold mb-1">Quick Reference</h3>
                <p className="text-sm text-muted-foreground">
                  Quick lookup for common tasks
                </p>
              </a>

              <a
                href="/IMPLEMENTATION_SUMMARY.md"
                className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-semibold mb-1">Implementation Summary</h3>
                <p className="text-sm text-muted-foreground">
                  High-level overview of changes
                </p>
              </a>

              <a
                href="/INTEGRATION_CHECKLIST.md"
                className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-semibold mb-1">Integration Checklist</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed implementation checklist
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
