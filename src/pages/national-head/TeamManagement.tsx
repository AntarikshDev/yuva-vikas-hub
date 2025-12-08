import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  Building2, 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  ChevronRight,
  UserPlus,
  UserMinus,
  RefreshCw,
  Calendar,
  Clock,
  History,
  AlertCircle
} from 'lucide-react';
import { TeamHierarchyTree } from '@/components/team-management/TeamHierarchyTree';
import { ManpowerSummaryCards } from '@/components/team-management/ManpowerSummaryCards';
import { RoleAssignmentDialog } from '@/components/team-management/RoleAssignmentDialog';
import { AssignmentHistoryDialog } from '@/components/team-management/AssignmentHistoryDialog';

// Mock data for programs and projects
const mockPrograms = [
  { id: 'prog-1', name: 'DDU-GKY Maharashtra' },
  { id: 'prog-2', name: 'DDU-GKY Karnataka' },
  { id: 'prog-3', name: 'PMKVY Bihar' },
];

const mockProjects = [
  { id: 'proj-1', name: 'Work Order 2024-001', programId: 'prog-1' },
  { id: 'proj-2', name: 'Work Order 2024-002', programId: 'prog-1' },
  { id: 'proj-3', name: 'Work Order 2024-003', programId: 'prog-2' },
];

const mockStates = [
  { id: 'state-1', name: 'Jharkhand' },
  { id: 'state-2', name: 'Maharashtra' },
  { id: 'state-3', name: 'Karnataka' },
];

const mockCentres = [
  { 
    id: 'centre-1', 
    name: 'Ranchi Training Centre', 
    centreId: 'RTC-001',
    programId: 'prog-1',
    projectId: 'proj-1',
    stateId: 'state-1',
    manpowerRequired: 15,
    manpowerAssigned: 12,
  },
  { 
    id: 'centre-2', 
    name: 'Dhanbad Skill Development Centre', 
    centreId: 'DSDC-002',
    programId: 'prog-1',
    projectId: 'proj-1',
    stateId: 'state-1',
    manpowerRequired: 12,
    manpowerAssigned: 10,
  },
  { 
    id: 'centre-3', 
    name: 'Jamshedpur Training Hub', 
    centreId: 'JTH-003',
    programId: 'prog-1',
    projectId: 'proj-1',
    stateId: 'state-1',
    manpowerRequired: 14,
    manpowerAssigned: 14,
  },
];

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignmentStartDate: string;
  assignmentEndDate: string | null;
  isCurrentlyAssigned: boolean;
}

export interface RoleNode {
  id: string;
  role: string;
  roleDisplayName: string;
  currentAssignee: TeamMember | null;
  pastAssignees: TeamMember[];
  children: RoleNode[];
}

// Mock hierarchy data per centre
const mockHierarchyByCentre: Record<string, RoleNode> = {
  'centre-1': {
    id: 'sh-ranchi',
    role: 'state_head',
    roleDisplayName: 'State Head',
    currentAssignee: {
      id: 'emp-sh-1',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@lnj.com',
      phone: '+91 9876543210',
      assignmentStartDate: '2024-01-01',
      assignmentEndDate: null,
      isCurrentlyAssigned: true,
    },
    pastAssignees: [],
    children: [
      {
        id: 'sa-ranchi',
        role: 'state_admin',
        roleDisplayName: 'State Admin',
        currentAssignee: {
          id: 'emp-sa-1',
          name: 'Priya Sharma',
          email: 'priya.sharma@lnj.com',
          phone: '+91 9876543212',
          assignmentStartDate: '2024-02-01',
          assignmentEndDate: null,
          isCurrentlyAssigned: true,
        },
        pastAssignees: [],
        children: [
          {
            id: 'mis-ranchi',
            role: 'mis',
            roleDisplayName: 'MIS',
            currentAssignee: {
              id: 'emp-mis-r1',
              name: 'Amit Patel',
              email: 'amit.patel@lnj.com',
              phone: '+91 9876543213',
              assignmentStartDate: '2024-03-01',
              assignmentEndDate: null,
              isCurrentlyAssigned: true,
            },
            pastAssignees: [],
            children: [],
          },
          {
            id: 'counsellor-ranchi',
            role: 'counsellor',
            roleDisplayName: 'Counsellor',
            currentAssignee: {
              id: 'emp-coun-r1',
              name: 'Kavita Singh',
              email: 'kavita.singh@lnj.com',
              phone: '+91 9876543222',
              assignmentStartDate: '2024-02-15',
              assignmentEndDate: null,
              isCurrentlyAssigned: true,
            },
            pastAssignees: [],
            children: [],
          },
          {
            id: 'cm-ranchi',
            role: 'centre_manager',
            roleDisplayName: 'Centre Manager',
            currentAssignee: {
              id: 'emp-cm-r1',
              name: 'Sunita Devi',
              email: 'sunita.devi@lnj.com',
              phone: '+91 9876543214',
              assignmentStartDate: '2024-01-15',
              assignmentEndDate: null,
              isCurrentlyAssigned: true,
            },
            pastAssignees: [],
            children: [
              {
                id: 'mm-ranchi-1',
                role: 'mobiliser_manager',
                roleDisplayName: 'Mobiliser Manager',
                currentAssignee: {
                  id: 'emp-mm-r1',
                  name: 'Vikram Singh',
                  email: 'vikram.singh@lnj.com',
                  phone: '+91 9876543215',
                  assignmentStartDate: '2024-02-01',
                  assignmentEndDate: null,
                  isCurrentlyAssigned: true,
                },
                pastAssignees: [],
                children: [
                  {
                    id: 'mob-ranchi-1',
                    role: 'mobiliser',
                    roleDisplayName: 'Mobiliser',
                    currentAssignee: {
                      id: 'emp-mob-r1',
                      name: 'Rahul Verma',
                      email: 'rahul.verma@lnj.com',
                      phone: '+91 9876543216',
                      assignmentStartDate: '2024-03-01',
                      assignmentEndDate: null,
                      isCurrentlyAssigned: true,
                    },
                    pastAssignees: [],
                    children: [],
                  },
                  {
                    id: 'mob-ranchi-2',
                    role: 'mobiliser',
                    roleDisplayName: 'Mobiliser',
                    currentAssignee: {
                      id: 'emp-mob-r2',
                      name: 'Neha Gupta',
                      email: 'neha.gupta@lnj.com',
                      phone: '+91 9876543217',
                      assignmentStartDate: '2024-03-15',
                      assignmentEndDate: null,
                      isCurrentlyAssigned: true,
                    },
                    pastAssignees: [],
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  'centre-2': {
    id: 'sh-dhanbad',
    role: 'state_head',
    roleDisplayName: 'State Head',
    currentAssignee: {
      id: 'emp-sh-1',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@lnj.com',
      phone: '+91 9876543210',
      assignmentStartDate: '2024-01-01',
      assignmentEndDate: null,
      isCurrentlyAssigned: true,
    },
    pastAssignees: [],
    children: [
      {
        id: 'sa-dhanbad',
        role: 'state_admin',
        roleDisplayName: 'State Admin',
        currentAssignee: {
          id: 'emp-sa-1',
          name: 'Priya Sharma',
          email: 'priya.sharma@lnj.com',
          phone: '+91 9876543212',
          assignmentStartDate: '2024-02-01',
          assignmentEndDate: null,
          isCurrentlyAssigned: true,
        },
        pastAssignees: [],
        children: [
          {
            id: 'mis-dhanbad',
            role: 'mis',
            roleDisplayName: 'MIS',
            currentAssignee: {
              id: 'emp-mis-d1',
              name: 'Sanjay Mishra',
              email: 'sanjay.mishra@lnj.com',
              phone: '+91 9876543230',
              assignmentStartDate: '2024-03-01',
              assignmentEndDate: null,
              isCurrentlyAssigned: true,
            },
            pastAssignees: [],
            children: [],
          },
          {
            id: 'counsellor-dhanbad',
            role: 'counsellor',
            roleDisplayName: 'Counsellor',
            currentAssignee: {
              id: 'emp-coun-d1',
              name: 'Meera Kumari',
              email: 'meera.kumari@lnj.com',
              phone: '+91 9876543231',
              assignmentStartDate: '2024-02-20',
              assignmentEndDate: null,
              isCurrentlyAssigned: true,
            },
            pastAssignees: [],
            children: [],
          },
          {
            id: 'cm-dhanbad',
            role: 'centre_manager',
            roleDisplayName: 'Centre Manager',
            currentAssignee: {
              id: 'emp-cm-d1',
              name: 'Ramesh Prasad',
              email: 'ramesh.prasad@lnj.com',
              phone: '+91 9876543232',
              assignmentStartDate: '2024-01-20',
              assignmentEndDate: null,
              isCurrentlyAssigned: true,
            },
            pastAssignees: [
              {
                id: 'emp-cm-d-prev',
                name: 'Anil Kumar',
                email: 'anil.kumar@lnj.com',
                phone: '+91 9876543240',
                assignmentStartDate: '2023-06-01',
                assignmentEndDate: '2024-01-19',
                isCurrentlyAssigned: false,
              }
            ],
            children: [
              {
                id: 'mm-dhanbad-1',
                role: 'mobiliser_manager',
                roleDisplayName: 'Mobiliser Manager',
                currentAssignee: {
                  id: 'emp-mm-d1',
                  name: 'Suresh Yadav',
                  email: 'suresh.yadav@lnj.com',
                  phone: '+91 9876543233',
                  assignmentStartDate: '2024-02-01',
                  assignmentEndDate: null,
                  isCurrentlyAssigned: true,
                },
                pastAssignees: [],
                children: [
                  {
                    id: 'mob-dhanbad-1',
                    role: 'mobiliser',
                    roleDisplayName: 'Mobiliser',
                    currentAssignee: {
                      id: 'emp-mob-d1',
                      name: 'Pankaj Sharma',
                      email: 'pankaj.sharma@lnj.com',
                      phone: '+91 9876543234',
                      assignmentStartDate: '2024-03-01',
                      assignmentEndDate: null,
                      isCurrentlyAssigned: true,
                    },
                    pastAssignees: [],
                    children: [],
                  },
                  {
                    id: 'mob-dhanbad-2',
                    role: 'mobiliser',
                    roleDisplayName: 'Mobiliser',
                    currentAssignee: null,
                    pastAssignees: [
                      {
                        id: 'emp-mob-d2-prev',
                        name: 'Previous Mobiliser',
                        email: 'prev.mob.d@lnj.com',
                        phone: '+91 9876543241',
                        assignmentStartDate: '2024-01-01',
                        assignmentEndDate: '2024-04-30',
                        isCurrentlyAssigned: false,
                      }
                    ],
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  'centre-3': {
    id: 'sh-jamshedpur',
    role: 'state_head',
    roleDisplayName: 'State Head',
    currentAssignee: {
      id: 'emp-sh-1',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@lnj.com',
      phone: '+91 9876543210',
      assignmentStartDate: '2024-01-01',
      assignmentEndDate: null,
      isCurrentlyAssigned: true,
    },
    pastAssignees: [],
    children: [
      {
        id: 'sa-jamshedpur',
        role: 'state_admin',
        roleDisplayName: 'State Admin',
        currentAssignee: {
          id: 'emp-sa-1',
          name: 'Priya Sharma',
          email: 'priya.sharma@lnj.com',
          phone: '+91 9876543212',
          assignmentStartDate: '2024-02-01',
          assignmentEndDate: null,
          isCurrentlyAssigned: true,
        },
        pastAssignees: [],
        children: [
          {
            id: 'mis-jamshedpur',
            role: 'mis',
            roleDisplayName: 'MIS',
            currentAssignee: {
              id: 'emp-mis-j1',
              name: 'Rohit Jha',
              email: 'rohit.jha@lnj.com',
              phone: '+91 9876543250',
              assignmentStartDate: '2024-03-01',
              assignmentEndDate: null,
              isCurrentlyAssigned: true,
            },
            pastAssignees: [],
            children: [],
          },
          {
            id: 'counsellor-jamshedpur',
            role: 'counsellor',
            roleDisplayName: 'Counsellor',
            currentAssignee: {
              id: 'emp-coun-j1',
              name: 'Anita Devi',
              email: 'anita.devi@lnj.com',
              phone: '+91 9876543251',
              assignmentStartDate: '2024-02-25',
              assignmentEndDate: null,
              isCurrentlyAssigned: true,
            },
            pastAssignees: [],
            children: [],
          },
          {
            id: 'cm-jamshedpur',
            role: 'centre_manager',
            roleDisplayName: 'Centre Manager',
            currentAssignee: {
              id: 'emp-cm-j1',
              name: 'Manoj Tiwari',
              email: 'manoj.tiwari@lnj.com',
              phone: '+91 9876543252',
              assignmentStartDate: '2024-01-10',
              assignmentEndDate: null,
              isCurrentlyAssigned: true,
            },
            pastAssignees: [],
            children: [
              {
                id: 'mm-jamshedpur-1',
                role: 'mobiliser_manager',
                roleDisplayName: 'Mobiliser Manager',
                currentAssignee: {
                  id: 'emp-mm-j1',
                  name: 'Deepak Oraon',
                  email: 'deepak.oraon@lnj.com',
                  phone: '+91 9876543253',
                  assignmentStartDate: '2024-02-01',
                  assignmentEndDate: null,
                  isCurrentlyAssigned: true,
                },
                pastAssignees: [],
                children: [
                  {
                    id: 'mob-jamshedpur-1',
                    role: 'mobiliser',
                    roleDisplayName: 'Mobiliser',
                    currentAssignee: {
                      id: 'emp-mob-j1',
                      name: 'Santosh Mahato',
                      email: 'santosh.mahato@lnj.com',
                      phone: '+91 9876543254',
                      assignmentStartDate: '2024-03-01',
                      assignmentEndDate: null,
                      isCurrentlyAssigned: true,
                    },
                    pastAssignees: [],
                    children: [],
                  },
                  {
                    id: 'mob-jamshedpur-2',
                    role: 'mobiliser',
                    roleDisplayName: 'Mobiliser',
                    currentAssignee: {
                      id: 'emp-mob-j2',
                      name: 'Geeta Kumari',
                      email: 'geeta.kumari@lnj.com',
                      phone: '+91 9876543255',
                      assignmentStartDate: '2024-03-15',
                      assignmentEndDate: null,
                      isCurrentlyAssigned: true,
                    },
                    pastAssignees: [],
                    children: [],
                  },
                  {
                    id: 'mob-jamshedpur-3',
                    role: 'mobiliser',
                    roleDisplayName: 'Mobiliser',
                    currentAssignee: {
                      id: 'emp-mob-j3',
                      name: 'Binod Sahu',
                      email: 'binod.sahu@lnj.com',
                      phone: '+91 9876543256',
                      assignmentStartDate: '2024-04-01',
                      assignmentEndDate: null,
                      isCurrentlyAssigned: true,
                    },
                    pastAssignees: [],
                    children: [],
                  },
                ],
              },
              {
                id: 'mm-jamshedpur-2',
                role: 'mobiliser_manager',
                roleDisplayName: 'Mobiliser Manager',
                currentAssignee: {
                  id: 'emp-mm-j2',
                  name: 'Ravi Munda',
                  email: 'ravi.munda@lnj.com',
                  phone: '+91 9876543257',
                  assignmentStartDate: '2024-02-15',
                  assignmentEndDate: null,
                  isCurrentlyAssigned: true,
                },
                pastAssignees: [],
                children: [
                  {
                    id: 'mob-jamshedpur-4',
                    role: 'mobiliser',
                    roleDisplayName: 'Mobiliser',
                    currentAssignee: {
                      id: 'emp-mob-j4',
                      name: 'Sunita Tirkey',
                      email: 'sunita.tirkey@lnj.com',
                      phone: '+91 9876543258',
                      assignmentStartDate: '2024-03-01',
                      assignmentEndDate: null,
                      isCurrentlyAssigned: true,
                    },
                    pastAssignees: [],
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

// Default hierarchy when no centre selected
const defaultHierarchy = mockHierarchyByCentre['centre-1'];

const TeamManagement: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCentre, setSelectedCentre] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedRoleNode, setSelectedRoleNode] = useState<RoleNode | null>(null);
  const [assignmentMode, setAssignmentMode] = useState<'assign' | 'remove' | 'reassign'>('assign');

  // Filter projects based on selected program
  const filteredProjects = selectedProgram 
    ? mockProjects.filter(p => p.programId === selectedProgram)
    : mockProjects;

  // Filter centres based on filters
  const filteredCentres = mockCentres.filter(centre => {
    if (selectedProgram && centre.programId !== selectedProgram) return false;
    if (selectedProject && centre.projectId !== selectedProject) return false;
    if (selectedState && centre.stateId !== selectedState) return false;
    return true;
  });

  // Calculate summary stats
  const summaryStats = {
    totalManpowerRequired: filteredCentres.reduce((sum, c) => sum + c.manpowerRequired, 0),
    totalManpowerAssigned: filteredCentres.reduce((sum, c) => sum + c.manpowerAssigned, 0),
    get remainingManpower() {
      return this.totalManpowerRequired - this.totalManpowerAssigned;
    }
  };

  const handleAssignRole = (node: RoleNode) => {
    setSelectedRoleNode(node);
    setAssignmentMode('assign');
    setAssignmentDialogOpen(true);
  };

  const handleRemoveRole = (node: RoleNode) => {
    setSelectedRoleNode(node);
    setAssignmentMode('remove');
    setAssignmentDialogOpen(true);
  };

  const handleReassignRole = (node: RoleNode) => {
    setSelectedRoleNode(node);
    setAssignmentMode('reassign');
    setAssignmentDialogOpen(true);
  };

  const handleViewHistory = (node: RoleNode) => {
    setSelectedRoleNode(node);
    setHistoryDialogOpen(true);
  };

  const currentCentre = selectedCentre 
    ? mockCentres.find(c => c.id === selectedCentre)
    : filteredCentres[0];

  return (
    <MainLayout role="national-head" title="Team & Program Management">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team & Program Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage teams, roles, hierarchy and personnel assignments across programs and centres
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Filters</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Program</label>
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    {mockPrograms.map(program => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project / Work Order</label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {filteredProjects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {mockStates.map(state => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Centre</label>
                <Select value={selectedCentre} onValueChange={setSelectedCentre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Centre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Centres</SelectItem>
                    {filteredCentres.map(centre => (
                      <SelectItem key={centre.id} value={centre.id}>
                        {centre.name} ({centre.centreId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <ManpowerSummaryCards
          programName={selectedProgram ? mockPrograms.find(p => p.id === selectedProgram)?.name : 'All Programs'}
          centreName={currentCentre?.name || 'All Centres'}
          centreId={currentCentre?.centreId || '-'}
          totalRequired={summaryStats.totalManpowerRequired}
          totalAssigned={summaryStats.totalManpowerAssigned}
          remaining={summaryStats.remainingManpower}
        />

        {/* Hierarchy Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Hierarchy
                </CardTitle>
                <CardDescription className="mt-1">
                  Complete organizational structure with current and historical assignments
                </CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <TeamHierarchyTree
                hierarchy={selectedCentre ? mockHierarchyByCentre[selectedCentre] || defaultHierarchy : defaultHierarchy}
                searchTerm={searchTerm}
                onAssign={handleAssignRole}
                onRemove={handleRemoveRole}
                onReassign={handleReassignRole}
                onViewHistory={handleViewHistory}
              />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <span className="font-medium text-muted-foreground">Legend:</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Currently Assigned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Vacant Position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span>Past Assignment</span>
              </div>
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <span>Has Assignment History</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Dialog */}
      <RoleAssignmentDialog
        open={assignmentDialogOpen}
        onOpenChange={setAssignmentDialogOpen}
        roleNode={selectedRoleNode}
        mode={assignmentMode}
      />

      {/* History Dialog */}
      <AssignmentHistoryDialog
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        roleNode={selectedRoleNode}
      />
    </MainLayout>
  );
};

export default TeamManagement;
