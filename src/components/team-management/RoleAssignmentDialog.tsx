import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CalendarIcon, 
  UserPlus, 
  UserMinus, 
  RefreshCw, 
  AlertTriangle,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { RoleNode } from '@/pages/national-head/TeamManagement';
import { useToast } from '@/hooks/use-toast';

interface RoleAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleNode: RoleNode | null;
  mode: 'assign' | 'remove' | 'reassign';
}

// Mock employees for assignment
const mockAvailableEmployees = [
  { id: 'emp-new-1', name: 'Arun Kumar', email: 'arun.kumar@lnj.com', phone: '+91 9876500001' },
  { id: 'emp-new-2', name: 'Meera Reddy', email: 'meera.reddy@lnj.com', phone: '+91 9876500002' },
  { id: 'emp-new-3', name: 'Sanjay Gupta', email: 'sanjay.gupta@lnj.com', phone: '+91 9876500003' },
  { id: 'emp-new-4', name: 'Kavita Singh', email: 'kavita.singh@lnj.com', phone: '+91 9876500004' },
  { id: 'emp-new-5', name: 'Rohit Sharma', email: 'rohit.sharma@lnj.com', phone: '+91 9876500005' },
];

export const RoleAssignmentDialog: React.FC<RoleAssignmentDialogProps> = ({
  open,
  onOpenChange,
  roleNode,
  mode,
}) => {
  const { toast } = useToast();
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [removalReason, setRemovalReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!roleNode) return null;

  const getTitle = () => {
    switch (mode) {
      case 'assign':
        return `Assign ${roleNode.roleDisplayName}`;
      case 'remove':
        return `Remove from ${roleNode.roleDisplayName}`;
      case 'reassign':
        return `Reassign ${roleNode.roleDisplayName}`;
      default:
        return 'Manage Role';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'assign':
        return 'Select an employee to assign to this role position.';
      case 'remove':
        return `Remove ${roleNode.currentAssignee?.name} from this role. This will mark the position as vacant.`;
      case 'reassign':
        return `Replace ${roleNode.currentAssignee?.name} with a new assignee. The current assignment will be recorded in history.`;
      default:
        return '';
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: mode === 'remove' ? 'Employee Removed' : 'Assignment Updated',
      description: mode === 'remove' 
        ? `${roleNode.currentAssignee?.name} has been removed from ${roleNode.roleDisplayName}`
        : `Role ${roleNode.roleDisplayName} has been ${mode === 'assign' ? 'assigned' : 'reassigned'} successfully`,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedEmployee('');
    setStartDate(new Date());
    setEndDate(undefined);
    setRemovalReason('');
  };

  const selectedEmployeeData = mockAvailableEmployees.find(e => e.id === selectedEmployee);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'assign' && <UserPlus className="h-5 w-5 text-primary" />}
            {mode === 'remove' && <UserMinus className="h-5 w-5 text-destructive" />}
            {mode === 'reassign' && <RefreshCw className="h-5 w-5 text-primary" />}
            {getTitle()}
          </DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Assignee Info (for remove/reassign) */}
          {(mode === 'remove' || mode === 'reassign') && roleNode.currentAssignee && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Current Assignee</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{roleNode.currentAssignee.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Since {format(new Date(roleNode.currentAssignee.assignmentStartDate), 'dd MMM yyyy')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {mode === 'remove' && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : 'Select end date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Removal *</Label>
                <Textarea
                  id="reason"
                  value={removalReason}
                  onChange={(e) => setRemovalReason(e.target.value)}
                  placeholder="Enter reason for removing this employee from the role..."
                  rows={3}
                />
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-800">
                  This action will mark the position as vacant. The employee's assignment history will be preserved.
                </p>
              </div>
            </>
          )}

          {(mode === 'assign' || mode === 'reassign') && (
            <>
              {mode === 'reassign' && <Separator />}
              
              <div className="space-y-2">
                <Label>Select Employee *</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an employee to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAvailableEmployees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>
                        <div className="flex items-center gap-2">
                          <span>{emp.name}</span>
                          <span className="text-muted-foreground text-xs">({emp.email})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEmployeeData && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{selectedEmployeeData.name}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {selectedEmployeeData.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {selectedEmployeeData.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Assignment Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : 'Select start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {mode === 'reassign' && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    The current assignee's record will be preserved in the assignment history with today as their end date.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || (mode !== 'remove' && !selectedEmployee)}
            variant={mode === 'remove' ? 'destructive' : 'default'}
          >
            {isSubmitting ? 'Processing...' : mode === 'remove' ? 'Remove' : mode === 'assign' ? 'Assign' : 'Reassign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
