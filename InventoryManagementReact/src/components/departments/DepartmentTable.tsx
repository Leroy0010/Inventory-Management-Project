import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { DepartmentResponseDto } from '@/types/department';
import { DepartmentTableRow } from './DepartmentTableRow';
import { DepartmentSearch } from './DepartmentSearch';

interface DepartmentTableProps {
    departments: DepartmentResponseDto[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
    hasEditPermission: boolean;
    hasDeletePermission: boolean;
    onEdit: (department: DepartmentResponseDto) => void;
    onDelete: (departmentId: number) => void;
}

export function DepartmentTable({
    departments,
    searchTerm,
    onSearchChange,
    hasEditPermission,
    hasDeletePermission,
    onEdit,
    onDelete,
}: DepartmentTableProps) {
    return (
        <Card>
            <CardHeader>
                <DepartmentSearch
                    searchTerm={searchTerm}
                    onSearchChange={onSearchChange}
                />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Department</TableHead>
                            <TableHead>Head of Department</TableHead>
                            <TableHead>Staff Count</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {departments.map((department) => (
                            <DepartmentTableRow
                                key={department.id}
                                department={department}
                                hasEditPermission={hasEditPermission}
                                hasDeletePermission={hasDeletePermission}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
