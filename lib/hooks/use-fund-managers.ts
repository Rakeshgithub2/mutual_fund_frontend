'use client';

import { useState, useEffect } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const API_URL = (process.env.NEXT_PUBLIC_API_URL || `${BASE_URL}/api`).replace(
  /\/+$/,
  ''
);

export interface FundManager {
  id: string;
  managerId: string;
  name: string;
  bio: string;
  experience: number;
  qualification: string[];
  currentFundHouse: string;
  designation: string;
  joinedDate: string;
  fundsManaged: number;
  fundsList: Array<{
    fundId: string;
    fundName: string;
    aum: number;
    returns: {
      oneYear: number;
      threeYear: number;
      fiveYear: number;
    };
  }>;
  totalAumManaged: number;
  averageReturns: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  awards: Array<{
    title: string;
    year: number;
    organization: string;
  }>;
  email?: string;
  linkedin?: string;
  twitter?: string;
  isActive: boolean;
  lastUpdated: string;
}

interface UseFundManagersResult {
  managers: FundManager[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFundManagers(options?: {
  fundHouse?: string;
  minExperience?: number;
  sortBy?: 'name' | 'aum' | 'experience';
  limit?: number;
}): UseFundManagersResult {
  const [managers, setManagers] = useState<FundManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManagers = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options?.fundHouse) params.append('fundHouse', options.fundHouse);
      if (options?.minExperience)
        params.append('minExperience', options.minExperience.toString());
      if (options?.sortBy) params.append('sortBy', options.sortBy);
      if (options?.limit) params.append('limit', options.limit.toString());
      else params.append('limit', '100');

      const apiUrl = `${BASE_URL}/api/fund-managers?${params.toString()}`;
      console.log('🚀 Fetching fund managers from API:', apiUrl);

      const httpResponse = await fetch(apiUrl);

      console.log('📡 Response status:', httpResponse.status);

      if (!httpResponse.ok) {
        const errorText = await httpResponse.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(
          `Failed to fetch fund managers: ${httpResponse.status} ${httpResponse.statusText}`
        );
      }

      const response = await httpResponse.json();
      console.log(
        '✅ API Response received:',
        response.data?.length,
        'managers'
      );

      setManagers(response.data || []);
    } catch (err) {
      console.error('Error fetching fund managers:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch fund managers'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, [
    options?.fundHouse,
    options?.minExperience,
    options?.sortBy,
    options?.limit,
  ]);

  return {
    managers,
    loading,
    error,
    refetch: fetchManagers,
  };
}

export function useFundManager(id: string) {
  const [manager, setManager] = useState<FundManager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManager = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${API_URL}/fund-managers/${id}`;
      console.log('🚀 Fetching fund manager from API:', apiUrl);

      const httpResponse = await fetch(apiUrl);

      if (!httpResponse.ok) {
        throw new Error(
          `Failed to fetch fund manager: ${httpResponse.statusText}`
        );
      }

      const apiResponse = await httpResponse.json();
      console.log('✅ Fund manager data received:', apiResponse.data?.name);

      setManager(apiResponse.data);
    } catch (err) {
      console.error('Error fetching fund manager:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch fund manager'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManager();
  }, [id]);

  return {
    manager,
    loading,
    error,
    refetch: fetchManager,
  };
}
