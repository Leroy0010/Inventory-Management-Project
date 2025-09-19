import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  Building, 
  UserCheck,
} from 'lucide-react';
import { RecipientType } from '@/types/notification';
import type { GeneralNotificationFormData } from './GeneralNotificationForm';

interface RecipientTypeSelectorProps {
  userRole: string;
}

export function RecipientTypeSelector({ userRole }: RecipientTypeSelectorProps) {
  const { watch, setValue } = useFormContext<GeneralNotificationFormData>();
  const recipientType = watch('recipientType');

  const getRecipientTypeOptions = () => {
    const baseOptions: Array<{
      value: RecipientType;
      label: string;
      description: string;
      icon: React.ReactNode;
    }> = [
      {
        value: RecipientType.DEPARTMENT_USERS,
        label: 'Department Users',
        description: 'Send to all users in your department',
        icon: <Building className="h-4 w-4" />,
      },
      {
        value: RecipientType.SPECIFIC_USERS,
        label: 'Specific Users',
        description: userRole === 'ADMIN' 
          ? 'Select specific users by email (any user)' 
          : 'Select specific users by email (department only)',
        icon: <UserCheck className="h-4 w-4" />,
      },
    ];

    if (userRole === 'ADMIN') {
      baseOptions.unshift({
        value: RecipientType.ALL_USERS,
        label: 'All Users',
        description: 'Send to all users in the system',
        icon: <Users className="h-4 w-4" />,
      });
    }

    return baseOptions;
  };

  const recipientTypeOptions = getRecipientTypeOptions();

  return (
    <div className="space-y-2">
      <Label>Send To *</Label>
      <div className="space-y-3">
        {recipientTypeOptions.map((option) => (
          <div
            key={option.value}
            className={`
              flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors
              ${recipientType === option.value 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => setValue('recipientType', option.value)}
          >
            <Checkbox
              checked={recipientType === option.value}
              onChange={() => setValue('recipientType', option.value)}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {option.icon}
                <span className="font-medium">{option.label}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
