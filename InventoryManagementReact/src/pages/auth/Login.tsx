import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoginForm } from '@/components/forms/LoginForm';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const { isAuthenticated, isLoading, isHydrated, setUser, setLoading } =
        useAuthStore();
    const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

    // Handle OAuth callback
    useEffect(() => {
        const handleOAuthCallback = async () => {
            const urlParams = new URLSearchParams(location.search);
            const googleAuth = urlParams.get('google_auth');
            const message = urlParams.get('message');

            if (googleAuth === 'success') {
                setIsProcessingOAuth(true);
                setLoading(true);

                try {
                    // Wait a bit for the backend to process the OAuth callback
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    // Try to get the user profile
                    const user = await authApi.getProfile();
                    setUser(user);

                    // Navigate to the intended destination
                    navigate(from, { replace: true });
                } catch (error) {
                    console.error('OAuth callback error:', error);
                    // If there's an error, redirect to login
                    navigate('/login', { replace: true });
                } finally {
                    setLoading(false);
                    setIsProcessingOAuth(false);
                }
            } else if (googleAuth === 'error') {
                console.error('Google OAuth error:', message);
                navigate('/login?error=oauth_error', { replace: true });
            }
        };

        handleOAuthCallback();
    }, [location.search, location.state, navigate, setUser, setLoading, from]);

    const handleLoginSuccess = () => {
        navigate(from, { replace: true });
    };

    // Show loading spinner during OAuth processing or initial auth check
    if (isProcessingOAuth || !isHydrated || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
                    <div className="text-white">
                        {isProcessingOAuth
                            ? 'Completing Google sign-in...'
                            : 'Loading...'}
                    </div>
                    {isProcessingOAuth && (
                        <div className="text-white/70 text-sm">
                            Please wait while we set up your account
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // If already authenticated, redirect
    if (isAuthenticated) {
        navigate(from, { replace: true });
        return null;
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
