import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

interface NotificationFormActionsProps {
  isSubmitting: boolean;
  isPending: boolean;
}

export function NotificationFormActions({ isSubmitting, isPending }: NotificationFormActionsProps) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting || isPending}
      className="w-full"
    >
      {isSubmitting || isPending ? (
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
  );
}
