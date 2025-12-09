import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { handleEmployeeDeparture, Employee, Target } from '@/store/slices/targetManagementSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { AlertTriangle, UserMinus, UserPlus, CheckCircle2 } from 'lucide-react';

export const EmployeeDepartureHandler: React.FC = () => {
  const dispatch = useAppDispatch();
  const { targets, employees, loading } = useAppSelector((state) => state.targetManagement);
  
  const [selectedDeparted, setSelectedDeparted] = useState<Employee | null>(null);
  const [reassignments, setReassignments] = useState<Record<string, string>>({});

  const departedEmployees = employees.filter((emp) => emp.status === 'departed' && emp.pendingTargets > 0);
  const activeEmployees = employees.filter((emp) => emp.status === 'active');

  const departedTargets = selectedDeparted
    ? targets.filter((t) => t.assignedTo === selectedDeparted.id && t.status === 'active')
    : [];

  const handleReassignmentChange = (targetId: string, newEmployeeId: string) => {
    setReassignments({ ...reassignments, [targetId]: newEmployeeId });
  };

  const handleProcessDeparture = async () => {
    if (!selectedDeparted) return;

    const allAssigned = departedTargets.every((t) => reassignments[t.id]);
    if (!allAssigned) {
      toast.error('Please assign all targets to new employees');
      return;
    }

    try {
      await dispatch(handleEmployeeDeparture({
        departedEmployeeId: selectedDeparted.id,
        reassignments: departedTargets.map((t) => ({
          targetId: t.id,
          newEmployeeId: reassignments[t.id],
          newEmployeeName: activeEmployees.find((e) => e.id === reassignments[t.id])?.name || '',
        })),
      })).unwrap();

      toast.success('All targets have been reassigned');
      setSelectedDeparted(null);
      setReassignments({});
    } catch (error) {
      toast.error('Failed to process departure');
    }
  };

  const handleAssignToManager = () => {
    if (!selectedDeparted) return;

    const newAssignments: Record<string, string> = {};
    departedTargets.forEach((target) => {
      // Find manager or first available active employee
      const manager = activeEmployees.find((e) => e.id === selectedDeparted.managerId);
      if (manager) {
        newAssignments[target.id] = manager.id;
      } else if (activeEmployees.length > 0) {
        newAssignments[target.id] = activeEmployees[0].id;
      }
    });
    setReassignments(newAssignments);
  };

  if (departedEmployees.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
          <h3 className="text-lg font-medium">No Pending Departures</h3>
          <p className="text-muted-foreground text-center mt-2">
            All departed employees' targets have been reassigned.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Action Required</AlertTitle>
        <AlertDescription>
          {departedEmployees.length} departed employee(s) have pending targets that need to be reassigned.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Departed Employees List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserMinus className="h-5 w-5 text-red-500" />
              Departed Employees
            </CardTitle>
            <CardDescription>Employees with pending target assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {departedEmployees.map((employee) => (
              <div
                key={employee.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedDeparted?.id === employee.id
                    ? 'border-red-500 bg-red-50'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  setSelectedDeparted(employee);
                  setReassignments({});
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {employee.role.replace('_', ' ')} • {employee.state}
                    </div>
                  </div>
                  <Badge variant="destructive">{employee.pendingTargets} pending</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Departed: {employee.departureDate}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Target Reassignment */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-emerald-500" />
                  {selectedDeparted ? `Reassign ${selectedDeparted.name}'s Targets` : 'Target Reassignment'}
                </CardTitle>
                <CardDescription>
                  {selectedDeparted
                    ? 'Assign each target to a new employee'
                    : 'Select a departed employee to view and reassign their targets'}
                </CardDescription>
              </div>
              {selectedDeparted && (
                <Button variant="outline" size="sm" onClick={handleAssignToManager}>
                  Assign All to Manager
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedDeparted ? (
              departedTargets.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Target Type</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-right">Pending</TableHead>
                        <TableHead>New Assignee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departedTargets.map((target) => (
                        <TableRow key={target.id}>
                          <TableCell className="capitalize font-medium">{target.type}</TableCell>
                          <TableCell>
                            {target.periodStart} - {target.periodEnd}
                          </TableCell>
                          <TableCell className="text-right text-amber-600 font-medium">
                            {target.value - target.achieved}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={reassignments[target.id] || ''}
                              onValueChange={(value) => handleReassignmentChange(target.id, value)}
                            >
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select employee" />
                              </SelectTrigger>
                              <SelectContent>
                                {activeEmployees.map((emp) => (
                                  <SelectItem key={emp.id} value={emp.id}>
                                    {emp.name} - {emp.role.replace('_', ' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={handleProcessDeparture}
                      disabled={loading || !departedTargets.every((t) => reassignments[t.id])}
                    >
                      Confirm All Reassignments
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No active targets found for this employee
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a departed employee from the list to reassign their targets
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
