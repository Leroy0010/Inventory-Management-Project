import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Settings,
  ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Demo navigation items
const demoItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/staff", label: "Staff Management", icon: Users },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function SidebarStyleDemo() {
  const [activeItem, setActiveItem] = useState("/");
  const [isExpanded, setIsExpanded] = useState(true);

  const renderNavItem = (item: typeof demoItems[0]) => {
    const isActive = activeItem === item.to;

    return (
      <button
        key={item.to}
        onClick={() => setActiveItem(item.to)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left",
          "relative group",
          // Inactive state styling
          !isActive && [
            "text-slate-300 hover:text-white",
            "hover:bg-slate-700/60 hover:shadow-md hover:scale-[1.02]",
            "hover:border-l-2 hover:border-slate-500"
          ],
          // Active state styling
          isActive && [
            "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg",
            "border-l-4 border-blue-400",
            "font-semibold",
            "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-white before:rounded-r-full",
            "shadow-blue-500/25",
            "scale-[1.02]",
            "ring-2 ring-blue-400/20",
            "backdrop-blur-sm"
          ]
        )}
      >
        <item.icon className="w-5 h-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110" />
        <span className="truncate transition-all duration-200">{item.label}</span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Sidebar Navigation Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click on different items to see the enhanced active state styling.
          </p>
          
          <div className="bg-slate-800 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Navigation Items</h4>
            {demoItems.map(renderNavItem)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Active State Features:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Gradient background (blue to purple)</li>
                <li>• Left border indicator</li>
                <li>• White accent line</li>
                <li>• Subtle glow effect</li>
                <li>• Slight scale increase</li>
                <li>• Enhanced shadows</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Hover State Features:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Smooth color transitions</li>
                <li>• Icon scaling animation</li>
                <li>• Subtle background change</li>
                <li>• Left border preview</li>
                <li>• Shadow enhancement</li>
                <li>• Scale animation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
