import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
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
                    const response = await fetch('/api/departments', {
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch departments');
                    }

                    const departments = await response.json();
                    set({ departments: departments || [], isLoading: false });
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to fetch departments',
                        isLoading: false,
                    });
                }
            },

            // Create department
            createDepartment: async (name: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/departments', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ name }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.message || 'Failed to create department'
                        );
                    }

                    const newDepartment = await response.json();

                    set((state) => ({
                        departments: [...state.departments, newDepartment],
                        isLoading: false,
                    }));

                    return newDepartment;
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to create department',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Update department
            updateDepartment: async (id: number, name: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch(`/api/departments/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ name }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.message || 'Failed to update department'
                        );
                    }

                    const updatedDepartment = await response.json();

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
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to update department',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Delete department
            deleteDepartment: async (id: number) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch(`/api/departments/${id}`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.message || 'Failed to delete department'
                        );
                    }

                    set((state) => ({
                        departments: state.departments.filter(
                            (dept) => dept.id !== id
                        ),
                        isLoading: false,
                    }));
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to delete department',
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
