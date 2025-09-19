import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Calendar, Edit, Trash2, Users } from 'lucide-react';
import type { DepartmentResponseDto } from '@/types/department';

interface DepartmentTableRowProps {
    department: DepartmentResponseDto;
    hasEditPermission: boolean;
    hasDeletePermission: boolean;
    onEdit: (department: DepartmentResponseDto) => void;
    onDelete: (departmentId: number) => void;
}

export function DepartmentTableRow({
    department,
    hasEditPermission,
    hasDeletePermission,
    onEdit,
    onDelete,
}: DepartmentTableRowProps) {
    return (
        <TableRow key={department.id}>
            <TableCell>
                <div>
                    <div className="font-medium">{department.name}</div>
                    <div className="text-sm text-muted-foreground">
                        {department.description}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{department.headOfDepartment}</span>
                </div>
            </TableCell>
            <TableCell>
                <Badge variant="secondary">{department.staffCount} staff</Badge>
            </TableCell>
            <TableCell>
                <Badge variant={department.active ? 'default' : 'secondary'}>
                    {department.active ? 'Active' : 'Inactive'}
                </Badge>
            </TableCell>
            <TableCell>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                        {new Date(department.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                    {hasEditPermission && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(department)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                    {hasDeletePermission && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(department.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}
