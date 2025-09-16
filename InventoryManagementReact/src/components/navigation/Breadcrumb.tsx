import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
    label: string;
    href?: string;
    isActive?: boolean;
}

interface BreadcrumbProps {
    className?: string;
    customItems?: BreadcrumbItem[];
}

// Route to label mapping
const routeLabels: Record<string, string> = {
    '/': 'Dashboard',
    '/departments': 'Departments',
    '/departments/add': 'Add Department',
    '/staff': 'Staff',
    '/staff/add': 'Add Staff',
    '/staff/:id': 'Staff Details',
    '/storekeeper/add': 'Add Storekeeper',
    '/inventory-items': 'Inventory Items',
    '/inventory-items/:id': 'Inventory Details',
    '/inventory/add': 'Add Inventory',
    '/office': 'Offices',
    '/office/add': 'Add Office',
    '/office/:id': 'Office Details',
    '/batch': 'Batches',
    '/batch/add': 'Add Batch',
    '/requests': 'Manage Requests',
    '/staff-requests': 'My Requests',
    '/requests/:requestId': 'Request Details',
    '/cart': 'Shopping Cart',
    '/notifications': 'Notifications',
    '/send-message': 'Send Message',
    '/profile': 'Profile',
    '/settings': 'Settings',
    '/reports/transaction': 'Transaction Report',
    '/reports/inventory-summary': 'Inventory Summary',
    '/reports/user': 'User Report',
    '/reports/user-activity': 'User Activity',
};

// Get breadcrumb items from current path
function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
    const segments = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/', isActive: pathname === '/' }
    ];

    if (segments.length === 0) {
        return items;
    }

    let currentPath = '';
    segments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const isLast = index === segments.length - 1;
        
        // Handle dynamic segments (like :id)
        let label = routeLabels[currentPath];
        if (!label) {
            // Check for dynamic routes
            const dynamicPath = currentPath.replace(/\/\d+$/, '/:id');
            label = routeLabels[dynamicPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
        }

        items.push({
            label,
            href: isLast ? undefined : currentPath,
            isActive: isLast
        });
    });

    return items;
}

export function Breadcrumb({ className, customItems }: BreadcrumbProps) {
    const location = useLocation();
    const items = customItems || getBreadcrumbItems(location.pathname);

    if (items.length <= 1) {
        return null;
    }

    return (
        <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
            <Link
                to="/"
                className="flex items-center hover:text-foreground transition-colors"
            >
                <Home className="h-4 w-4" />
            </Link>
            
            {items.slice(1).map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="hover:text-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className={cn(
                            'font-medium',
                            item.isActive && 'text-foreground'
                        )}>
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}