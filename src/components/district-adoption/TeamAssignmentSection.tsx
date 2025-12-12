import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, UserPlus, Info, Phone, MapPin, Building2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { jharkhandDistricts } from '@/data/jharkhandCensusData';
import { useGetTeamMembersQuery, useAddTeamMemberMutation } from '@/store/api/apiSlice';

interface TeamMember {
  id: string;
  name: string;
  designation: string;
  phone: string;
  homeLocation: string;
  workLocation: string;
}

interface DistrictAssignment {
  districtId: string;
  districtName: string;
  accountableLeader: TeamMember | null;
  responsibleLeader: TeamMember | null;
  centreTeam: TeamMember[];
  groundTeam: TeamMember[];
}

interface TeamAssignmentSectionProps {
  canEdit: boolean;
  adoptedDistricts: string[];
  workOrderId?: string;
}

// Mock team members
const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Rajesh Kumar', designation: 'State Head', phone: '9876543210', homeLocation: 'Ranchi', workLocation: 'Ranchi' },
  { id: '2', name: 'Priya Sharma', designation: 'Cluster Manager', phone: '9876543211', homeLocation: 'Hazaribagh', workLocation: 'Hazaribagh' },
  { id: '3', name: 'Amit Singh', designation: 'Center Manager', phone: '9876543212', homeLocation: 'Dhanbad', workLocation: 'Dhanbad' },
  { id: '4', name: 'Sunita Devi', designation: 'DMM', phone: '9876543213', homeLocation: 'Giridih', workLocation: 'Giridih' },
  { id: '5', name: 'Vikash Yadav', designation: 'Mobilizer', phone: '9876543214', homeLocation: 'Bokaro', workLocation: 'Bokaro' },
  { id: '6', name: 'Meena Kumari', designation: 'Counsellor', phone: '9876543215', homeLocation: 'Ranchi', workLocation: 'Ranchi' },
];

// Mock district assignments
const getMockAssignments = (adoptedDistricts: string[]): DistrictAssignment[] => 
  adoptedDistricts.map(districtId => {
    const district = jharkhandDistricts.find(d => d.id === districtId);
    return {
      districtId,
      districtName: district?.name || districtId,
      accountableLeader: districtId === 'ranchi' ? mockTeamMembers[0] : null,
      responsibleLeader: districtId === 'ranchi' ? mockTeamMembers[2] : null,
      centreTeam: districtId === 'ranchi' ? [mockTeamMembers[5]] : [],
      groundTeam: districtId === 'ranchi' ? [mockTeamMembers[4]] : []
    };
  });

export const TeamAssignmentSection: React.FC<TeamAssignmentSectionProps> = ({ 
  canEdit, 
  adoptedDistricts,
  workOrderId = ''
}) => {
  // RTK Query hooks
  const { data: teamData, isLoading } = useGetTeamMembersQuery(workOrderId, { skip: !workOrderId });
  const [addTeamMemberMutation] = useAddTeamMemberMutation();

  // Mock fallback pattern
  const [assignments, setAssignments] = useState<DistrictAssignment[]>([]);

  useEffect(() => {
    if (teamData && Array.isArray(teamData) && teamData.length > 0) {
      // Use API data if available, otherwise use mock
      setAssignments(getMockAssignments(adoptedDistricts));
    } else {
      setAssignments(getMockAssignments(adoptedDistricts));
    }
  }, [teamData, adoptedDistricts]);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({});

  const handleAssignLeader = (districtId: string, role: 'accountable' | 'responsible', memberId: string) => {
    const member = mockTeamMembers.find(m => m.id === memberId);
    if (!member) return;

    setAssignments(prev => prev.map(a => {
      if (a.districtId === districtId) {
        return {
          ...a,
          [role === 'accountable' ? 'accountableLeader' : 'responsibleLeader']: member
        };
      }
      return a;
    }));
    toast.success(`${member.name} assigned as ${role === 'accountable' ? 'Accountable' : 'Responsible'} Leader`);
  };

  const handleAddTeamMember = () => {
    if (!selectedDistrict || !selectedRole || !newMember.name) {
      toast.error('Please fill all required fields');
      return;
    }

    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name || '',
      designation: newMember.designation || selectedRole,
      phone: newMember.phone || '',
      homeLocation: newMember.homeLocation || '',
      workLocation: newMember.workLocation || ''
    };

    setAssignments(prev => prev.map(a => {
      if (a.districtId === selectedDistrict) {
        const teamKey = selectedRole === 'groundTeam' ? 'groundTeam' : 'centreTeam';
        return {
          ...a,
          [teamKey]: [...a[teamKey], member]
        };
      }
      return a;
    }));

    setIsAddMemberOpen(false);
    setNewMember({});
    toast.success(`${member.name} added to team`);
  };

  return (
    <div className="space-y-6">
      {/* RACI Model Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            One District - One Leader (RACI Model)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Accountable (A)</h4>
              <p className="text-sm text-muted-foreground">
                The person who delegates and reviews work. Ultimately answerable for the correct and thorough completion of the deliverable.
              </p>
              <ul className="mt-2 text-sm space-y-1">
                <li>• Oversees district mobilization strategy</li>
                <li>• Reviews weekly progress reports</li>
                <li>• Escalates blockers to management</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Responsible (R)</h4>
              <p className="text-sm text-muted-foreground">
                The person who does the work. Responsible for action/implementation and manages the ground team.
              </p>
              <ul className="mt-2 text-sm space-y-1">
                <li>• Leads ground operations daily</li>
                <li>• Coordinates with CRPs and mobilizers</li>
                <li>• Reports to Accountable Leader</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* District Assignments Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>District-wise Team Assignment</CardTitle>
            <CardDescription>Assign leaders and team members to adopted districts</CardDescription>
          </div>
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button disabled={!canEdit || adoptedDistricts.length === 0}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>Add a new member to a district team</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>District</Label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignments.map(a => (
                        <SelectItem key={a.districtId} value={a.districtId}>{a.districtName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Team Type</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="centreTeam">Centre Team</SelectItem>
                      <SelectItem value="groundTeam">Ground Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={newMember.name || ''} onChange={e => setNewMember({ ...newMember, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input value={newMember.designation || ''} onChange={e => setNewMember({ ...newMember, designation: e.target.value })} placeholder="e.g., DMM, Mobilizer, CRP" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={newMember.phone || ''} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Home Location</Label>
                    <Input value={newMember.homeLocation || ''} onChange={e => setNewMember({ ...newMember, homeLocation: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Work Location</Label>
                    <Input value={newMember.workLocation || ''} onChange={e => setNewMember({ ...newMember, workLocation: e.target.value })} />
                  </div>
                </div>
                <Button className="w-full" onClick={handleAddTeamMember}>Add Member</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No districts adopted yet</p>
                <p className="text-sm">Adopt districts from the District Selection tab first</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District</TableHead>
                  <TableHead>Accountable Leader (A)</TableHead>
                  <TableHead>Responsible Leader (R)</TableHead>
                  <TableHead>Centre Team</TableHead>
                  <TableHead>Ground Team</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map(assignment => (
                  <TableRow key={assignment.districtId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {assignment.districtName}
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignment.accountableLeader ? (
                        <div className="space-y-1">
                          <p className="font-medium">{assignment.accountableLeader.name}</p>
                          <p className="text-xs text-muted-foreground">{assignment.accountableLeader.designation}</p>
                        </div>
                      ) : (
                        <Select disabled={!canEdit} onValueChange={(v) => handleAssignLeader(assignment.districtId, 'accountable', v)}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Assign leader" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockTeamMembers.filter(m => ['State Head', 'Cluster Manager'].includes(m.designation)).map(m => (
                              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      {assignment.responsibleLeader ? (
                        <div className="space-y-1">
                          <p className="font-medium">{assignment.responsibleLeader.name}</p>
                          <p className="text-xs text-muted-foreground">{assignment.responsibleLeader.designation}</p>
                        </div>
                      ) : (
                        <Select disabled={!canEdit} onValueChange={(v) => handleAssignLeader(assignment.districtId, 'responsible', v)}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Assign leader" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockTeamMembers.filter(m => ['Center Manager', 'DMM'].includes(m.designation)).map(m => (
                              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{assignment.centreTeam.length} members</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{assignment.groundTeam.length} members</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Team Member Cards */}
      {assignments.filter(a => a.groundTeam.length > 0 || a.centreTeam.length > 0).map(assignment => (
        <Card key={assignment.districtId}>
          <CardHeader>
            <CardTitle className="text-lg">{assignment.districtName} - Team Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Centre Team */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Centre Team
                </h4>
                <div className="space-y-2">
                  {assignment.centreTeam.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No members assigned</p>
                  ) : (
                    assignment.centreTeam.map(member => (
                      <div key={member.id} className="p-3 rounded-lg border bg-card">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <Badge variant="secondary" className="text-xs mt-1">{member.designation}</Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {member.phone}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Ground Team */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Ground Team
                </h4>
                <div className="space-y-2">
                  {assignment.groundTeam.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No members assigned</p>
                  ) : (
                    assignment.groundTeam.map(member => (
                      <div key={member.id} className="p-3 rounded-lg border bg-card">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <Badge variant="secondary" className="text-xs mt-1">{member.designation}</Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {member.phone}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground flex gap-4">
                          <span>Home: {member.homeLocation}</span>
                          <span>Work: {member.workLocation}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
