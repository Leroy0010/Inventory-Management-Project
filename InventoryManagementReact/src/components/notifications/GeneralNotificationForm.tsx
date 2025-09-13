import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Loader2, 
  Users, 
  Building, 
  UserCheck,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useSendGeneralNotification } from '@/hooks/queries/useNotification';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user';
import type { GeneralNotificationRequest } from '@/types/notification';
import { RecipientType } from '@/types/notification';

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
  recipientType: z.nativeEnum(RecipientType),
  userEmails: z.array(z.string().email()).optional(),
});

type GeneralNotificationFormData = z.infer<typeof generalNotificationSchema>;

interface GeneralNotificationFormProps {
  onSuccess?: () => void;
  className?: string;
}

const RECIPIENT_TYPE_OPTIONS: { value: RecipientType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: RecipientType.ALL_USERS,
    label: 'All Users',
    description: 'Send to all users in the system (Admin only)',
    icon: <Users className="h-4 w-4" />,
  },
  {
    value: RecipientType.DEPARTMENT_USERS,
    label: 'Department Users',
    description: 'Send to all users in your department',
    icon: <Building className="h-4 w-4" />,
  },
  {
    value: RecipientType.SPECIFIC_USERS,
    label: 'Specific Users',
    description: 'Select specific users by email',
    icon: <UserCheck className="h-4 w-4" />,
  },
];

export function GeneralNotificationForm({ 
  onSuccess, 
  className = '' 
}: GeneralNotificationFormProps) {
  const { user } = useAuthStore();
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [availableEmails, setAvailableEmails] = useState<string[]>([]);
  const [emailSearch, setEmailSearch] = useState('');
  
  const sendNotificationMutation = useSendGeneralNotification();

  // Get available user emails for selection
  const { data: users = [] } = useQuery({
    queryKey: ['users', 'emails'],
    queryFn: () => userApi.getUsers(),
    enabled: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<GeneralNotificationFormData>({
    resolver: zodResolver(generalNotificationSchema),
    defaultValues: {
      recipientType: RecipientType.DEPARTMENT_USERS,
    },
  });

  const recipientType = watch('recipientType');

  // Update available emails when users data changes
  useEffect(() => {
    if (users.length > 0) {
      const emails = users.map(user => user.email).filter(Boolean);
      setAvailableEmails(emails);
    }
  }, [users]);

  // Filter emails based on search
  const filteredEmails = availableEmails.filter(email =>
    email.toLowerCase().includes(emailSearch.toLowerCase()) &&
    !selectedEmails.includes(email)
  );

  const handleEmailToggle = (email: string) => {
    setSelectedEmails(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleEmailRemove = (email: string) => {
    setSelectedEmails(prev => prev.filter(e => e !== email));
  };

  const onSubmit = async (data: GeneralNotificationFormData) => {
    try {
      const requestData: GeneralNotificationRequest = {
        subject: data.subject,
        message: data.message,
        recipientType: data.recipientType,
        userEmails: data.recipientType === RecipientType.SPECIFIC_USERS ? selectedEmails : undefined,
      };

      await sendNotificationMutation.mutateAsync(requestData);
      
      // Reset form
      reset();
      setSelectedEmails([]);
      setEmailSearch('');
      
      onSuccess?.();
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const canSendToAllUsers = user?.role?.name === 'ADMIN';
  const canSendToDepartment = ['ADMIN', 'STOREKEEPER'].includes(user?.role?.name || '');

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send General Notification
        </CardTitle>
        <CardDescription>
          Send notifications to users based on your role and permissions.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Alert */}
        {sendNotificationMutation.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {sendNotificationMutation.error.message || 'Failed to send notification'}
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="Enter notification subject"
              {...register('subject')}
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject.message}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here"
              rows={4}
              {...register('message')}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          {/* Recipient Type */}
          <div className="space-y-2">
            <Label>Send To *</Label>
            <div className="space-y-3">
              {RECIPIENT_TYPE_OPTIONS.map((option) => {
                const isDisabled = 
                  (option.value === RecipientType.ALL_USERS && !canSendToAllUsers) ||
                  (option.value === RecipientType.DEPARTMENT_USERS && !canSendToDepartment);

                return (
                  <div
                    key={option.value}
                    className={`
                      flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors
                      ${recipientType === option.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => !isDisabled && setValue('recipientType', option.value)}
                  >
                    <Checkbox
                      checked={recipientType === option.value}
                      disabled={isDisabled}
                      onChange={() => !isDisabled && setValue('recipientType', option.value)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span className="font-medium">{option.label}</span>
                        {isDisabled && (
                          <Badge variant="secondary" className="text-xs">
                            Not Available
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Specific Users Selection */}
          {recipientType === RecipientType.SPECIFIC_USERS && (
            <div className="space-y-4">
              <Label>Select Users</Label>
              
              {/* Selected Users */}
              {selectedEmails.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Selected users:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmails.map((email) => (
                      <Badge
                        key={email}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => handleEmailRemove(email)}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Email Search and Selection */}
              <div className="space-y-2">
                <Input
                  placeholder="Search users by email..."
                  value={emailSearch}
                  onChange={(e) => setEmailSearch(e.target.value)}
                />
                
                {filteredEmails.length > 0 && (
                  <div className="max-h-40 overflow-y-auto border rounded-lg">
                    {filteredEmails.map((email) => (
                      <div
                        key={email}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleEmailToggle(email)}
                      >
                        <Checkbox
                          checked={selectedEmails.includes(email)}
                          onChange={() => handleEmailToggle(email)}
                        />
                        <span className="text-sm">{email}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errors.userEmails && (
                <p className="text-sm text-red-500">{errors.userEmails.message}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || sendNotificationMutation.isPending}
            className="w-full"
          >
            {isSubmitting || sendNotificationMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Notification
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
