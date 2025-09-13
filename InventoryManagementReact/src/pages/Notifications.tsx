import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Send, Settings } from 'lucide-react';
import { NotificationList } from '@/components/notifications/NotificationList';
import { GeneralNotificationForm } from '@/components/notifications/GeneralNotificationForm';
import { useWebSocketNotification } from '@/hooks/useWebSocketNotification';
import { useUnreadCount } from '@/hooks/queries/useNotification';

export default function Notifications() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('list');

  // Auto-select send tab if specified in URL parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'send') 
      setActiveTab('send');
    else 
        setActiveTab('list');
    
  }, [searchParams]);
  const { connectionState } = useWebSocketNotification();
  const { data: unreadCount = 0 } = useUnreadCount();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">
          Manage your notifications and send general notifications to users.
        </p>
        
        {/* Connection Status */}
        <div className="mt-4 flex items-center gap-2">
          <div 
            className={`w-2 h-2 rounded-full ${
              connectionState.connected 
                ? 'bg-green-500' 
                : connectionState.connecting 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-gray-600">
            {connectionState.connected 
              ? 'Real-time notifications enabled' 
              : connectionState.connecting 
                ? 'Connecting...' 
                : 'Real-time notifications disabled'
            }
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            All Notifications
            {unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send Notification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <NotificationList />
        </TabsContent>

        <TabsContent value="send" className="space-y-6">
          <GeneralNotificationForm 
            onSuccess={() => {
              // Optionally switch to list tab after successful send
              setActiveTab('list');
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}