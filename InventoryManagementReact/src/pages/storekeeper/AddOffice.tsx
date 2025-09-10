import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Building } from 'lucide-react';
import AddOfficeForm from '@/components/forms/AddOfficeForm';

export default function AddOffice() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-lg mx-auto mt-10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Add Office
                    </CardTitle>
                    <CardDescription>
                        Enter the details for the new office
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AddOfficeForm />
                </CardContent>
            </Card>
        </div>
    );
}
