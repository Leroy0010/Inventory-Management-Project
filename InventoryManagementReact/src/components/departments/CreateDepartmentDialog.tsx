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

interface CreateDepartmentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    formData: {
        name: string;
        description: string;
    };
    onFormDataChange: (data: { name: string; description: string }) => void;
    onSubmit: () => void;
}

export function CreateDepartmentDialog({
    isOpen,
    onOpenChange,
    formData,
    onFormDataChange,
    onSubmit,
}: CreateDepartmentDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Department</DialogTitle>
                    <DialogDescription>
                        Add a new department to the organization
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Department Name</Label>
                        <Input
                            id="name"
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
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
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
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={onSubmit}>Create Department</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
