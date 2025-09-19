import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { DepartmentResponseDto } from '@/types/department';

interface EditDepartmentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editingDepartment: DepartmentResponseDto | null;
    formData: {
        name: string;
        description: string;
    };
    onFormDataChange: (data: { name: string; description: string }) => void;
    onSubmit: () => void;
}

export function EditDepartmentDialog({
    isOpen,
    onOpenChange,
    editingDepartment,
    formData,
    onFormDataChange,
    onSubmit,
}: EditDepartmentDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                                onFormDataChange({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            placeholder="Enter department name"
                        />
                    </div>
                    <div>
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) =>
                                onFormDataChange({
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
                            readOnly
                            value={editingDepartment?.headOfDepartment || ''}
                            placeholder="Enter head of department name"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={onSubmit}>Update Department</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
