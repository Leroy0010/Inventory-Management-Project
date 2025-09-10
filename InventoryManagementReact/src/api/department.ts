import { api, handleApiError } from './client';
import type { Department } from '@/types/department';

export const departmentApi = {
    // Departments
    getDepartments: async (): Promise<Department[]> => {
        try {
            return await api.get<Department[]>('/api/departments');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    createDepartment: async (name: string): Promise<Department> => {
        try {
            return await api.post<Department>('/api/departments', { name });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    updateDepartment: async (id: number, name: string): Promise<Department> => {
        try {
            return await api.put<Department>(`/api/departments/${id}`, {
                name,
            });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    deleteDepartment: async (id: number): Promise<void> => {
        try {
            await api.delete(`/api/departments/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
