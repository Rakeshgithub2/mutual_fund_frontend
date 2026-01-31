import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// CRITICAL FIX #3: Prevent Vercel caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// GET /api/goals - List all goals for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // TODO: Get user ID from session/auth token
    // For now, using a query parameter for testing
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

// POST /api/goals - Create a new goal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      name,
      goalType,
      description,
      targetAmount,
      currentSavings,
      timeframe,
      expectedReturn,
      monthlyInvestment,
    } = body;

    // Validation
    if (!userId || !name || !goalType || !targetAmount || !timeframe) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.create({
      data: {
        userId,
        name,
        goalType,
        description: description || '',
        targetAmount: parseFloat(targetAmount),
        currentSavings: currentSavings ? parseFloat(currentSavings) : 0,
        timeframe: parseFloat(timeframe),
        expectedReturn: expectedReturn ? parseFloat(expectedReturn) : 12,
        monthlyInvestment: monthlyInvestment
          ? parseFloat(monthlyInvestment)
          : 0,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true, goal }, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}
