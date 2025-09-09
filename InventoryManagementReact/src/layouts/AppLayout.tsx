import { Sidebar } from '@/components/nav/Sidebar';
import { Topbar } from '@/components/nav/Topbar';
// import { DevBanner } from '@/components/DevBanner';
import { SearchProvider } from '@/contexts/SearchContext';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };
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
                        <Outlet /> {/* Nested routes will render here */}
                    </main>
                </div>
            </div>
        </SearchProvider>
    );
}
