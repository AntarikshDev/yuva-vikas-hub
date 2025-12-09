import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { createTarget, TargetType, TargetPeriod, RoleType, AllocationMethod } from '@/store/slices/targetManagementSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';
import { format, addDays, addWeeks, addMonths, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Target, Users, Calendar, Settings2 } from 'lucide-react';

export const TargetAssignmentForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.targetManagement);

  const [targetType, setTargetType] = useState<TargetType>('mobilisation');
  const [period, setPeriod] = useState<TargetPeriod>('month');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [targetValue, setTargetValue] = useState('');
  const [assignToRole, setAssignToRole] = useState<RoleType>('state_head');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [allocationMethod, setAllocationMethod] = useState<AllocationMethod>('equal');
  const [cascadeDown, setCascadeDown] = useState(true);
  const [notifyAssignees, setNotifyAssignees] = useState(true);
  const [notes, setNotes] = useState('');
  const [state, setState] = useState('all');
  const [program, setProgram] = useState('all');

  const targetTypes: { value: TargetType; label: string; description?: string }[] = [
    { value: 'mobilisation', label: 'Mobilisation', description: 'Initial candidate outreach' },
    { value: 'ofr_registration', label: 'OFR (Registration)', description: 'Online Form Registration - higher buffer for dropouts' },
    { value: 'approved_ofr', label: 'Approved OFR', description: 'Verified and approved registrations' },
    { value: 'migration', label: 'Migration', description: 'Candidate migration to training center' },
    { value: 'enrolment', label: 'Enrolment', description: 'Final enrollment - no carry forward' },
    { value: 'training_completion', label: 'Training Completion', description: 'Training completion - no carry forward' },
    { value: 'assessment', label: 'Assessment', description: 'Assessment completion - no carry forward' },
    { value: 'placement', label: 'Placement', description: 'Job placement - no carry forward' },
    { value: 'retention', label: 'Retention', description: 'Post-placement retention - no carry forward' },
  ];

  const roles: { value: RoleType; label: string }[] = [
    { value: 'national_head', label: 'National Head' },
    { value: 'state_head', label: 'State Head' },
    { value: 'cluster_manager', label: 'Cluster Manager' },
    { value: 'manager', label: 'Manager' },
    { value: 'mobiliser', label: 'Mobiliser' },
  ];

  const allocationMethods: { value: AllocationMethod; label: string; description: string }[] = [
    { value: 'equal', label: 'Equal Distribution', description: 'Divide equally among all assignees' },
    { value: 'weighted', label: 'Weighted by Performance', description: 'Based on past performance metrics' },
    { value: 'capacity', label: 'Capacity Based', description: 'Based on team capacity and size' },
    { value: 'manual', label: 'Manual Assignment', description: 'Manually specify each assignment' },
  ];

  const states = ['All States', 'Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh'];
  const programs = ['All Programs', 'DDU-GKY', 'PMKVY', 'State Skill Mission'];

  const handlePeriodChange = (newPeriod: TargetPeriod) => {
    setPeriod(newPeriod);
    const today = new Date();
    
    switch (newPeriod) {
      case 'day':
        setDateRange({ from: startOfDay(today), to: endOfDay(today) });
        break;
      case 'week':
        setDateRange({ from: startOfWeek(today), to: endOfWeek(today) });
        break;
      case 'month':
        setDateRange({ from: startOfMonth(today), to: endOfMonth(today) });
        break;
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    if (emp.status !== 'active') return false;
    if (emp.role !== assignToRole) return false;
    if (state !== 'all' && emp.state !== state) return false;
    return true;
  });

  const handleSubmit = async () => {
    if (!targetValue || !dateRange?.from || !dateRange?.to) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!selectedEmployee && allocationMethod !== 'equal') {
      toast.error('Please select an employee or use equal distribution');
      return;
    }

    try {
      const employee = employees.find((e) => e.id === selectedEmployee) || employees[0];
      
      await dispatch(createTarget({
        type: targetType,
        period,
        periodStart: format(dateRange.from, 'yyyy-MM-dd'),
        periodEnd: format(dateRange.to, 'yyyy-MM-dd'),
        value: parseInt(targetValue),
        assignedTo: selectedEmployee || 'TEAM',
        assignedToName: employee?.name || 'Team Distribution',
        assignedToRole: assignToRole,
        assignedBy: 'current_user',
        assignedByName: 'Current User',
        status: 'active',
        notes,
        state: state !== 'all' ? state : undefined,
        program: program !== 'all' ? program : undefined,
      })).unwrap();

      toast.success('Target assigned successfully');
      
      // Reset form
      setTargetValue('');
      setSelectedEmployee('');
      setNotes('');
    } catch (error) {
      toast.error('Failed to assign target');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Form */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Create New Target
          </CardTitle>
          <CardDescription>
            Define and assign targets to your team hierarchy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Target Type */}
          <div className="space-y-2">
            <Label>Target Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {targetTypes.map((type) => (
                <Button
                  key={type.value}
                  type="button"
                  variant={targetType === type.value ? 'default' : 'outline'}
                  className="w-full text-xs h-auto py-2 px-2"
                  onClick={() => setTargetType(type.value)}
                  title={type.description}
                >
                  {type.label}
                </Button>
              ))}
            </div>
            {['enrolment', 'training_completion', 'assessment', 'placement', 'retention'].includes(targetType) && (
              <p className="text-xs text-amber-600 mt-2">
                ⚠️ This target type cannot be carried forward. Any shortfall will be counted as dropout.
              </p>
            )}
          </div>

          {/* Period Selection */}
          <div className="space-y-2">
            <Label>Target Period</Label>
            <RadioGroup
              value={period}
              onValueChange={(value) => handlePeriodChange(value as TargetPeriod)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="day" id="day" />
                <Label htmlFor="day" className="cursor-pointer">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="week" id="week" />
                <Label htmlFor="week" className="cursor-pointer">Weekly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="month" id="month" />
                <Label htmlFor="month" className="cursor-pointer">Monthly</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Select date range"
            />
            {dateRange?.from && dateRange?.to && (
              <p className="text-sm text-muted-foreground">
                Duration: {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            )}
          </div>

          {/* Target Value */}
          <div className="space-y-2">
            <Label htmlFor="targetValue">Target Value</Label>
            <Input
              id="targetValue"
              type="number"
              placeholder="Enter target value"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
            />
          </div>

          {/* State & Program Filter */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {states.map((s) => (
                    <SelectItem key={s} value={s === 'All States' ? 'all' : s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Program</Label>
              <Select value={program} onValueChange={setProgram}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((p) => (
                    <SelectItem key={p} value={p === 'All Programs' ? 'all' : p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assign To Role */}
          <div className="space-y-2">
            <Label>Assign to Role</Label>
            <Select value={assignToRole} onValueChange={(v) => setAssignToRole(v as RoleType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Select Employee */}
          <div className="space-y-2">
            <Label>Select Employee (Optional for Equal Distribution)</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee or leave for team distribution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {assignToRole.replace('_', ' ')}s</SelectItem>
                {filteredEmployees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} - {emp.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional instructions or context..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Options */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cascade"
                checked={cascadeDown}
                onCheckedChange={(checked) => setCascadeDown(checked as boolean)}
              />
              <Label htmlFor="cascade" className="text-sm cursor-pointer">
                Automatically cascade targets down the hierarchy
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify"
                checked={notifyAssignees}
                onCheckedChange={(checked) => setNotifyAssignees(checked as boolean)}
              />
              <Label htmlFor="notify" className="text-sm cursor-pointer">
                Send notifications to all assignees
              </Label>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full" size="lg">
            Assign Target
          </Button>
        </CardContent>
      </Card>

      {/* Allocation Method Sidebar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Allocation Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={allocationMethod}
            onValueChange={(value) => setAllocationMethod(value as AllocationMethod)}
            className="space-y-4"
          >
            {allocationMethods.map((method) => (
              <div
                key={method.value}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  allocationMethod === method.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setAllocationMethod(method.value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={method.value} id={method.value} />
                  <Label htmlFor={method.value} className="font-medium cursor-pointer">
                    {method.label}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1 ml-6">
                  {method.description}
                </p>
              </div>
            ))}
          </RadioGroup>

          {/* Role Hierarchy Info */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Role Hierarchy</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Director → National Head</p>
              <p>National Head → State Head</p>
              <p>State Head → Cluster Manager</p>
              <p>Cluster Manager → Manager</p>
              <p>Manager → Mobiliser</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
