import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import {
    getPasswordStrengthColor,
    getPasswordStrengthLabel,
    validatePasswordStrength,
} from '@/lib/password-utils';
import type { ResetPasswordFormData } from './ResetPasswordFormValidation';

interface ResetPasswordFormFieldsProps {
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    showConfirmPassword: boolean;
    setShowConfirmPassword: (show: boolean) => void;
    isSubmitting: boolean;
    isPending: boolean;
}

export function ResetPasswordFormFields({
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isSubmitting,
    isPending,
}: ResetPasswordFormFieldsProps) {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext<ResetPasswordFormData>();

    const newPassword = watch('newPassword');
    const passwordStrength = validatePasswordStrength(newPassword || '');

    return (
        <div className="space-y-4">
            {/* New Password Field */}
            <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                    <Input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your new password"
                        {...register('newPassword')}
                        disabled={isSubmitting || isPending}
                        className={
                            errors.newPassword
                                ? 'border-red-500 pr-10'
                                : 'pr-10'
                        }
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting || isPending}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>
                </div>
                {errors.newPassword && (
                    <p className="text-sm text-red-500">
                        {errors.newPassword.message}
                    </p>
                )}

                {/* Password Strength Indicator */}
                {newPassword && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span>Password Strength:</span>
                            <span
                                className={getPasswordStrengthColor(
                                    passwordStrength
                                )}
                            >
                                {getPasswordStrengthLabel(passwordStrength)}
                            </span>
                        </div>
                        <Progress
                            value={
                                passwordStrength === 'Very Weak'
                                    ? 20
                                    : passwordStrength === 'Weak'
                                      ? 40
                                      : passwordStrength === 'Moderate'
                                        ? 60
                                        : passwordStrength === 'Strong'
                                          ? 80
                                          : 100
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
                        disabled={isSubmitting || isPending}
                        className={
                            errors.confirmPassword
                                ? 'border-red-500 pr-10'
                                : 'pr-10'
                        }
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isSubmitting || isPending}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>
        </div>
    );
}
