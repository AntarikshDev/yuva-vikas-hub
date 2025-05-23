
import React, { useState } from 'react';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define types for mobile navigation items
type NavIcon = React.FC<{ className?: string }>;

interface MobileNavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
  badge?: number;
  phase?: 1 | 2 | 3;
}

interface MobileAppLayoutProps {
  children: React.ReactNode;
  role: 'mobilizer' | 'candidate';
  title: string;
}

export const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({
  children,
  role,
  title,
}) => {
  // Mock function to get navigation items based on role
  const getNavItems = (role: 'mobilizer' | 'candidate') => {
    if (role === 'mobilizer') {
      return [
        {
          label: 'Home',
          icon: <span>🏠</span>,
          path: '/mobilizer',
          isActive: true,
        },
        {
          label: 'New',
          icon: <span>➕</span>,
          path: '/mobilizer/new',
          isActive: false,
        },
        {
          label: 'List',
          icon: <span>📋</span>,
          path: '/mobilizer/list',
          isActive: false,
        },
        {
          label: 'Videos',
          icon: <span>🎥</span>,
          path: '/mobilizer/videos',
          isActive: false,
          phase: 2 as const,
        },
        {
          label: 'Profile',
          icon: <span>👤</span>,
          path: '/mobilizer/profile',
          isActive: false,
        },
      ];
    } else {
      return [
        {
          label: 'Home',
          icon: <span>🏠</span>,
          path: '/candidate',
          isActive: true,
        },
        {
          label: 'Status',
          icon: <span>📋</span>,
          path: '/candidate/status',
          isActive: false,
        },
        {
          label: 'Docs',
          icon: <span>📂</span>,
          path: '/candidate/docs',
          isActive: false,
        },
        {
          label: 'Videos',
          icon: <span>🎥</span>,
          path: '/candidate/videos',
          isActive: false,
        },
        {
          label: 'Help',
          icon: <span>🆘</span>,
          path: '/candidate/help',
          isActive: false,
        },
      ];
    }
  };

  const [notifications] = useState(3); // Mock notification count
  const navItems = getNavItems(role);

  const handleNavItemClick = (path: string) => {
    console.log(`Navigating to: ${path}`);
    // In a real app, you would use router.push(path) or similar
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="mr-2 h-8 w-8" />
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-error-500 text-[10px] text-white">
                  {notifications}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-4 pb-20">
        {children}
      </main>
      
      <MobileBottomNav
        items={navItems}
        onItemClick={handleNavItemClick}
      />
    </div>
  );
};
