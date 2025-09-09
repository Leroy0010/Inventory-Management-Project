import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '@/components/forms/LoginForm';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleLoginSuccess = () => {
        navigate(from, { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">
                        Welcome Back
                    </CardTitle>
                    <CardDescription>
                        Sign in to your inventory management account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm onSuccess={handleLoginSuccess} />
                </CardContent>
            </Card>
        </div>
    );
}
