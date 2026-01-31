'use client';

export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/header';
import { BackButton } from '@/components/back-button';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "👋 Hi! I'm your AI investment assistant. I can help you with:\n\n• Finding the right mutual funds\n• Understanding investment terms\n• Comparing fund performance\n• Answering investment questions\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const API_URL = (
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api`
          : `${BASE_URL}/api`
      ).replace(/\/+$/, '');
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content, // Backend expects 'message'
          conversationHistory: messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server error: ${response.status}`
        );
      }

      const apiResponse = await response.json();

      // Backend returns { success, reply, timestamp }
      const responseText =
        apiResponse.reply ||
        apiResponse.data?.reply ||
        apiResponse.data?.answer ||
        apiResponse.answer ||
        'No response received';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Handle follow-up questions from API response (data.followUpQuestions)
      const followUps =
        apiResponse.data?.followUpQuestions || apiResponse.followUpQuestions;
      if (followUps && followUps.length > 0) {
        const followUpMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: `💡 You might also want to ask:\n${followUps
            .map((q: string, i: number) => `${i + 1}. ${q}`)
            .join('\n')}`,
          timestamp: new Date(),
        };
        setTimeout(() => {
          setMessages((prev) => [...prev, followUpMessage]);
        }, 500);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          error instanceof Error && error.message.includes('503')
            ? '🔧 AI service is temporarily unavailable. The administrator needs to configure the GEMINI_API_KEY.'
            : error instanceof Error
              ? `⚠️ ${error.message}`
              : "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    'What are the best equity funds?',
    'How does SIP work?',
    'Compare large cap vs mid cap funds',
    'What is expense ratio?',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      <Header />

      <main className="mx-auto max-w-6xl px-2 sm:px-4 py-3 sm:py-6 pb-20 sm:pb-24">
        <div className="mb-3 sm:mb-4 px-2">
          <BackButton />
          <div className="flex items-center gap-3 mt-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                AI Investment Assistant
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                Get instant answers powered by Gemini AI
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden h-[calc(100vh-200px)] sm:h-[calc(100vh-240px)] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } animate-fadeIn`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mr-2 sm:mr-3 shadow-md">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] sm:max-w-[75%] rounded-2xl sm:rounded-3xl px-4 py-3 sm:px-5 sm:py-4 shadow-lg transition-all hover:shadow-xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-2 flex items-center gap-1 ${
                      message.role === 'user'
                        ? 'text-white/70'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                    suppressHydrationWarning
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center flex-shrink-0 ml-2 sm:ml-3 text-white font-bold text-sm shadow-md">
                    You
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mr-2 sm:mr-3 shadow-md">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl px-5 py-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-pink-600 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Questions */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-3 pt-2 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent flex-1"></div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
                    💡 Quick Starts
                  </p>
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent flex-1"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {suggestedQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputValue(question);
                        inputRef.current?.focus();
                      }}
                      className="group text-left text-sm px-4 py-3 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-lg transition-all min-h-[52px] flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {question}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 lg:p-5 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything about investments..."
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-600 h-11 sm:h-12 lg:h-14 text-sm sm:text-base pl-4 pr-4 bg-white dark:bg-gray-800 shadow-sm"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 h-11 sm:h-12 lg:h-14 px-4 sm:px-5 lg:px-7 min-w-[48px] sm:min-w-[60px] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Press{' '}
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">
                  Enter
                </kbd>{' '}
                to send
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Powered by Gemini AI
              </p>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
