import { api, handleApiError } from './client';
import type { Department, DepartmentResponseDto } from '@/types/department';

export const departmentApi = {
    // Departments
    getDepartments: async (): Promise<Department[]> => {
        try {
            return await api.get<Department[]>('/departments');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    createDepartment: async (data: {
        name: string;
        description?: string;
    }): Promise<Department> => {
        try {
            return await api.post<Department>('/departments', data);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    updateDepartment: async (id: number, name: string): Promise<Department> => {
        try {
            return await api.put<Department>(`/departments/${id}`, {
                name,
            });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    deleteDepartment: async (id: number): Promise<void> => {
        try {
            await api.delete(`/departments/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    fetchDepartmentsAdmin: async (): Promise<DepartmentResponseDto[]> => {
        try {
            return await api.get(`/departments/admin/get-all`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
