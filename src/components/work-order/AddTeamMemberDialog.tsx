import { useState } from "react";
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MobilisationTeamMember } from "./WorkOrderAssignmentTab";

interface AddTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (member: Omit<MobilisationTeamMember, 'id' | 'employeeId'>) => void;
  existingMembers: MobilisationTeamMember[];
}

const roleOptions = [
  { value: 'state_head', label: 'State Head', salary: 85000 },
  { value: 'project_head', label: 'Project Head', salary: 85000 },
  { value: 'operation_manager', label: 'Operation Manager', salary: 55000 },
  { value: 'centre_manager', label: 'Centre Manager', salary: 50000 },
  { value: 'mobilisation_manager', label: 'Mobilisation Manager', salary: 45000 },
  { value: 'mobiliser', label: 'Mobiliser', salary: 25000 },
];

const AddTeamMemberDialog = ({ open, onOpenChange, onAdd, existingMembers }: AddTeamMemberDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '' as MobilisationTeamMember['role'] | '',
    salary: 0,
    department: '',
    experience: '',
    qualification: '',
    reportingTo: '',
  });

  const handleRoleChange = (value: string) => {
    const roleOption = roleOptions.find(r => r.value === value);
    setFormData(prev => ({
      ...prev,
      role: value as MobilisationTeamMember['role'],
      salary: roleOption?.salary || 0,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.role) return;

    const roleOption = roleOptions.find(r => r.value === formData.role);
    
    onAdd({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role as MobilisationTeamMember['role'],
      roleDisplayName: roleOption?.label || '',
      salary: formData.salary,
      assignmentStartDate: new Date().toISOString().split('T')[0],
      assignmentEndDate: null,
      status: 'pending_approval',
      department: formData.department,
      experience: formData.experience,
      qualification: formData.qualification,
      reportingTo: formData.reportingTo,
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      salary: 0,
      department: '',
      experience: '',
      qualification: '',
      reportingTo: '',
    });
    onOpenChange(false);
  };

  // Get potential reporting managers based on selected role
  const getReportingOptions = () => {
    if (!formData.role) return [];
    
    const roleHierarchy: Record<string, string[]> = {
      operation_manager: ['state_head', 'project_head'],
      centre_manager: ['state_head', 'project_head'],
      mobilisation_manager: ['operation_manager', 'centre_manager'],
      mobiliser: ['mobilisation_manager'],
    };

    const allowedRoles = roleHierarchy[formData.role] || [];
    return existingMembers.filter(m => 
      allowedRoles.includes(m.role) && m.status === 'active'
    );
  };

  const reportingOptions = getReportingOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Team Member
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {reportingOptions.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="reportingTo">Reports To</Label>
              <Select 
                value={formData.reportingTo} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, reportingTo: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reporting manager" />
                </SelectTrigger>
                <SelectContent>
                  {reportingOptions.map(m => (
                    <SelectItem key={m.employeeId} value={m.employeeId}>
                      {m.name} ({m.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Monthly Salary (₹)</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="e.g. Operations"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="e.g. 3 years"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                value={formData.qualification}
                onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                placeholder="e.g. MBA"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.name || !formData.email || !formData.role}
          >
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamMemberDialog;
