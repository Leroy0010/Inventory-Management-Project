import { Sidebar } from '@/components/nav/Sidebar';
import { Topbar } from '@/components/nav/Topbar';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
// import { NotificationPermissionRequest } from '@/components/notifications/NotificationPermissionRequest';
// import { DevBanner } from '@/components/DevBanner';
import { SearchProvider } from '@/contexts/SearchContext';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';

export function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showPermissionRequest, setShowPermissionRequest] = useState(false);
    const { permission, isSupported } = useNotificationPermission();

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    // Show permission request if notifications are supported but not granted
    useEffect(() => {
        if (isSupported && permission === 'default') {
            setShowPermissionRequest(true);
        }
    }, [isSupported, permission]);
    return (
        <SearchProvider>
            <div className="flex h-screen bg-background text-foreground">
                {/* Sidebar */}
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                />

                {/* Main content */}
                <div className="flex flex-col flex-1">
                    <Topbar
                        onMenuToggle={toggleSidebar}
                        isSidebarCollapsed={isSidebarOpen}
                    />
                    <main className="flex-1 overflow-y-auto p-4">
                        {/* <DevBanner /> */}
                        <div className="space-y-4">
                            <Breadcrumb />
                            {/* {showPermissionRequest && (
                                <NotificationPermissionRequest
                                    onPermissionGranted={() =>
                                        setShowPermissionRequest(false)
                                    }
                                    onDismiss={() =>
                                        setShowPermissionRequest(false)
                                    }
                                />
                            )} */}
                            <Outlet /> {/* Nested routes will render here */}
                        </div>
                    </main>
                </div>
            </div>
        </SearchProvider>
    );
}
