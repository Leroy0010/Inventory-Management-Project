import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api, handleApiError } from '@/api/client';
import type { Department, DepartmentResponseDto } from '@/types/department';

export interface DepartmentState {
    departments: Department[];
    isLoading: boolean;
    error: string | null;
}

export interface DepartmentActions {
    // Departments management
    fetchDepartments: () => Promise<Department[]>;
    createDepartment: (name: string) => Promise<Department>;
    updateDepartment: (id: number, name: string) => Promise<Department>;
    deleteDepartment: (id: number) => Promise<void>;
    fetchDepartmentsAdmin: () => Promise<DepartmentResponseDto[]>;

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
                    const departments = await api.get<Department[]>('/departments');
                    set({ departments: departments || [], isLoading: false });
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                }
            },

            // Fetch departments
            fetchDepartmentsAdmin: async () => {
                set({ isLoading: true, error: null });

                try {
                    const departments = await api.get<DepartmentResponseDto[]>('/departments/admin/get-all');
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
                    const newDepartment = await api.post<Department>('/departments', { name });

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
                    const updatedDepartment = await api.put<Department>(`/departments/${id}`, { name });

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
                    await api.delete(`/departments/${id}`);

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
