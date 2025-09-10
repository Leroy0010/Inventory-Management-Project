import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AddStorekeeperForm from '@/components/forms/AddStorekeeperForm';
import { UserPlus } from 'lucide-react';

export default function AddStorekeeper() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-lg mx-auto mt-10">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <UserPlus className="h-5 w-5" />
                        <span>Add Storekeeper</span>
                    </CardTitle>
                    <CardDescription>
                        Enter the details for the new staff member
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AddStorekeeperForm />
                </CardContent>
            </Card>
        </div>
    );
}
