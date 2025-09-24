import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import type { Office } from '@/types/office';

interface OfficeViewModalStaffProps {
    office: Office;
}

export function OfficeViewModalStaff({ office }: OfficeViewModalStaffProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Staff Members</h3>

                    {office.staffCount > 0 ? (
                        <div className="text-center py-8">
                            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                This office has {office.staffCount} staff{' '}
                                {office.staffCount === 1 ? 'member' : 'members'}
                                .
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                View staff details in the Staff management
                                section.
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                No staff members assigned to this office.
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Add staff members in the Staff management
                                section.
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
