import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Lock, Eye, EyeOff, Shield, Loader2 } from 'lucide-react';
import { updatePasswordSchema } from '@/types/profile';
import type { UpdatePasswordFormData, PasswordStrength } from '@/types/profile';
import { useChangePassword } from '@/hooks/queries/useAuth';
import {
    validatePasswordStrength,
    getPasswordStrengthColor,
    getPasswordStrengthWidth,
    getPasswordRequirements,
} from '@/lib/password-utils';

interface PasswordChangeFormProps {
    onSuccess?: () => void;
    className?: string;
}

export function PasswordChangeForm({
    onSuccess,
    className = '',
}: PasswordChangeFormProps) {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] =
        useState<PasswordStrength>('Very Weak');

    const changePasswordMutation = useChangePassword();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm<UpdatePasswordFormData>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const newPasswordValue = watch('newPassword');
    const passwordRequirements = getPasswordRequirements();

    // Update password strength when new password changes
    useEffect(() => {
        if (newPasswordValue) {
            setPasswordStrength(validatePasswordStrength(newPasswordValue));
        } else {
            setPasswordStrength('Very Weak');
        }
    }, [newPasswordValue]);

    const onSubmit = async (data: UpdatePasswordFormData) => {
        try {
            await changePasswordMutation.mutateAsync({
                currentPassword: data.oldPassword,
                newPassword: data.newPassword,
            });
            reset();
            setPasswordStrength('Very Weak');
            onSuccess?.();
        } catch (err) {
            // Error is handled by the mutation's onError with toast notifications
        }
    };

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <CardTitle>Change Password</CardTitle>
                </div>
                <CardDescription>
                    Update your password to keep your account secure.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* Error and success messages are now handled by toast notifications */}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="oldPassword"
                            className="flex items-center gap-2"
                        >
                            <Lock className="h-4 w-4" />
                            Current Password *
                        </Label>
                        <div className="relative">
                            <Input
                                id="oldPassword"
                                type={showOldPassword ? 'text' : 'password'}
                                {...register('oldPassword')}
                                disabled={isSubmitting}
                                className={
                                    errors.oldPassword ? 'border-red-500' : ''
                                }
                                placeholder="Enter your current password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
                                onClick={() =>
                                    setShowOldPassword(!showOldPassword)
                                }
                                disabled={isSubmitting}
                            >
                                {showOldPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                    {showOldPassword
                                        ? 'Hide password'
                                        : 'Show password'}
                                </span>
                            </Button>
                        </div>
                        {errors.oldPassword && (
                            <p className="text-sm text-red-500">
                                {errors.oldPassword.message}
                            </p>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="newPassword"
                            className="flex items-center gap-2"
                        >
                            <Lock className="h-4 w-4" />
                            New Password *
                        </Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                {...register('newPassword')}
                                disabled={isSubmitting}
                                className={
                                    errors.newPassword ? 'border-red-500' : ''
                                }
                                placeholder="Enter your new password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
                                onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                                disabled={isSubmitting}
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                    {showNewPassword
                                        ? 'Hide password'
                                        : 'Show password'}
                                </span>
                            </Button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-sm text-red-500">
                                {errors.newPassword.message}
                            </p>
                        )}

                        {/* Password Strength Indicator */}
                        {newPasswordValue && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        Strength:
                                    </span>
                                    <span
                                        className={`text-sm font-medium ${getPasswordStrengthColor(passwordStrength)}`}
                                    >
                                        {passwordStrength}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            passwordStrength === 'Very Weak'
                                                ? 'bg-red-500'
                                                : passwordStrength === 'Weak'
                                                  ? 'bg-orange-500'
                                                  : passwordStrength ===
                                                      'Moderate'
                                                    ? 'bg-yellow-500'
                                                    : passwordStrength ===
                                                        'Strong'
                                                      ? 'bg-green-500'
                                                      : 'bg-blue-500'
                                        } ${getPasswordStrengthWidth(passwordStrength)}`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="confirmPassword"
                            className="flex items-center gap-2"
                        >
                            <Lock className="h-4 w-4" />
                            Confirm New Password *
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                {...register('confirmPassword')}
                                disabled={isSubmitting}
                                className={
                                    errors.confirmPassword
                                        ? 'border-red-500'
                                        : ''
                                }
                                placeholder="Confirm your new password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                disabled={isSubmitting}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                    {showConfirmPassword
                                        ? 'Hide password'
                                        : 'Show password'}
                                </span>
                            </Button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Password Requirements */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Password Requirements:
                        </Label>
                        <div className="space-y-1">
                            {passwordRequirements.map((requirement, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-2 text-sm ${
                                        newPasswordValue &&
                                        requirement.test(newPasswordValue)
                                            ? 'text-green-600'
                                            : 'text-gray-500'
                                    }`}
                                >
                                    <div
                                        className={`w-1 h-1 rounded-full ${
                                            newPasswordValue &&
                                            requirement.test(newPasswordValue)
                                                ? 'bg-green-600'
                                                : 'bg-gray-400'
                                        }`}
                                    />
                                    {requirement.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Shield className="h-4 w-4" />
                            )}
                            {isSubmitting
                                ? 'Changing Password...'
                                : 'Change Password'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
