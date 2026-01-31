'use client';

import { useState, useMemo } from 'react';
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
  PieChart,
  Coins,
  Gem,
  Target,
  Layers,
  Zap,
  Crown,
} from 'lucide-react';
import Link from 'next/link';

interface CategoryConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  description: string;
  subCategories: SubCategoryConfig[];
}

interface SubCategoryConfig {
  id: string;
  label: string;
  apiValue: string;
  icon: React.ElementType;
  color: string;
  description: string;
  expectedCount: number;
}

const categoryConfigs: CategoryConfig[] = [
  {
    id: 'equity',
    label: 'Equity Funds',
    icon: TrendingUp,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-700',
    description:
      'Growth-oriented equity mutual funds across market capitalizations',
    subCategories: [
      {
        id: 'largecap',
        label: 'Large Cap',
        apiValue: 'largecap',
        icon: Crown,
        color: 'blue',
        description:
          'Invest in established large-cap companies with stable growth',
        expectedCount: 30,
      },
      {
        id: 'midcap',
        label: 'Mid Cap',
        apiValue: 'midcap',
        icon: Target,
        color: 'indigo',
        description: 'Medium-sized companies with high growth potential',
        expectedCount: 25,
      },
      {
        id: 'smallcap',
        label: 'Small Cap',
        apiValue: 'smallcap',
        icon: Zap,
        color: 'purple',
        description: 'Small companies with explosive growth opportunities',
        expectedCount: 20,
      },
      {
        id: 'multicap',
        label: 'Multi Cap',
        apiValue: 'multicap',
        icon: Layers,
        color: 'pink',
        description: 'Diversified across large, mid, and small-cap stocks',
        expectedCount: 18,
      },
    ],
  },
  {
    id: 'commodity',
    label: 'Commodity Funds',
    icon: Building2,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-700',
    description: 'Precious metals and commodity-based investment funds',
    subCategories: [
      {
        id: 'gold',
        label: 'Gold',
        apiValue: 'Gold',
        icon: Coins,
        color: 'yellow',
        description: 'Gold ETFs and funds for inflation protection',
        expectedCount: 30,
      },
      {
        id: 'silver',
        label: 'Silver',
        apiValue: 'Silver',
        icon: Gem,
        color: 'gray',
        description: 'Silver ETFs and funds for portfolio diversification',
        expectedCount: 25,
      },
    ],
  },
];

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

  // Get active category config
  const activeCategoryConfig = categoryConfigs.find(
    (config) => config.id === activeTab
  );

  // Create API hooks for all subcategories
  const { funds: largeCapFunds, loading: largeCapLoading } = useFunds({
    category: 'equity',
    subCategory: 'largecap',
    limit: 10000,
  });
  const { funds: midCapFunds, loading: midCapLoading } = useFunds({
    category: 'equity',
    subCategory: 'midcap',
    limit: 10000,
  });
  const { funds: smallCapFunds, loading: smallCapLoading } = useFunds({
    category: 'equity',
    subCategory: 'smallcap',
    limit: 10000,
  });
  const { funds: multiCapFunds, loading: multiCapLoading } = useFunds({
    category: 'equity',
    subCategory: 'multicap',
    limit: 10000,
  });
  // Backend doesn't support Commodity category, fetch all and filter client-side
  const { funds: allFundsForGold, loading: goldLoading } = useFunds({
    limit: 10000,
  });
  const goldFunds = allFundsForGold.filter(
    (fund) =>
      fund.subCategory?.toLowerCase().includes('gold') ||
      fund.name?.toLowerCase().includes('gold')
  );
  const { funds: allFundsForSilver, loading: silverLoading } = useFunds({
    limit: 10000,
  });
  const silverFunds = allFundsForSilver.filter(
    (fund) =>
      fund.subCategory?.toLowerCase().includes('silver') ||
      fund.name?.toLowerCase().includes('silver')
  );

  // Get all funds for the active category
  const { funds: allEquityFunds, loading: allEquityLoading } = useFunds({
    category: 'equity',
    limit: 10000,
  });
  const { funds: allFundsForCommodity, loading: allCommodityLoading } =
    useFunds({
      limit: 10000,
    });
  const allCommodityFunds = allFundsForCommodity.filter(
    (fund) =>
      fund.category?.toLowerCase().includes('commodity') ||
      fund.subCategory?.toLowerCase().includes('commodity') ||
      fund.subCategory?.toLowerCase().includes('gold') ||
      fund.subCategory?.toLowerCase().includes('silver') ||
      fund.name?.toLowerCase().includes('gold') ||
      fund.name?.toLowerCase().includes('silver') ||
      fund.name?.toLowerCase().includes('commodity')
  );

  // Get current funds based on active tab and subcategory
  const getCurrentFunds = () => {
    const currentSubCategory = activeSubCategory[activeTab];

    if (activeTab === 'equity') {
      if (currentSubCategory === 'all') {
        return { funds: allEquityFunds, loading: allEquityLoading };
      }
      switch (currentSubCategory) {
        case 'largecap':
          return { funds: largeCapFunds, loading: largeCapLoading };
        case 'midcap':
          return { funds: midCapFunds, loading: midCapLoading };
        case 'smallcap':
          return { funds: smallCapFunds, loading: smallCapLoading };
        case 'multicap':
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
        largecap: largeCapFunds.length,
        midcap: midCapFunds.length,
        smallcap: smallCapFunds.length,
        multicap: multiCapFunds.length,
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

  if (!activeCategoryConfig) {
    return <div>Category not found</div>;
  }

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-4 justify-center">
        {categoryConfigs.map((category) => (
          <Button
            key={category.id}
            onClick={() => onTabChange(category.id as any)}
            variant={activeTab === category.id ? 'default' : 'outline'}
            size="lg"
            className={`transition-all transform hover:scale-105 ${
              activeTab === category.id
                ? `bg-gradient-to-r ${category.gradient} text-white shadow-xl scale-105`
                : 'hover:bg-gray-50'
            }`}
          >
            <category.icon className="w-5 h-5 mr-2" />
            {category.label}
            <Badge
              variant={activeTab === category.id ? 'secondary' : 'default'}
              className={`ml-2 ${
                activeTab === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {activeTab === 'equity'
                ? allEquityFunds.length
                : allCommodityFunds.length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Category Description */}
      <Card className="bg-gradient-to-r from-white/90 to-gray-50/90 backdrop-blur-xl border-2 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeCategoryConfig.gradient} flex items-center justify-center shadow-lg`}
            >
              <activeCategoryConfig.icon className="w-7 h-7 text-white" />
            </div>
            {activeCategoryConfig.label}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {activeCategoryConfig.description}
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
                ? `bg-gradient-to-br ${activeCategoryConfig.gradient} text-white shadow-xl scale-105`
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
                    : `bg-gradient-to-br ${activeCategoryConfig.gradient}`
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
                All {activeCategoryConfig.label}
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

          {/* Subcategory Buttons */}
          {activeCategoryConfig.subCategories.map((subCategory) => (
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
                  <subCategory.icon
                    className={`w-6 h-6 ${
                      activeSubCategory[activeTab] === subCategory.id
                        ? 'text-white'
                        : 'text-white'
                    }`}
                  />
                </div>
                <h4 className="font-semibold text-sm mb-1">
                  {subCategory.label}
                </h4>
                <p className="text-xs opacity-80 mb-2">
                  {subCategory.description}
                </p>
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
                  Loading{' '}
                  {activeSubCategory[activeTab] === 'all'
                    ? `all ${activeCategoryConfig.label.toLowerCase()}`
                    : activeCategoryConfig.subCategories.find(
                        (s) => s.id === activeSubCategory[activeTab]
                      )?.label + ' funds'}
                  ...
                </p>
              </CardContent>
            </Card>
          ) : currentFunds.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                      activeSubCategory[activeTab] === 'all'
                        ? `bg-gradient-to-br ${activeCategoryConfig.gradient}`
                        : `bg-gradient-to-br from-${
                            activeCategoryConfig.subCategories.find(
                              (s) => s.id === activeSubCategory[activeTab]
                            )?.color
                          }-500 to-${
                            activeCategoryConfig.subCategories.find(
                              (s) => s.id === activeSubCategory[activeTab]
                            )?.color
                          }-700`
                    }`}
                  >
                    {activeSubCategory[activeTab] === 'all' ? (
                      <activeCategoryConfig.icon className="w-7 h-7 text-white" />
                    ) : (
                      (() => {
                        const SubIcon = activeCategoryConfig.subCategories.find(
                          (s) => s.id === activeSubCategory[activeTab]
                        )?.icon;
                        return SubIcon ? (
                          <SubIcon className="w-7 h-7 text-white" />
                        ) : null;
                      })()
                    )}
                  </div>
                  {activeSubCategory[activeTab] === 'all'
                    ? `All ${activeCategoryConfig.label}`
                    : activeCategoryConfig.subCategories.find(
                        (s) => s.id === activeSubCategory[activeTab]
                      )?.label + ' Funds'}
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {currentFunds.length}
                  </Badge>
                </h2>
                <Link
                  href={`/search?category=${activeTab}${
                    activeSubCategory[activeTab] !== 'all'
                      ? `&subCategory=${
                          activeCategoryConfig.subCategories.find(
                            (s) => s.id === activeSubCategory[activeTab]
                          )?.apiValue
                        }`
                      : ''
                  }`}
                >
                  <Button
                    variant="outline"
                    className="gap-2 hover:scale-105 transition-transform"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <FundList
                funds={currentFunds.slice(0, 100)}
                language={language}
              />

              {currentFunds.length > 100 && (
                <div className="text-center mt-8">
                  <Link
                    href={`/search?category=${activeTab}${
                      activeSubCategory[activeTab] !== 'all'
                        ? `&subCategory=${
                            activeCategoryConfig.subCategories.find(
                              (s) => s.id === activeSubCategory[activeTab]
                            )?.apiValue
                          }`
                        : ''
                    }`}
                  >
                    <Button
                      size="lg"
                      className={`gap-2 bg-gradient-to-r ${activeCategoryConfig.gradient} hover:scale-105 transition-transform`}
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
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${activeCategoryConfig.gradient} flex items-center justify-center mx-auto mb-6 opacity-50`}
                >
                  <activeCategoryConfig.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  No{' '}
                  {activeSubCategory[activeTab] === 'all'
                    ? activeCategoryConfig.label.toLowerCase()
                    : activeCategoryConfig.subCategories.find(
                        (s) => s.id === activeSubCategory[activeTab]
                      )?.label + ' funds'}{' '}
                  found
                </h3>
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
                  View All {activeCategoryConfig.label}
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
