
import React, { useState } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarProvider,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useLocation } from 'react-router-dom';

// Define proper types for navigation items
type NavIcon = React.FC<{ className?: string }>;

interface NavItem {
  name: string;
  path: string;
  icon?: NavIcon;
  phase?: number;
}

type NavGroup = {
  label: string;
  items: NavItem[];
}

interface MainLayoutProps {
  children: React.ReactNode;
  role: 'super_admin' | 'state_head' | 'center_manager' | 'mobilizer' | 
         'candidate' | 'ppc_team' | 'company_hr' | 'mobilization_manager' | 
         'trainer' | 'outreach_admin' | 'accounts_team' | 'audit';
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, role }) => {
  const [notifications, setNotifications] = useState<number>(5); // Example notifications count
  const location = useLocation();
  
  // Get navigation items based on role
  const navItems = getNavigationByRole(role);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-neutral-100">
        <Sidebar className="border-r border-purple-800 bg-purple-700 text-white">
          <SidebarHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold">LNJ Skills</span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            {role === 'super_admin' && (
              <div className="px-4 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-purple-300">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="font-medium">Super Admin</div>
                    <div className="text-sm text-purple-200">Super Admin</div>
                  </div>
                </div>
              </div>
            )}

            {navItems.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel className="text-purple-200">{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isActive}
                            className={`hover:bg-purple-600 ${isActive ? 'bg-purple-800 font-medium' : ''}`}
                          >
                            <a href={item.path} className="flex items-center">
                              {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                              <span>{item.name}</span>
                              {item.phase && (
                                <span className="ml-auto rounded bg-purple-900 px-1.5 py-0.5 text-xs text-white">
                                  Phase {item.phase}
                                </span>
                              )}
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          
          <SidebarFooter className="mt-auto border-t border-purple-800 p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="hover:bg-purple-600 w-full"
                  asChild
                >
                  <a href="/logout" className="flex items-center">
                    <span className="mr-2">🚪</span>
                    <span>Logout</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="ml-4 text-xl font-semibold">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {notifications}
                  </span>
                )}
              </Button>
              
              <div className="h-8 w-8 overflow-hidden rounded-full">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="h-full w-full object-cover" />
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
        
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

// Helper function to format role for display
function formatRoleDisplay(role: string): string {
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Function to return navigation items based on role with proper typing
function getNavigationByRole(role: MainLayoutProps['role']): NavGroup[] {
  // This function would return different navigation items based on user role
  if (role === 'super_admin') {
    return [
      {
        label: '',
        items: [
          { 
            name: 'Dashboard', 
            path: '/admin/dashboard', 
            icon: ({ className }) => <span className={className || ''}>🏠</span> 
          },
          { 
            name: 'Profile', 
            path: '/admin/profile', 
            icon: ({ className }) => <span className={className || ''}>👤</span> 
          },
          { 
            name: 'Users', 
            path: '/admin/users', 
            icon: ({ className }) => <span className={className || ''}>👥</span> 
          },
          { 
            name: 'States', 
            path: '/admin/states', 
            icon: ({ className }) => <span className={className || ''}>🏛️</span> 
          },
          { 
            name: 'Centers', 
            path: '/admin/centers', 
            icon: ({ className }) => <span className={className || ''}>🏢</span> 
          },
          { 
            name: 'Reports', 
            path: '/admin/reports', 
            icon: ({ className }) => <span className={className || ''}>📊</span> 
          },
          { 
            name: 'Settings', 
            path: '/admin/settings', 
            icon: ({ className }) => <span className={className || ''}>⚙️</span> 
          },
        ]
      }
    ];
  }
  
  // Return default navigation for other roles (would be customized for each)
  return [
    {
      label: 'Main',
      items: [
        { 
          name: 'Dashboard', 
          path: '/dashboard', 
          icon: ({ className }) => <span className={className || ''}>🏠</span> 
        },
      ]
    }
  ];
}
