import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { LoginForm } from '@/components/forms/LoginForm';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const { isAuthenticated, isLoading } = useAuthStore();

    // Parse query params once
    const urlParams = new URLSearchParams(location.search);
    const googleAuth = urlParams.get('google_auth');
    const message = urlParams.get('message');

    // Handle Google OAuth callback
    useEffect(() => {
        if (googleAuth === 'success') {
            if (isAuthenticated) {
                navigate(from, { replace: true });
            } else {
                console.log(
                    'Google OAuth successful, waiting for authentication state to update'
                );
            }
        } else if (googleAuth === 'error') {
            console.error('Google OAuth error:', message);
        }
    }, [googleAuth, message, isAuthenticated, navigate, from]);

    const handleLoginSuccess = () => {
        console.log('handleLoginSuccess called, navigating to:', from);
        navigate(from, { replace: true });
    };

    // Show loading spinner instead of flashing login form
    if (googleAuth === 'success' && isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

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
