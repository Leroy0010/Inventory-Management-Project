import { useState, memo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
    useSendGeneralNotification,
    useAvailableUsers,
} from '@/hooks/queries/useNotification';
import { useAuthStore } from '@/stores/authStore';
import type { GeneralNotificationRequest } from '@/types/notification';
import { RecipientType } from '@/types/notification';
import { NotificationFormFields } from './NotificationFormFields';
import { RecipientTypeSelector } from './RecipientTypeSelector';
import { UserEmailSelector } from './UserEmailSelector';
import { NotificationFormActions } from './NotificationFormActions';

// Validation schema
const generalNotificationSchema = z.object({
    subject: z
        .string()
        .min(1, 'Subject is required')
        .max(100, 'Subject must be less than 100 characters'),
    message: z
        .string()
        .min(1, 'Message is required')
        .max(1000, 'Message must be less than 1000 characters'),
    recipientType: z.enum(RecipientType),
    userEmails: z.array(z.email()).optional(),
});

export type GeneralNotificationFormData = z.infer<
    typeof generalNotificationSchema
>;

interface GeneralNotificationFormProps {
    onSuccess?: () => void;
    className?: string;
}

export const GeneralNotificationForm = memo(function GeneralNotificationForm({
    onSuccess,
    className = '',
}: GeneralNotificationFormProps) {
    const { user } = useAuthStore();
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

    const sendNotificationMutation = useSendGeneralNotification();
    const { data: availableEmails = [], isLoading: isLoadingUsers } =
        useAvailableUsers();

    const methods = useForm<GeneralNotificationFormData>({
        resolver: zodResolver(generalNotificationSchema),
        defaultValues: {
            recipientType: RecipientType.DEPARTMENT_USERS,
        },
    });

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = methods;

    const recipientType = watch('recipientType');

    const handleEmailToggle = (email: string) => {
        setSelectedEmails((prev) =>
            prev.includes(email)
                ? prev.filter((e) => e !== email)
                : [...prev, email]
        );
    };

    const handleEmailRemove = (email: string) => {
        setSelectedEmails((prev) => prev.filter((e) => e !== email));
    };

    const onSubmit = async (data: GeneralNotificationFormData) => {
        try {
            const requestData: GeneralNotificationRequest = {
                subject: data.subject,
                message: data.message,
                recipientType: data.recipientType,
                userEmails:
                    data.recipientType === RecipientType.SPECIFIC_USERS
                        ? selectedEmails
                        : undefined,
            };

            await sendNotificationMutation.mutateAsync(requestData);

            // Reset form
            reset();
            setSelectedEmails([]);

            onSuccess?.();
        } catch (error) {
            // Error handling is done by the mutation
        }
    };

    const userRole = user?.role || '';

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send General Notification
                </CardTitle>
                <CardDescription>
                    Send notifications to users based on your role and
                    permissions.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Error Alert */}
                {sendNotificationMutation.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {sendNotificationMutation.error.message ||
                                'Failed to send notification'}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Success Alert */}
                {sendNotificationMutation.isSuccess && (
                    <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>
                            Notification sent successfully!
                        </AlertDescription>
                    </Alert>
                )}

                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Form Fields */}
                        <NotificationFormFields errors={errors} />

                        {/* Recipient Type Selector */}
                        <RecipientTypeSelector userRole={userRole} />

                        {/* Specific Users Selection */}
                        {recipientType === RecipientType.SPECIFIC_USERS && (
                            <UserEmailSelector
                                availableEmails={availableEmails}
                                selectedEmails={selectedEmails}
                                onEmailToggle={handleEmailToggle}
                                onEmailRemove={handleEmailRemove}
                                isLoading={isLoadingUsers}
                                errors={errors}
                            />
                        )}

                        {/* Submit Button */}
                        <NotificationFormActions
                            isSubmitting={isSubmitting}
                            isPending={sendNotificationMutation.isPending}
                        />
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
});
