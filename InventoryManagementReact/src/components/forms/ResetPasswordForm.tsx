import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import { useResetPassword } from '@/hooks/queries/usePasswordReset';
import { validatePasswordStrength, getPasswordStrengthColor, getPasswordStrengthLabel } from '@/lib/password-utils';
import type { PasswordStrength } from '@/types/profile';
import type { ResetPasswordFormData } from '@/types/passwordReset';

// Validation schema
const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .min(1, 'Password is required'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface ResetPasswordFormProps {
  token: string;
  onSuccess?: () => void;
  onBack?: () => void;
  className?: string;
}

export function ResetPasswordForm({ 
  token, 
  onSuccess, 
  onBack, 
  className 
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPassword = watch('newPassword');
  const passwordStrength = validatePasswordStrength(newPassword || '');

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword.mutateAsync({
        token,
        newPassword: data.newPassword,
      });
      setIsSuccess(true);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isSuccess) {
    return (
      <Card className={className}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Password Reset Successful</CardTitle>
          <CardDescription>
            Your password has been successfully reset. You can now log in with your new password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              You will be redirected to the login page shortly.
            </AlertDescription>
          </Alert>
          
          <Button
            onClick={onBack}
            className="w-full"
          >
            Continue to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset Your Password</CardTitle>
        <CardDescription>
          Enter your new password below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Alert */}
        {resetPassword.error && (
          <Alert variant="destructive">
            <AlertDescription>
              {resetPassword.error.message || 'Failed to reset password'}
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                {...register('newPassword')}
                disabled={isSubmitting || resetPassword.isPending}
                className={errors.newPassword ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting || resetPassword.isPending}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword.message}</p>
            )}
            
            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Password Strength:</span>
                  <span className={getPasswordStrengthColor(passwordStrength)}>
                    {getPasswordStrengthLabel(passwordStrength)}
                  </span>
                </div>
                <Progress 
                  value={
                    passwordStrength === 'Very Weak' ? 20 :
                    passwordStrength === 'Weak' ? 40 :
                    passwordStrength === 'Moderate' ? 60 :
                    passwordStrength === 'Strong' ? 80 : 100
                  } 
                  className="h-2"
                />
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                {...register('confirmPassword')}
                disabled={isSubmitting || resetPassword.isPending}
                className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting || resetPassword.isPending}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || resetPassword.isPending || passwordStrength === 'Very Weak'}
          >
            {isSubmitting || resetPassword.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>

        <div className="text-center">
          <Button
            onClick={onBack}
            variant="link"
            className="text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
