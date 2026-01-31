/**
 * Enhanced Fund Search Service
 * - Searches local database first
 * - Falls back to external APIs (AMFI, MFCentral) if not found
 * - Auto-saves new funds to database for future searches
 */

import axios from 'axios';
import { mongodb } from '../db/mongodb';
import { ObjectId } from 'mongodb';

interface ExternalFundData {
  amfiCode?: string;
  name: string;
  fundHouse?: string;
  category?: string;
  subCategory?: string;
  currentNav?: number;
  navDate?: string;
  source: 'amfi' | 'mfapi' | 'rapidapi';
}

interface SearchResult {
  id: string;
  fundId: string;
  name: string;
  fundHouse?: string;
  category?: string;
  subCategory?: string;
  currentNav?: number;
  aum?: number;
  returns?: any;
  expenseRatio?: number;
  isNew?: boolean; // Flag for newly fetched funds
  source: 'database' | 'external';
}

export class EnhancedSearchService {
  // AMFI India API endpoint
  private readonly AMFI_API_URL = 'https://www.amfiindia.com/spages/NAVAll.txt';

  // MF API (Open source Indian MF API)
  private readonly MFAPI_URL = 'https://api.mfapi.in';

  /**
   * Search funds in database first, then fallback to external APIs
   */
  async searchFunds(
    query: string,
    limit: number = 15
  ): Promise<SearchResult[]> {
    console.log(`🔍 Enhanced search for: "${query}"`);

    // Step 1: Search in local database
    const localResults = await this.searchInDatabase(query, limit);
    console.log(`✅ Found ${localResults.length} results in database`);

    // If we have enough results, return them
    if (localResults.length >= 5) {
      return localResults;
    }

    // Step 2: If less than 5 results, try external APIs
    console.log('🌐 Fetching from external APIs...');
    try {
      const externalResults = await this.searchExternalAPIs(query);
      console.log(
        `✅ Found ${externalResults.length} results from external APIs`
      );

      // Step 3: Save external results to database for future searches
      const savedResults = await this.saveExternalFunds(externalResults);

      // Combine and deduplicate results
      const combined = [...localResults];
      for (const extResult of savedResults) {
        // Check if already in local results
        const exists = combined.some(
          (r) => r.name.toLowerCase() === extResult.name.toLowerCase()
        );
        if (!exists) {
          combined.push(extResult);
        }
      }

      return combined.slice(0, limit);
    } catch (error) {
      console.error('❌ External API search failed:', error);
      // Return whatever we have from database
      return localResults;
    }
  }

  /**
   * Search in local MongoDB database
   */
  private async searchInDatabase(
    query: string,
    limit: number
  ): Promise<SearchResult[]> {
    const fundsCollection = mongodb.getCollection('funds');

    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { fundHouse: { $regex: query, $options: 'i' } },
        { amfiCode: { $regex: query, $options: 'i' } },
      ],
      isActive: { $ne: false },
    };

    const funds = await fundsCollection
      .find(searchQuery)
      .limit(limit)
      .project({
        _id: 1,
        fundId: 1,
        name: 1,
        fundHouse: 1,
        category: 1,
        subCategory: 1,
        fundManager: 1,
        aum: 1,
        returns: 1,
        currentNav: 1,
        expenseRatio: 1,
      })
      .toArray();

    return funds.map((fund: any) => ({
      id: fund._id.toString(),
      fundId: fund.fundId || fund._id.toString(),
      name: fund.name,
      fundHouse: fund.fundHouse,
      category: fund.category,
      subCategory: fund.subCategory,
      currentNav: fund.currentNav,
      aum: fund.aum,
      returns: fund.returns,
      expenseRatio: fund.expenseRatio,
      source: 'database' as const,
    }));
  }

  /**
   * Search external APIs for fund data
   */
  private async searchExternalAPIs(query: string): Promise<ExternalFundData[]> {
    const results: ExternalFundData[] = [];

    // Try MFAPI (faster and more reliable)
    try {
      const mfResults = await this.searchMFAPI(query);
      results.push(...mfResults);
    } catch (error) {
      console.error('MFAPI search failed:', error);
    }

    // Try AMFI if still not enough results
    if (results.length < 3) {
      try {
        const amfiResults = await this.searchAMFI(query);
        results.push(...amfiResults);
      } catch (error) {
        console.error('AMFI search failed:', error);
      }
    }

    return results;
  }

  /**
   * Search using MFAPI (https://api.mfapi.in)
   */
  private async searchMFAPI(query: string): Promise<ExternalFundData[]> {
    try {
      // MFAPI doesn't have search, so we fetch all schemes and filter
      // This is cached on their end, so it's fast
      const response = await axios.get(`${this.MFAPI_URL}/mf`, {
        timeout: 5000,
      });

      if (!Array.isArray(response.data)) {
        return [];
      }

      // Filter schemes matching the query
      const lowerQuery = query.toLowerCase();
      const matching = response.data.filter(
        (scheme: any) =>
          scheme.schemeName &&
          scheme.schemeName.toLowerCase().includes(lowerQuery)
      );

      // Get latest NAV for matching schemes (limit to 5 to avoid too many requests)
      const results: ExternalFundData[] = [];
      const limit = Math.min(matching.length, 5);

      for (let i = 0; i < limit; i++) {
        const scheme = matching[i];
        try {
          const navResponse = await axios.get(
            `${this.MFAPI_URL}/mf/${scheme.schemeCode}`,
            { timeout: 3000 }
          );

          if (navResponse.data && navResponse.data.data) {
            const latestNav = navResponse.data.data[0];
            results.push({
              amfiCode: scheme.schemeCode,
              name: navResponse.data.meta.scheme_name,
              fundHouse: this.extractFundHouse(
                navResponse.data.meta.scheme_name
              ),
              category: this.inferCategory(
                navResponse.data.meta.scheme_category
              ),
              subCategory: this.inferSubCategory(
                navResponse.data.meta.scheme_name
              ),
              currentNav: parseFloat(latestNav.nav),
              navDate: latestNav.date,
              source: 'mfapi',
            });
          }
        } catch (error) {
          console.error(`Failed to fetch NAV for ${scheme.schemeCode}:`, error);
        }
      }

      return results;
    } catch (error) {
      console.error('MFAPI search error:', error);
      return [];
    }
  }

  /**
   * Search using AMFI NAV file
   */
  private async searchAMFI(query: string): Promise<ExternalFundData[]> {
    try {
      const response = await axios.get(this.AMFI_API_URL, {
        timeout: 10000,
        responseType: 'text',
      });

      const lines = response.data.split('\n');
      const results: ExternalFundData[] = [];
      const lowerQuery = query.toLowerCase();

      for (const line of lines) {
        if (line.trim() && !line.includes('Scheme Name')) {
          const parts = line.split(';');
          if (parts.length >= 5) {
            const schemeName = parts[3]?.trim();
            if (schemeName && schemeName.toLowerCase().includes(lowerQuery)) {
              const nav = parseFloat(parts[4]);
              if (!isNaN(nav)) {
                results.push({
                  amfiCode: parts[0]?.trim(),
                  name: schemeName,
                  fundHouse: this.extractFundHouse(schemeName),
                  category: this.inferCategory(schemeName),
                  subCategory: this.inferSubCategory(schemeName),
                  currentNav: nav,
                  navDate: parts[5]?.trim(),
                  source: 'amfi',
                });
              }
            }
          }
        }

        // Limit results to avoid processing entire file
        if (results.length >= 10) break;
      }

      return results;
    } catch (error) {
      console.error('AMFI search error:', error);
      return [];
    }
  }

  /**
   * Save external fund data to database
   */
  private async saveExternalFunds(
    externalFunds: ExternalFundData[]
  ): Promise<SearchResult[]> {
    const fundsCollection = mongodb.getCollection('funds');
    const savedResults: SearchResult[] = [];

    for (const extFund of externalFunds) {
      try {
        // Check if fund already exists
        const existing = await fundsCollection.findOne({
          $or: [{ amfiCode: extFund.amfiCode }, { name: extFund.name }],
        });

        if (existing) {
          // Update existing fund with latest NAV
          await fundsCollection.updateOne(
            { _id: existing._id },
            {
              $set: {
                currentNav: extFund.currentNav,
                navDate: extFund.navDate,
                updatedAt: new Date(),
              },
            }
          );

          savedResults.push({
            id: existing._id.toString(),
            fundId: existing.fundId || existing._id.toString(),
            name: existing.name,
            fundHouse: existing.fundHouse || extFund.fundHouse,
            category: existing.category || extFund.category,
            subCategory: existing.subCategory || extFund.subCategory,
            currentNav: extFund.currentNav,
            source: 'database',
          });
        } else {
          // Insert new fund
          const newFund = await fundsCollection.insertOne({
            amfiCode: extFund.amfiCode || `EXT-${Date.now()}`,
            name: extFund.name,
            fundHouse: extFund.fundHouse,
            category: extFund.category || 'other',
            subCategory: extFund.subCategory,
            fundType: 'mutual_fund',
            currentNav: extFund.currentNav,
            navDate: extFund.navDate,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          savedResults.push({
            id: newFund.insertedId.toString(),
            fundId: newFund.insertedId.toString(),
            name: extFund.name,
            fundHouse: extFund.fundHouse,
            category: extFund.category,
            subCategory: extFund.subCategory,
            currentNav: extFund.currentNav,
            isNew: true,
            source: 'external',
          });
        }

        console.log(`✅ Saved/Updated fund: ${extFund.name}`);
      } catch (error) {
        console.error(`Failed to save fund ${extFund.name}:`, error);
      }
    }

    return savedResults;
  }

  /**
   * Helper: Extract fund house from scheme name
   */
  private extractFundHouse(schemeName: string): string {
    // Common pattern: "Fund House - Scheme Name"
    const parts = schemeName.split('-');
    if (parts.length > 1) {
      return parts[0].trim();
    }

    // Try to extract from common patterns
    const fundHouses = [
      'HDFC',
      'ICICI',
      'SBI',
      'Axis',
      'Kotak',
      'Aditya Birla',
      'UTI',
      'Nippon',
      'DSP',
      'Franklin',
      'IDFC',
      'Mirae',
      'Motilal',
      'Tata',
      'Edelweiss',
      'PGIM',
      'Quantum',
      'LIC',
      'BOI',
      'Canara',
      'Sundaram',
      'Union',
    ];

    for (const house of fundHouses) {
      if (schemeName.includes(house)) {
        return house;
      }
    }

    return 'Other';
  }

  /**
   * Helper: Infer category from scheme name/category
   */
  private inferCategory(text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes('equity') || lower.includes('stock')) return 'equity';
    if (
      lower.includes('debt') ||
      lower.includes('bond') ||
      lower.includes('income')
    )
      return 'debt';
    if (lower.includes('hybrid') || lower.includes('balanced')) return 'hybrid';
    if (lower.includes('liquid') || lower.includes('money market'))
      return 'liquid';
    if (lower.includes('gold') || lower.includes('commodity'))
      return 'commodity';
    if (lower.includes('international') || lower.includes('global'))
      return 'international';
    if (lower.includes('elss') || lower.includes('tax saver')) return 'elss';
    return 'other';
  }

  /**
   * Helper: Infer subcategory from scheme name
   */
  private inferSubCategory(schemeName: string): string {
    const lower = schemeName.toLowerCase();
    if (lower.includes('large cap') || lower.includes('blue chip'))
      return 'Large Cap';
    if (lower.includes('mid cap') || lower.includes('midcap')) return 'Mid Cap';
    if (lower.includes('small cap') || lower.includes('smallcap'))
      return 'Small Cap';
    if (lower.includes('multi cap') || lower.includes('multicap'))
      return 'Multi Cap';
    if (lower.includes('flexi cap') || lower.includes('flexicap'))
      return 'Flexi Cap';
    if (lower.includes('large & mid') || lower.includes('large and mid'))
      return 'Large & Mid Cap';
    if (lower.includes('sectoral') || lower.includes('thematic'))
      return 'Sectoral/Thematic';
    if (lower.includes('focused') || lower.includes('focus')) return 'Focused';
    if (lower.includes('value')) return 'Value';
    if (lower.includes('dividend')) return 'Dividend Yield';
    return undefined as any;
  }
}

export const enhancedSearchService = new EnhancedSearchService();
