import { AlertCircle, CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobilisationTeamMember } from "./WorkOrderAssignmentTab";
import { cn } from "@/lib/utils";

interface TeamApprovalPanelProps {
  pendingMembers: MobilisationTeamMember[];
  onApprove: (memberId: string) => void;
  onReject: (memberId: string) => void;
  onViewProfile: (member: MobilisationTeamMember) => void;
}

const roleColors: Record<string, string> = {
  state_head: "bg-purple-100 text-purple-800",
  project_head: "bg-purple-100 text-purple-800",
  operation_manager: "bg-blue-100 text-blue-800",
  centre_manager: "bg-green-100 text-green-800",
  mobilisation_manager: "bg-amber-100 text-amber-800",
  mobiliser: "bg-orange-100 text-orange-800",
};

const TeamApprovalPanel = ({ pendingMembers, onApprove, onReject, onViewProfile }: TeamApprovalPanelProps) => {
  const handleApproveAll = () => {
    pendingMembers.forEach(m => onApprove(m.id));
  };

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900">Pending Team Approvals</h3>
            <p className="text-sm text-amber-700">
              {pendingMembers.length} team member{pendingMembers.length > 1 ? 's' : ''} awaiting your approval
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleApproveAll}
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve All
          </Button>
        </div>

        <div className="space-y-2">
          {pendingMembers.map((member) => (
            <div 
              key={member.id}
              className="flex items-center justify-between p-3 bg-background rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{member.name}</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {member.employeeId}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge className={cn("text-xs font-normal", roleColors[member.role])}>
                      {member.roleDisplayName}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ₹{member.salary.toLocaleString()}/mo
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewProfile(member)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(member.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onApprove(member.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamApprovalPanel;
