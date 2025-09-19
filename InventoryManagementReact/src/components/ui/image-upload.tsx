import React, { useCallback, useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ImageUploadPreview } from './image-upload/ImageUploadPreview';
import { ImageUploadProgress } from './image-upload/ImageUploadProgress';
import { ImageUploadDropzone } from './image-upload/ImageUploadDropzone';
import { ImageUploadError } from './image-upload/ImageUploadError';

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

    const handleFileInputClick = () => {
        fileInputRef.current?.click();
    };

    const handleDownload = () => {
        if (preview && fileInfo) {
            const link = document.createElement('a');
            link.href = preview;
            link.download = fileInfo.name;
            link.click();
        }
    };

    const handlePreview = () => {
        if (preview && fileInfo) {
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
        }
    };

    return (
        <div className={cn('space-y-4', className)}>
            {label && (
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </Label>
            )}

            {preview ? (
                <ImageUploadPreview
                    preview={preview}
                    fileInfo={fileInfo}
                    isUploaded={isUploaded}
                    onClear={clearFile}
                    onDownload={handleDownload}
                    onPreview={handlePreview}
                    onReplace={clearFile}
                />
            ) : (
                <ImageUploadDropzone
                    onDrop={onDrop}
                    disabled={disabled}
                    label="Upload an image"
                    description={description}
                    maxSize={maxSize}
                    acceptedTypes={acceptedTypes}
                    onFileInputClick={handleFileInputClick}
                />
            )}

            <input
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                type="file"
                accept={acceptedTypes.join(',')}
            />

            <ImageUploadError
                error={error}
                onRetry={retryUpload}
            />

            <ImageUploadProgress
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                showProgress={showProgress}
            />
        </div>
    );
}

export default ImageUpload;
