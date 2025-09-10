import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    Upload,
    X,
    Image as ImageIcon,
    AlertCircle,
    RotateCcw,
    ZoomIn,
    Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ImageUploadProps {
    value?: File | string | null;
    onChange: (file: File | null) => void;
    onError?: (error: string) => void;
    maxSize?: number; // in MB
    acceptedTypes?: string[];
    multiple?: boolean;
    disabled?: boolean;
    className?: string;
    label?: string;
    description?: string;
    showPreview?: boolean;
    showProgress?: boolean;
    maxFiles?: number;
}

const DEFAULT_MAX_SIZE = 5; // 5MB
const DEFAULT_ACCEPTED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
];

export function ImageUpload({
    value,
    onChange,
    onError,
    maxSize = DEFAULT_MAX_SIZE,
    acceptedTypes = DEFAULT_ACCEPTED_TYPES,
    multiple = false,
    disabled = false,
    className,
    label = 'Upload Image',
    description = 'Drag and drop an image here, or click to select',
    showPreview = true,
    showProgress = true,
    maxFiles = 1,
}: ImageUploadProps) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file validation
    const validateFile = useCallback(
        (file: File): string | null => {
            // Check file size
            if (file.size > maxSize * 1024 * 1024) {
                return `File size must be less than ${maxSize}MB`;
            }

            // Check file type
            if (!acceptedTypes.includes(file.type)) {
                return `File type must be one of: ${acceptedTypes.join(', ')}`;
            }

            return null;
        },
        [maxSize, acceptedTypes]
    );

    // Handle file selection
    const handleFileSelect = useCallback(
        (file: File) => {
            const validationError = validateFile(file);

            if (validationError) {
                setError(validationError);
                onError?.(validationError);
                return;
            }

            setError(null);
            onChange(file);

            // Create preview
            if (showPreview) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        },
        [validateFile, onChange, onError, showPreview]
    );

    // Dropzone configuration
    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            if (disabled) return;

            // Handle rejected files
            if (rejectedFiles.length > 0) {
                const rejection = rejectedFiles[0];
                const errorMessage =
                    rejection.errors[0]?.message || 'File rejected';
                setError(errorMessage);
                onError?.(errorMessage);
                return;
            }

            // Handle accepted files
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                handleFileSelect(file);
            }
        },
        [disabled, handleFileSelect, onError]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } =
        useDropzone({
            onDrop,
            accept: acceptedTypes.reduce(
                (acc, type) => {
                    acc[type] = [];
                    return acc;
                },
                {} as Record<string, string[]>
            ),
            maxSize: maxSize * 1024 * 1024,
            multiple: false, // Always single file for image upload
            disabled,
        });

    // Handle manual file input
    const handleFileInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // Clear file
    const clearFile = () => {
        onChange(null);
        setPreview(null);
        setError(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Simulate upload progress (replace with actual upload logic)
    const simulateUpload = async (file: File) => {
        setIsUploading(true);
        setUploadProgress(0);

        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            setUploadProgress(i);
        }

        setIsUploading(false);
    };

    // Get file info
    const getFileInfo = () => {
        if (value instanceof File) {
            return {
                name: value.name,
                size: value.size,
                type: value.type,
            };
        }
        return null;
    };

    const fileInfo = getFileInfo();

    return (
        <div className={cn('space-y-4', className)}>
            {label && (
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </Label>
            )}

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
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    className="hidden"
                />

                <div className="text-center">
                    {preview ? (
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
                                        clearFile();
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>

                            {fileInfo && (
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <p className="font-medium">
                                        {fileInfo.name}
                                    </p>
                                    <p>
                                        {(fileInfo.size / 1024 / 1024).toFixed(
                                            2
                                        )}{' '}
                                        MB
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
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
                                    {isDragActive
                                        ? 'Drop the image here'
                                        : 'Upload an image'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {description}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    Max size: {maxSize}MB •{' '}
                                    {acceptedTypes.join(', ')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mt-4 flex items-center space-x-2 text-sm text-red-600 dark:text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}

                {showProgress && isUploading && (
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                    </div>
                )}

                {!preview && !isUploading && (
                    <div className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={disabled}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                        </Button>
                    </div>
                )}
            </div>

            {/* Action buttons for uploaded file */}
            {preview && fileInfo && (
                <div className="flex items-center space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const link = document.createElement('a');
                            link.href = preview;
                            link.download = fileInfo.name;
                            link.click();
                        }}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const img = new Image();
                            img.src = preview;
                            const newWindow = window.open();
                            if (newWindow) {
                                newWindow.document.write(`
                  <html>
                    <head><title>${fileInfo.name}</title></head>
                    <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f0f0f0;">
                      <img src="${preview}" style="max-width:100%;max-height:100%;object-fit:contain;" />
                    </body>
                  </html>
                `);
                            }
                        }}
                    >
                        <ZoomIn className="h-4 w-4 mr-2" />
                        Preview
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearFile}
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Replace
                    </Button>
                </div>
            )}
        </div>
    );
}

export default ImageUpload;
