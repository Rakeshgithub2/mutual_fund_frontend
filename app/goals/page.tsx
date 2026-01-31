'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/header';
import Link from 'next/link';
import {
  Target,
  ArrowRight,
  Home as HomeIcon,
  GraduationCap,
  Car,
  Palmtree,
  Building2,
  Heart,
  Briefcase,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  DollarSign,
  Calendar,
  PiggyBank,
  Calculator,
  CheckCircle,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

interface Goal {
  id: string;
  name: string;
  goalType: string;
  description?: string;
  targetAmount: number;
  currentSavings: number;
  timeframe: number;
  expectedReturn: number;
  monthlyInvestment: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const goalTypes = [
  {
    id: 'HOME',
    name: 'Buy a Home',
    icon: HomeIcon,
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    description: 'Save for your dream home',
  },
  {
    id: 'EDUCATION',
    name: 'Education',
    icon: GraduationCap,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600',
    description: 'Fund higher education',
  },
  {
    id: 'CAR',
    name: 'Buy a Car',
    icon: Car,
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    description: 'Purchase your dream vehicle',
  },
  {
    id: 'VACATION',
    name: 'Dream Vacation',
    icon: Palmtree,
    color: 'teal',
    gradient: 'from-teal-500 to-emerald-600',
    description: 'Plan that perfect getaway',
  },
  {
    id: 'RETIREMENT',
    name: 'Retirement',
    icon: Building2,
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    description: 'Secure your retirement',
  },
  {
    id: 'WEDDING',
    name: 'Wedding',
    icon: Heart,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    description: 'Plan your special day',
  },
  {
    id: 'BUSINESS',
    name: 'Start Business',
    icon: Briefcase,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Launch your venture',
  },
  {
    id: 'WEALTH',
    name: 'Wealth Creation',
    icon: TrendingUp,
    color: 'green',
    gradient: 'from-green-500 to-lime-600',
    description: 'Build long-term wealth',
  },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedType, setSelectedType] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [monthlyInvestment, setMonthlyInvestment] = useState(0);

  // TODO: Replace with actual user ID from authentication
  const userId = 'temp-user-id';

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/goals?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setGoals(data.goals);
      } else {
        toast.error('Failed to load goals');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const calculateInvestment = () => {
    const target = parseFloat(targetAmount);
    const years = parseFloat(timeframe);
    const current = parseFloat(currentSavings) || 0;
    const returnRate = parseFloat(expectedReturn) / 100;

    if (!target || !years) return 0;

    const months = years * 12;
    const monthlyRate = returnRate / 12;

    // Future value of current savings
    const futureValueCurrent = current * Math.pow(1 + monthlyRate, months);

    // Remaining amount needed
    const remaining = target - futureValueCurrent;

    if (remaining <= 0) {
      return 0;
    }

    // Calculate monthly SIP using future value of annuity formula
    const sip =
      (remaining * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);

    return Math.round(sip);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType || !name || !targetAmount || !timeframe) {
      toast.error('Please fill all required fields');
      return;
    }

    const calculatedMonthlyInvestment = calculateInvestment();

    const goalData = {
      userId,
      name,
      goalType: selectedType,
      description,
      targetAmount: parseFloat(targetAmount),
      currentSavings: parseFloat(currentSavings) || 0,
      timeframe: parseFloat(timeframe),
      expectedReturn: parseFloat(expectedReturn),
      monthlyInvestment: calculatedMonthlyInvestment,
    };

    try {
      if (editingGoal) {
        // Update existing goal
        const response = await fetch(`/api/goals/${editingGoal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goalData),
        });

        const data = await response.json();

        if (data.success) {
          toast.success('Goal updated successfully!');
          fetchGoals();
          resetForm();
        } else {
          toast.error('Failed to update goal');
        }
      } else {
        // Create new goal
        const response = await fetch('/api/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goalData),
        });

        const data = await response.json();

        if (data.success) {
          toast.success('Goal created successfully!');
          fetchGoals();
          resetForm();
        } else {
          toast.error('Failed to create goal');
        }
      }
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setSelectedType(goal.goalType);
    setName(goal.name);
    setDescription(goal.description || '');
    setTargetAmount(goal.targetAmount.toString());
    setCurrentSavings(goal.currentSavings.toString());
    setTimeframe(goal.timeframe.toString());
    setExpectedReturn(goal.expectedReturn.toString());
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Goal deleted successfully!');
        fetchGoals();
      } else {
        toast.error('Failed to delete goal');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingGoal(null);
    setSelectedType('');
    setName('');
    setDescription('');
    setTargetAmount('');
    setCurrentSavings('');
    setTimeframe('');
    setExpectedReturn('12');
    setMonthlyInvestment(0);
  };

  const getGoalTypeInfo = (goalType: string) => {
    return goalTypes.find((g) => g.id === goalType) || goalTypes[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/">
          <Button
            variant="outline"
            className="mb-6 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </Button>
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl mb-6">
            <Target className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-4">
            Financial Goal Planner
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Create, manage, and track your financial goals with real-time
            updates
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Goal
          </Button>
        </motion.div>

        {/* Goals List */}
        {!showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Loading your goals...
                </p>
              </div>
            ) : goals.length === 0 ? (
              <Card className="max-w-2xl mx-auto text-center py-12">
                <CardContent>
                  <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    No Goals Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start planning your financial future by creating your first
                    goal
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Goal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => {
                  const goalInfo = getGoalTypeInfo(goal.goalType);
                  const progress =
                    (goal.currentSavings / goal.targetAmount) * 100;

                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="hover:shadow-2xl transition-all border-2 hover:border-emerald-400 overflow-hidden">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-12 h-12 bg-gradient-to-r ${goalInfo.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                              >
                                <goalInfo.icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {goal.name}
                                </CardTitle>
                                <p className="text-sm text-gray-500">
                                  {goalInfo.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(goal)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(goal.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {goal.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {goal.description}
                            </p>
                          )}

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                Progress
                              </span>
                              <span className="font-semibold">
                                {progress.toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`bg-gradient-to-r ${goalInfo.gradient} h-2 rounded-full transition-all`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div>
                              <p className="text-xs text-gray-500">Target</p>
                              <p className="font-bold text-gray-900 dark:text-gray-100">
                                ₹{goal.targetAmount.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Monthly SIP
                              </p>
                              <p className="font-bold text-emerald-600">
                                ₹
                                {goal.monthlyInvestment.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Timeframe</p>
                              <p className="font-bold text-gray-900 dark:text-gray-100">
                                {goal.timeframe} years
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Status</p>
                              <p
                                className={`font-bold ${
                                  goal.status === 'ACTIVE'
                                    ? 'text-green-600'
                                    : goal.status === 'COMPLETED'
                                    ? 'text-blue-600'
                                    : 'text-gray-600'
                                }`}
                              >
                                {goal.status}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Create/Edit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold">
                      {editingGoal ? 'Edit Goal' : 'Create New Goal'}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={resetForm}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Goal Type Selection */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">
                        Select Goal Type
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {goalTypes.map((type) => (
                          <div
                            key={type.id}
                            onClick={() => {
                              setSelectedType(type.id);
                              if (!name) setName(type.name);
                            }}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedType === type.id
                                ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-950/30`
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div
                              className={`w-10 h-10 mx-auto mb-2 bg-gradient-to-r ${type.gradient} rounded-xl flex items-center justify-center`}
                            >
                              <type.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-xs text-center font-medium">
                              {type.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Goal Name */}
                    <div>
                      <Label htmlFor="name" className="text-base font-semibold">
                        Goal Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="e.g., Save for Home Down Payment"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-2"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <Label
                        htmlFor="description"
                        className="text-base font-semibold"
                      >
                        Description (Optional)
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Add more details about your goal..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    {/* Target Amount and Timeframe */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="targetAmount"
                          className="text-base font-semibold flex items-center gap-2"
                        >
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                          Target Amount (₹)
                        </Label>
                        <Input
                          id="targetAmount"
                          type="number"
                          placeholder="e.g., 5000000"
                          value={targetAmount}
                          onChange={(e) => setTargetAmount(e.target.value)}
                          className="mt-2"
                          required
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="timeframe"
                          className="text-base font-semibold flex items-center gap-2"
                        >
                          <Calendar className="w-5 h-5 text-emerald-600" />
                          Time Period (Years)
                        </Label>
                        <Input
                          id="timeframe"
                          type="number"
                          step="0.5"
                          placeholder="e.g., 10"
                          value={timeframe}
                          onChange={(e) => setTimeframe(e.target.value)}
                          className="mt-2"
                          required
                        />
                      </div>
                    </div>

                    {/* Current Savings and Expected Return */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="currentSavings"
                          className="text-base font-semibold flex items-center gap-2"
                        >
                          <PiggyBank className="w-5 h-5 text-emerald-600" />
                          Current Savings (₹)
                        </Label>
                        <Input
                          id="currentSavings"
                          type="number"
                          placeholder="e.g., 500000"
                          value={currentSavings}
                          onChange={(e) => setCurrentSavings(e.target.value)}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="expectedReturn"
                          className="text-base font-semibold flex items-center gap-2"
                        >
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                          Expected Return (%)
                        </Label>
                        <Input
                          id="expectedReturn"
                          type="number"
                          step="0.5"
                          value={expectedReturn}
                          onChange={(e) => setExpectedReturn(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    {/* Calculate Preview */}
                    {targetAmount && timeframe && (
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                          <Calculator className="w-5 h-5" />
                          Monthly Investment Required
                        </h4>
                        <p className="text-3xl font-bold text-emerald-600">
                          ₹{calculateInvestment().toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        {editingGoal ? 'Update Goal' : 'Create Goal'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
