import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.DATABASE_URL!;
const MONGODB_DB = 'mutualfunds';

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URL environment variable');
}

interface MongoClientCache {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

// In development mode, use a global variable so the value is preserved
// across module reloads caused by HMR (Hot Module Replacement).
const globalForMongo = globalThis as unknown as {
  mongoClientPromise: MongoClientCache;
};

if (!globalForMongo.mongoClientPromise) {
  globalForMongo.mongoClientPromise = { client: null, promise: null };
}

const cached = globalForMongo.mongoClientPromise;

export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  if (cached.client) {
    return { client: cached.client, db: cached.client.db(MONGODB_DB) };
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts);
  }

  try {
    cached.client = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return { client: cached.client, db: cached.client.db(MONGODB_DB) };
}

export async function getDb(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}

// Direct function to get all funds from DB
export async function getAllFundsFromDB(limit: number = 15000) {
  try {
    const db = await getDb();
    const fundsCollection = db.collection('funds');

    console.log('📊 [MongoDB] Fetching funds from database...');

    const funds = await fundsCollection
      .find({})
      .limit(limit)
      .project({
        schemeCode: 1,
        schemeName: 1,
        name: 1,
        category: 1,
        subCategory: 1,
        fundHouse: 1,
        amcName: 1,
        amc: 1,
        fundType: 1,
        aum: 1,
        expenseRatio: 1,
        nav: 1,
        currentNav: 1,
        returns: 1,
        returns1Y: 1,
        returns3Y: 1,
        returns5Y: 1,
        riskMetrics: 1,
        ratings: 1,
        rating: 1,
        tags: 1,
        _id: 0,
      })
      .toArray();

    console.log(`✅ [MongoDB] Fetched ${funds.length} funds from database`);
    return funds;
  } catch (error) {
    console.error('❌ [MongoDB] Error fetching funds:', error);
    throw error;
  }
}
