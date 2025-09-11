import { api, handleApiError } from './client';
import type { UserReportRequest, UserReportItemDto, UserReportResponse, UserReportFilters } from '@/types/userReport';

// User Report API functions based on Spring Boot UserReportController
export const userReportApi = {
    // Get user report for a specific user and year (existing Spring Boot implementation)
    getUserReport: async (request: UserReportRequest): Promise<UserReportItemDto[]> => {
        try {
            return await api.post<UserReportItemDto[]>('/api/reports/user', request);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Get all users in the storekeeper's department (new Spring Boot endpoint)
    getAllUsersReport: async (filters: UserReportFilters = {}): Promise<UserReportResponse> => {
        try {
            const params = new URLSearchParams();
            if (filters.year) params.append('year', filters.year.toString());
            if (filters.search) params.append('search', filters.search);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
            
            const queryString = params.toString();
            const url = queryString ? `/api/reports/user/all?${queryString}` : '/api/reports/user/all';
            return await api.get<UserReportResponse>(url);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Get users report for a specific department (new Spring Boot endpoint)
    getDepartmentUserReport: async (departmentId: number, filters: UserReportFilters = {}): Promise<UserReportResponse> => {
        try {
            const params = new URLSearchParams();
            if (filters.year) params.append('year', filters.year.toString());
            if (filters.search) params.append('search', filters.search);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
            
            const queryString = params.toString();
            const url = queryString 
                ? `/api/reports/user/department/${departmentId}?${queryString}` 
                : `/api/reports/user/department/${departmentId}`;
            return await api.get<UserReportResponse>(url);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
