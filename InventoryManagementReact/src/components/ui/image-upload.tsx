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
    CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ImageUploadProps {
    value?: File | string | null;
    onChange: (file: File | null) => void;
    onError?: (error: string) => void;
    onUploadStart?: () => void;
    onUploadComplete?: (file: File) => void;
    onUploadError?: (error: string) => void;
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
    simulateUpload?: boolean; // Enable/disable upload simulation
    uploadFailureRate?: number; // Percentage chance of upload failure (0-1)
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
    onUploadStart,
    onUploadComplete,
    onUploadError,
    maxSize = DEFAULT_MAX_SIZE,
    acceptedTypes = DEFAULT_ACCEPTED_TYPES,
    disabled = false,
    className,
    label = 'Upload Image',
    description = 'Drag and drop an image here, or click to select',
    showPreview = true,
    showProgress = true,
    simulateUpload: enableSimulation = true,
    uploadFailureRate = 0.05, // 5% default failure rate
}: ImageUploadProps) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
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
        async (file: File) => {
            const validationError = validateFile(file);

            if (validationError) {
                setError(validationError);
                onError?.(validationError);
                return;
            }

            setError(null);

            // Create preview immediately
            if (showPreview) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            }

            // Start upload simulation
            const uploadSuccess = await simulateUpload(file);
            
            if (uploadSuccess) {
                onChange(file);
            } else {
                // Clear preview on upload failure
                setPreview(null);
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
        setIsUploading(false);
        setIsUploaded(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Retry upload
    const retryUpload = async () => {
        if (value instanceof File) {
            await handleFileSelect(value);
        }
    };

    // Simulate upload progress with realistic timing and error handling
    const simulateUpload = async (file: File): Promise<boolean> => {
        if (!enableSimulation) {
            // If simulation is disabled, just call the file immediately
            onChange(file);
            onUploadComplete?.(file);
            return true;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setError(null);
        onUploadStart?.();

        try {
            // Simulate network delay based on file size
            const baseDelay = 200; // Base delay in ms
            const sizeDelay = Math.min(file.size / (1024 * 1024) * 50, 1000); // Max 1s additional delay
            const totalDelay = baseDelay + sizeDelay;

            // Simulate realistic upload progress with varying speeds
            const progressSteps = [
                { progress: 10, delay: totalDelay * 0.1 }, // Quick start
                { progress: 25, delay: totalDelay * 0.2 }, // Slow down
                { progress: 45, delay: totalDelay * 0.3 }, // Steady progress
                { progress: 70, delay: totalDelay * 0.2 }, // Speed up
                { progress: 85, delay: totalDelay * 0.1 }, // Almost done
                { progress: 95, delay: totalDelay * 0.05 }, // Final processing
                { progress: 100, delay: totalDelay * 0.05 }, // Complete
            ];

            for (const step of progressSteps) {
                await new Promise((resolve) => setTimeout(resolve, step.delay));
                setUploadProgress(step.progress);
            }

            // Simulate upload failures based on configurable rate
            if (Math.random() < uploadFailureRate) {
                const errorMessages = [
                    'Upload failed: Network timeout',
                    'Upload failed: Server error',
                    'Upload failed: File too large',
                    'Upload failed: Invalid file format',
                    'Upload failed: Connection lost'
                ];
                const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
                throw new Error(randomError);
            }

            // Simulate server processing time
            await new Promise((resolve) => setTimeout(resolve, 300));
            
            setIsUploading(false);
            setIsUploaded(true);
            onUploadComplete?.(file);
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            setError(errorMessage);
            onError?.(errorMessage);
            onUploadError?.(errorMessage);
            setIsUploading(false);
            setUploadProgress(0);
            return false;
        }
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
                    <div className="mt-4 flex items-center justify-between text-sm text-red-600 dark:text-red-400">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="h-4 w-4" />
                            <span>{error}</span>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={retryUpload}
                            className="text-red-600 hover:text-red-700"
                        >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Retry
                        </Button>
                    </div>
                )}

                {showProgress && isUploading && (
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
