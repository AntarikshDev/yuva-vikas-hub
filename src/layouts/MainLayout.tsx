
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
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';

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
  
  // Get navigation items based on role
  const navItems = getNavigationByRole(role);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-neutral-100">
        <Sidebar className="border-r border-neutral-200">
          <SidebarHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/logo.svg" alt="Skill Hub Logo" className="h-10 w-10" />
                <span className="text-lg font-semibold">Skill Hub</span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            {navItems.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                          <a href={item.path} className="flex items-center">
                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                            <span>{item.name}</span>
                            {item.phase && (
                              <span className="ml-auto rounded bg-primary-100 px-1.5 py-0.5 text-xs text-primary-800">
                                Phase {item.phase}
                              </span>
                            )}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          
          <SidebarFooter className="p-4">
            <div className="text-sm text-neutral-500">
              © 2025 Skill Development Hub
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6">
            <SidebarTrigger />
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-error-500 text-xs text-white">
                    {notifications}
                  </span>
                )}
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-primary-200 p-2">
                  <span className="text-sm font-medium text-primary-800">
                    {role === 'super_admin' ? 'SA' : role === 'state_head' ? 'SH' : 'CM'}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium">{getUserName(role)}</div>
                  <div className="text-xs text-neutral-500">{formatRoleDisplay(role)}</div>
                </div>
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

// Mock function to return user name based on role
function getUserName(role: string): string {
  const nameMappings: Record<string, string> = {
    'super_admin': 'Admin User',
    'state_head': 'Anita Sharma',
    'center_manager': 'Rajesh Kumar',
    'mobilizer': 'Sunil Patel',
    'candidate': 'Preeti Verma',
    'ppc_team': 'Dinesh Gupta',
    'company_hr': 'Meera Iyer',
    'mobilization_manager': 'Ajay Singh',
    'trainer': 'Deepika Shah',
    'outreach_admin': 'Vivek Reddy',
    'accounts_team': 'Rohit Malhotra',
    'audit': 'Kiran Nair'
  };
  
  return nameMappings[role] || 'User';
}

// Function to return navigation items based on role with proper typing
function getNavigationByRole(role: MainLayoutProps['role']): NavGroup[] {
  // This function would return different navigation items based on user role
  // For now, let's return a basic structure for Super Admin
  if (role === 'super_admin') {
    return [
      {
        label: 'Main',
        items: [
          { 
            name: 'Dashboard', 
            path: '/admin/dashboard', 
            icon: ({ className }) => <span className={className}>🏠</span> 
          },
          { 
            name: 'User & Role Management', 
            path: '/admin/users', 
            icon: ({ className }) => <span className={className}>👤</span> 
          },
          { 
            name: 'Master Data Management', 
            path: '/admin/master-data', 
            icon: ({ className }) => <span className={className}>🗂️</span> 
          },
        ]
      },
      {
        label: 'Operations',
        items: [
          { 
            name: 'Document Generator', 
            path: '/admin/documents', 
            icon: ({ className }) => <span className={className}>🧾</span> 
          },
          { 
            name: 'Batch Management', 
            path: '/admin/batches', 
            icon: ({ className }) => <span className={className}>📦</span> 
          },
          { 
            name: 'Candidate Directory', 
            path: '/admin/candidates', 
            icon: ({ className }) => <span className={className}>🔍</span> 
          },
          { 
            name: 'Reports & Analytics', 
            path: '/admin/reports', 
            icon: ({ className }) => <span className={className}>📊</span> 
          },
          { 
            name: 'Video Log Manager', 
            path: '/admin/video-logs', 
            icon: ({ className }) => <span className={className}>🎥</span> 
          },
        ]
      },
      {
        label: 'Advanced',
        items: [
          { 
            name: 'AI Dropout Engine', 
            path: '/admin/ai-dropout', 
            icon: ({ className }) => <span className={className}>🧠</span>, 
            phase: 3 
          },
          { 
            name: 'Quality Tracker', 
            path: '/admin/quality', 
            icon: ({ className }) => <span className={className}>🧪</span>, 
            phase: 3 
          },
          { 
            name: 'SOS & Escalation Tracker', 
            path: '/admin/sos', 
            icon: ({ className }) => <span className={className}>🆘</span> 
          },
          { 
            name: 'Data Export Hub', 
            path: '/admin/export', 
            icon: ({ className }) => <span className={className}>📤</span> 
          },
          { 
            name: 'System Settings', 
            path: '/admin/settings', 
            icon: ({ className }) => <span className={className}>⚙️</span> 
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
          icon: ({ className }) => <span className={className}>🏠</span> 
        },
      ]
    }
  ];
}
