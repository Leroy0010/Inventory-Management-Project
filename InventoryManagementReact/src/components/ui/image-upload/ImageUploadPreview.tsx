import React from 'react';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, Download, ZoomIn, RotateCcw } from 'lucide-react';

interface ImageUploadPreviewProps {
  preview: string | null;
  fileInfo: {
    name: string;
    size: number;
    type: string;
  } | null;
  isUploaded: boolean;
  onClear: () => void;
  onDownload: () => void;
  onPreview: () => void;
  onReplace: () => void;
}

export function ImageUploadPreview({
  preview,
  fileInfo,
  isUploaded,
  onClear,
  onDownload,
  onPreview,
  onReplace,
}: ImageUploadPreviewProps) {
  if (!preview) return null;

  return (
    <div className="space-y-4">
      <div className="relative inline-block">
        <img
          src={preview}
          alt="Preview"
          className="max-h-48 max-w-full rounded-lg object-cover shadow-md"
        />
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
        {isUploaded && (
          <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1">
            <CheckCircle className="h-4 w-4" />
          </div>
        )}
      </div>

      {fileInfo && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <p className="font-medium">
              {fileInfo.name}
            </p>
            {isUploaded && (
              <span className="text-green-600 dark:text-green-400 text-xs font-medium">
                ✓ Uploaded
              </span>
            )}
          </div>
          <p>
            {(fileInfo.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      {/* Action buttons for uploaded file */}
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPreview}
        >
          <ZoomIn className="h-4 w-4 mr-2" />
          Preview
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReplace}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Replace
        </Button>
      </div>
    </div>
  );
}
