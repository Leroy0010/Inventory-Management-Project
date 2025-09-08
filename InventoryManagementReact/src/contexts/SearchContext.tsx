import React, { createContext, useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';

// Search result types
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'page' | 'feature' | 'action';
  path: string;
  icon: string;
  keywords: string[];
  permissions?: string[];
}

// Search context type
interface SearchContextType {
  searchResults: SearchResult[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => void;
  clearSearch: () => void;
  navigateToResult: (result: SearchResult) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Application search data
const applicationData: SearchResult[] = [
  // Dashboard
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Main dashboard with overview and statistics',
    category: 'page',
    path: '/',
    icon: 'LayoutDashboard',
    keywords: ['dashboard', 'home', 'overview', 'main', 'stats', 'statistics'],
    permissions: ['VIEW_DASHBOARD']
  },

  // Admin Pages
  {
    id: 'departments',
    title: 'Departments',
    description: 'Manage departments and organizational structure',
    category: 'page',
    path: '/departments',
    icon: 'Building2',
    keywords: ['departments', 'organization', 'structure', 'manage', 'admin'],
    permissions: ['VIEW_DEPARTMENTS']
  },
  {
    id: 'create-storekeeper',
    title: 'Create Storekeeper',
    description: 'Add new storekeeper accounts',
    category: 'page',
    path: '/staff/create-storekeeper',
    icon: 'UserPlus',
    keywords: ['create', 'storekeeper', 'add', 'user', 'account', 'admin'],
    permissions: ['CREATE_STOREKEEPER']
  },

  // Staff Pages
  {
    id: 'staff-dashboard',
    title: 'Staff Dashboard',
    description: 'Staff-specific dashboard and tools',
    category: 'page',
    path: '/staff-dashboard',
    icon: 'LayoutDashboard',
    keywords: ['staff', 'dashboard', 'employee', 'tools'],
    permissions: ['VIEW_DASHBOARD']
  },
  {
    id: 'staff-inventory',
    title: 'Browse Inventory',
    description: 'View and browse available inventory items',
    category: 'page',
    path: '/staff-inventory-items',
    icon: 'Package',
    keywords: ['inventory', 'browse', 'items', 'products', 'staff'],
    permissions: ['VIEW_INVENTORY']
  },
  {
    id: 'cart',
    title: 'Shopping Cart',
    description: 'Manage your shopping cart and requests',
    category: 'page',
    path: '/cart',
    icon: 'ShoppingCart',
    keywords: ['cart', 'shopping', 'basket', 'requests', 'items'],
    permissions: ['VIEW_CART']
  },
  {
    id: 'staff-requests',
    title: 'My Requests',
    description: 'View and manage your personal requests',
    category: 'page',
    path: '/staff-requests',
    icon: 'FileText',
    keywords: ['requests', 'my', 'personal', 'manage', 'staff'],
    permissions: ['VIEW_REQUESTS']
  },

  // Storekeeper Pages
  {
    id: 'storekeeper-dashboard',
    title: 'Storekeeper Dashboard',
    description: 'Storekeeper management dashboard',
    category: 'page',
    path: '/storekeeper-dashboard',
    icon: 'LayoutDashboard',
    keywords: ['storekeeper', 'dashboard', 'management', 'admin'],
    permissions: ['VIEW_DASHBOARD']
  },
  {
    id: 'staff-management',
    title: 'Staff Management',
    description: 'Manage staff members and accounts',
    category: 'page',
    path: '/staff',
    icon: 'Users',
    keywords: ['staff', 'management', 'users', 'accounts', 'employees'],
    permissions: ['VIEW_STAFF']
  },
  {
    id: 'add-staff',
    title: 'Add Staff',
    description: 'Add new staff members to the system',
    category: 'page',
    path: '/staff/add',
    icon: 'UserPlus',
    keywords: ['add', 'staff', 'create', 'new', 'user', 'employee'],
    permissions: ['ADD_STAFF']
  },
  {
    id: 'inventory-management',
    title: 'Inventory Management',
    description: 'Manage inventory items and stock',
    category: 'page',
    path: '/inventory',
    icon: 'Package',
    keywords: ['inventory', 'management', 'stock', 'items', 'products'],
    permissions: ['VIEW_INVENTORY']
  },
  {
    id: 'add-inventory',
    title: 'Add Inventory',
    description: 'Add new inventory items to the system',
    category: 'page',
    path: '/inventory/add',
    icon: 'PackagePlus',
    keywords: ['add', 'inventory', 'create', 'new', 'item', 'product'],
    permissions: ['ADD_INVENTORY']
  },
  {
    id: 'office-management',
    title: 'Office Management',
    description: 'Manage office locations and details',
    category: 'page',
    path: '/office',
    icon: 'Building',
    keywords: ['office', 'management', 'locations', 'buildings'],
    permissions: ['VIEW_OFFICE']
  },
  {
    id: 'add-office',
    title: 'Add Office',
    description: 'Add new office locations',
    category: 'page',
    path: '/office/add',
    icon: 'Building2',
    keywords: ['add', 'office', 'create', 'new', 'location', 'building'],
    permissions: ['ADD_OFFICE']
  },
  {
    id: 'batch-management',
    title: 'Batch Management',
    description: 'Manage inventory batches and groups',
    category: 'page',
    path: '/batch',
    icon: 'Layers',
    keywords: ['batch', 'management', 'groups', 'inventory', 'lots'],
    permissions: ['VIEW_BATCH']
  },
  {
    id: 'add-batch',
    title: 'Add Batch',
    description: 'Create new inventory batches',
    category: 'page',
    path: '/batch/add',
    icon: 'Layers3',
    keywords: ['add', 'batch', 'create', 'new', 'group', 'lot'],
    permissions: ['ADD_BATCH']
  },
  {
    id: 'inventory-items',
    title: 'Inventory Items',
    description: 'View and manage all inventory items',
    category: 'page',
    path: '/inventory-items',
    icon: 'Package2',
    keywords: ['inventory', 'items', 'products', 'stock', 'view'],
    permissions: ['VIEW_INVENTORY']
  },
  {
    id: 'requests-management',
    title: 'Request Management',
    description: 'Manage and process all requests',
    category: 'page',
    path: '/requests',
    icon: 'FileText',
    keywords: ['requests', 'management', 'process', 'approve', 'reject'],
    permissions: ['VIEW_REQUESTS']
  },

  // Reports
  {
    id: 'transaction-reports',
    title: 'Transaction Reports',
    description: 'View transaction reports and analytics',
    category: 'page',
    path: '/reports/transaction',
    icon: 'BarChart3',
    keywords: ['reports', 'transaction', 'analytics', 'data', 'charts'],
    permissions: ['VIEW_TRANSACTION_REPORTS']
  },
  {
    id: 'user-reports',
    title: 'User Reports',
    description: 'View user activity and reports',
    category: 'page',
    path: '/reports/user',
    icon: 'Users',
    keywords: ['reports', 'user', 'activity', 'analytics', 'data'],
    permissions: ['VIEW_USER_REPORTS']
  },
  {
    id: 'inventory-summary-reports',
    title: 'Inventory Summary Reports',
    description: 'View inventory summary and statistics',
    category: 'page',
    path: '/reports/inventory-summary',
    icon: 'Package',
    keywords: ['reports', 'inventory', 'summary', 'statistics', 'data'],
    permissions: ['VIEW_INVENTORY_SUMMARY_REPORTS']
  },

  // Common Pages
  {
    id: 'profile',
    title: 'Profile',
    description: 'View and edit your user profile',
    category: 'page',
    path: '/profile',
    icon: 'User',
    keywords: ['profile', 'user', 'account', 'settings', 'personal'],
    permissions: ['VIEW_PROFILE']
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'View system notifications and alerts',
    category: 'page',
    path: '/notifications',
    icon: 'Bell',
    keywords: ['notifications', 'alerts', 'messages', 'updates'],
    permissions: ['VIEW_NOTIFICATIONS']
  },
  {
    id: 'send-message',
    title: 'Send Message',
    description: 'Send messages to other users',
    category: 'page',
    path: '/send-message',
    icon: 'MessageSquare',
    keywords: ['send', 'message', 'communication', 'chat', 'email'],
    permissions: ['SEND_MESSAGES']
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Application settings and preferences',
    category: 'page',
    path: '/settings',
    icon: 'Settings',
    keywords: ['settings', 'preferences', 'configuration', 'options'],
    permissions: ['VIEW_SETTINGS']
  },

  // Actions/Features
  {
    id: 'logout',
    title: 'Logout',
    description: 'Sign out of your account',
    category: 'action',
    path: '/login',
    icon: 'LogOut',
    keywords: ['logout', 'signout', 'exit', 'leave'],
    permissions: []
  },
  {
    id: 'search',
    title: 'Search',
    description: 'Search through the application',
    category: 'feature',
    path: '#',
    icon: 'Search',
    keywords: ['search', 'find', 'lookup', 'query'],
    permissions: []
  }
];

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { canAccess } = usePermissionCheck();

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    
    return applicationData
      .filter(item => {
        // Check permissions
        if (item.permissions && item.permissions.length > 0) {
          const hasPermission = canAccess(item.permissions as any);
          if (!hasPermission) return false;
        }

        // Search in title, description, and keywords
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.keywords.some(keyword => keyword.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => {
        // Prioritize exact title matches
        const aTitleMatch = a.title.toLowerCase().includes(query);
        const bTitleMatch = b.title.toLowerCase().includes(query);
        
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        
        // Then by category priority
        const categoryOrder = { page: 0, feature: 1, action: 2 };
        return categoryOrder[a.category] - categoryOrder[b.category];
      })
      .slice(0, 8); // Limit to 8 results
  }, [searchQuery, canAccess]);

  const performSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const navigateToResult = (result: SearchResult) => {
    if (result.category === 'action' && result.id === 'logout') {
      // Handle logout action
      window.location.href = '/login';
    } else if (result.path !== '#') {
      navigate(result.path);
    }
    clearSearch();
  };

  const value: SearchContextType = {
    searchResults,
    searchQuery,
    setSearchQuery,
    performSearch,
    clearSearch,
    navigateToResult,
    isSearchOpen,
    setIsSearchOpen
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
