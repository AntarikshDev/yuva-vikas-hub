import { User, Mail, Phone, Briefcase, GraduationCap, Calendar, Building2, IndianRupee } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MobilisationTeamMember } from "./WorkOrderAssignmentTab";
import { cn } from "@/lib/utils";

interface EmployeeProfileDialogProps {
  member: MobilisationTeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  pending_approval: { variant: "secondary", label: "Pending Approval" },
  removed: { variant: "destructive", label: "Removed" },
  vacant: { variant: "outline", label: "Vacant" },
};

const EmployeeProfileDialog = ({ member, open, onOpenChange }: EmployeeProfileDialogProps) => {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Employee Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <Badge variant="outline" className="font-mono">
                  {member.employeeId}
                </Badge>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={cn("font-normal", roleColors[member.role])}>
                  {member.roleDisplayName}
                </Badge>
                <Badge variant={statusBadges[member.status].variant}>
                  {statusBadges[member.status].label}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member.phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Professional Details */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Professional Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{member.department || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="text-sm font-medium">{member.experience || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Qualification</p>
                  <p className="text-sm font-medium">{member.qualification || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IndianRupee className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Salary</p>
                  <p className="text-sm font-medium">₹{member.salary.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Assignment Details */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Assignment Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="text-sm font-medium">{member.assignmentStartDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">End Date</p>
                  <p className="text-sm font-medium">{member.assignmentEndDate || 'Ongoing'}</p>
                </div>
              </div>
              {member.reportingTo && (
                <div className="flex items-start gap-3 col-span-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Reports To</p>
                    <p className="text-sm font-medium">{member.reportingTo}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Approval Info */}
          {member.approvedBy && (
            <>
              <Separator />
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Approved by</p>
                <p className="text-sm font-medium">{member.approvedBy} on {member.approvedDate}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeProfileDialog;
