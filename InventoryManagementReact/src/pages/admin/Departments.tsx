import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Users,
    Calendar,
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface Department {
    id: string;
    name: string;
    description: string;
    headOfDepartment: string;
    staffCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function Departments() {
    const { hasPermission } = usePermissions();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] =
        useState<Department | null>(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        headOfDepartment: '',
    });

    // Mock data - replace with actual API calls
    useEffect(() => {
        const mockDepartments: Department[] = [
            {
                id: '1',
                name: 'Finance Department',
                description: 'Handles all financial operations and budgeting',
                headOfDepartment: 'John Smith',
                staffCount: 15,
                isActive: true,
                createdAt: '2024-01-15',
                updatedAt: '2024-01-20',
            },
            {
                id: '2',
                name: 'IT Department',
                description: 'Manages technology infrastructure and support',
                headOfDepartment: 'Jane Doe',
                staffCount: 8,
                isActive: true,
                createdAt: '2024-01-10',
                updatedAt: '2024-01-18',
            },
            {
                id: '3',
                name: 'Human Resources',
                description: 'Employee management and recruitment',
                headOfDepartment: 'Mike Johnson',
                staffCount: 5,
                isActive: true,
                createdAt: '2024-01-05',
                updatedAt: '2024-01-15',
            },
        ];

        setDepartments(mockDepartments);
        setLoading(false);
    }, []);

    const filteredDepartments = departments.filter(
        (dept) =>
            dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.headOfDepartment
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const handleCreateDepartment = () => {
        // TODO: Implement API call
        // Creating department
        setIsCreateDialogOpen(false);
        setFormData({ name: '', description: '', headOfDepartment: '' });
    };

    const handleEditDepartment = (department: Department) => {
        setEditingDepartment(department);
        setFormData({
            name: department.name,
            description: department.description,
            headOfDepartment: department.headOfDepartment,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateDepartment = () => {
        // TODO: Implement API call
        // Updating department
        setIsEditDialogOpen(false);
        setEditingDepartment(null);
        setFormData({ name: '', description: '', headOfDepartment: '' });
    };

    const handleDeleteDepartment = (departmentId: string) => {
        // TODO: Implement API call
        // Deleting department
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Departments
                    </h1>
                    <p className="text-muted-foreground">
                        Manage organizational departments and their
                        configurations
                    </p>
                </div>
                {hasPermission('ADD_DEPARTMENT') && (
                    <Dialog
                        open={isCreateDialogOpen}
                        onOpenChange={setIsCreateDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Department
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Department</DialogTitle>
                                <DialogDescription>
                                    Add a new department to the organization
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">
                                        Department Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Enter department name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        placeholder="Enter department description"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="headOfDepartment">
                                        Head of Department
                                    </Label>
                                    <Input
                                        id="headOfDepartment"
                                        value={formData.headOfDepartment}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                headOfDepartment:
                                                    e.target.value,
                                            })
                                        }
                                        placeholder="Enter head of department name"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCreateDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateDepartment}>
                                    Create Department
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4" />
                        <Input
                            placeholder="Search departments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
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
                            {filteredDepartments.map((department) => (
                                <TableRow key={department.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {department.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {department.description}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Users className="h-4 w-4" />
                                            <span>
                                                {department.headOfDepartment}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {department.staffCount} staff
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                department.isActive
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {department.isActive
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            <span>
                                                {new Date(
                                                    department.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            {hasPermission(
                                                'EDIT_DEPARTMENT'
                                            ) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEditDepartment(
                                                            department
                                                        )
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {hasPermission(
                                                'DELETE_DEPARTMENT'
                                            ) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteDepartment(
                                                            department.id
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Department</DialogTitle>
                        <DialogDescription>
                            Update department information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Department Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Enter department name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-description">
                                Description
                            </Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Enter department description"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-headOfDepartment">
                                Head of Department
                            </Label>
                            <Input
                                id="edit-headOfDepartment"
                                value={formData.headOfDepartment}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        headOfDepartment: e.target.value,
                                    })
                                }
                                placeholder="Enter head of department name"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateDepartment}>
                            Update Department
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
