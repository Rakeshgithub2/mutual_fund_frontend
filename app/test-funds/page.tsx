/**
 * Test Page for Enhanced Fund List
 *
 * This page demonstrates the new EnhancedFundList component
 * with proper backend integration.
 *
 * To use this page:
 * 1. Ensure backend is running on port 3002
 * 2. Navigate to http://localhost:5001/test-funds
 * 3. Check Debug Panel (bottom-right) for backend status
 */

'use client';

import React from 'react';
import EnhancedFundList from '@/components/EnhancedFundList';

export default function TestFundsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Test Fund List
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Testing the enhanced fund list component with backend integration
          </p>
        </div>

        {/* Enhanced Fund List with all features */}
        <EnhancedFundList
          showFilters={true}
          onFundSelect={(fund) => {
            console.log('Fund selected:', fund);
            alert(`Selected: ${fund.name}`);
          }}
        />
      </div>
    </div>
  );
}
