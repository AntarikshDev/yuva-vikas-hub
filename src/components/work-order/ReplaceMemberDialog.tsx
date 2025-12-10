import { useState } from "react";
import { UserCog, History, ArrowRight } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MobilisationTeamMember } from "./WorkOrderAssignmentTab";

export interface AssignmentHistory {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  startDate: string;
  endDate: string;
  reason: string;
  replacedBy?: string;
}

interface ReplaceMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberToReplace: MobilisationTeamMember | null;
  onReplace: (
    memberId: string,
    newMember: Omit<MobilisationTeamMember, 'id' | 'employeeId'>,
    reason: string
  ) => void;
  availableEmployees: { id: string; name: string; email: string; phone: string }[];
  assignmentHistory: AssignmentHistory[];
}

const ReplaceMemberDialog = ({
  open,
  onOpenChange,
  memberToReplace,
  onReplace,
  availableEmployees,
  assignmentHistory,
}: ReplaceMemberDialogProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [reason, setReason] = useState("");
  const [salary, setSalary] = useState(memberToReplace?.salary || 0);
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const positionHistory = assignmentHistory.filter(
    (h) => h.role === memberToReplace?.role
  );

  const handleSubmit = () => {
    if (!selectedEmployee || !reason || !memberToReplace) return;

    const employee = availableEmployees.find((e) => e.id === selectedEmployee);
    if (!employee) return;

    onReplace(
      memberToReplace.id,
      {
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        role: memberToReplace.role,
        roleDisplayName: memberToReplace.roleDisplayName,
        salary,
        assignmentStartDate: effectiveDate,
        assignmentEndDate: null,
        status: "pending_approval",
        department: memberToReplace.department,
        experience: "",
        qualification: "",
        reportingTo: memberToReplace.reportingTo,
      },
      reason
    );

    // Reset form
    setSelectedEmployee("");
    setReason("");
    setSalary(0);
    onOpenChange(false);
  };

  if (!memberToReplace) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Replace Team Member
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Member Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Current Assignee</h4>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold">
                  {memberToReplace.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{memberToReplace.name}</span>
                  <Badge variant="outline">{memberToReplace.employeeId}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {memberToReplace.roleDisplayName} • ₹
                  {memberToReplace.salary.toLocaleString()}/month
                </p>
                <p className="text-xs text-muted-foreground">
                  Assigned since: {memberToReplace.assignmentStartDate}
                </p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center border-2 border-dashed border-green-300">
                <span className="text-green-600 text-lg font-semibold">?</span>
              </div>
            </div>
          </div>

          {/* Replacement Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="replacement">Select Replacement *</Label>
              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Search and select employee..." />
                </SelectTrigger>
                <SelectContent>
                  {availableEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date *</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Monthly Salary (₹)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Replacement *</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for replacement (e.g., Resignation, Transfer, Performance, etc.)"
                rows={3}
              />
            </div>
          </div>

          {/* Assignment History */}
          {positionHistory.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium">
                    Position Assignment History
                  </h4>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {positionHistory.map((history) => (
                    <div
                      key={history.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm"
                    >
                      <div>
                        <span className="font-medium">{history.employeeName}</span>
                        <span className="text-muted-foreground ml-2">
                          ({history.employeeId})
                        </span>
                      </div>
                      <div className="text-right text-muted-foreground">
                        <div>
                          {history.startDate} - {history.endDate}
                        </div>
                        <div className="text-xs">{history.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedEmployee || !reason}
          >
            Replace Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplaceMemberDialog;
