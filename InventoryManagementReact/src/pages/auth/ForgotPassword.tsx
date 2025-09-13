import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm';
import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState<string>('');
  
  const token = searchParams.get('token');

  const handleForgotPasswordSuccess = (userEmail: string) => {
    setEmail(userEmail);
  };

  const handleResetPasswordSuccess = () => {
    // Redirect to login after successful password reset
    navigate('/login', { 
      replace: true,
      state: { message: 'Password reset successful. Please log in with your new password.' }
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
          <ForgotPasswordForm
            onSuccess={handleForgotPasswordSuccess}
            onBack={handleBackToLogin}
          />
        )}
      </div>
    </div>
  );
}
