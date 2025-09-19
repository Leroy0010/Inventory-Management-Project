import { useDepartmentQueries } from '@/hooks/queries/useDepartments';
import { usePermissions } from '@/hooks/usePermissions';
import type { DepartmentResponseDto } from '@/types/department';
import { useState } from 'react';
import { DepartmentHeader } from '@/components/departments/DepartmentHeader';
import { DepartmentTable } from '@/components/departments/DepartmentTable';
import { CreateDepartmentDialog } from '@/components/departments/CreateDepartmentDialog';
import { EditDepartmentDialog } from '@/components/departments/EditDepartmentDialog';
import { DepartmentLoadingState } from '@/components/departments/DepartmentLoadingState';
import { DepartmentErrorState } from '@/components/departments/DepartmentErrorState';

export default function Departments() {
    const { hasPermission } = usePermissions();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] =
        useState<DepartmentResponseDto | null>(null);
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    // Department queries
    const { departmentsQueryAdmin } = useDepartmentQueries();
    const departments = departmentsQueryAdmin.data || [];
    const isLoading = departmentsQueryAdmin.isLoading;
    const error = departmentsQueryAdmin.error;

    const filteredDepartments = departments.filter(
        (dept) =>
            dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            dept.headOfDepartment
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const handleCreateDepartment = () => {
        // TODO: Implement API call
        // Creating department
        setIsCreateDialogOpen(false);
        setFormData({ name: '', description: '' });
    };

    const handleEditDepartment = (department: DepartmentResponseDto) => {
        setEditingDepartment(department);
        setFormData({
            name: department.name,
            description: department?.description || '',
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateDepartment = () => {
        // TODO: Implement API call
        // Updating department
        setIsEditDialogOpen(false);
        setEditingDepartment(null);
        setFormData({ name: '', description: '' });
    };

    const handleDeleteDepartment = (departmentId: number) => {
        // TODO: Implement API call
        // Deleting department
    };

    if (isLoading) {
        return <DepartmentLoadingState />;
    }

    if (error) {
        return <DepartmentErrorState error={error} />;
    }

    return (
        <div className="space-y-6">
            <DepartmentHeader
                hasAddPermission={hasPermission('ADD_DEPARTMENT')}
                onAddClick={() => setIsCreateDialogOpen(true)}
            />

            <DepartmentTable
                departments={filteredDepartments}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                hasEditPermission={hasPermission('EDIT_DEPARTMENT')}
                hasDeletePermission={hasPermission('DELETE_DEPARTMENT')}
                onEdit={handleEditDepartment}
                onDelete={handleDeleteDepartment}
            />

            <CreateDepartmentDialog
                isOpen={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                formData={formData}
                onFormDataChange={setFormData}
                onSubmit={handleCreateDepartment}
            />

            <EditDepartmentDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                editingDepartment={editingDepartment}
                formData={formData}
                onFormDataChange={setFormData}
                onSubmit={handleUpdateDepartment}
            />
        </div>
    );
}
