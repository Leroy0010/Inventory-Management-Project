// Enums matching backend
export const UserRole = {
  ADMIN: 'ADMIN',
  STOREKEEPER: 'STOREKEEPER',
  STAFF: 'STAFF'
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Request DTO matching backend
export interface UserActivityReportRequest {
  // Time period options
  year?: number;                    // Optional - for single year reports
  startDate?: string;               // Optional - for custom date range (ISO string)
  endDate?: string;                 // Optional - for custom date range (ISO string)
  
  // Filtering options
  officeId?: number;                // Optional - filter by specific office
  search?: string;                  // Optional - search by user name or email
  sortBy?: string;                  // Optional - sort field (name, requests, lastActivity, etc.)
  sortOrder?: 'ASC' | 'DESC';       // Optional - sort direction
  
  // Activity type filters
  includeSubmissions?: boolean;     // Optional - include request submissions
  includeApprovals?: boolean;       // Optional - include request approvals
  includeRejections?: boolean;      // Optional - include request rejections
  includeFulfillments?: boolean;    // Optional - include request fulfillments
  
  // User status filters
  activeOnly?: boolean;             // Optional - show only active users
  roleFilter?: UserRole;            // Optional - filter by role
}

// Response DTOs matching backend
export interface UserActivityItemDto {
  // User information
  userId: number;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  officeName: string;
  departmentName: string;
  isActive: boolean;
  
  // Request activity metrics
  totalRequestsSubmitted: number;
  totalRequestsApproved: number;
  totalRequestsRejected: number;
  totalRequestsFulfilled: number;
  pendingRequests: number;
  
  // Request value metrics
  totalValueRequested: number;
  totalValueApproved: number;
  totalValueRejected: number;
  totalValueFulfilled: number;
  
  // Activity timestamps
  lastRequestSubmitted?: string;
  lastRequestApproved?: string;
  lastRequestRejected?: string;
  lastRequestFulfilled?: string;
  lastActivity?: string;
  
  // Calculated metrics
  approvalRate: number;
  rejectionRate: number;
  fulfillmentRate: number;
  totalItemsRequested: number;
  totalItemsApproved: number;
  totalItemsRejected: number;
  totalItemsFulfilled: number;
}

export interface UserActivitySummaryDto {
  // User counts
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  staffUsers: number;
  storekeeperUsers: number;
  
  // Request counts
  totalRequestsSubmitted: number;
  totalRequestsApproved: number;
  totalRequestsRejected: number;
  totalRequestsFulfilled: number;
  pendingRequests: number;
  
  // Value totals
  totalValueRequested: number;
  totalValueApproved: number;
  totalValueRejected: number;
  totalValueFulfilled: number;
  
  // Calculated metrics
  averageRequestsPerUser: number;
  overallApprovalRate: number;
  overallRejectionRate: number;
  overallFulfillmentRate: number;
  
  // Top performers
  topRequesters: TopRequesterDto[];
  topApprovers: TopApproverDto[];
  officeActivity: OfficeActivityDto[];
}

export interface TopRequesterDto {
  userId: number;
  userName: string;
  officeName: string;
  requestCount: number;
  totalValue: number;
  approvalRate: number;
}

export interface TopApproverDto {
  userId: number;
  userName: string;
  officeName: string;
  approvalCount: number;
  rejectionCount: number;
  approvalRate: number;
}

export interface OfficeActivityDto {
  officeId: number;
  officeName: string;
  userCount: number;
  requestCount: number;
  totalValue: number;
  averageRequestsPerUser: number;
}

export interface UserActivityReportResponseDto {
  // Report metadata
  reportType: string;
  generatedAt: string;
  generatedBy: string;
  departmentName: string;
  timePeriod: string;
  
  // Summary statistics
  summary: UserActivitySummaryDto;
  
  // Detailed user activities
  userActivities: UserActivityItemDto[];
  
  // Filtering information
  filters: UserActivityReportRequest;
  
  // Pagination info (if needed)
  totalPages?: number;
  currentPage?: number;
  totalRecords?: number;
}

// UI-specific types for enhanced display
export interface UserActivityReportFilters {
  // Time period
  timePeriod: {
    type: 'year' | 'dateRange';
    year?: number;
    startDate?: string;
    endDate?: string;
  };
  
  // Filtering options
  officeId?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  
  // Activity type filters
  includeSubmissions: boolean;
  includeApprovals: boolean;
  includeRejections: boolean;
  includeFulfillments: boolean;
  
  // User status filters
  activeOnly: boolean;
  roleFilter?: UserRole;
}

// Report generation state
export interface UserActivityReportState {
  isGenerating: boolean;
  error: string | null;
  lastGenerated: Date | null;
  data: UserActivityItemDto[] | null;
  summary: UserActivitySummaryDto | null;
}

// Export options
export interface UserActivityExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  includeSummary: boolean;
  includeTopPerformers: boolean;
  includeOfficeBreakdown: boolean;
}
