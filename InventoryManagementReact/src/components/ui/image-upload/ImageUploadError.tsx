import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ImageUploadErrorProps {
  error: string | null;
  onRetry: () => void;
}

export function ImageUploadError({ error, onRetry }: ImageUploadErrorProps) {
  if (!error) return null;

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-red-600 dark:text-red-400">
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="text-red-600 hover:text-red-700"
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Retry
      </Button>
    </div>
  );
}
