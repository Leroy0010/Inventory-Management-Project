import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateStorekeeperForm from '@/components/forms/CreateStorekeeperForm';
import { UserPlus } from 'lucide-react';


export default function CreateStorekeeper() {


    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-lg mx-auto mt-10">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <UserPlus className="h-5 w-5" />
                        <span>Create Storekeeper</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CreateStorekeeperForm />
                </CardContent>
            </Card>
        </div>
    );
}
