import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, BarChart3 } from 'lucide-react';
import { UserActivitySummary } from './UserActivitySummary';
import { UserActivityReportTable } from './UserActivityReportTable';
import type { UserActivityReportResponseDto } from '@/types/userActivityReport';

interface UserActivityReportContentProps {
  reportData: UserActivityReportResponseDto | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onGenerateReport: () => void;
  isLoading: boolean;
}

export function UserActivityReportContent({
  reportData,
  activeTab,
  onTabChange,
  onGenerateReport,
  isLoading,
}: UserActivityReportContentProps) {
  if (!reportData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No Report Data
          </h3>
          <p className="text-muted-foreground text-center mb-4">
            Configure your filters and generate a report to view user activity data.
          </p>
          <Button
            onClick={onGenerateReport}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          value="overview"
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="details"
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Details
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <UserActivitySummary summary={reportData.summary} />
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        <UserActivityReportTable
          data={reportData.userActivities}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
}
