'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FundList } from '@/components/fund-list';
import { useFunds } from '@/lib/hooks/use-funds';
import { useLanguage } from '@/lib/hooks/use-language';
import {
  TrendingUp,
  Building2,
  ArrowRight,
  Filter,
  BarChart3,
  Coins,
  Gem,
  Target,
  Layers,
  Zap,
  Crown,
} from 'lucide-react';
import Link from 'next/link';

interface FundCategoriesProps {
  activeTab: 'equity' | 'commodity';
  onTabChange: (tab: 'equity' | 'commodity') => void;
}

export function FundCategories({
  activeTab,
  onTabChange,
}: FundCategoriesProps) {
  const { language } = useLanguage();
  const [activeSubCategory, setActiveSubCategory] = useState<{
    equity: string;
    commodity: string;
  }>({
    equity: 'all',
    commodity: 'all',
  });

  // Create API hooks for all subcategories
  const { funds: largeCapFunds, loading: largeCapLoading } = useFunds({
    category: 'equity',
    subCategory: 'Large Cap',
    limit: 2000,
  });
  const { funds: midCapFunds, loading: midCapLoading } = useFunds({
    category: 'equity',
    subCategory: 'Mid Cap',
    limit: 2000,
  });
  const { funds: smallCapFunds, loading: smallCapLoading } = useFunds({
    category: 'equity',
    subCategory: 'Small Cap',
    limit: 2000,
  });
  const { funds: multiCapFunds, loading: multiCapLoading } = useFunds({
    category: 'equity',
    subCategory: 'Multi Cap',
    limit: 2000,
  });
  // Backend doesn't support commodity category, fetch all and filter
  const { funds: allFundsForGold, loading: goldLoading } = useFunds({
    limit: 2000,
  });
  const goldFunds = allFundsForGold.filter(
    (fund) =>
      fund.subCategory?.toLowerCase().includes('gold') ||
      fund.name?.toLowerCase().includes('gold')
  );
  const { funds: allFundsForSilver, loading: silverLoading } = useFunds({
    limit: 2000,
  });
  const silverFunds = allFundsForSilver.filter(
    (fund) =>
      fund.subCategory?.toLowerCase().includes('silver') ||
      fund.name?.toLowerCase().includes('silver')
  );

  // Get all funds for the active category
  const { funds: allEquityFunds, loading: allEquityLoading } = useFunds({
    category: 'equity',
    limit: 2000,
  });
  const { funds: allCommodityFunds, loading: allCommodityLoading } = useFunds({
    category: 'commodity',
    limit: 1000,
  });

  // Get current funds based on active tab and subcategory
  const getCurrentFunds = () => {
    const currentSubCategory = activeSubCategory[activeTab];

    if (activeTab === 'equity') {
      if (currentSubCategory === 'all') {
        return { funds: allEquityFunds, loading: allEquityLoading };
      }
      switch (currentSubCategory) {
        case 'large-cap':
          return { funds: largeCapFunds, loading: largeCapLoading };
        case 'mid-cap':
          return { funds: midCapFunds, loading: midCapLoading };
        case 'small-cap':
          return { funds: smallCapFunds, loading: smallCapLoading };
        case 'multi-cap':
          return { funds: multiCapFunds, loading: multiCapLoading };
        default:
          return { funds: [], loading: false };
      }
    } else {
      if (currentSubCategory === 'all') {
        return { funds: allCommodityFunds, loading: allCommodityLoading };
      }
      switch (currentSubCategory) {
        case 'gold':
          return { funds: goldFunds, loading: goldLoading };
        case 'silver':
          return { funds: silverFunds, loading: silverLoading };
        default:
          return { funds: [], loading: false };
      }
    }
  };

  const { funds: currentFunds, loading: currentLoading } = getCurrentFunds();

  // Get subcategory counts
  const getSubCategoryCounts = () => {
    if (activeTab === 'equity') {
      return {
        all: allEquityFunds.length,
        'large-cap': largeCapFunds.length,
        'mid-cap': midCapFunds.length,
        'small-cap': smallCapFunds.length,
        'multi-cap': multiCapFunds.length,
      };
    } else {
      return {
        all: allCommodityFunds.length,
        gold: goldFunds.length,
        silver: silverFunds.length,
      };
    }
  };

  const subCategoryCounts = getSubCategoryCounts();

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={() => onTabChange('equity')}
          variant={activeTab === 'equity' ? 'default' : 'outline'}
          size="lg"
          className={`transition-all transform hover:scale-105 ${
            activeTab === 'equity'
              ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-xl scale-105'
              : 'hover:bg-gray-50'
          }`}
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Equity Funds
          <Badge
            variant={activeTab === 'equity' ? 'secondary' : 'default'}
            className={`ml-2 ${
              activeTab === 'equity' ? 'bg-white/20 text-white' : 'bg-gray-100'
            }`}
          >
            {allEquityFunds.length}
          </Badge>
        </Button>

        <Button
          onClick={() => onTabChange('commodity')}
          variant={activeTab === 'commodity' ? 'default' : 'outline'}
          size="lg"
          className={`transition-all transform hover:scale-105 ${
            activeTab === 'commodity'
              ? 'bg-gradient-to-r from-amber-500 to-orange-700 text-white shadow-xl scale-105'
              : 'hover:bg-gray-50'
          }`}
        >
          <Building2 className="w-5 h-5 mr-2" />
          Commodity Funds
          <Badge
            variant={activeTab === 'commodity' ? 'secondary' : 'default'}
            className={`ml-2 ${
              activeTab === 'commodity'
                ? 'bg-white/20 text-white'
                : 'bg-gray-100'
            }`}
          >
            {allCommodityFunds.length}
          </Badge>
        </Button>
      </div>

      {/* Category Description */}
      <Card className="bg-gradient-to-r from-white/90 to-gray-50/90 backdrop-blur-xl border-2 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                activeTab === 'equity'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                  : 'bg-gradient-to-br from-amber-500 to-orange-700'
              }`}
            >
              {activeTab === 'equity' ? (
                <TrendingUp className="w-7 h-7 text-white" />
              ) : (
                <Building2 className="w-7 h-7 text-white" />
              )}
            </div>
            {activeTab === 'equity' ? 'Equity Funds' : 'Commodity Funds'}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {activeTab === 'equity'
              ? 'Growth-oriented equity mutual funds across market capitalizations'
              : 'Precious metals and commodity-based investment funds'}
          </p>
        </CardHeader>
      </Card>

      {/* Subcategory Selection */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Select Fund Type
          </h3>
        </div>

        {/* Subcategory Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* All Category Button */}
          <Card
            className={`cursor-pointer transition-all transform hover:scale-105 ${
              activeSubCategory[activeTab] === 'all'
                ? activeTab === 'equity'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-xl scale-105'
                  : 'bg-gradient-to-br from-amber-500 to-orange-700 text-white shadow-xl scale-105'
                : 'hover:shadow-lg bg-white/80 backdrop-blur-sm'
            }`}
            onClick={() =>
              setActiveSubCategory((prev) => ({
                ...prev,
                [activeTab]: 'all',
              }))
            }
          >
            <CardContent className="p-6 text-center">
              <div
                className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  activeSubCategory[activeTab] === 'all'
                    ? 'bg-white/20'
                    : activeTab === 'equity'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                      : 'bg-gradient-to-br from-amber-500 to-orange-700'
                }`}
              >
                <BarChart3
                  className={`w-6 h-6 ${
                    activeSubCategory[activeTab] === 'all'
                      ? 'text-white'
                      : 'text-white'
                  }`}
                />
              </div>
              <h4 className="font-semibold text-sm mb-1">
                All {activeTab === 'equity' ? 'Equity' : 'Commodity'} Funds
              </h4>
              <Badge
                variant={
                  activeSubCategory[activeTab] === 'all'
                    ? 'secondary'
                    : 'default'
                }
                className={
                  activeSubCategory[activeTab] === 'all'
                    ? 'bg-white/20 text-white'
                    : ''
                }
              >
                {subCategoryCounts.all} Funds
              </Badge>
            </CardContent>
          </Card>

          {/* Equity Subcategory Buttons */}
          {activeTab === 'equity' && (
            <>
              {[
                {
                  id: 'large-cap',
                  label: 'Large Cap',
                  icon: Crown,
                  color: 'blue',
                },
                {
                  id: 'mid-cap',
                  label: 'Mid Cap',
                  icon: Target,
                  color: 'indigo',
                },
                {
                  id: 'small-cap',
                  label: 'Small Cap',
                  icon: Zap,
                  color: 'purple',
                },
                {
                  id: 'multi-cap',
                  label: 'Multi Cap',
                  icon: Layers,
                  color: 'pink',
                },
              ].map((subCategory) => (
                <Card
                  key={subCategory.id}
                  className={`cursor-pointer transition-all transform hover:scale-105 ${
                    activeSubCategory[activeTab] === subCategory.id
                      ? `bg-gradient-to-br from-${subCategory.color}-500 to-${subCategory.color}-700 text-white shadow-xl scale-105`
                      : 'hover:shadow-lg bg-white/80 backdrop-blur-sm'
                  }`}
                  onClick={() =>
                    setActiveSubCategory((prev) => ({
                      ...prev,
                      [activeTab]: subCategory.id,
                    }))
                  }
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                        activeSubCategory[activeTab] === subCategory.id
                          ? 'bg-white/20'
                          : `bg-gradient-to-br from-${subCategory.color}-500 to-${subCategory.color}-700`
                      }`}
                    >
                      <subCategory.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">
                      {subCategory.label}
                    </h4>
                    <Badge
                      variant={
                        activeSubCategory[activeTab] === subCategory.id
                          ? 'secondary'
                          : 'default'
                      }
                      className={
                        activeSubCategory[activeTab] === subCategory.id
                          ? 'bg-white/20 text-white'
                          : ''
                      }
                    >
                      {subCategoryCounts[subCategory.id] || 0} Funds
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {/* Commodity Subcategory Buttons */}
          {activeTab === 'commodity' && (
            <>
              {[
                { id: 'gold', label: 'Gold', icon: Coins, color: 'yellow' },
                { id: 'silver', label: 'Silver', icon: Gem, color: 'gray' },
              ].map((subCategory) => (
                <Card
                  key={subCategory.id}
                  className={`cursor-pointer transition-all transform hover:scale-105 ${
                    activeSubCategory[activeTab] === subCategory.id
                      ? activeTab === 'commodity' && subCategory.id === 'gold'
                        ? 'bg-gradient-to-br from-yellow-500 to-amber-700 text-white shadow-xl scale-105'
                        : 'bg-gradient-to-br from-gray-500 to-slate-700 text-white shadow-xl scale-105'
                      : 'hover:shadow-lg bg-white/80 backdrop-blur-sm'
                  }`}
                  onClick={() =>
                    setActiveSubCategory((prev) => ({
                      ...prev,
                      [activeTab]: subCategory.id,
                    }))
                  }
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                        activeSubCategory[activeTab] === subCategory.id
                          ? 'bg-white/20'
                          : subCategory.id === 'gold'
                            ? 'bg-gradient-to-br from-yellow-500 to-amber-700'
                            : 'bg-gradient-to-br from-gray-500 to-slate-700'
                      }`}
                    >
                      <subCategory.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">
                      {subCategory.label}
                    </h4>
                    <Badge
                      variant={
                        activeSubCategory[activeTab] === subCategory.id
                          ? 'secondary'
                          : 'default'
                      }
                      className={
                        activeSubCategory[activeTab] === subCategory.id
                          ? 'bg-white/20 text-white'
                          : ''
                      }
                    >
                      {subCategoryCounts[subCategory.id] || 0} Funds
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Fund Results */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab}-${activeSubCategory[activeTab]}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentLoading ? (
            <Card className="bg-white/80 backdrop-blur-xl shadow-xl">
              <CardContent className="py-16 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                <p className="text-gray-600">
                  Loading {activeSubCategory[activeTab]} funds...
                </p>
              </CardContent>
            </Card>
          ) : currentFunds.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                      activeTab === 'equity'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                        : 'bg-gradient-to-br from-amber-500 to-orange-700'
                    }`}
                  >
                    {activeTab === 'equity' ? (
                      <TrendingUp className="w-7 h-7 text-white" />
                    ) : (
                      <Building2 className="w-7 h-7 text-white" />
                    )}
                  </div>
                  {activeSubCategory[activeTab] === 'all'
                    ? `All ${
                        activeTab === 'equity' ? 'Equity' : 'Commodity'
                      } Funds`
                    : activeSubCategory[activeTab].charAt(0).toUpperCase() +
                      activeSubCategory[activeTab].slice(1).replace('-', ' ') +
                      ' Funds'}
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {currentFunds.length}
                  </Badge>
                </h2>
                <Link href={`/search?category=${activeTab}`}>
                  <Button
                    variant="outline"
                    className="gap-2 hover:scale-105 transition-transform"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <FundList funds={currentFunds.slice(0, 50)} language={language} />

              {currentFunds.length > 50 && (
                <div className="text-center mt-8">
                  <Link href={`/search?category=${activeTab}`}>
                    <Button
                      size="lg"
                      className={`gap-2 hover:scale-105 transition-transform ${
                        activeTab === 'equity'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-700'
                          : 'bg-gradient-to-r from-amber-500 to-orange-700'
                      }`}
                    >
                      View All {currentFunds.length} Funds{' '}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Card className="bg-white/80 backdrop-blur-xl shadow-xl">
              <CardContent className="py-16 text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50 ${
                    activeTab === 'equity'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                      : 'bg-gradient-to-br from-amber-500 to-orange-700'
                  }`}
                >
                  {activeTab === 'equity' ? (
                    <TrendingUp className="w-8 h-8 text-white" />
                  ) : (
                    <Building2 className="w-8 h-8 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3">No funds found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We're working on adding more funds in this category. Please
                  check back soon!
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    setActiveSubCategory((prev) => ({
                      ...prev,
                      [activeTab]: 'all',
                    }))
                  }
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View All {activeTab === 'equity'
                    ? 'Equity'
                    : 'Commodity'}{' '}
                  Funds
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
