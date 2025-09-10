import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileImage, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ImageUploadDemo() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploadHistory, setUploadHistory] = useState<File[]>([]);

    const handleImageChange = (file: File | null) => {
        setSelectedImage(file);
        if (file) {
            setUploadHistory((prev) => [file, ...prev.slice(0, 4)]); // Keep last 5 files
        }
    };

    const handleImageError = (error: string) => {
        console.error('Image upload error:', error);
    };

    const clearImage = () => {
        setSelectedImage(null);
    };

    const getFileInfo = (file: File) => ({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString(),
    });

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Image Upload Component Demo
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Advanced image upload with drag & drop, preview, and
                    validation
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Upload Component */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Upload className="h-5 w-5" />
                            <span>Image Upload</span>
                        </CardTitle>
                        <CardDescription>
                            Drag and drop an image or click to select
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ImageUpload
                            value={selectedImage}
                            onChange={handleImageChange}
                            onError={handleImageError}
                            label="Upload Image"
                            description="Drag and drop an image here, or click to select"
                            maxSize={5}
                            acceptedTypes={[
                                'image/jpeg',
                                'image/jpg',
                                'image/png',
                                'image/webp',
                            ]}
                            showPreview={true}
                            showProgress={true}
                        />
                    </CardContent>
                </Card>

                {/* Current Selection Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <FileImage className="h-5 w-5" />
                            <span>Current Selection</span>
                        </CardTitle>
                        <CardDescription>
                            Information about the currently selected image
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {selectedImage ? (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <span className="font-medium text-green-700 dark:text-green-400">
                                        Image Selected
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            Name:
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {getFileInfo(selectedImage).name}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            Size:
                                        </span>
                                        <Badge variant="secondary">
                                            {getFileInfo(selectedImage).size}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            Type:
                                        </span>
                                        <Badge variant="outline">
                                            {getFileInfo(selectedImage).type}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            Modified:
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {
                                                getFileInfo(selectedImage)
                                                    .lastModified
                                            }
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    onClick={clearImage}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Clear Selection
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    No image selected
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    Upload an image to see details here
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Upload History */}
            {uploadHistory.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Upload History</CardTitle>
                        <CardDescription>
                            Recently uploaded images (last 5)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {uploadHistory.map((file, index) => (
                                <div
                                    key={`${file.name}-${file.lastModified}`}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <FileImage className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {getFileInfo(file).size} •{' '}
                                                {getFileInfo(file).lastModified}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            index === 0
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {index === 0 ? 'Current' : 'Previous'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Features List */}
            <Card>
                <CardHeader>
                    <CardTitle>Component Features</CardTitle>
                    <CardDescription>
                        Advanced image upload capabilities
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            'Drag & Drop Support',
                            'File Type Validation',
                            'Size Limit Enforcement',
                            'Image Preview',
                            'Progress Tracking',
                            'Error Handling',
                            'Keyboard Navigation',
                            'Mobile Responsive',
                            'Accessibility Support',
                            'Download Functionality',
                            'Preview in New Window',
                            'Replace File Option',
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2"
                            >
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{feature}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
