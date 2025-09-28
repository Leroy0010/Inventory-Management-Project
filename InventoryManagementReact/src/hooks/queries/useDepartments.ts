// Barrel exports for all department-related hooks
export { useDepartments } from './useDepartmentsList';
export { useDepartmentsAdmin } from './useDepartmentsAdmin';
export { useCreateDepartment } from './useCreateDepartment';
export { useUpdateDepartment } from './useUpdateDepartment';
export { useDeleteDepartment } from './useDeleteDepartment';
export { departmentKeys } from './departmentKeys';

import { useDepartments } from './useDepartmentsList';
import { useDepartmentsAdmin } from './useDepartmentsAdmin';
import { useCreateDepartment } from './useCreateDepartment';
import { useUpdateDepartment } from './useUpdateDepartment';
import { useDeleteDepartment } from './useDeleteDepartment';

// Legacy export for backward compatibility
export function useDepartmentQueries() {
    // This is now deprecated - components should use individual hooks
    console.warn(
        'useDepartmentQueries is deprecated. Use individual hooks like useDepartments, useCreateDepartment, etc.'
    );

    return {
        departmentsQuery: useDepartments(),
        departmentsQueryAdmin: useDepartmentsAdmin(),
        createDepartmentMutation: useCreateDepartment(),
        updateDepartmentMutation: useUpdateDepartment(),
        deleteDepartmentMutation: useDeleteDepartment(),
    };
}
