import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api, handleApiError } from '@/api/client';
import type { Department } from '@/types/department';

export interface DepartmentState {
    departments: Department[];
    isLoading: boolean;
    error: string | null;
}

export interface DepartmentActions {
    // Departments management
    fetchDepartments: () => Promise<void>;
    createDepartment: (name: string) => Promise<Department>;
    updateDepartment: (id: number, name: string) => Promise<Department>;
    deleteDepartment: (id: number) => Promise<void>;

    // Error handling
    setError: (error: string | null) => void;
    clearError: () => void;
}

export type DepartmentStore = DepartmentState & DepartmentActions;

const initialState: DepartmentState = {
    departments: [],
    isLoading: false,
    error: null,
};

export const useDepartmentStore = create<DepartmentStore>()(
    devtools(
        (set, get) => ({
            ...initialState,

            // Fetch departments
            fetchDepartments: async () => {
                set({ isLoading: true, error: null });

                try {
                    const departments = await api.get<Department[]>('/api/departments');
                    set({ departments: departments || [], isLoading: false });
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                }
            },

            // Create department
            createDepartment: async (name: string) => {
                set({ isLoading: true, error: null });

                try {
                    const newDepartment = await api.post<Department>('/api/departments', { name });

                    set((state) => ({
                        departments: [...state.departments, newDepartment],
                        isLoading: false,
                    }));

                    return newDepartment;
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Update department
            updateDepartment: async (id: number, name: string) => {
                set({ isLoading: true, error: null });

                try {
                    const updatedDepartment = await api.put<Department>(`/api/departments/${id}`, { name });

                    set((state) => ({
                        departments: state.departments.map((dept) =>
                            dept.id === updatedDepartment.id
                                ? updatedDepartment
                                : dept
                        ),
                        isLoading: false,
                    }));

                    return updatedDepartment;
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Delete department
            deleteDepartment: async (id: number) => {
                set({ isLoading: true, error: null });

                try {
                    await api.delete(`/api/departments/${id}`);

                    set((state) => ({
                        departments: state.departments.filter(
                            (dept) => dept.id !== id
                        ),
                        isLoading: false,
                    }));
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                    throw error;
                }
            },
            // Set error
            setError: (error) => {
                set({ error });
            },

            // Clear error
            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'department-store',
        }
    )
);
