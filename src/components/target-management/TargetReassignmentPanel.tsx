import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { reassignTarget, Target, Employee } from '@/store/slices/targetManagementSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowRightLeft, Search, User } from 'lucide-react';

export const TargetReassignmentPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { targets, employees, loading } = useAppSelector((state) => state.targetManagement);
  
  const [searchEmployee, setSearchEmployee] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [newEmployeeId, setNewEmployeeId] = useState('');
  const [reassignAmount, setReassignAmount] = useState('');
  const [reassignReason, setReassignReason] = useState('');

  const activeEmployees = employees.filter((emp) => emp.status === 'active');
  const filteredEmployees = activeEmployees.filter((emp) =>
    emp.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchEmployee.toLowerCase())
  );

  const employeeTargets = selectedEmployee
    ? targets.filter((t) => t.assignedTo === selectedEmployee.id && t.status === 'active')
    : [];

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleReassignClick = (target: Target) => {
    setSelectedTarget(target);
    setReassignAmount(String(target.value - target.achieved));
    setShowReassignDialog(true);
  };

  const handleReassign = async () => {
    if (!selectedTarget || !newEmployeeId || !reassignReason) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newEmployee = employees.find((e) => e.id === newEmployeeId);
    if (!newEmployee) {
      toast.error('Invalid employee selected');
      return;
    }

    try {
      await dispatch(reassignTarget({
        targetId: selectedTarget.id,
        fromEmployeeId: selectedTarget.assignedTo,
        toEmployeeId: newEmployeeId,
        toEmployeeName: newEmployee.name,
        toEmployeeRole: newEmployee.role,
        amount: parseInt(reassignAmount),
        reason: reassignReason,
        reassignedBy: 'current_user',
      })).unwrap();

      toast.success('Target reassigned successfully');
      setShowReassignDialog(false);
      setSelectedTarget(null);
      setNewEmployeeId('');
      setReassignAmount('');
      setReassignReason('');
    } catch (error) {
      toast.error('Failed to reassign target');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-800',
      completed: 'bg-blue-100 text-blue-800',
      carried_forward: 'bg-amber-100 text-amber-800',
      reassigned: 'bg-purple-100 text-purple-800',
      void: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Select Employee
          </CardTitle>
          <CardDescription>Choose an employee to view their targets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchEmployee}
              onChange={(e) => setSearchEmployee(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedEmployee?.id === employee.id
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleSelectEmployee(employee)}
              >
                <div className="font-medium">{employee.name}</div>
                <div className="text-sm text-muted-foreground">
                  {employee.role.replace('_', ' ')} • {employee.state}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {employee.activeTargets} active targets
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Employee Targets */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            {selectedEmployee ? `${selectedEmployee.name}'s Targets` : 'Employee Targets'}
          </CardTitle>
          <CardDescription>
            {selectedEmployee
              ? 'Select a target to reassign'
              : 'Select an employee from the list to view their targets'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedEmployee ? (
            employeeTargets.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Target</TableHead>
                    <TableHead className="text-right">Achieved</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeTargets.map((target) => (
                    <TableRow key={target.id}>
                      <TableCell className="capitalize">{target.type}</TableCell>
                      <TableCell>
                        {target.periodStart} - {target.periodEnd}
                      </TableCell>
                      <TableCell className="text-right">{target.value}</TableCell>
                      <TableCell className="text-right text-emerald-600">
                        {target.achieved}
                      </TableCell>
                      <TableCell className="text-right text-amber-600 font-medium">
                        {target.value - target.achieved}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(target.status)}>
                          {target.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReassignClick(target)}
                        >
                          Reassign
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No active targets found for this employee
              </div>
            )
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Select an employee from the list to view their targets
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reassign Dialog */}
      <Dialog open={showReassignDialog} onOpenChange={setShowReassignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Target</DialogTitle>
            <DialogDescription>
              Transfer this target to another employee
            </DialogDescription>
          </DialogHeader>

          {selectedTarget && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Target Type</span>
                  <span className="font-medium capitalize">{selectedTarget.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current Assignee</span>
                  <span className="font-medium">{selectedTarget.assignedToName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pending Amount</span>
                  <span className="font-medium text-amber-600">
                    {selectedTarget.value - selectedTarget.achieved}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>New Assignee</Label>
                <Select value={newEmployeeId} onValueChange={setNewEmployeeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeEmployees
                      .filter((e) => e.id !== selectedTarget.assignedTo)
                      .map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name} - {emp.role.replace('_', ' ')}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amount to Reassign</Label>
                <Input
                  type="number"
                  value={reassignAmount}
                  onChange={(e) => setReassignAmount(e.target.value)}
                  max={selectedTarget.value - selectedTarget.achieved}
                />
                <p className="text-xs text-muted-foreground">
                  Max: {selectedTarget.value - selectedTarget.achieved}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Reason for Reassignment</Label>
                <Textarea
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  placeholder="Enter reason for reassignment..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReassignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReassign} disabled={loading}>
              Confirm Reassignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
