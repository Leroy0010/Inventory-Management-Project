import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserActivityReportHeaderProps {
  onRefresh: () => void;
  onExport?: () => void;
  isLoading: boolean;
  canExport: boolean;
  hasData: boolean;
}

export function UserActivityReportHeader({
  onRefresh,
  onExport,
  isLoading,
  canExport,
  hasData,
}: UserActivityReportHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          User Activity Report
        </h1>
        <p className="text-muted-foreground">
          Monitor user activity, performance metrics, and request patterns
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={cn(
              'h-4 w-4',
              isLoading && 'animate-spin'
            )}
          />
          Refresh
        </Button>
        {canExport && hasData && (
          <Button
            onClick={onExport}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>
    </div>
  );
}
