/**
 * 🎯 Fund Card Action Buttons
 *
 * Compare and Overlap buttons for fund cards
 * Uses global state management with auto-redirect
 *
 * Usage:
 * <FundCardActions fund={fundData} />
 */

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GitCompare, Layers, Check, AlertCircle } from 'lucide-react';
import {
  useFundSelectionStore,
  SelectedFund,
  MAX_FUNDS,
} from '@/stores/fund-selection-store';
import { useState } from 'react';
import { toast } from 'sonner';

interface FundCardActionsProps {
  fund: SelectedFund;
  variant?: 'default' | 'compact' | 'icon-only';
  showLabels?: boolean;
  className?: string;
}

export function FundCardActions({
  fund,
  variant = 'default',
  showLabels = true,
  className = '',
}: FundCardActionsProps) {
  const router = useRouter();
  const store = useFundSelectionStore();
  const [isLoading, setIsLoading] = useState<'compare' | 'overlap' | null>(
    null
  );

  const isInCompare = store.isInCompare(fund.schemeCode);
  const isInOverlap = store.isInOverlap(fund.schemeCode);
  const canAddCompare = store.canAddToCompare();
  const canAddOverlap = store.canAddToOverlap();

  const handleCompareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading('compare');

    try {
      if (isInCompare) {
        // Remove from compare
        store.removeFromCompare(fund.schemeCode);
        toast.success('Removed from comparison', {
          description: fund.name,
        });
      } else {
        // Add to compare
        if (!canAddCompare) {
          toast.error(`Maximum ${MAX_FUNDS} funds allowed`, {
            description: 'Remove a fund to add another',
          });
          return;
        }

        const added = store.addToCompare(fund);
        if (added) {
          toast.success('Added to comparison', {
            description: `${fund.name} (${store.compareFunds.length}/${MAX_FUNDS})`,
            action: {
              label: 'Go to Compare',
              onClick: () => router.push('/compare'),
            },
          });

          // Auto-redirect to compare page
          router.push('/compare');
        }
      }
    } finally {
      setIsLoading(null);
    }
  };

  const handleOverlapClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading('overlap');

    try {
      if (isInOverlap) {
        // Remove from overlap
        store.removeFromOverlap(fund.schemeCode);
        toast.success('Removed from overlap analysis', {
          description: fund.name,
        });
      } else {
        // Add to overlap
        if (!canAddOverlap) {
          toast.error(`Maximum ${MAX_FUNDS} funds allowed`, {
            description: 'Remove a fund to add another',
          });
          return;
        }

        const added = store.addToOverlap(fund);
        if (added) {
          toast.success('Added to overlap analysis', {
            description: `${fund.name} (${store.overlapFunds.length}/${MAX_FUNDS})`,
            action: {
              label: 'Go to Overlap',
              onClick: () => router.push('/overlap'),
            },
          });

          // Auto-redirect to overlap page
          router.push('/overlap');
        }
      }
    } finally {
      setIsLoading(null);
    }
  };

  if (variant === 'icon-only') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Button
          size="icon"
          variant={isInCompare ? 'default' : 'outline'}
          onClick={handleCompareClick}
          disabled={isLoading !== null}
          className={`h-8 w-8 ${isInCompare ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
          title={isInCompare ? 'Remove from Compare' : 'Add to Compare'}
        >
          {isInCompare ? (
            <Check className="h-4 w-4" />
          ) : (
            <GitCompare className="h-4 w-4" />
          )}
        </Button>

        <Button
          size="icon"
          variant={isInOverlap ? 'default' : 'outline'}
          onClick={handleOverlapClick}
          disabled={isLoading !== null}
          className={`h-8 w-8 ${isInOverlap ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
          title={isInOverlap ? 'Remove from Overlap' : 'Add to Overlap'}
        >
          {isInOverlap ? (
            <Check className="h-4 w-4" />
          ) : (
            <Layers className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          size="sm"
          variant={isInCompare ? 'default' : 'outline'}
          onClick={handleCompareClick}
          disabled={isLoading !== null}
          className={`h-7 text-xs ${isInCompare ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
        >
          {isInCompare ? (
            <Check className="h-3 w-3 mr-1" />
          ) : (
            <GitCompare className="h-3 w-3 mr-1" />
          )}
          {showLabels && (isInCompare ? 'Selected' : 'Compare')}
        </Button>

        <Button
          size="sm"
          variant={isInOverlap ? 'default' : 'outline'}
          onClick={handleOverlapClick}
          disabled={isLoading !== null}
          className={`h-7 text-xs ${isInOverlap ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
        >
          {isInOverlap ? (
            <Check className="h-3 w-3 mr-1" />
          ) : (
            <Layers className="h-3 w-3 mr-1" />
          )}
          {showLabels && (isInOverlap ? 'Selected' : 'Overlap')}
        </Button>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        size="sm"
        variant={isInCompare ? 'default' : 'outline'}
        onClick={handleCompareClick}
        disabled={isLoading !== null}
        className={`
          transition-all duration-200
          ${
            isInCompare
              ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
              : 'hover:border-blue-500 hover:text-blue-600'
          }
        `}
      >
        {isInCompare ? (
          <>
            <Check className="h-4 w-4 mr-1.5" />
            {showLabels && 'In Compare'}
          </>
        ) : (
          <>
            <GitCompare className="h-4 w-4 mr-1.5" />
            {showLabels && 'Compare'}
          </>
        )}
      </Button>

      <Button
        size="sm"
        variant={isInOverlap ? 'default' : 'outline'}
        onClick={handleOverlapClick}
        disabled={isLoading !== null}
        className={`
          transition-all duration-200
          ${
            isInOverlap
              ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
              : 'hover:border-purple-500 hover:text-purple-600'
          }
        `}
      >
        {isInOverlap ? (
          <>
            <Check className="h-4 w-4 mr-1.5" />
            {showLabels && 'In Overlap'}
          </>
        ) : (
          <>
            <Layers className="h-4 w-4 mr-1.5" />
            {showLabels && 'Overlap'}
          </>
        )}
      </Button>
    </div>
  );
}

// Floating indicator showing selected funds count
export function FundSelectionIndicator() {
  const router = useRouter();
  const store = useFundSelectionStore();

  const compareCount = store.compareFunds.length;
  const overlapCount = store.overlapFunds.length;

  if (compareCount === 0 && overlapCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {compareCount > 0 && (
        <Button
          onClick={() => router.push('/compare')}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <GitCompare className="h-4 w-4 mr-2" />
          Compare ({compareCount}/{MAX_FUNDS})
        </Button>
      )}

      {overlapCount > 0 && (
        <Button
          onClick={() => router.push('/overlap')}
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
        >
          <Layers className="h-4 w-4 mr-2" />
          Overlap ({overlapCount}/{MAX_FUNDS})
        </Button>
      )}
    </div>
  );
}
