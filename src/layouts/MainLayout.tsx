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
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Bell, Settings, Home, Map, Building, Users, User, BarChart, Brain, Calendar, Package, AlertCircle, FileOutput, FileSpreadsheet, ClipboardList, FileCheck, Briefcase, TrendingUp, BookOpen, Video, MessageSquare, FileText, MapPin, ChevronDown } from 'lucide-react';
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
  subItems?: NavItem[];
}

type NavGroup = {
  label: string;
  items: NavItem[];
}

interface MainLayoutProps {
  children: React.ReactNode;
  role: 'admin' | 'state_head' | 'center_manager' | 'mobilizer' | 
         'candidate' | 'ppc_team' | 'company_hr' | 'mobilization_manager' | 
         'trainer' | 'outreach_admin' | 'accounts_team' | 'audit' | 'counsellor' | 'mis' | 'ppc_admin' | 'poc' | 'director' | 'national-head';
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
      <div className="flex min-h-screen w-full bg-neutral-100">
        <Sidebar className="border-r border-indigo-800 bg-gradient-to-b from-indigo-900 to-violet-900 text-white w-64 flex-shrink-0">
          <SidebarHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white">LNJ Skills</span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            {(role === 'admin' || role === 'state_head') && (
              <div className="px-4 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-indigo-300 ring-2 ring-white/30 shadow-lg">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {window.location.pathname.startsWith('/admin-department') ? 'Administration Department' : formatRoleDisplay(role)}
                    </div>
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
                      const hasSubItems = item.subItems && item.subItems.length > 0;
                      const isSubItemActive = hasSubItems && item.subItems?.some(sub => location.pathname === sub.path);
                      
                      if (hasSubItems) {
                        return (
                          <Collapsible key={item.name} defaultOpen={isSubItemActive} className="group/collapsible">
                            <SidebarMenuItem>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuButton 
                                  className={`hover:bg-indigo-800/70 transition-all duration-200 ${isSubItemActive ? 'bg-indigo-800/90 font-medium' : ''}`}
                                >
                                  {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                                  <span>{item.name}</span>
                                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {item.subItems?.map((subItem) => {
                                    const isSubActive = location.pathname === subItem.path;
                                    return (
                                      <SidebarMenuSubItem key={subItem.name}>
                                        <SidebarMenuSubButton 
                                          asChild 
                                          isActive={isSubActive}
                                          className={`hover:bg-indigo-800/70 transition-all duration-200 ${isSubActive ? 'bg-indigo-800/90 font-medium shadow-md' : ''}`}
                                        >
                                          <Link to={subItem.path} className="flex items-center">
                                            {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                                            <span>{subItem.name}</span>
                                          </Link>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    );
                                  })}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </SidebarMenuItem>
                          </Collapsible>
                        );
                      }
                      
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

        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6 shadow-sm flex-shrink-0">
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
          
          <main className="flex-1 overflow-auto p-6 w-full">
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
    'mobilisation': 'Mobilisation Monitoring',
    'mobilisation-monitoring': 'National Mobilisation Monitoring',
    'state-performance': 'State Performance Analysis',
    'program-health': 'Program Health Overview',
    'targets': 'Target Assignment',
    'national-heads': 'National Heads Management',
    'compliance': 'Compliance & Alerts',
  };
  
  return titleMap[lastSegment] || 'Dashboard';
}

// Function to return navigation items based on role with proper typing
function getNavigationByRole(role: MainLayoutProps['role']): NavGroup[] {
  // Check if this is an admin department page based on the current location
  if (window.location.pathname.startsWith('/admin-department')) {
    return [
      {
        label: 'Administration',
        items: [
          { 
            name: 'Dashboard', 
            path: '/admin-department/dashboard', 
            icon: Home 
          },
          { 
            name: 'Rent Management', 
            path: '/admin-department/rent-management', 
            icon: Building 
          },
          { 
            name: 'Property Management', 
            path: '/admin-department/property-management', 
            icon: Building 
          },
          { 
            name: 'Vendor Management', 
            path: '/admin-department/vendor-management', 
            icon: Users 
          },
          { 
            name: 'Food Vendor Management', 
            path: '/admin-department/food-vendor-management', 
            icon: ({ className }) => <span className={className || ''}>🍽️</span>
          },
          { 
            name: 'Expense Management', 
            path: '/admin-department/expense-management', 
            icon: ({ className }) => <span className={className || ''}>💰</span>
          },
          { 
            name: 'Petty Cash Management', 
            path: '/admin-department/petty-cash-management', 
            icon: ({ className }) => <span className={className || ''}>💳</span>
          },
          { 
            name: 'Purchase Order Management', 
            path: '/admin-department/purchase-order-management', 
            icon: ({ className }) => <span className={className || ''}>📋</span>
          },
          { 
            name: 'Ticket Booking', 
            path: '/admin-department/ticket-booking', 
            icon: ({ className }) => <span className={className || ''}>🎫</span>
          },
          { 
            name: 'Ticket Booking Approval', 
            path: '/admin-department/ticket-booking-approval', 
            icon: ({ className }) => <span className={className || ''}>✅</span>
          },
          { 
            name: 'Reports', 
            path: '/admin-department/reports', 
            icon: BarChart 
          },
        ]
      }
    ];
  }
  
  // This function would return different navigation items based on user role
  if (role === 'admin') {
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
            name: 'Mobilisation Monitoring', 
            path: '/admin/mobilisation', 
            icon: TrendingUp 
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
          { 
            name: 'Profile', 
            path: '/admin/profile', 
            icon: User 
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
  
  if (role === 'director') {
    return [
      {
        label: 'Main',
        items: [
          { name: 'Dashboard', path: '/director/dashboard', icon: Home },
        ]
      },
      {
        label: 'Operations',
        items: [
          { 
            name: 'Target Management', 
            path: '/director/target-management', 
            icon: ({ className }) => <span className={className || ''}>🎯</span>
          },
          { 
            name: 'Mobilisation', 
            path: '/director/mobilisation', 
            icon: Users,
            subItems: [
              { name: 'Mobilisation Monitoring', path: '/director/mobilisation-monitoring', icon: TrendingUp },
              { name: 'Activities Monitoring', path: '/director/activities-monitoring', icon: Calendar },
              { name: 'OFR Monitoring', path: '/director/ofr-monitoring', icon: FileText },
            ]
          },
          { 
            name: 'Training', 
            path: '/director/training', 
            icon: BookOpen,
          },
          { 
            name: 'Placements', 
            path: '/director/placements', 
            icon: Briefcase,
          },
          { 
            name: 'Post Placements', 
            path: '/director/post-placements', 
            icon: TrendingUp,
          },
        ]
      },
      {
        label: 'Settings',
        items: [
          { name: 'Profile', path: '/director/profile', icon: User },
          { name: 'System Settings', path: '/director/settings', icon: Settings },
        ]
      }
    ];
  }
  
  if (role === 'national-head') {
    return [
      {
        label: 'Overview',
        items: [
          { name: 'Dashboard', path: '/national-head/dashboard', icon: Home },
          { name: 'Mobilisation Monitoring', path: '/national-head/mobilisation-monitoring', icon: TrendingUp },
          { name: 'Team & Program Management', path: '/national-head/team-management', icon: Users },
          { name: 'State Performance', path: '/national-head/state-performance', icon: Map },
        ]
      },
      {
        label: 'Management',
        items: [
          { name: 'Target Management', path: '/director/target-management', icon: ({ className }) => <span className={className || ''}>🎯</span> },
          { name: 'State Admins', path: '/national-head/state-admins', icon: Users },
          { name: 'Reports & Scheduler', path: '/national-head/reports', icon: BarChart },
          { name: 'Notifications', path: '/national-head/notifications', icon: Bell },
        ]
      },
      {
        label: 'Settings',
        items: [
          { name: 'Profile', path: '/national-head/profile', icon: User },
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

  if (role === 'mis') {
    return [
      {
        label: 'Main',
        items: [
          { name: 'Dashboard', path: '/mis/dashboard', icon: Home },
          { name: 'Daily Activity Management', path: '/mis/daily-activities', icon: Calendar },
          { name: 'Ready for Migration', path: '/mis/ready-for-migration', icon: Users },
          { name: 'Curriculum Management', path: '/mis/curriculum', icon: BookOpen },
          { name: 'Profile', path: '/mis/profile', icon: User },
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
            name: 'OFR Management', 
            path: '/counsellor/ofr-management', 
            icon: FileText 
          },
          { 
            name: 'Non Interested Candidates', 
            path: '/counsellor/not-interested', 
            icon: ({ className }) => <span className={className || ''}>🚫</span>
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

  if (role === 'candidate') {
    return [
      {
        label: 'Main',
        items: [
          { 
            name: 'Dashboard', 
            path: '/candidate', 
            icon: Home 
          },
          { 
            name: 'My Profile', 
            path: '/candidate/profile', 
            icon: ({ className }) => <span className={className || ''}>👤</span>
          },
          { 
            name: 'Training Progress', 
            path: '/candidate/progress', 
            icon: TrendingUp 
          },
          { 
            name: 'Attendance', 
            path: '/candidate/attendance', 
            icon: Calendar 
          },
        ]
      },
      {
        label: 'Documents & Forms',
        items: [
          { 
            name: 'Documents', 
            path: '/candidate/documents', 
            icon: FileText 
          },
          { 
            name: 'Forms & Applications', 
            path: '/candidate/forms', 
            icon: ClipboardList 
          },
        ]
      },
      {
        label: 'Placement',
        items: [
          { 
            name: 'Job Opportunities', 
            path: '/candidate/jobs', 
            icon: Briefcase 
          },
          { 
            name: 'Placement Status', 
            path: '/candidate/placement', 
            icon: ({ className }) => <span className={className || ''}>🎯</span>
          },
        ]
      }
    ];
  }

  if (role === 'trainer') {
    return [
      {
        label: 'Main',
        items: [
          { 
            name: 'Dashboard', 
            path: '/trainer', 
            icon: Home 
          },
          { 
            name: 'Curriculum Planner', 
            path: '/trainer/curriculum-planner', 
            icon: BookOpen 
          },
          { 
            name: 'Curriculum Schedule', 
            path: '/trainer/curriculum-schedule', 
            icon: Calendar 
          },
          { 
            name: 'Attendance Management', 
            path: '/trainer/attendance-management', 
            icon: Users 
          },
          { 
            name: 'Video Logs', 
            path: '/trainer/video-logs', 
            icon: Video 
          },
        ]
      },
      {
        label: 'Assessment & Feedback',
        items: [
          { 
            name: 'Assessment Evaluation', 
            path: '/trainer/assessment-evaluation', 
            icon: FileCheck 
          },
          { 
            name: 'Feedback & Counselling', 
            path: '/trainer/feedback-management', 
            icon: MessageSquare 
          },
        ]
      },
      {
        label: 'Reports & Profile',
        items: [
          { 
            name: 'Reports & Analytics', 
            path: '/trainer/reports', 
            icon: BarChart 
          },
          { 
            name: 'Profile & Settings', 
            path: '/trainer/profile', 
            icon: ({ className }) => <span className={className || ''}>👤</span>
          },
        ]
      }
    ];
  }

  if (role === 'ppc_admin') {
    return [
      {
        label: 'Main',
        items: [
          { 
            name: 'Dashboard', 
            path: '/ppc-admin/dashboard', 
            icon: Home 
          },
          { 
            name: 'Pre-Placement Compliance', 
            path: '/ppc-admin/pre-placement', 
            icon: FileCheck 
          },
          { 
            name: 'Post-Placement Management', 
            path: '/ppc-admin/post-placement', 
            icon: Building 
          },
        ]
      },
      {
        label: 'Monitoring & Management',
        items: [
          { 
            name: 'POC Management', 
            path: '/ppc-admin/poc-management', 
            icon: Users 
          },
          { 
            name: 'SOS Monitoring', 
            path: '/ppc-admin/sos-monitoring', 
            icon: AlertCircle 
          },
        ]
      },
      {
        label: 'Reports & Profile',
        items: [
          { 
            name: 'Reports & Analytics', 
            path: '/ppc-admin/reports', 
            icon: BarChart 
          },
          { 
            name: 'Profile & Settings', 
            path: '/ppc-admin/profile', 
            icon: ({ className }) => <span className={className || ''}>👤</span>
          },
        ]
      }
    ];
  }

  if (role === 'company_hr') {
    return [
      {
        label: 'Main',
        items: [
          { 
            name: 'Dashboard', 
            path: '/company-hr/dashboard', 
            icon: Home 
          },
          { 
            name: 'Batch Management', 
            path: '/company-hr/batch-management', 
            icon: Users 
          },
          { 
            name: 'Candidate Management', 
            path: '/company-hr/candidate-management', 
            icon: ({ className }) => <span className={className || ''}>👥</span>
          },
        ]
      },
      {
        label: 'Scheduling & Travel',
        items: [
          { 
            name: 'Interview Scheduler', 
            path: '/company-hr/interview-scheduler', 
            icon: Calendar 
          },
          { 
            name: 'Travel Management', 
            path: '/company-hr/travel-management', 
            icon: ({ className }) => <span className={className || ''}>✈️</span>
          },
        ]
      },
      {
        label: 'Reports & Profile',
        items: [
          { 
            name: 'Feedback Management', 
            path: '/company-hr/feedback-management', 
            icon: MessageSquare 
          },
          { 
            name: 'Reports & Analytics', 
            path: '/company-hr/reports', 
            icon: BarChart 
          },
          { 
            name: 'Profile & Settings', 
            path: '/company-hr/profile', 
            icon: ({ className }) => <span className={className || ''}>👤</span>
          },
        ]
      }
    ];
  }

  if (role === 'poc') {
    return [
      {
        label: 'Main',
        items: [
          { 
            name: 'Dashboard', 
            path: '/poc/dashboard', 
            icon: Home 
          },
          { 
            name: 'Visit Management', 
            path: '/poc/visits', 
            icon: Calendar 
          },
          { 
            name: 'SOS Management', 
            path: '/poc/sos', 
            icon: AlertCircle 
          },
        ]
      },
      {
        label: 'Facilitation',
        items: [
          { 
            name: 'Travel Management', 
            path: '/poc/travel', 
            icon: MapPin 
          },
          { 
            name: 'Welfare Facilitation', 
            path: '/poc/welfare', 
            icon: Home 
          },
        ]
      },
      {
        label: 'Reports & Profile',
        items: [
          { 
            name: 'Reports', 
            path: '/poc/reports', 
            icon: BarChart 
          },
          { 
            name: 'Profile', 
            path: '/poc/profile', 
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

export default MainLayout;
