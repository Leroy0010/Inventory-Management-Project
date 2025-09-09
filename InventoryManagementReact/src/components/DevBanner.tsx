import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DEV_CONFIG } from '@/config/dev';

export function DevBanner() {
    if (!DEV_CONFIG.BYPASS_AUTH || !DEV_CONFIG.SHOW_DEV_WARNINGS) {
        return null;
    }

    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <div>
                    <p className="font-bold">Development Mode Active</p>
                    <p className="text-sm">
                        Authentication and permission checks are bypassed.
                        NotificationProvider is disabled. This should only be
                        enabled during development.
                    </p>
                </div>
            </div>
        </div>
    );
}
