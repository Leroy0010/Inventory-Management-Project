// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const UserRole = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  STOREKEEPER: 'STOREKEEPER'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
}

// Permission System
export const Permission = {
  // Dashboard
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',
  
  // Department Management (Admin only)
  VIEW_DEPARTMENTS: 'VIEW_DEPARTMENTS',
  ADD_DEPARTMENT: 'ADD_DEPARTMENT',
  EDIT_DEPARTMENT: 'EDIT_DEPARTMENT',
  DELETE_DEPARTMENT: 'DELETE_DEPARTMENT',
  
  // Staff Management
  VIEW_STAFF: 'VIEW_STAFF',
  ADD_STAFF: 'ADD_STAFF',
  EDIT_STAFF: 'EDIT_STAFF',
  DELETE_STAFF: 'DELETE_STAFF',
  CREATE_STOREKEEPER: 'CREATE_STOREKEEPER',
  
  // Inventory Management
  VIEW_INVENTORY: 'VIEW_INVENTORY',
  ADD_INVENTORY: 'ADD_INVENTORY',
  EDIT_INVENTORY: 'EDIT_INVENTORY',
  DELETE_INVENTORY: 'DELETE_INVENTORY',
  
  // Office Management
  VIEW_OFFICE: 'VIEW_OFFICE',
  ADD_OFFICE: 'ADD_OFFICE',
  EDIT_OFFICE: 'EDIT_OFFICE',
  DELETE_OFFICE: 'DELETE_OFFICE',
  
  // Batch Management
  VIEW_BATCH: 'VIEW_BATCH',
  ADD_BATCH: 'ADD_BATCH',
  EDIT_BATCH: 'EDIT_BATCH',
  DELETE_BATCH: 'DELETE_BATCH',
  
  // Requests
  VIEW_REQUESTS: 'VIEW_REQUESTS',
  APPROVE_REQUESTS: 'APPROVE_REQUESTS',
  REJECT_REQUESTS: 'REJECT_REQUESTS',
  MANAGE_REQUESTS: 'MANAGE_REQUESTS',
  
  // Cart (Staff specific)
  VIEW_CART: 'VIEW_CART',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  CHECKOUT_CART: 'CHECKOUT_CART',
  
  // Notifications
  VIEW_NOTIFICATIONS: 'VIEW_NOTIFICATIONS',
  SEND_MESSAGES: 'SEND_MESSAGES',
  SEND_GENERAL_NOTIFICATION: 'SEND_GENERAL_NOTIFICATION',
  
  // Reports (Storekeeper specific)
  VIEW_REPORTS: 'VIEW_REPORTS',
  VIEW_TRANSACTION_REPORTS: 'VIEW_TRANSACTION_REPORTS',
  VIEW_USER_REPORTS: 'VIEW_USER_REPORTS',
  VIEW_INVENTORY_SUMMARY_REPORTS: 'VIEW_INVENTORY_SUMMARY_REPORTS',
  EXPORT_REPORTS: 'EXPORT_REPORTS',
  
  // Profile and Common
  VIEW_PROFILE: 'VIEW_PROFILE',
  EDIT_PROFILE: 'EDIT_PROFILE',
  VIEW_REQUEST_DETAILS: 'VIEW_REQUEST_DETAILS',
  VIEW_INVENTORY_ITEM_DETAILS: 'VIEW_INVENTORY_ITEM_DETAILS',
  
  // Settings
  VIEW_SETTINGS: 'VIEW_SETTINGS',
  EDIT_SETTINGS: 'EDIT_SETTINGS'
} as const;

export type Permission = typeof Permission[keyof typeof Permission];

// Inventory Types
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  location: string;
  batchId?: string;
  officeId: string;
  status: InventoryStatus;
  createdAt: string;
  updatedAt: string;
}

export const InventoryStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DISCONTINUED: 'DISCONTINUED'
} as const;

export type InventoryStatus = typeof InventoryStatus[keyof typeof InventoryStatus];

// Staff Types
export interface Staff {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  officeId: string;
  role: UserRole;
  isActive: boolean;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

// Office Types
export interface Office {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  managerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Batch Types
export interface Batch {
  id: string;
  batchNumber: string;
  name: string;
  description: string;
  officeId: string;
  status: BatchStatus;
  createdAt: string;
  updatedAt: string;
}

export const BatchStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED'
} as const;

export type BatchStatus = typeof BatchStatus[keyof typeof BatchStatus];

// Request Types
export interface Request {
  id: string;
  type: RequestType;
  title: string;
  description: string;
  requesterId: string;
  approverId?: string;
  status: RequestStatus;
  priority: RequestPriority;
  items: RequestItem[];
  createdAt: string;
  updatedAt: string;
}

export const RequestType = {
  INVENTORY_REQUEST: 'INVENTORY_REQUEST',
  APPROVAL_REQUEST: 'APPROVAL_REQUEST',
  TRANSFER_REQUEST: 'TRANSFER_REQUEST'
} as const;

export type RequestType = typeof RequestType[keyof typeof RequestType];

export const RequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
} as const;

export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];

export const RequestPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
} as const;

export type RequestPriority = typeof RequestPriority[keyof typeof RequestPriority];

export interface RequestItem {
  id: string;
  inventoryItemId: string;
  quantity: number;
  notes?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  isRead: boolean;
  data?: Record<string, string>;
  createdAt: string;
}

export const NotificationType = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  REQUEST: 'REQUEST',
  INVENTORY_ALERT: 'INVENTORY_ALERT'
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
  timestamp: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}
