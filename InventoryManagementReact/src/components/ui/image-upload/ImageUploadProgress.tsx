import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ImageUploadProgressProps {
  isUploading: boolean;
  uploadProgress: number;
  showProgress: boolean;
}

export function ImageUploadProgress({
  isUploading,
  uploadProgress,
  showProgress,
}: ImageUploadProgressProps) {
  if (!showProgress || !isUploading) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center space-x-2">
          <div className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span>Uploading...</span>
        </span>
        <span className="font-medium">{uploadProgress}%</span>
      </div>
      <Progress value={uploadProgress} className="h-2" />
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Please don't close this page while uploading
      </p>
    </div>
  );
}
