import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Users } from 'lucide-react';
import AddStaffForm from '@/components/forms/AddStaffForm';

export default function AddStaff() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-lg mx-auto mt-10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Add Staff Member
                    </CardTitle>
                    <CardDescription>
                        Enter the details for the new staff member
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AddStaffForm />
                </CardContent>
            </Card>
        </div>
    );
}
