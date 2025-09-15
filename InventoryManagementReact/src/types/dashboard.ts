// Dashboard types for React app
export interface DashboardStats {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: string;
  color: string;
  href?: string;
  action?: () => void;
}

export interface RecentRequest {
  id: number;
  staffName: string;
  itemName: string;
  status: string;
  createdAt: string;
  timeAgo: string;
  quantity: number;
}

export interface CartItem {
  id: number;
  name: string;
  quantity: number;
}

export interface SystemHealth {
  status: string;
  database: string;
  cache: string;
  uptime: string;
}

export interface DepartmentOverview {
  totalStaff: number;
  totalItems: number;
  pendingRequests: number;
  lowStockItems: number;
}

export interface AdminDashboard {
  welcomeMessage: string;
  role: string;
  lastLoginAt: string;
  stats: DashboardStats[];
  quickActions: QuickAction[];
  recentActivity: RecentRequest[];
  systemHealth: SystemHealth;
}

export interface StorekeeperDashboard {
  welcomeMessage: string;
  role: string;
  departmentName: string;
  stats: DashboardStats[];
  quickActions: QuickAction[];
  recentRequests: RecentRequest[];
  departmentOverview: DepartmentOverview;
}

export interface StaffDashboard {
  welcomeMessage: string;
  role: string;
  officeName: string;
  stats: DashboardStats[];
  quickActions: QuickAction[];
  recentRequests: RecentRequest[];
  cartItems: CartItem[];
  cartTotal: number;
  unreadNotifications: number;
}
