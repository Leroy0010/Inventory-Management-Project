import { ForgotPasswordForm } from '@/routes/lazyLoadPages';
import { ResetPasswordForm } from '@/routes/lazyLoadPages';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');

    const handleResetPasswordSuccess = () => {
        // Redirect to login after successful password reset
        navigate('/login', {
            replace: true,
            state: {
                message:
                    'Password reset successful. Please log in with your new password.',
            },
        });
    };

    const handleBackToLogin = () => {
        navigate('/login', { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <div className="w-full max-w-md">
                {token ? (
                    <ResetPasswordForm
                        token={token}
                        onSuccess={handleResetPasswordSuccess}
                        onBack={handleBackToLogin}
                    />
                ) : (
                    <ForgotPasswordForm onBack={handleBackToLogin} />
                )}
            </div>
        </div>
    );
}
