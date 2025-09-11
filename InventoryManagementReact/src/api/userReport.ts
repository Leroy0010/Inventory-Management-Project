import { api, handleApiError } from './client';
import type { UserReportRequest, UserReportItemDto } from '@/types/userReport';

// User Report API functions based on Spring Boot UserReportController
export const userReportApi = {
    // Get user report for a specific user and year (current Spring Boot implementation)
    getUserReport: async (request: UserReportRequest): Promise<UserReportItemDto[]> => {
        try {
            return await api.post<UserReportItemDto[]>('/api/reports/user', request);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Get all users in the storekeeper's department (would need new Spring Boot endpoint)
    // This would be implemented as: GET /api/reports/user/department/{departmentId}?year={year}
    getDepartmentUserReport: async (departmentId: number, year?: number): Promise<UserReportItemDto[]> => {
        try {
            const params = year ? `?year=${year}` : '';
            return await api.get<UserReportItemDto[]>(`/api/reports/user/department/${departmentId}${params}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Get all users with their report data (would need new Spring Boot endpoint)
    // This would be implemented as: GET /api/reports/user/all?year={year}&search={search}&sortBy={sortBy}&sortOrder={sortOrder}
    getAllUsersReport: async (filters: {
        year?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: string;
    } = {}): Promise<UserReportItemDto[]> => {
        try {
            const params = new URLSearchParams();
            if (filters.year) params.append('year', filters.year.toString());
            if (filters.search) params.append('search', filters.search);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
            
            const queryString = params.toString();
            const url = queryString ? `/api/reports/user/all?${queryString}` : '/api/reports/user/all';
            return await api.get<UserReportItemDto[]>(url);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
