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
import { Bell, Settings, Home, Map, Building, Users, BarChart, Brain, Calendar, Package, AlertCircle, FileOutput, FileSpreadsheet, ClipboardList, FileCheck, Briefcase, TrendingUp } from 'lucide-react';
import { NotificationCenter } from '@/components/common/NotificationCenter';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useLocation, Link } from 'react-router-dom';

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
         'trainer' | 'outreach_admin' | 'accounts_team' | 'audit' | 'counsellor' | 'mis_admin';
  title?: string; // Optional title override
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, role, title }) => {
  const [notifications, setNotifications] = useState<number>(5); // Example notifications count
  const location = useLocation();
  
  // Get navigation items based on role
  const navItems = getNavigationByRole(role);
  
  // Determine page title from route if not provided
  const pageTitle = title || getPageTitle(location.pathname);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-neutral-100">
        <Sidebar className="border-r border-indigo-800 bg-gradient-to-b from-indigo-900 to-violet-900 text-white">
          <SidebarHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white">LNJ Skills</span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            {(role === 'super_admin' || role === 'state_head') && (
              <div className="px-4 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-indigo-300 ring-2 ring-white/30 shadow-lg">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{formatRoleDisplay(role)}</div>
                    <div className="text-sm text-indigo-200">Maharashtra</div>
                  </div>
                </div>
              </div>
            )}

            {navItems.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel className="text-indigo-200">{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isActive}
                            className={`hover:bg-indigo-800/70 transition-all duration-200 ${isActive ? 'bg-indigo-800/90 font-medium shadow-md' : ''}`}
                          >
                            <Link to={item.path} className="flex items-center">
                              {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                              <span>{item.name}</span>
                              {item.phase && (
                                <span className="ml-auto rounded bg-indigo-800/80 px-1.5 py-0.5 text-xs text-white shadow-inner">
                                  Phase {item.phase}
                                </span>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          
          <SidebarFooter className="mt-auto border-t border-indigo-800/50 p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="hover:bg-indigo-800/70 transition-all duration-200 w-full"
                  asChild
                >
                  <Link to="/" className="flex items-center">
                    <span className="mr-2">🚪</span>
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6 shadow-sm">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="ml-4 text-xl font-semibold">{pageTitle}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              
              <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-indigo-200 shadow-sm">
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

// Helper function to format role display
function formatRoleDisplay(role: string): string {
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to get page title from URL path
function getPageTitle(path: string): string {
  const segments = path.split('/');
  const lastSegment = segments[segments.length - 1];
  
  // Map specific routes to titles
  const titleMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'state-overview': 'State Overview',
    'center-performance': 'Center Performance',
    'trainer-summary': 'Trainer Summary',
    'reports': 'Reports',
    'dropout-insights': 'Dropout Insights',
    'ppc-schedule': 'PPC Schedule Monitor',
    'batch-tracker': 'Batch Tracker',
    'sos-tracker': 'SOS Tracker',
    'export-reports': 'Export Reports',
    'attendance': 'Attendance Module',
  };
  
  return titleMap[lastSegment] || 'Dashboard';
}

// Function to return navigation items based on role with proper typing
function getNavigationByRole(role: MainLayoutProps['role']): NavGroup[] {
  // This function would return different navigation items based on user role
  if (role === 'super_admin') {
    return [
      {
        label: 'Platform',
        items: [
          { 
            name: 'Dashboard', 
            path: '/admin/dashboard', 
            icon: Home 
          },
          { 
            name: 'User & Role Management', 
            path: '/admin/users', 
            icon: Users 
          },
          { 
            name: 'Master Data Management', 
            path: '/admin/master-data', 
            icon: ({ className }) => <span className={className || ''}>🗂️</span> 
          },
          { 
            name: 'Document Generator', 
            path: '/admin/documents', 
            icon: ({ className }) => <span className={className || ''}>🧾</span> 
          },
          { 
            name: 'Batch Management', 
            path: '/admin/batches', 
            icon: Package 
          },
          { 
            name: 'Candidate Directory', 
            path: '/admin/candidates', 
            icon: ({ className }) => <span className={className || ''}>🔍</span> 
          },
          { 
            name: 'Reports & Analytics', 
            path: '/admin/reports', 
            icon: BarChart 
          },
          { 
            name: 'Video Log Manager', 
            path: '/admin/videos', 
            icon: ({ className }) => <span className={className || ''}>🎥</span> 
          },
        ]
      },
      {
        label: 'Advanced Features',
        items: [
          { 
            name: 'AI Dropout Engine', 
            path: '/admin/ai-dropout', 
            icon: Brain,
            phase: 3 
          },
          { 
            name: 'Quality Tracker', 
            path: '/admin/quality', 
            icon: ({ className }) => <span className={className || ''}>🧪</span>,
            phase: 3 
          },
          { 
            name: 'SOS & Escalation Tracker', 
            path: '/admin/sos', 
            icon: AlertCircle 
          },
          { 
            name: 'Data Export Hub', 
            path: '/admin/export', 
            icon: FileOutput 
          },
          { 
            name: 'System Settings', 
            path: '/admin/settings', 
            icon: Settings 
          },
        ]
      }
    ];
  }
  
  if (role === 'state_head') {
    return [
      {
        label: 'Main',
        items: [
          { 
            name: 'Dashboard', 
            path: '/state-head/dashboard', 
            icon: Home 
          },
          { 
            name: 'State Overview', 
            path: '/state-head/state-overview', 
            icon: Map 
          },
          { 
            name: 'Center Performance', 
            path: '/state-head/center-performance', 
            icon: Building 
          },
          { 
            name: 'Trainer Summary', 
            path: '/state-head/trainer-summary', 
            icon: Users 
          },
          { 
            name: 'Reports', 
            path: '/state-head/reports', 
            icon: BarChart 
          },
          { 
            name: 'Attendance Module', 
            path: '/state-head/attendance', 
            icon: ({ className }) => <span className={className || ''}>📋</span> 
          },
        ]
      },
      {
        label: 'Monitoring',
        items: [
          { 
            name: 'Dropout Insights', 
            path: '/state-head/dropout-insights', 
            icon: Brain,
            phase: 3
          },
          { 
            name: 'PPC Schedule Monitor', 
            path: '/state-head/ppc-schedule', 
            icon: Calendar,
            phase: 2 
          },
          { 
            name: 'Batch Tracker', 
            path: '/state-head/batch-tracker', 
            icon: Package 
          },
          { 
            name: 'SOS Tracker', 
            path: '/state-head/sos-tracker', 
            icon: AlertCircle 
          },
          { 
            name: 'Export Reports', 
            path: '/state-head/export-reports', 
            icon: FileOutput 
          },
        ]
      }
    ];
  }
  
  if (role === 'center_manager') {
    return [
      {
        label: 'Main',
        items: [
          { name: 'Dashboard', path: '/center-manager/dashboard', icon: Home },
          { name: 'Enrollment & Batch', path: '/center-manager/enrollment', icon: Users },
          { name: 'Counselling Verification', path: '/center-manager/counselling', icon: FileCheck },
          { name: 'Document Compliance', path: '/center-manager/documents', icon: ({ className }) => <span className={className || ''}>📋</span> },
          { name: 'Mandatory Sheets', path: '/center-manager/mandatory-sheets', icon: FileSpreadsheet },
        ]
      },
      {
        label: 'Training & Attendance',
        items: [
          { name: 'Video Logs & Orientation', path: '/center-manager/video-logs', icon: ({ className }) => <span className={className || ''}>🎥</span> },
          { name: 'Attendance Module', path: '/center-manager/attendance', icon: ClipboardList },
        ]
      },
      {
        label: 'Placement & Travel',
        items: [
          { name: 'Placement Coordination', path: '/center-manager/placement', icon: Briefcase },
          { name: 'Travel Letter Management', path: '/center-manager/travel-letters', icon: ({ className }) => <span className={className || ''}>✈️</span> },
          { name: 'Post-Placement Tracking', path: '/center-manager/post-placement', icon: TrendingUp },
        ]
      },
      {
        label: 'Reports & Profile',
        items: [
          { name: 'Reports & Exports', path: '/center-manager/reports', icon: BarChart },
          { name: 'Profile & Settings', path: '/center-manager/profile', icon: ({ className }) => <span className={className || ''}>👤</span> },
        ]
      }
    ];
  }

  if (role === 'mis_admin') {
    return [
      {
        label: 'Main',
        items: [
          { name: 'Dashboard', path: '/mis-admin/dashboard', icon: Home },
          { name: 'User & Role Management', path: '/mis-admin/users', icon: Users },
          { name: 'Lookup & Configuration', path: '/mis-admin/lookups', icon: Settings },
        ]
      },
      {
        label: 'Data Management',
        items: [
          { name: 'Data Sync Queue', path: '/mis-admin/data-sync', icon: ({ className }) => <span className={className || ''}>🔄</span> },
          { name: 'Data Correction', path: '/mis-admin/data-correction', icon: ({ className }) => <span className={className || ''}>🔧</span> },
          { name: 'Archive & Backup', path: '/mis-admin/backup', icon: ({ className }) => <span className={className || ''}>💾</span> },
        ]
      },
      {
        label: 'Reporting & MIS',
        items: [
          { name: 'Reports Library', path: '/mis-admin/reports', icon: BarChart },
          { name: 'Custom Report Builder', path: '/mis-admin/report-builder', icon: ({ className }) => <span className={className || ''}>📊</span> },
          { name: 'Report Scheduling', path: '/mis-admin/schedule-reports', icon: Calendar },
        ]
      },
      {
        label: 'System',
        items: [
          { name: 'Notifications & Alerts', path: '/mis-admin/alerts', icon: AlertCircle },
          { name: 'Audit & Compliance', path: '/mis-admin/audit', icon: ({ className }) => <span className={className || ''}>🔍</span> },
          { name: 'API & Integration', path: '/mis-admin/api-management', icon: ({ className }) => <span className={className || ''}>🔗</span> },
          { name: 'Profile & Settings', path: '/mis-admin/profile', icon: ({ className }) => <span className={className || ''}>👤</span> },
        ]
      }
    ];
  }

  if (role === 'counsellor') {
    return [
      {
        label: 'Main',
        items: [
          { 
            name: 'Dashboard', 
            path: '/counsellor/dashboard', 
            icon: Home 
          },
          { 
            name: 'Candidate Management', 
            path: '/counsellor/candidates', 
            icon: Users 
          },
          { 
            name: 'Pending Tasks', 
            path: '/counsellor/pending-tasks', 
            icon: ClipboardList 
          },
        ]
      },
      {
        label: 'Documentation',
        items: [
          { 
            name: 'Mandatory Sheets', 
            path: '/counsellor/mandatory-sheets', 
            icon: FileSpreadsheet 
          },
          { 
            name: 'Parent Consent', 
            path: '/counsellor/parent-consent', 
            icon: ({ className }) => <span className={className || ''}>📝</span>
          },
          { 
            name: 'Video Logs', 
            path: '/counsellor/video-logs', 
            icon: ({ className }) => <span className={className || ''}>🎥</span>
          },
          { 
            name: 'Reports & Analytics', 
            path: '/counsellor/reports', 
            icon: BarChart 
          },
        ]
      },
      {
        label: 'Account',
        items: [
          { 
            name: 'My Profile', 
            path: '/counsellor/profile', 
            icon: ({ className }) => <span className={className || ''}>👤</span>
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
          icon: Home 
        },
      ]
    }
  ];
}
