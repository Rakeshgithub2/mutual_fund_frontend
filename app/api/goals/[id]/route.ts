import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// CRITICAL FIX #3: Prevent Vercel caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
// GET /api/goals/[id] - Get a single goal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    console.error('Error fetching goal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goal' },
      { status: 500 }
    );
  }
}

// PUT /api/goals/[id] - Update a goal
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      name,
      goalType,
      description,
      targetAmount,
      currentSavings,
      timeframe,
      expectedReturn,
      monthlyInvestment,
      status,
    } = body;

    // Check if goal exists
    const existingGoal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (goalType !== undefined) updateData.goalType = goalType;
    if (description !== undefined) updateData.description = description;
    if (targetAmount !== undefined)
      updateData.targetAmount = parseFloat(targetAmount);
    if (currentSavings !== undefined)
      updateData.currentSavings = parseFloat(currentSavings);
    if (timeframe !== undefined) updateData.timeframe = parseFloat(timeframe);
    if (expectedReturn !== undefined)
      updateData.expectedReturn = parseFloat(expectedReturn);
    if (monthlyInvestment !== undefined)
      updateData.monthlyInvestment = parseFloat(monthlyInvestment);
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'COMPLETED') {
        updateData.achievedAt = new Date();
      }
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

// DELETE /api/goals/[id] - Delete a goal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if goal exists
    const existingGoal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    await prisma.goal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}
