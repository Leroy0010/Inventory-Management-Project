import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Save,
    RotateCcw,
    Download,
    Upload,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';

interface SettingsActionsProps {
    saveStatus: 'idle' | 'saving' | 'saved' | 'error';
    hasUnsavedChanges: boolean;
    error?: string;
    isSaving: boolean;
    onSave: () => void;
    onReset: () => void;
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRefresh: () => void;
}

export function SettingsActions({
    saveStatus,
    hasUnsavedChanges,
    error,
    isSaving,
    onSave,
    onReset,
    onExport,
    onImport,
    onRefresh,
}: SettingsActionsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Save className="h-5 w-5" />
                    Save Status and Actions
                </CardTitle>
                <CardDescription>
                    Manage your settings and save changes to the server
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Status Display */}
                <div className="flex items-center gap-2">
                    {saveStatus === 'saving' && (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-sm text-muted-foreground">
                                Saving...
                            </span>
                        </>
                    )}
                    {saveStatus === 'saved' && (
                        <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">
                                Settings saved successfully
                            </span>
                        </>
                    )}
                    {saveStatus === 'error' && (
                        <>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-600">
                                Failed to save settings
                            </span>
                        </>
                    )}
                    {hasUnsavedChanges && saveStatus === 'idle' && (
                        <Badge
                            variant="outline"
                            className="text-orange-600 border-orange-200"
                        >
                            Unsaved changes
                        </Badge>
                    )}
                </div>

                {/* Error Display */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                    <Button
                        onClick={onSave}
                        disabled={isSaving || !hasUnsavedChanges}
                        className="flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onReset}
                        disabled={isSaving}
                        className="flex items-center gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset to Defaults
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onExport}
                        disabled={isSaving}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export Settings
                    </Button>

                    <label className="cursor-pointer">
                        <Button
                            variant="outline"
                            disabled={isSaving}
                            className="flex items-center gap-2"
                            asChild
                        >
                            <span>
                                <Upload className="h-4 w-4" />
                                Import Settings
                            </span>
                        </Button>
                        <input
                            type="file"
                            accept=".json"
                            onChange={onImport}
                            className="hidden"
                        />
                    </label>

                    <Button
                        variant="outline"
                        onClick={onRefresh}
                        disabled={isSaving}
                        className="flex items-center gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
