import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeTest() {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Theme Toggle Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Current theme: <span className="font-medium">{theme}</span>
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('light')}
            className="flex items-center gap-2"
          >
            <Sun className="w-4 h-4" />
            Light
          </Button>
          
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('dark')}
            className="flex items-center gap-2"
          >
            <Moon className="w-4 h-4" />
            Dark
          </Button>
          
          <Button
            variant={theme === 'system' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('system')}
            className="flex items-center gap-2"
          >
            <Monitor className="w-4 h-4" />
            System
          </Button>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm">
            This card should change appearance based on the selected theme.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
