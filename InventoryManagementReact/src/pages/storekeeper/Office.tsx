import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Office() {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Office Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your office locations and branches
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/office/add')}
                    className="cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Office
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Offices
                    </CardTitle>
                    <CardDescription>
                        View and manage all office locations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No offices found</p>
                        <p className="text-sm">
                            Add your first office to get started
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
