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
  { id: 'state-1', name: 'Maharashtra' },
  { id: 'state-2', name: 'Karnataka' },
  { id: 'state-3', name: 'Bihar' },
];

const mockCentres = [
  { 
    id: 'centre-1', 
    name: 'Mumbai Training Centre', 
    centreId: 'MTC-001',
    programId: 'prog-1',
    projectId: 'proj-1',
    stateId: 'state-1',
    manpowerRequired: 15,
    manpowerAssigned: 12,
  },
  { 
    id: 'centre-2', 
    name: 'Pune Skill Development Centre', 
    centreId: 'PSDC-002',
    programId: 'prog-1',
    projectId: 'proj-1',
    stateId: 'state-1',
    manpowerRequired: 10,
    manpowerAssigned: 8,
  },
  { 
    id: 'centre-3', 
    name: 'Bangalore Training Hub', 
    centreId: 'BTH-001',
    programId: 'prog-2',
    projectId: 'proj-3',
    stateId: 'state-2',
    manpowerRequired: 12,
    manpowerAssigned: 12,
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

// Mock hierarchy data
const mockHierarchy: RoleNode = {
  id: 'sh-1',
  role: 'state_head',
  roleDisplayName: 'State Head',
  currentAssignee: {
    id: 'emp-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@lnj.com',
    phone: '+91 9876543210',
    assignmentStartDate: '2024-01-01',
    assignmentEndDate: null,
    isCurrentlyAssigned: true,
  },
  pastAssignees: [
    {
      id: 'emp-0',
      name: 'Previous Head',
      email: 'prev.head@lnj.com',
      phone: '+91 9876543211',
      assignmentStartDate: '2023-01-01',
      assignmentEndDate: '2023-12-31',
      isCurrentlyAssigned: false,
    }
  ],
  children: [
    {
      id: 'sa-1',
      role: 'state_admin',
      roleDisplayName: 'State Admin',
      currentAssignee: {
        id: 'emp-2',
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
          id: 'mis-1',
          role: 'mis_counsellor',
          roleDisplayName: 'MIS Counsellor',
          currentAssignee: {
            id: 'emp-3',
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
          id: 'cm-1',
          role: 'centre_manager',
          roleDisplayName: 'Centre Manager',
          currentAssignee: {
            id: 'emp-4',
            name: 'Sunita Devi',
            email: 'sunita.devi@lnj.com',
            phone: '+91 9876543214',
            assignmentStartDate: '2024-01-15',
            assignmentEndDate: null,
            isCurrentlyAssigned: true,
          },
          pastAssignees: [
            {
              id: 'emp-prev-cm',
              name: 'Old Centre Manager',
              email: 'old.cm@lnj.com',
              phone: '+91 9876543220',
              assignmentStartDate: '2023-06-01',
              assignmentEndDate: '2024-01-14',
              isCurrentlyAssigned: false,
            }
          ],
          children: [
            {
              id: 'mm-1',
              role: 'mobiliser_manager',
              roleDisplayName: 'Mobiliser Manager',
              currentAssignee: {
                id: 'emp-5',
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
                  id: 'mob-1',
                  role: 'mobiliser',
                  roleDisplayName: 'Mobiliser',
                  currentAssignee: {
                    id: 'emp-6',
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
                  id: 'mob-2',
                  role: 'mobiliser',
                  roleDisplayName: 'Mobiliser',
                  currentAssignee: {
                    id: 'emp-7',
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
                {
                  id: 'mob-3',
                  role: 'mobiliser',
                  roleDisplayName: 'Mobiliser',
                  currentAssignee: null,
                  pastAssignees: [
                    {
                      id: 'emp-prev-mob',
                      name: 'Previous Mobiliser',
                      email: 'prev.mob@lnj.com',
                      phone: '+91 9876543221',
                      assignmentStartDate: '2024-01-01',
                      assignmentEndDate: '2024-04-30',
                      isCurrentlyAssigned: false,
                    }
                  ],
                  children: [],
                },
              ],
            },
            {
              id: 'mm-2',
              role: 'mobiliser_manager',
              roleDisplayName: 'Mobiliser Manager',
              currentAssignee: {
                id: 'emp-8',
                name: 'Deepak Yadav',
                email: 'deepak.yadav@lnj.com',
                phone: '+91 9876543218',
                assignmentStartDate: '2024-02-15',
                assignmentEndDate: null,
                isCurrentlyAssigned: true,
              },
              pastAssignees: [],
              children: [
                {
                  id: 'mob-4',
                  role: 'mobiliser',
                  roleDisplayName: 'Mobiliser',
                  currentAssignee: {
                    id: 'emp-9',
                    name: 'Anjali Mehta',
                    email: 'anjali.mehta@lnj.com',
                    phone: '+91 9876543219',
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
};

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
                hierarchy={mockHierarchy}
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
