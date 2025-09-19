import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadDropzoneProps {
  onDrop: (acceptedFiles: File[], rejectedFiles: any[]) => void;
  disabled: boolean;
  label: string;
  description: string;
  maxSize: number;
  acceptedTypes: string[];
  onFileInputClick: () => void;
}

export function ImageUploadDropzone({
  onDrop,
  disabled,
  label,
  description,
  maxSize,
  acceptedTypes,
  onFileInputClick,
}: ImageUploadDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce(
      (acc, type) => {
        acc[type] = [];
        return acc;
      },
      {} as Record<string, string[]>
    ),
    maxSize: maxSize * 1024 * 1024,
    multiple: false,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
        'hover:border-blue-400 hover:bg-blue-50/50',
        'dark:hover:border-blue-500 dark:hover:bg-blue-950/20',
        {
          'border-blue-400 bg-blue-50/50 dark:bg-blue-950/20':
            isDragActive && !isDragReject,
          'border-red-400 bg-red-50/50 dark:bg-red-950/20':
            isDragReject,
          'border-gray-300 dark:border-gray-600':
            !isDragActive && !isDragReject,
          'opacity-50 cursor-not-allowed': disabled,
        }
      )}
    >
      <input
        {...getInputProps()}
        className="hidden"
      />

      <div className="text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            {isDragActive ? (
              <Upload className="h-6 w-6 text-blue-500" />
            ) : (
              <ImageIcon className="h-6 w-6 text-gray-400" />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {isDragActive ? 'Drop the image here' : label}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Max size: {maxSize}MB • {acceptedTypes.join(', ')}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onFileInputClick}
            disabled={disabled}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </div>
      </div>
    </div>
  );
}
