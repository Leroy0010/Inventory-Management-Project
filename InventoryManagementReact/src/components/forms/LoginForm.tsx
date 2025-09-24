import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthQueries } from '@/hooks/queries/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormErrorAlert } from '@/components/ui/FormErrorAlert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { GoogleSignInButton } from './GoogleSignInButton';

// Validation schema
const loginSchema = z.object({
    email: z
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSuccess?: () => void;
    className?: string;
}

export function LoginForm({ onSuccess, className }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { error, clearError } = useAuthStore();
    const { loginMutation } = useAuthQueries();
    const { login } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            clearError();
            // console.log('Starting login process...');

            const user = await loginMutation.mutateAsync({
                email: data.email,
                password: data.password,
            });

            login(user);

            // console.log('Login successful, result:', user);

            // Add a small delay to ensure all backend operations complete
            // This prevents race conditions with token cleanup
            await new Promise((resolve) => setTimeout(resolve, 200));

            // console.log('Calling onSuccess callback...');
            // Call onSuccess after successful login
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            // console.error('Login error:', error);
            // Error is handled by the mutation
        }
    };

    return (
        <Card className={className}>
            <CardContent className="space-y-4">
                {/* Error Alert */}
                {(error || loginMutation.error) && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            <FormErrorAlert
                                error={loginMutation.error || error}
                                defaultMessage="Login failed. Please try again."
                            />
                        </AlertDescription>
                    </Alert>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register('email')}
                            disabled={isSubmitting || loginMutation.isPending}
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                {...register('password')}
                                disabled={
                                    isSubmitting || loginMutation.isPending
                                }
                                className={
                                    errors.password
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
                                disabled={
                                    isSubmitting || loginMutation.isPending
                                }
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={isSubmitting || loginMutation.isPending}
                    >
                        {isSubmitting || loginMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </Button>
                </form>

                {/* Forgot Password Link */}
                <div className="text-center">
                    <Button
                        variant="link"
                        className="text-sm"
                        onClick={() => navigate('/forgot-password')}
                    >
                        Forgot your password?
                    </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or Sign in with Google
                        </span>
                    </div>
                </div>

                {/* Google Sign In */}
                <GoogleSignInButton
                    isLoading={false}
                    disabled={isSubmitting || loginMutation.isPending}
                />
            </CardContent>
        </Card>
    );
}
