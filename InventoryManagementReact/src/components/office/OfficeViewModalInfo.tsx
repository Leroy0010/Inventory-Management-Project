import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, FileText, Users, Edit, Trash2 } from 'lucide-react';
import type { Office } from '@/types/office';

interface OfficeViewModalInfoProps {
    office: Office;
    onEdit: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}

export function OfficeViewModalInfo({
    office,
    onEdit,
    onDelete,
    isDeleting,
}: OfficeViewModalInfoProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                            Office Information
                        </h3>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onEdit}
                                className="flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onDelete}
                                disabled={isDeleting || office.staffCount > 0}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Office Name
                            </label>
                            <p className="text-sm font-medium">{office.name}</p>
                        </div>

                        {office.location && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    Location
                                </label>
                                <p className="text-sm">{office.location}</p>
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                Staff Count
                            </label>
                            <Badge
                                variant="outline"
                                className="flex items-center gap-1 w-fit"
                            >
                                <Users className="w-3 h-3" />
                                {office.staffCount}{' '}
                                {office.staffCount === 1 ? 'member' : 'members'}
                            </Badge>
                        </div>
                    </div>

                    {office.description && (
                        <div>
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                Description
                            </label>
                            <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                {office.description}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
