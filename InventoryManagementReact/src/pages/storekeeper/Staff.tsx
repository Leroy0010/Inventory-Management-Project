import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';

export default function Staff() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Staff Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your team members and their roles
                    </p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Staff
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Staff Members
                    </CardTitle>
                    <CardDescription>
                        View and manage all staff members in your organization
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No staff members found</p>
                        <p className="text-sm">
                            Add your first staff member to get started
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
