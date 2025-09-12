import { useState } from 'react';
import { ImageUpload } from '@/components/ui/image-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function ImageUploadDemo() {
    const [file, setFile] = useState<File | null>(null);
    const [simulateUpload, setSimulateUpload] = useState(true);
    const [failureRate, setFailureRate] = useState(0.1); // 10% failure rate
    const [uploadLog, setUploadLog] = useState<string[]>([]);

    const addLog = (message: string) => {
        setUploadLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const handleUploadStart = () => {
        addLog('Upload started');
    };

    const handleUploadComplete = (uploadedFile: File) => {
        addLog(`Upload completed: ${uploadedFile.name}`);
    };

    const handleUploadError = (error: string) => {
        addLog(`Upload failed: ${error}`);
    };

    const clearLog = () => {
        setUploadLog([]);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Image Upload with Simulation Demo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Controls */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="simulate-upload"
                                checked={simulateUpload}
                                onCheckedChange={setSimulateUpload}
                            />
                            <Label htmlFor="simulate-upload">
                                Enable Upload Simulation
                            </Label>
                        </div>

                        {simulateUpload && (
                            <div className="space-y-2">
                                <Label>
                                    Upload Failure Rate: {Math.round(failureRate * 100)}%
                                </Label>
                                <input
                                    type="range"
                                    min="0"
                                    max="0.5"
                                    step="0.05"
                                    value={failureRate}
                                    onChange={(e) => setFailureRate(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                            </div>
                        )}
                    </div>

                    {/* Upload Component */}
                    <ImageUpload
                        value={file}
                        onChange={setFile}
                        onUploadStart={handleUploadStart}
                        onUploadComplete={handleUploadComplete}
                        onUploadError={handleUploadError}
                        simulateUpload={simulateUpload}
                        uploadFailureRate={failureRate}
                        maxSize={10}
                        label="Upload Demo Image"
                        description="Try uploading different images to see the simulation in action"
                    />

                    {/* Upload Log */}
                    {uploadLog.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Upload Log</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearLog}
                                >
                                    Clear Log
                                </Button>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-h-40 overflow-y-auto">
                                {uploadLog.map((log, index) => (
                                    <div key={index} className="text-sm font-mono">
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* File Info */}
                    {file && (
                        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                Selected File
                            </h3>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                                <p><strong>Name:</strong> {file.name}</p>
                                <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                <p><strong>Type:</strong> {file.type}</p>
                                <p><strong>Last Modified:</strong> {new Date(file.lastModified).toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default ImageUploadDemo;
