/**
 * IndexedDB Utility for Fund Caching
 * Provides persistent browser storage for all funds
 * Survives page refresh, enables instant navigation
 */

const DB_NAME = 'MutualFundsDB';
const DB_VERSION = 1;
const FUNDS_STORE = 'funds';
const META_STORE = 'metadata';

export interface CachedFund {
  id: string;
  schemeCode: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory: string;
  nav: number;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  aum: number;
  expenseRatio: number;
  rating: number;
  riskLevel?: string;
  schemeType?: string;
  normalizedCategory?: string; // Computed category for filtering
}

interface DBMetadata {
  key: string;
  value: any;
  timestamp: number;
}

let dbInstance: IDBDatabase | null = null;

// Open/Create IndexedDB
export async function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('❌ [IndexedDB] Failed to open database');
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      console.log('✅ [IndexedDB] Database opened successfully');
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create funds store with indexes
      if (!db.objectStoreNames.contains(FUNDS_STORE)) {
        const fundsStore = db.createObjectStore(FUNDS_STORE, { keyPath: 'id' });
        fundsStore.createIndex('schemeCode', 'schemeCode', { unique: false });
        fundsStore.createIndex('category', 'category', { unique: false });
        fundsStore.createIndex('normalizedCategory', 'normalizedCategory', {
          unique: false,
        });
        fundsStore.createIndex('fundHouse', 'fundHouse', { unique: false });
        console.log('✅ [IndexedDB] Funds store created with indexes');
      }

      // Create metadata store
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'key' });
        console.log('✅ [IndexedDB] Metadata store created');
      }
    };
  });
}

// Store funds in IndexedDB (batch insert)
export async function storeFunds(funds: CachedFund[]): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FUNDS_STORE], 'readwrite');
    const store = transaction.objectStore(FUNDS_STORE);

    let completed = 0;
    const total = funds.length;

    funds.forEach((fund) => {
      const request = store.put(fund);
      request.onsuccess = () => {
        completed++;
        if (completed === total) {
          console.log(`✅ [IndexedDB] Stored ${total} funds`);
        }
      };
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Get all funds from IndexedDB
export async function getAllFunds(): Promise<CachedFund[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FUNDS_STORE], 'readonly');
    const store = transaction.objectStore(FUNDS_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      console.log(
        `✅ [IndexedDB] Retrieved ${request.result.length} funds from cache`
      );
      resolve(request.result);
    };
    request.onerror = () => reject(request.error);
  });
}

// Get funds by category using index
export async function getFundsByCategory(
  category: string
): Promise<CachedFund[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FUNDS_STORE], 'readonly');
    const store = transaction.objectStore(FUNDS_STORE);
    const index = store.index('normalizedCategory');
    const request = index.getAll(category);

    request.onsuccess = () => {
      console.log(
        `✅ [IndexedDB] Found ${request.result.length} funds for category: ${category}`
      );
      resolve(request.result);
    };
    request.onerror = () => reject(request.error);
  });
}

// Get fund count
export async function getFundCount(): Promise<number> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FUNDS_STORE], 'readonly');
    const store = transaction.objectStore(FUNDS_STORE);
    const request = store.count();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Store metadata (last update time, total count, etc.)
export async function setMetadata(key: string, value: any): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([META_STORE], 'readwrite');
    const store = transaction.objectStore(META_STORE);
    const request = store.put({ key, value, timestamp: Date.now() });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Get metadata
export async function getMetadata(key: string): Promise<any> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([META_STORE], 'readonly');
    const store = transaction.objectStore(META_STORE);
    const request = store.get(key);

    request.onsuccess = () => {
      resolve(request.result?.value ?? null);
    };
    request.onerror = () => reject(request.error);
  });
}

// Check if cache is valid (less than 1 hour old)
export async function isCacheValid(): Promise<boolean> {
  try {
    const lastUpdate = await getMetadata('lastUpdate');
    if (!lastUpdate) return false;

    const ONE_HOUR = 60 * 60 * 1000;
    const isValid = Date.now() - lastUpdate < ONE_HOUR;
    console.log(`📊 [IndexedDB] Cache valid: ${isValid}`);
    return isValid;
  } catch {
    return false;
  }
}

// Clear all funds (for refresh)
export async function clearFunds(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FUNDS_STORE], 'readwrite');
    const store = transaction.objectStore(FUNDS_STORE);
    const request = store.clear();

    request.onsuccess = () => {
      console.log('✅ [IndexedDB] Funds cache cleared');
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

// Check if IndexedDB is available
export function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}
