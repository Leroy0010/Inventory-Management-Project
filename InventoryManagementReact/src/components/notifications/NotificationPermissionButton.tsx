import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, CheckCircle } from 'lucide-react';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';

export function NotificationPermissionButton() {
    const { permission, requestPermission, isSupported } =
        useNotificationPermission();
    const [isRequesting, setIsRequesting] = useState(false);

    const handleRequestPermission = async () => {
        setIsRequesting(true);
        try {
            await requestPermission();
        } finally {
            setIsRequesting(false);
        }
    };

    if (!isSupported) {
        return (
            <Button variant="outline" size="sm" disabled>
                <BellOff className="h-4 w-4 mr-2 text-gray-500" />
                Not Supported
            </Button>
        );
    }

    if (permission === 'granted') {
        return (
            <Button variant="outline" size="sm" disabled>
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Notifications Enabled
            </Button>
        );
    }

    if (permission === 'denied') {
        return (
            <Button variant="outline" size="sm" disabled>
                <BellOff className="h-4 w-4 mr-2 text-red-500" />
                Notifications Blocked
            </Button>
        );
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleRequestPermission}
            disabled={isRequesting}
        >
            <Bell className="h-4 w-4 mr-2" />
            {isRequesting ? 'Requesting...' : 'Enable Notifications'}
        </Button>
    );
}
