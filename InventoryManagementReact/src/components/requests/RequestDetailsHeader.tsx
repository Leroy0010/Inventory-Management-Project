import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Package } from 'lucide-react';
import type { RequestResponseDto } from '@/types/request';

interface RequestDetailsHeaderProps {
  request: RequestResponseDto;
}

export function RequestDetailsHeader({ request }: RequestDetailsHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center space-x-2">
        <Package className="h-5 w-5" />
        <span>Request Details #{request.id}</span>
      </DialogTitle>
      <DialogDescription>
        View and manage request information
      </DialogDescription>
    </DialogHeader>
  );
}
