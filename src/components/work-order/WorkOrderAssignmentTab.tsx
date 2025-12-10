import { useState } from "react";
import { Users, GitBranch, List, Plus, Download, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import MobilisationOrgChart from "./MobilisationOrgChart";
import TeamListTable from "./TeamListTable";
import TeamApprovalPanel from "./TeamApprovalPanel";
import AddTeamMemberDialog from "./AddTeamMemberDialog";
import EmployeeProfileDialog from "./EmployeeProfileDialog";

export interface MobilisationTeamMember {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: 'state_head' | 'project_head' | 'operation_manager' | 'centre_manager' | 'mobilisation_manager' | 'mobiliser';
  roleDisplayName: string;
  salary: number;
  assignmentStartDate: string;
  assignmentEndDate: string | null;
  status: 'active' | 'pending_approval' | 'removed' | 'vacant';
  approvedBy?: string;
  approvedDate?: string;
  profilePhoto?: string;
  department?: string;
  experience?: string;
  qualification?: string;
  reportingTo?: string;
}

export interface TeamHierarchyNode {
  id: string;
  role: string;
  roleDisplayName: string;
  member: MobilisationTeamMember | null;
  children: TeamHierarchyNode[];
}

interface WorkOrderAssignmentTabProps {
  workOrderId: string;
  role: 'director' | 'national-head';
  isStarted: boolean;
}

// Mock team data
const mockTeamMembers: MobilisationTeamMember[] = [
  {
    id: "1",
    employeeId: "LNJ001",
    name: "Rahul Sharma",
    email: "rahul.sharma@lnj.com",
    phone: "+91 98765 43210",
    role: "state_head",
    roleDisplayName: "State Head",
    salary: 85000,
    assignmentStartDate: "2024-01-15",
    assignmentEndDate: null,
    status: "active",
    approvedBy: "Director",
    approvedDate: "2024-01-10",
    department: "Operations",
    experience: "8 years",
    qualification: "MBA - HR Management",
  },
  {
    id: "2",
    employeeId: "LNJ002",
    name: "Priya Singh",
    email: "priya.singh@lnj.com",
    phone: "+91 98765 43211",
    role: "operation_manager",
    roleDisplayName: "Operation Manager",
    salary: 55000,
    assignmentStartDate: "2024-01-20",
    assignmentEndDate: null,
    status: "active",
    department: "Operations",
    experience: "5 years",
    qualification: "BBA",
    reportingTo: "LNJ001",
  },
  {
    id: "3",
    employeeId: "LNJ003",
    name: "Amit Kumar",
    email: "amit.kumar@lnj.com",
    phone: "+91 98765 43212",
    role: "centre_manager",
    roleDisplayName: "Centre Manager",
    salary: 50000,
    assignmentStartDate: "2024-02-01",
    assignmentEndDate: null,
    status: "pending_approval",
    department: "Centre Operations",
    experience: "4 years",
    qualification: "B.Com",
    reportingTo: "LNJ001",
  },
  {
    id: "4",
    employeeId: "LNJ004",
    name: "Neha Gupta",
    email: "neha.gupta@lnj.com",
    phone: "+91 98765 43213",
    role: "mobilisation_manager",
    roleDisplayName: "Mobilisation Manager",
    salary: 45000,
    assignmentStartDate: "2024-02-05",
    assignmentEndDate: null,
    status: "active",
    department: "Mobilisation",
    experience: "3 years",
    qualification: "BA Social Work",
    reportingTo: "LNJ002",
  },
  {
    id: "5",
    employeeId: "LNJ005",
    name: "Sanjay Verma",
    email: "sanjay.verma@lnj.com",
    phone: "+91 98765 43214",
    role: "mobiliser",
    roleDisplayName: "Mobiliser",
    salary: 25000,
    assignmentStartDate: "2024-02-10",
    assignmentEndDate: null,
    status: "active",
    department: "Mobilisation",
    experience: "1 year",
    qualification: "12th Pass",
    reportingTo: "LNJ004",
  },
  {
    id: "6",
    employeeId: "LNJ006",
    name: "Kavita Das",
    email: "kavita.das@lnj.com",
    phone: "+91 98765 43215",
    role: "mobiliser",
    roleDisplayName: "Mobiliser",
    salary: 25000,
    assignmentStartDate: "2024-02-10",
    assignmentEndDate: null,
    status: "active",
    department: "Mobilisation",
    experience: "2 years",
    qualification: "Graduate",
    reportingTo: "LNJ004",
  },
  {
    id: "7",
    employeeId: "LNJ007",
    name: "Rajesh Patel",
    email: "rajesh.patel@lnj.com",
    phone: "+91 98765 43216",
    role: "mobiliser",
    roleDisplayName: "Mobiliser",
    salary: 25000,
    assignmentStartDate: "2024-02-15",
    assignmentEndDate: null,
    status: "pending_approval",
    department: "Mobilisation",
    experience: "6 months",
    qualification: "10th Pass",
    reportingTo: "LNJ004",
  },
  {
    id: "8",
    employeeId: "LNJ008",
    name: "Sunita Rao",
    email: "sunita.rao@lnj.com",
    phone: "+91 98765 43217",
    role: "mobilisation_manager",
    roleDisplayName: "Mobilisation Manager",
    salary: 45000,
    assignmentStartDate: "2024-02-05",
    assignmentEndDate: null,
    status: "active",
    department: "Mobilisation",
    experience: "4 years",
    qualification: "MSW",
    reportingTo: "LNJ003",
  },
  {
    id: "9",
    employeeId: "LNJ009",
    name: "Vikram Joshi",
    email: "vikram.joshi@lnj.com",
    phone: "+91 98765 43218",
    role: "mobiliser",
    roleDisplayName: "Mobiliser",
    salary: 25000,
    assignmentStartDate: "2024-02-20",
    assignmentEndDate: null,
    status: "active",
    department: "Mobilisation",
    experience: "1.5 years",
    qualification: "Graduate",
    reportingTo: "LNJ008",
  },
];

// Build hierarchy from flat list
const buildHierarchy = (members: MobilisationTeamMember[]): TeamHierarchyNode => {
  const stateHead = members.find(m => m.role === 'state_head' || m.role === 'project_head');
  
  const getChildren = (parentId: string): TeamHierarchyNode[] => {
    return members
      .filter(m => m.reportingTo === parentId)
      .map(member => ({
        id: member.id,
        role: member.role,
        roleDisplayName: member.roleDisplayName,
        member,
        children: getChildren(member.employeeId),
      }));
  };

  return {
    id: stateHead?.id || 'root',
    role: stateHead?.role || 'state_head',
    roleDisplayName: stateHead?.roleDisplayName || 'State Head / Project Head',
    member: stateHead || null,
    children: stateHead ? getChildren(stateHead.employeeId) : [],
  };
};

const WorkOrderAssignmentTab = ({ workOrderId, role, isStarted }: WorkOrderAssignmentTabProps) => {
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [selectedMember, setSelectedMember] = useState<MobilisationTeamMember | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const canEdit = role === 'national-head';
  const hierarchy = buildHierarchy(teamMembers);
  
  const pendingCount = teamMembers.filter(m => m.status === 'pending_approval').length;
  const activeCount = teamMembers.filter(m => m.status === 'active').length;
  const totalPositions = teamMembers.length;

  const handleViewProfile = (member: MobilisationTeamMember) => {
    setSelectedMember(member);
    setIsProfileOpen(true);
  };

  const handleApprove = (memberId: string) => {
    setTeamMembers(prev => prev.map(m => 
      m.id === memberId 
        ? { ...m, status: 'active' as const, approvedBy: 'National Head', approvedDate: new Date().toISOString().split('T')[0] }
        : m
    ));
  };

  const handleReject = (memberId: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const handleRemove = (memberId: string) => {
    setTeamMembers(prev => prev.map(m => 
      m.id === memberId ? { ...m, status: 'removed' as const } : m
    ));
  };

  const handleAddMember = (member: Omit<MobilisationTeamMember, 'id' | 'employeeId'>) => {
    const newId = (teamMembers.length + 1).toString();
    const newEmployeeId = `LNJ${String(teamMembers.length + 1).padStart(3, '0')}`;
    setTeamMembers(prev => [...prev, { ...member, id: newId, employeeId: newEmployeeId }]);
  };

  return (
    <div className="space-y-6">
      {/* Approval Banner */}
      {pendingCount > 0 && canEdit && (
        <TeamApprovalPanel 
          pendingMembers={teamMembers.filter(m => m.status === 'pending_approval')}
          onApprove={handleApprove}
          onReject={handleReject}
          onViewProfile={handleViewProfile}
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Positions</p>
                <p className="text-2xl font-bold">{totalPositions}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                {pendingCount}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Salary</p>
                <p className="text-2xl font-bold">₹{teamMembers.filter(m => m.status === 'active').reduce((sum, m) => sum + m.salary, 0).toLocaleString()}</p>
              </div>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle & Actions */}
      <div className="flex items-center justify-between">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'chart' | 'list')}>
          <TabsList>
            <TabsTrigger value="chart" className="gap-2">
              <GitBranch className="h-4 w-4" />
              Org Chart
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          {canEdit && (
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          )}
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Mobilisation Team Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'chart' ? (
            <MobilisationOrgChart 
              hierarchy={hierarchy}
              onViewProfile={handleViewProfile}
              onRemove={canEdit ? handleRemove : undefined}
              canEdit={canEdit}
            />
          ) : (
            <TeamListTable 
              members={teamMembers.filter(m => m.status !== 'removed')}
              onViewProfile={handleViewProfile}
              onRemove={canEdit ? handleRemove : undefined}
              canEdit={canEdit}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EmployeeProfileDialog 
        member={selectedMember}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />
      
      <AddTeamMemberDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddMember}
        existingMembers={teamMembers}
      />
    </div>
  );
};

export default WorkOrderAssignmentTab;
