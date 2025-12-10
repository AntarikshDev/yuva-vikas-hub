import { useState } from "react";
import { Eye, UserMinus, UserCog, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobilisationTeamMember } from "./WorkOrderAssignmentTab";
import { cn } from "@/lib/utils";

interface TeamListTableProps {
  members: MobilisationTeamMember[];
  onViewProfile: (member: MobilisationTeamMember) => void;
  onRemove?: (memberId: string) => void;
  onReplace?: (member: MobilisationTeamMember) => void;
  canEdit: boolean;
}

const roleColors: Record<string, string> = {
  state_head: "bg-purple-100 text-purple-800",
  project_head: "bg-purple-100 text-purple-800",
  operation_manager: "bg-blue-100 text-blue-800",
  centre_manager: "bg-green-100 text-green-800",
  mobilisation_manager: "bg-amber-100 text-amber-800",
  mobiliser: "bg-orange-100 text-orange-800",
};

const statusBadges: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  active: { variant: "default", label: "Active" },
  pending_approval: { variant: "secondary", label: "Pending" },
  removed: { variant: "destructive", label: "Removed" },
  vacant: { variant: "outline", label: "Vacant" },
};

type SortField = 'employeeId' | 'name' | 'role' | 'salary' | 'status';
type SortOrder = 'asc' | 'desc';

const TeamListTable = ({ members, onViewProfile, onRemove, onReplace, canEdit }: TeamListTableProps) => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>('employeeId');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredMembers = members
    .filter(m => {
      const matchesSearch = 
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || m.role === roleFilter;
      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'employeeId':
          comparison = a.employeeId.localeCompare(b.employeeId);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'role':
          comparison = a.roleDisplayName.localeCompare(b.roleDisplayName);
          break;
        case 'salary':
          comparison = a.salary - b.salary;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="state_head">State Head</SelectItem>
            <SelectItem value="operation_manager">Operation Manager</SelectItem>
            <SelectItem value="centre_manager">Centre Manager</SelectItem>
            <SelectItem value="mobilisation_manager">Mobilisation Manager</SelectItem>
            <SelectItem value="mobiliser">Mobiliser</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending_approval">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <SortableHeader field="employeeId">Emp ID</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="name">Name</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="role">Role</SortableHeader>
              </TableHead>
              <TableHead className="text-right">
                <SortableHeader field="salary">Salary (₹)</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="status">Status</SortableHeader>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No team members found
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-mono font-medium">
                    {member.employeeId}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("font-normal", roleColors[member.role])}>
                      {member.roleDisplayName}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {member.salary.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadges[member.status].variant}>
                      {statusBadges[member.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewProfile(member)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        {canEdit && onReplace && (
                          <DropdownMenuItem onClick={() => onReplace(member)}>
                            <UserCog className="h-4 w-4 mr-2" />
                            Replace
                          </DropdownMenuItem>
                        )}
                        {canEdit && onRemove && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => onRemove(member.id)}
                              className="text-destructive"
                            >
                              <UserMinus className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Showing {filteredMembers.length} of {members.length} members</span>
        <span>Total Monthly Salary: ₹{filteredMembers.filter(m => m.status === 'active').reduce((sum, m) => sum + m.salary, 0).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default TeamListTable;
