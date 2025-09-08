import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Application Settings
          </CardTitle>
          <CardDescription>
            Configure your inventory management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <SettingsIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Settings panel coming soon</p>
            <p className="text-sm">This feature will be implemented in the next phase</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
