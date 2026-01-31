'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="outline"
      className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mt-2"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </Button>
  );
}
