import React, { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface UserEmailSelectorProps {
  availableEmails: string[];
  selectedEmails: string[];
  onEmailToggle: (email: string) => void;
  onEmailRemove: (email: string) => void;
  isLoading: boolean;
  errors: any;
}

export function UserEmailSelector({
  availableEmails,
  selectedEmails,
  onEmailToggle,
  onEmailRemove,
  isLoading,
  errors,
}: UserEmailSelectorProps) {
  const [emailSearch, setEmailSearch] = useState('');

  // Filter emails based on search
  const filteredEmails = useMemo(() => 
    availableEmails.filter(email =>
      email.toLowerCase().includes(emailSearch.toLowerCase()) &&
      !selectedEmails.includes(email)
    ), [availableEmails, emailSearch, selectedEmails]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading available users...
      </div>
    );
  }

  return (
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
                  onClick={() => onEmailRemove(email)}
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
        
        {filteredEmails.length > 0 ? (
          <div className="max-h-40 overflow-y-auto border rounded-lg">
            {filteredEmails.map((email) => (
              <div
                key={email}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => onEmailToggle(email)}
              >
                <Checkbox
                  checked={selectedEmails.includes(email)}
                  onChange={() => onEmailToggle(email)}
                />
                <span className="text-sm">{email}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            {emailSearch ? 'No users found matching your search' : 'No users available'}
          </div>
        )}
      </div>

      {errors.userEmails && (
        <p className="text-sm text-red-500">{errors.userEmails.message}</p>
      )}
    </div>
  );
}
