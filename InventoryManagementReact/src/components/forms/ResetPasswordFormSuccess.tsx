import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ResetPasswordFormSuccessProps {
    onBack: () => void;
    className?: string;
}

export function ResetPasswordFormSuccess({
    onBack,
    className,
}: ResetPasswordFormSuccessProps) {
    return (
        <Card className={className}>
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl">
                    Password Reset Successful
                </CardTitle>
                <CardDescription>
                    Your password has been successfully reset. You can now log
                    in with your new password.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert>
                    <AlertDescription>
                        You will be redirected to the login page shortly.
                    </AlertDescription>
                </Alert>

                <Button onClick={onBack} className="w-full">
                    Continue to Login
                </Button>
            </CardContent>
        </Card>
    );
}
