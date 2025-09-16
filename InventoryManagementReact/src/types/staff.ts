export interface Staff {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  active: boolean;
  officeName?: string;
}

export interface CreateStaffRequest {
  email: string;
  firstName: string;
  lastName: string;
  officeName: string;
}

export interface UpdateStaffRequest {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  officeName: string;
}

export interface ToggleStaffStatusRequest {
  id: number;
  active: boolean;
}

export interface StaffFilters {
  search?: string;
  active?: boolean;
  officeName?: string;
}

export interface StaffListResponse {
  staff: Staff[];
  total: number;
  page: number;
  size: number;
}
