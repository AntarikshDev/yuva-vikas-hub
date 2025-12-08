import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { TeamHierarchyTree } from '@/components/team-management/TeamHierarchyTree';
import { ManpowerSummaryCards } from '@/components/team-management/ManpowerSummaryCards';
import { RoleAssignmentDialog } from '@/components/team-management/RoleAssignmentDialog';
import { AssignmentHistoryDialog } from '@/components/team-management/AssignmentHistoryDialog';

// States
const mockStates = [
  { id: 'jharkhand', name: 'Jharkhand' },
  { id: 'maharashtra', name: 'Maharashtra' },
  { id: 'karnataka', name: 'Karnataka' },
];

// Centres within Jharkhand
const mockCentres = [
  { 
    id: 'ranchi', 
    name: 'Ranchi Training Centre', 
    centreId: 'RTC-001',
    stateId: 'jharkhand',
    manpowerRequired: 6,
    manpowerAssigned: 5,
  },
  { 
    id: 'dhanbad', 
    name: 'Dhanbad Skill Development Centre', 
    centreId: 'DSDC-002',
    stateId: 'jharkhand',
    manpowerRequired: 6,
    manpowerAssigned: 5,
  },
  { 
    id: 'jamshedpur', 
    name: 'Jamshedpur Training Hub', 
    centreId: 'JTH-003',
    stateId: 'jharkhand',
    manpowerRequired: 6,
    manpowerAssigned: 5,
  },
];

// Programs available in all centres
const mockPrograms = [
  { id: 'program-a', name: 'Program A' },
  { id: 'program-b', name: 'Program B' },
];

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignmentStartDate: string;
  assignmentEndDate: string | null;
  isCurrentlyAssigned: boolean;
  isNewlyAssigned?: boolean;
}

export interface RoleNode {
  id: string;
  role: string;
  roleDisplayName: string;
  currentAssignee: TeamMember | null;
  pastAssignees: TeamMember[];
  children: RoleNode[];
}

// Mock hierarchy data per centre per program
// Each program has: Program Manager -> Coordinator -> Trainer
// Rule: At least one newly assigned + one vacant per program
const mockHierarchyByCentreProgram: Record<string, Record<string, RoleNode>> = {
  // RANCHI CENTRE
  'ranchi': {
    'program-a': {
      id: 'pm-ranchi-a',
      role: 'program_manager',
      roleDisplayName: 'Program Manager',
      currentAssignee: {
        id: 'emp-pm-ra',
        name: 'Mr. Amit Kumar',
        email: 'amit.kumar@lnj.com',
        phone: '+91 9876543210',
        assignmentStartDate: '2025-01-15',
        assignmentEndDate: null,
        isCurrentlyAssigned: true,
        isNewlyAssigned: true, // Newly Assigned
      },
      pastAssignees: [],
      children: [
        {
          id: 'coord-ranchi-a',
          role: 'coordinator',
          roleDisplayName: 'Coordinator',
          currentAssignee: {
            id: 'emp-coord-ra',
            name: 'Ms. Pooja Singh',
            email: 'pooja.singh@lnj.com',
            phone: '+91 9876543211',
            assignmentStartDate: '2024-06-01',
            assignmentEndDate: null,
            isCurrentlyAssigned: true,
          },
          pastAssignees: [],
          children: [
            {
              id: 'trainer-ranchi-a',
              role: 'trainer',
              roleDisplayName: 'Trainer',
              currentAssignee: null, // VACANT
              pastAssignees: [
                {
                  id: 'emp-trainer-ra-prev',
                  name: 'Mr. Suresh Kumar',
                  email: 'suresh.kumar@lnj.com',
                  phone: '+91 9876543299',
                  assignmentStartDate: '2024-01-01',
                  assignmentEndDate: '2024-12-31',
                  isCurrentlyAssigned: false,
                }
              ],
              children: [],
            },
          ],
        },
      ],
    },
    'program-b': {
      id: 'pm-ranchi-b',
      role: 'program_manager',
      roleDisplayName: 'Program Manager',
      currentAssignee: {
        id: 'emp-pm-rb',
        name: 'Ms. Sunita Devi',
        email: 'sunita.devi@lnj.com',
        phone: '+91 9876543220',
        assignmentStartDate: '2024-03-01',
        assignmentEndDate: null,
        isCurrentlyAssigned: true,
      },
      pastAssignees: [],
      children: [
        {
          id: 'coord-ranchi-b',
          role: 'coordinator',
          roleDisplayName: 'Coordinator',
          currentAssignee: {
            id: 'emp-coord-rb',
            name: 'Mr. Rahul Verma',
            email: 'rahul.verma@lnj.com',
            phone: '+91 9876543221',
            assignmentStartDate: '2025-01-10',
            assignmentEndDate: null,
            isCurrentlyAssigned: true,
            isNewlyAssigned: true, // Newly Assigned
          },
          pastAssignees: [],
          children: [
            {
              id: 'trainer-ranchi-b',
              role: 'trainer',
              roleDisplayName: 'Trainer',
              currentAssignee: null, // VACANT
              pastAssignees: [],
              children: [],
            },
          ],
        },
      ],
    },
  },
  // DHANBAD CENTRE
  'dhanbad': {
    'program-a': {
      id: 'pm-dhanbad-a',
      role: 'program_manager',
      roleDisplayName: 'Program Manager',
      currentAssignee: {
        id: 'emp-pm-da',
        name: 'Mr. Rajesh Sharma',
        email: 'rajesh.sharma@lnj.com',
        phone: '+91 9876543230',
        assignmentStartDate: '2024-02-15',
        assignmentEndDate: null,
        isCurrentlyAssigned: true,
      },
      pastAssignees: [],
      children: [
        {
          id: 'coord-dhanbad-a',
          role: 'coordinator',
          roleDisplayName: 'Coordinator',
          currentAssignee: {
            id: 'emp-coord-da',
            name: 'Ms. Neha Roy',
            email: 'neha.roy@lnj.com',
            phone: '+91 9876543231',
            assignmentStartDate: '2025-01-08',
            assignmentEndDate: null,
            isCurrentlyAssigned: true,
            isNewlyAssigned: true, // Newly Assigned
          },
          pastAssignees: [],
          children: [
            {
              id: 'trainer-dhanbad-a',
              role: 'trainer',
              roleDisplayName: 'Trainer',
              currentAssignee: null, // VACANT
              pastAssignees: [],
              children: [],
            },
          ],
        },
      ],
    },
    'program-b': {
      id: 'pm-dhanbad-b',
      role: 'program_manager',
      roleDisplayName: 'Program Manager',
      currentAssignee: {
        id: 'emp-pm-db',
        name: 'Mr. Anil Gupta',
        email: 'anil.gupta@lnj.com',
        phone: '+91 9876543240',
        assignmentStartDate: '2025-01-05',
        assignmentEndDate: null,
        isCurrentlyAssigned: true,
        isNewlyAssigned: true, // Newly Assigned
      },
      pastAssignees: [],
      children: [
        {
          id: 'coord-dhanbad-b',
          role: 'coordinator',
          roleDisplayName: 'Coordinator',
          currentAssignee: {
            id: 'emp-coord-db',
            name: 'Ms. Kavita Das',
            email: 'kavita.das@lnj.com',
            phone: '+91 9876543241',
            assignmentStartDate: '2024-05-01',
            assignmentEndDate: null,
            isCurrentlyAssigned: true,
          },
          pastAssignees: [],
          children: [
            {
              id: 'trainer-dhanbad-b',
              role: 'trainer',
              roleDisplayName: 'Trainer',
              currentAssignee: null, // VACANT
              pastAssignees: [],
              children: [],
            },
          ],
        },
      ],
    },
  },
  // JAMSHEDPUR CENTRE
  'jamshedpur': {
    'program-a': {
      id: 'pm-jamshedpur-a',
      role: 'program_manager',
      roleDisplayName: 'Program Manager',
      currentAssignee: {
        id: 'emp-pm-ja',
        name: 'Ms. Ritu Chatterjee',
        email: 'ritu.chatterjee@lnj.com',
        phone: '+91 9876543250',
        assignmentStartDate: '2024-04-01',
        assignmentEndDate: null,
        isCurrentlyAssigned: true,
      },
      pastAssignees: [],
      children: [
        {
          id: 'coord-jamshedpur-a',
          role: 'coordinator',
          roleDisplayName: 'Coordinator',
          currentAssignee: {
            id: 'emp-coord-ja',
            name: 'Mr. Kunal Mishra',
            email: 'kunal.mishra@lnj.com',
            phone: '+91 9876543251',
            assignmentStartDate: '2024-07-01',
            assignmentEndDate: null,
            isCurrentlyAssigned: true,
          },
          pastAssignees: [],
          children: [
            {
              id: 'trainer-jamshedpur-a',
              role: 'trainer',
              roleDisplayName: 'Trainer',
              currentAssignee: null, // VACANT
              pastAssignees: [
                {
                  id: 'emp-trainer-ja-prev',
                  name: 'Ms. Priya Sharma',
                  email: 'priya.sharma@lnj.com',
                  phone: '+91 9876543298',
                  assignmentStartDate: '2024-03-01',
                  assignmentEndDate: '2024-11-30',
                  isCurrentlyAssigned: false,
                }
              ],
              children: [],
            },
          ],
        },
      ],
    },
    'program-b': {
      id: 'pm-jamshedpur-b',
      role: 'program_manager',
      roleDisplayName: 'Program Manager',
      currentAssignee: {
        id: 'emp-pm-jb',
        name: 'Ms. Sunita Das',
        email: 'sunita.das@lnj.com',
        phone: '+91 9876543260',
        assignmentStartDate: '2025-01-12',
        assignmentEndDate: null,
        isCurrentlyAssigned: true,
        isNewlyAssigned: true, // Newly Assigned
      },
      pastAssignees: [],
      children: [
        {
          id: 'coord-jamshedpur-b',
          role: 'coordinator',
          roleDisplayName: 'Coordinator',
          currentAssignee: {
            id: 'emp-coord-jb',
            name: 'Mr. Manoj Prasad',
            email: 'manoj.prasad@lnj.com',
            phone: '+91 9876543261',
            assignmentStartDate: '2024-06-15',
            assignmentEndDate: null,
            isCurrentlyAssigned: true,
          },
          pastAssignees: [],
          children: [
            {
              id: 'trainer-jamshedpur-b',
              role: 'trainer',
              roleDisplayName: 'Trainer',
              currentAssignee: null, // VACANT
              pastAssignees: [],
              children: [],
            },
          ],
        },
      ],
    },
  },
};

const TeamManagement: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('jharkhand');
  const [selectedCentre, setSelectedCentre] = useState<string>('ranchi');
  const [selectedProgram, setSelectedProgram] = useState<string>('program-a');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedRoleNode, setSelectedRoleNode] = useState<RoleNode | null>(null);
  const [assignmentMode, setAssignmentMode] = useState<'assign' | 'remove' | 'reassign'>('assign');

  // Filter centres based on state
  const filteredCentres = useMemo(() => {
    return mockCentres.filter(centre => {
      if (selectedState && centre.stateId !== selectedState) return false;
      return true;
    });
  }, [selectedState]);

  // Get current centre details
  const currentCentre = useMemo(() => {
    return mockCentres.find(c => c.id === selectedCentre);
  }, [selectedCentre]);

  // Get hierarchy for selected centre and program
  const currentHierarchy = useMemo(() => {
    if (selectedCentre && selectedProgram) {
      return mockHierarchyByCentreProgram[selectedCentre]?.[selectedProgram] || null;
    }
    return null;
  }, [selectedCentre, selectedProgram]);

  // Calculate summary stats for selected centre
  const summaryStats = useMemo(() => {
    if (currentCentre) {
      return {
        totalManpowerRequired: currentCentre.manpowerRequired,
        totalManpowerAssigned: currentCentre.manpowerAssigned,
        remainingManpower: currentCentre.manpowerRequired - currentCentre.manpowerAssigned,
      };
    }
    return {
      totalManpowerRequired: 0,
      totalManpowerAssigned: 0,
      remainingManpower: 0,
    };
  }, [currentCentre]);

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

  return (
    <MainLayout role="national-head" title="Team & Program Management">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team & Program Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage teams, roles, and personnel assignments across centres and programs
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
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
                    {filteredCentres.map(centre => (
                      <SelectItem key={centre.id} value={centre.id}>
                        {centre.name} ({centre.centreId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Program</label>
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Program" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPrograms.map(program => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
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
          programName={mockPrograms.find(p => p.id === selectedProgram)?.name || 'Program'}
          centreName={currentCentre?.name || 'Centre'}
          centreId={currentCentre?.centreId || '-'}
          totalRequired={summaryStats.totalManpowerRequired}
          totalAssigned={summaryStats.totalManpowerAssigned}
          remaining={summaryStats.remainingManpower}
        />

        {/* Program Tabs with Hierarchy */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {currentCentre?.name || 'Centre'} - Team Structure
                </CardTitle>
                <CardDescription className="mt-1">
                  Select a program to view its team hierarchy
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
            <Tabs value={selectedProgram} onValueChange={setSelectedProgram} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                {mockPrograms.map(program => (
                  <TabsTrigger key={program.id} value={program.id} className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {program.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {mockPrograms.map(program => (
                <TabsContent key={program.id} value={program.id}>
                  <ScrollArea className="h-[500px] pr-4">
                    {currentHierarchy ? (
                      <TeamHierarchyTree
                        hierarchy={currentHierarchy}
                        searchTerm={searchTerm}
                        onAssign={handleAssignRole}
                        onRemove={handleRemoveRole}
                        onReassign={handleReassignRole}
                        onViewHistory={handleViewHistory}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-48 text-muted-foreground">
                        <p>No hierarchy data available for this selection</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
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
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">NEW</Badge>
                <span>Newly Assigned</span>
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