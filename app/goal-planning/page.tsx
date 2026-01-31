'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  GraduationCap,
  Home,
  Car,
  Plane,
  Heart,
  Baby,
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  Calculator,
  ArrowRight,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  X,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  iconName: string;
  targetAmount: number;
  currentSavings: number;
  timeframe: number;
  color: string;
  description: string;
  monthlyInvestment: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
}

export default function GoalPlanningPage() {
  const [myGoals, setMyGoals] = useState<Goal[]>([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    timeframe: '',
    currentSavings: '0',
    monthlyInvestment: '',
    iconName: 'Target',
    color: 'from-blue-500 to-cyan-600',
    description: '',
  });

  // Load goals from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userGoals');
    if (saved) {
      setMyGoals(JSON.parse(saved));
    }
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    if (myGoals.length > 0) {
      localStorage.setItem('userGoals', JSON.stringify(myGoals));
    }
  }, [myGoals]);

  const predefinedGoals = [
    {
      id: 'education',
      title: 'Child Education',
      iconName: 'GraduationCap',
      targetAmount: 2000000,
      timeframe: 15,
      color: 'from-blue-500 to-cyan-600',
      description: "Plan for your child's higher education expenses",
    },
    {
      id: 'home',
      title: 'Dream Home',
      iconName: 'Home',
      targetAmount: 5000000,
      timeframe: 10,
      color: 'from-purple-500 to-pink-600',
      description: 'Save for down payment on your dream house',
    },
    {
      id: 'car',
      title: 'New Car',
      iconName: 'Car',
      targetAmount: 800000,
      timeframe: 3,
      color: 'from-orange-500 to-red-600',
      description: 'Buy your dream car without financial stress',
    },
    {
      id: 'vacation',
      title: 'World Tour',
      iconName: 'Plane',
      targetAmount: 500000,
      timeframe: 2,
      color: 'from-green-500 to-teal-600',
      description: 'Travel the world and create memories',
    },
    {
      id: 'wedding',
      title: 'Wedding',
      iconName: 'Heart',
      targetAmount: 1500000,
      timeframe: 5,
      color: 'from-pink-500 to-rose-600',
      description: 'Plan a perfect wedding celebration',
    },
    {
      id: 'retirement',
      title: 'Retirement',
      iconName: 'Baby',
      targetAmount: 10000000,
      timeframe: 25,
      color: 'from-indigo-500 to-purple-600',
      description: 'Secure your golden years with smart planning',
    },
  ];

  const iconMap: any = {
    GraduationCap,
    Home,
    Car,
    Plane,
    Heart,
    Baby,
    Target,
    TrendingUp,
    DollarSign,
  };

  const calculateSIP = (
    target: number,
    years: number,
    currentSavings: number = 0
  ) => {
    const months = years * 12;
    const rate = 0.12 / 12;
    const futureValue = target - currentSavings * Math.pow(1 + rate, months);
    const sip = (futureValue * rate) / (Math.pow(1 + rate, months) - 1);
    return Math.ceil(sip);
  };

  const handleStartPlanning = (preset: (typeof predefinedGoals)[0]) => {
    const sip = calculateSIP(preset.targetAmount, preset.timeframe);
    setFormData({
      title: preset.title,
      targetAmount: preset.targetAmount.toString(),
      timeframe: preset.timeframe.toString(),
      currentSavings: '0',
      monthlyInvestment: sip.toString(),
      iconName: preset.iconName,
      color: preset.color,
      description: preset.description,
    });
    setShowGoalForm(true);
  };

  const handleCreateGoal = () => {
    if (!formData.title || !formData.targetAmount || !formData.timeframe) {
      alert('Please fill all required fields');
      return;
    }

    const newGoal: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      title: formData.title,
      iconName: formData.iconName,
      targetAmount: parseFloat(formData.targetAmount),
      currentSavings: parseFloat(formData.currentSavings),
      timeframe: parseFloat(formData.timeframe),
      color: formData.color,
      description: formData.description,
      monthlyInvestment: parseFloat(formData.monthlyInvestment),
      status: 'active',
      createdAt: editingGoal?.createdAt || new Date(),
    };

    if (editingGoal) {
      setMyGoals(myGoals.map((g) => (g.id === editingGoal.id ? newGoal : g)));
    } else {
      setMyGoals([...myGoals, newGoal]);
    }

    resetForm();
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount.toString(),
      timeframe: goal.timeframe.toString(),
      currentSavings: goal.currentSavings.toString(),
      monthlyInvestment: goal.monthlyInvestment.toString(),
      iconName: goal.iconName,
      color: goal.color,
      description: goal.description,
    });
    setShowGoalForm(true);
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      setMyGoals(myGoals.filter((g) => g.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setMyGoals(
      myGoals.map((g) =>
        g.id === id
          ? {
              ...g,
              status: g.status === 'active' ? 'paused' : 'active',
            }
          : g
      )
    );
  };

  const handleMarkComplete = (id: string) => {
    setMyGoals(
      myGoals.map((g) =>
        g.id === id ? { ...g, status: 'completed' as const } : g
      )
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      targetAmount: '',
      timeframe: '',
      currentSavings: '0',
      monthlyInvestment: '',
      iconName: 'Target',
      color: 'from-blue-500 to-cyan-600',
      description: '',
    });
    setEditingGoal(null);
    setShowGoalForm(false);
  };

  const getProgress = (goal: Goal) => {
    return Math.min((goal.currentSavings / goal.targetAmount) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-red-600">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
            Goal Planning
          </h1>
          <p className="text-white/80 text-sm">
            Plan your financial goals and achieve them with smart investments
          </p>
        </div>

        {/* My Goals Section */}
        {myGoals.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">My Goals</h2>
              <Button
                onClick={() => setShowGoalForm(true)}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Goal
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myGoals.map((goal) => {
                const Icon = iconMap[goal.iconName] || Target;
                const progress = getProgress(goal);

                return (
                  <Card
                    key={goal.id}
                    className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-white/30 ${
                      goal.status === 'completed' ? 'opacity-75' : ''
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                              {goal.title}
                            </CardTitle>
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                goal.status === 'completed'
                                  ? 'bg-green-100 text-green-600'
                                  : goal.status === 'paused'
                                    ? 'bg-yellow-100 text-yellow-600'
                                    : 'bg-blue-100 text-blue-600'
                              }`}
                            >
                              {goal.status === 'completed'
                                ? 'Completed'
                                : goal.status === 'paused'
                                  ? 'Paused'
                                  : 'Active'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditGoal(goal)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="p-1.5 rounded-lg hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {progress.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${goal.color}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                          <p className="text-gray-600 dark:text-gray-400 mb-1">
                            Current
                          </p>
                          <p className="font-bold text-gray-900 dark:text-white">
                            ₹{(goal.currentSavings / 100000).toFixed(1)}L
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                          <p className="text-gray-600 dark:text-gray-400 mb-1">
                            Target
                          </p>
                          <p className="font-bold text-gray-900 dark:text-white">
                            ₹{(goal.targetAmount / 100000).toFixed(1)}L
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                          <p className="text-gray-600 dark:text-gray-400 mb-1">
                            Monthly SIP
                          </p>
                          <p className="font-bold text-gray-900 dark:text-white">
                            ₹{(goal.monthlyInvestment / 1000).toFixed(1)}K
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                          <p className="text-gray-600 dark:text-gray-400 mb-1">
                            Timeframe
                          </p>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {goal.timeframe} years
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {goal.status !== 'completed' && (
                          <>
                            <Button
                              onClick={() => handleToggleStatus(goal.id)}
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              {goal.status === 'active' ? (
                                <>
                                  <PauseCircle className="w-3 h-3 mr-1" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="w-3 h-3 mr-1" />
                                  Resume
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => handleMarkComplete(goal.id)}
                              size="sm"
                              className={`flex-1 bg-gradient-to-r ${goal.color}`}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Complete
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Goal Form Modal */}
        {showGoalForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-white dark:bg-gray-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">
                    {editingGoal ? 'Edit Goal' : 'Create New Goal'}
                  </CardTitle>
                  <button
                    onClick={resetForm}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Goal Name *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Dream Home"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Target Amount (₹) *
                    </label>
                    <Input
                      type="number"
                      value={formData.targetAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          targetAmount: e.target.value,
                        })
                      }
                      placeholder="5000000"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Timeframe (Years) *
                    </label>
                    <Input
                      type="number"
                      value={formData.timeframe}
                      onChange={(e) =>
                        setFormData({ ...formData, timeframe: e.target.value })
                      }
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Current Savings (₹)
                    </label>
                    <Input
                      type="number"
                      value={formData.currentSavings}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentSavings: e.target.value,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Monthly Investment (₹) *
                    </label>
                    <Input
                      type="number"
                      value={formData.monthlyInvestment}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          monthlyInvestment: e.target.value,
                        })
                      }
                      placeholder="25000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Description
                  </label>
                  <Input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Save for down payment on dream house"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateGoal}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {editingGoal ? 'Update Goal' : 'Create Goal'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Predefined Goals (Show when no goals) */}
        {myGoals.length === 0 && (
          <>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white mb-2">
                Popular Goals
              </h2>
              <p className="text-white/80 text-sm">
                Choose a preset goal or create your own custom plan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predefinedGoals.map((goal) => {
                const Icon = iconMap[goal.iconName];
                const monthlySIP = calculateSIP(
                  goal.targetAmount,
                  goal.timeframe
                );

                return (
                  <Card
                    key={goal.id}
                    className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-white/30 hover:shadow-2xl transition-all cursor-pointer group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                          {goal.timeframe} years
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                        {goal.title}
                      </CardTitle>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {goal.description}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          Target
                        </span>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          ₹{(goal.targetAmount / 100000).toFixed(1)}L
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
                        <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-1">
                          Required Monthly SIP
                        </p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          ₹{(monthlySIP / 1000).toFixed(1)}K
                        </p>
                      </div>

                      <Button
                        onClick={() => handleStartPlanning(goal)}
                        className={`w-full bg-gradient-to-r ${goal.color} text-white hover:shadow-lg transition-all text-xs py-2`}
                      >
                        Start Planning
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 text-center">
              <Button
                onClick={() => setShowGoalForm(true)}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Goal
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
