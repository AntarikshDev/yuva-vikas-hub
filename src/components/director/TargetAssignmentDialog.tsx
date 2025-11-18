import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { createTargetAssignment } from '@/store/slices/directorSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface TargetAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Validation schema
const targetAssignmentSchema = z.object({
  programName: z.string().min(1, 'Program is required'),
  workOrderNo: z.string()
    .min(1, 'Work Order No. is required')
    .max(50, 'Work Order No. must be less than 50 characters')
    .regex(/^[A-Z0-9/-]+$/, 'Work Order No. must contain only uppercase letters, numbers, slashes, and hyphens'),
  businessHead: z.string().min(1, 'Business Head is required'),
  cycle: z.number().min(1, 'Cycle must be at least 1').max(10, 'Cycle must be at most 10'),
  enrolmentTarget: z.number().min(1, 'Enrolment target must be at least 1').max(10000, 'Enrolment target must be at most 10,000'),
  enrolmentStartDate: z.date({ required_error: 'Enrolment start date is required' }),
  enrolmentDeadline: z.date({ required_error: 'Enrolment deadline is required' }),
  placementTarget: z.number().min(1, 'Placement target must be at least 1').max(10000, 'Placement target must be at most 10,000'),
  placementStartDate: z.date({ required_error: 'Placement start date is required' }),
  placementDeadline: z.date({ required_error: 'Placement deadline is required' }),
  st: z.number().min(0, 'Must be 0 or greater').max(5000),
  sc: z.number().min(0, 'Must be 0 or greater').max(5000),
  obc: z.number().min(0, 'Must be 0 or greater').max(5000),
  general: z.number().min(0, 'Must be 0 or greater').max(5000),
  minority: z.number().min(0, 'Must be 0 or greater').max(5000),
  districts: z.array(z.string()).min(1, 'At least one district is required'),
  roleAssignments: z.array(z.object({
    role: z.string().min(1, 'Role is required'),
    employeeIds: z.array(z.string()).min(1, 'At least one employee is required'),
  })).min(1, 'At least one role assignment is required'),
  fixedBudget: z.number().min(0, 'Fixed budget must be 0 or greater'),
  variableBudget: z.number().min(0, 'Variable budget must be 0 or greater'),
}).refine((data) => data.enrolmentDeadline > data.enrolmentStartDate, {
  message: 'Enrolment deadline must be after start date',
  path: ['enrolmentDeadline'],
}).refine((data) => data.placementDeadline > data.placementStartDate, {
  message: 'Placement deadline must be after start date',
  path: ['placementDeadline'],
}).refine((data) => data.placementTarget <= data.enrolmentTarget, {
  message: 'Placement target cannot exceed enrolment target',
  path: ['placementTarget'],
}).refine((data) => (data.st + data.sc + data.obc + data.general + data.minority) === data.enrolmentTarget, {
  message: 'Category targets must sum to enrolment target',
  path: ['st'],
});

type FormValues = z.infer<typeof targetAssignmentSchema>;

// Mock data
const programs = [
  { id: 'DDUGKY', name: 'DDUGKY' },
  { id: 'UPSDM', name: 'UPSDM' },
  { id: 'JSDMS', name: 'JSDMS' },
  { id: 'OSDA', name: 'OSDA' },
  { id: 'WDC', name: 'WDC' },
];

const businessHeads = [
  { id: 'bh-001', name: 'Rajesh Kumar' },
  { id: 'bh-002', name: 'Priya Sharma' },
  { id: 'bh-003', name: 'Amit Patel' },
  { id: 'bh-004', name: 'Sneha Reddy' },
];

const cycles = Array.from({ length: 5 }, (_, i) => ({ value: i + 1, label: `Cycle ${i + 1}` }));

const stateDistrictData = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Thane'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tirunelveli'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Darjeeling'],
};

const organizationRoles = [
  { id: 'mobiliser', name: 'Mobiliser' },
  { id: 'mobiliser_manager', name: 'Mobiliser Manager' },
  { id: 'counsellor', name: 'Counsellor' },
  { id: 'center_manager', name: 'Center Manager' },
  { id: 'trainer', name: 'Trainer' },
  { id: 'placement_coordinator', name: 'Placement Coordinator' },
  { id: 'data_entry_operator', name: 'Data Entry Operator' },
  { id: 'cluster_manager', name: 'Cluster Manager' },
];

// Mock employee data - will be fetched from HR portal in future
const mockEmployees = [
  // Mobilisers
  { id: 'emp-001', name: 'Rahul Verma', role: 'mobiliser', state: 'Maharashtra', monthlySalary: 24000 },
  { id: 'emp-002', name: 'Priya Singh', role: 'mobiliser', state: 'Maharashtra', monthlySalary: 25000 },
  { id: 'emp-003', name: 'Amit Kumar', role: 'mobiliser', state: 'Karnataka', monthlySalary: 23000 },
  { id: 'emp-004', name: 'Sneha Patil', role: 'mobiliser', state: 'Tamil Nadu', monthlySalary: 26000 },
  { id: 'emp-005', name: 'Rajesh Sharma', role: 'mobiliser', state: 'Uttar Pradesh', monthlySalary: 22000 },
  
  // Mobiliser Managers
  { id: 'emp-006', name: 'Vikram Desai', role: 'mobiliser_manager', state: 'Maharashtra', monthlySalary: 38000 },
  { id: 'emp-007', name: 'Anjali Reddy', role: 'mobiliser_manager', state: 'Karnataka', monthlySalary: 35000 },
  { id: 'emp-008', name: 'Suresh Nair', role: 'mobiliser_manager', state: 'Tamil Nadu', monthlySalary: 37000 },
  
  // Counsellors
  { id: 'emp-009', name: 'Meera Joshi', role: 'counsellor', state: 'Maharashtra', monthlySalary: 30000 },
  { id: 'emp-010', name: 'Karan Mehta', role: 'counsellor', state: 'Karnataka', monthlySalary: 32000 },
  { id: 'emp-011', name: 'Pooja Iyer', role: 'counsellor', state: 'Tamil Nadu', monthlySalary: 29000 },
  
  // Center Managers
  { id: 'emp-012', name: 'Anil Gupta', role: 'center_manager', state: 'Maharashtra', monthlySalary: 45000 },
  { id: 'emp-013', name: 'Divya Rao', role: 'center_manager', state: 'Karnataka', monthlySalary: 47000 },
  { id: 'emp-014', name: 'Sanjay Mishra', role: 'center_manager', state: 'Uttar Pradesh', monthlySalary: 43000 },
  
  // Trainers
  { id: 'emp-015', name: 'Ravi Krishnan', role: 'trainer', state: 'Maharashtra', monthlySalary: 40000 },
  { id: 'emp-016', name: 'Lakshmi Nair', role: 'trainer', state: 'Karnataka', monthlySalary: 42000 },
  { id: 'emp-017', name: 'Arjun Shetty', role: 'trainer', state: 'Tamil Nadu', monthlySalary: 39000 },
  
  // Placement Coordinators
  { id: 'emp-018', name: 'Neha Agarwal', role: 'placement_coordinator', state: 'Maharashtra', monthlySalary: 35000 },
  { id: 'emp-019', name: 'Rohit Kapoor', role: 'placement_coordinator', state: 'Karnataka', monthlySalary: 36000 },
  
  // Data Entry Operators
  { id: 'emp-020', name: 'Manish Tiwari', role: 'data_entry_operator', state: 'Maharashtra', monthlySalary: 20000 },
  { id: 'emp-021', name: 'Kavita Yadav', role: 'data_entry_operator', state: 'Karnataka', monthlySalary: 21000 },
  
  // Cluster Managers
  { id: 'emp-022', name: 'Sunil Pandey', role: 'cluster_manager', state: 'Maharashtra', monthlySalary: 60000 },
  { id: 'emp-023', name: 'Deepa Kulkarni', role: 'cluster_manager', state: 'Karnataka', monthlySalary: 62000 },
];

export function TargetAssignmentDialog({ open, onOpenChange }: TargetAssignmentDialogProps) {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(targetAssignmentSchema),
    defaultValues: {
      programName: '',
      workOrderNo: '',
      businessHead: '',
      cycle: 1,
      enrolmentTarget: 0,
      placementTarget: 0,
      st: 0,
      sc: 0,
      obc: 0,
      general: 0,
      minority: 0,
      districts: [],
      roleAssignments: [],
      fixedBudget: 0,
      variableBudget: 0,
    },
  });

  const watchedValues = form.watch();
  const totalBudget = watchedValues.fixedBudget + watchedValues.variableBudget;
  const expectedProfit = totalBudget * 0.15; // 15% profit margin
  const categoryTotal = watchedValues.st + watchedValues.sc + watchedValues.obc + watchedValues.general + watchedValues.minority;
  
  // Calculate total manpower and monthly salary cost from selected employees
  const totalManpower = watchedValues.roleAssignments.reduce((sum, assignment) => 
    sum + assignment.employeeIds.length, 0
  );
  const monthlySalaryCost = watchedValues.roleAssignments.reduce((sum, assignment) => {
    const employees = mockEmployees.filter(emp => assignment.employeeIds.includes(emp.id));
    return sum + employees.reduce((empSum, emp) => empSum + emp.monthlySalary, 0);
  }, 0);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await dispatch(createTargetAssignment({
        programName: data.programName,
        workOrderNo: data.workOrderNo,
        businessHead: data.businessHead,
        cycle: data.cycle,
        enrolmentTarget: data.enrolmentTarget,
        enrolmentDateRange: [
          data.enrolmentStartDate.toISOString().split('T')[0],
          data.enrolmentDeadline.toISOString().split('T')[0],
        ],
        placementTarget: data.placementTarget,
        placementDateRange: [
          data.placementStartDate.toISOString().split('T')[0],
          data.placementDeadline.toISOString().split('T')[0],
        ],
        categoryTarget: {
          st: data.st,
          sc: data.sc,
          obc: data.obc,
          general: data.general,
          minority: data.minority,
        },
        districts: data.districts,
        roleAssignments: data.roleAssignments.map(a => ({
          role: a.role!,
          employeeIds: a.employeeIds!
        })),
        fixedBudget: data.fixedBudget,
        variableBudget: data.variableBudget,
      })).unwrap();

      toast.success('Target Assignment Created', {
        description: `Work Order ${data.workOrderNo} has been successfully created.`,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create target assignment', {
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addDistrict = () => {
    if (!selectedState || !selectedDistrict) {
      toast.error('Please select both state and district');
      return;
    }
    
    const current = form.getValues('districts');
    const districtWithState = `${selectedState}|${selectedDistrict}`;
    
    if (current.includes(districtWithState)) {
      toast.error('District already added');
      return;
    }
    
    form.setValue('districts', [...current, districtWithState]);
    setSelectedDistrict('');
  };

  const removeDistrict = (districtWithState: string) => {
    const current = form.getValues('districts');
    form.setValue('districts', current.filter((d) => d !== districtWithState));
  };

  const getDistrictsByState = () => {
    const grouped: Record<string, string[]> = {};
    watchedValues.districts.forEach((districtWithState) => {
      const [state, district] = districtWithState.split('|');
      if (!grouped[state]) {
        grouped[state] = [];
      }
      grouped[state].push(district);
    });
    return grouped;
  };

  const addRoleAssignment = () => {
    if (!selectedRole || selectedEmployees.length === 0) {
      toast.error('Please select role and at least one employee');
      return;
    }

    const role = organizationRoles.find(r => r.id === selectedRole);
    if (!role) return;

    const current = form.getValues('roleAssignments');
    
    // Check if this role already exists
    const existingIndex = current.findIndex(
      assignment => assignment.role === selectedRole
    );

    if (existingIndex >= 0) {
      // Merge employees into existing assignment
      const updated = [...current];
      const existingEmployeeIds = updated[existingIndex].employeeIds;
      const newEmployeeIds = [...new Set([...existingEmployeeIds, ...selectedEmployees])];
      updated[existingIndex] = {
        ...updated[existingIndex],
        employeeIds: newEmployeeIds
      };
      form.setValue('roleAssignments', updated);
    } else {
      // Add new assignment
      form.setValue('roleAssignments', [
        ...current,
        {
          role: selectedRole,
          employeeIds: selectedEmployees,
        }
      ]);
    }

    setSelectedRole('');
    setSelectedEmployees([]);
    toast.success('Employees assigned to role');
  };

  const removeEmployeeFromRole = (roleId: string, employeeId: string) => {
    const current = form.getValues('roleAssignments');
    const updated = current.map(assignment => {
      if (assignment.role === roleId) {
        return {
          ...assignment,
          employeeIds: assignment.employeeIds.filter(id => id !== employeeId)
        };
      }
      return assignment;
    }).filter(assignment => assignment.employeeIds.length > 0); // Remove role if no employees left
    
    form.setValue('roleAssignments', updated);
  };

  const getAvailableEmployeesForRole = (roleId: string) => {
    // Get states from selected districts
    const selectedStates = new Set<string>();
    watchedValues.districts.forEach((districtWithState) => {
      const [state] = districtWithState.split('|');
      selectedStates.add(state);
    });

    // Get already assigned employee IDs for this role
    const assignedEmployeeIds = new Set<string>();
    const currentRoleAssignment = watchedValues.roleAssignments.find(a => a.role === roleId);
    if (currentRoleAssignment) {
      currentRoleAssignment.employeeIds.forEach(id => assignedEmployeeIds.add(id));
    }

    // Filter employees by role. If districts are selected, also filter by state
    return mockEmployees.filter(emp => 
      emp.role === roleId && 
      (selectedStates.size === 0 || selectedStates.has(emp.state)) &&
      !assignedEmployeeIds.has(emp.id)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign New Target</DialogTitle>
          <DialogDescription>
            Create a new work order with target assignments for mobilisation and placement activities.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Program Name & Work Order No. */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="programName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Name</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background z-50">
                        {programs.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workOrderNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Order No.</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., DDUGKY/2024/001"
                        {...field}
                        className="uppercase"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Business Head & Cycle */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="businessHead"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Head</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select business head" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background z-50">
                        {businessHeads.map((head) => (
                          <SelectItem key={head.id} value={head.name}>
                            {head.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cycle</FormLabel>
                    <Select onValueChange={(val) => field.onChange(parseInt(val))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select cycle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background z-50">
                        {cycles.map((cycle) => (
                          <SelectItem key={cycle.value} value={cycle.value.toString()}>
                            {cycle.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Enrolment Target & Date Range */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                Enrolment Target
                <Badge variant="outline">{watchedValues.enrolmentTarget}</Badge>
              </h3>
              
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="enrolmentTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="500"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enrolmentStartDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'pl-3 text-left font-normal bg-background',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? format(field.value, 'PPP') : <span>Pick date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn('p-3 pointer-events-auto')}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enrolmentDeadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'pl-3 text-left font-normal bg-background',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? format(field.value, 'PPP') : <span>Pick date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn('p-3 pointer-events-auto')}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Placement Target & Date Range */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                Placement Target
                <Badge variant="outline">{watchedValues.placementTarget}</Badge>
              </h3>
              
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="placementTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="400"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="placementStartDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'pl-3 text-left font-normal bg-background',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? format(field.value, 'PPP') : <span>Pick date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn('p-3 pointer-events-auto')}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="placementDeadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'pl-3 text-left font-normal bg-background',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? format(field.value, 'PPP') : <span>Pick date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn('p-3 pointer-events-auto')}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Category Targets */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Category Targets</h3>
                <Badge variant={categoryTotal === watchedValues.enrolmentTarget ? 'default' : 'destructive'}>
                  Total: {categoryTotal} / {watchedValues.enrolmentTarget}
                </Badge>
              </div>
              
              <div className="grid gap-4 md:grid-cols-5">
                <FormField
                  control={form.control}
                  name="st"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ST</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SC</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="obc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OBC</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="general"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>General</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minority</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {categoryTotal !== watchedValues.enrolmentTarget && watchedValues.enrolmentTarget > 0 && (
                <p className="text-sm text-destructive flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Category targets must sum to enrolment target
                </p>
              )}
            </div>

            {/* Districts */}
            <FormField
              control={form.control}
              name="districts"
              render={() => (
                <FormItem>
                  <FormLabel>Districts</FormLabel>
                  <FormDescription>Select state and district to add to work order</FormDescription>
                  
                  <div className="space-y-4">
                    {/* State and District Selection */}
                    <div className="flex gap-3">
                      <Select value={selectedState} onValueChange={(value) => {
                        setSelectedState(value);
                        setSelectedDistrict('');
                      }}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(stateDistrictData).map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select 
                        value={selectedDistrict} 
                        onValueChange={setSelectedDistrict}
                        disabled={!selectedState}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedState && stateDistrictData[selectedState as keyof typeof stateDistrictData].map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button 
                        type="button" 
                        onClick={addDistrict}
                        disabled={!selectedState || !selectedDistrict}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>

                    {/* Selected Districts Grouped by State */}
                    {watchedValues.districts.length > 0 && (
                      <div className="border rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto bg-muted/30">
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          Selected Districts ({watchedValues.districts.length})
                        </div>
                        {Object.entries(getDistrictsByState()).map(([state, districts]) => (
                          <div key={state} className="space-y-2">
                            <div className="text-sm font-semibold text-foreground">{state}</div>
                            <div className="flex flex-wrap gap-2 pl-3">
                              {districts.map((district) => (
                                <Badge 
                                  key={`${state}|${district}`}
                                  variant="secondary"
                                  className="flex items-center gap-1"
                                >
                                  {district}
                                  <button
                                    type="button"
                                    onClick={() => removeDistrict(`${state}|${district}`)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Assignments */}
            <FormField
              control={form.control}
              name="roleAssignments"
              render={() => (
                <FormItem>
                  <FormLabel>Role Assignments</FormLabel>
                  <FormDescription>
                    Select employees for each role. Employee salaries are fetched from HR portal. 
                    Only employees from selected states are shown.
                  </FormDescription>
                  
                  <div className="space-y-4">
                    {/* Role and Employee Selection */}
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Select 
                          value={selectedRole} 
                          onValueChange={(value) => {
                            setSelectedRole(value);
                            setSelectedEmployees([]);
                          }}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {organizationRoles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button 
                          type="button" 
                          onClick={addRoleAssignment}
                          disabled={!selectedRole || selectedEmployees.length === 0}
                          variant="outline"
                        >
                          Assign Employees
                        </Button>
                      </div>

                      {/* Employee Multi-Select */}
                      {selectedRole && (
                        <div className="space-y-2">
                          <FormLabel className="text-sm text-muted-foreground">
                            Select Employees {watchedValues.districts.length > 0 ? '(from selected states)' : '(select districts to filter by state)'}
                          </FormLabel>
                          <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto bg-background">
                            {getAvailableEmployeesForRole(selectedRole).length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-2">
                                No available employees for this role
                              </p>
                            ) : (
                              getAvailableEmployeesForRole(selectedRole).map((emp) => (
                                <label
                                  key={emp.id}
                                  className="flex items-center gap-3 p-2 rounded hover:bg-accent cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedEmployees.includes(emp.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedEmployees([...selectedEmployees, emp.id]);
                                      } else {
                                        setSelectedEmployees(selectedEmployees.filter(id => id !== emp.id));
                                      }
                                    }}
                                    className="w-4 h-4"
                                  />
                                  <div className="flex-1 flex items-center justify-between">
                                    <div>
                                      <span className="text-sm font-medium">{emp.name}</span>
                                      <span className="text-xs text-muted-foreground ml-2">({emp.state})</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      ₹{(emp.monthlySalary / 1000).toFixed(0)}k/mo
                                    </span>
                                  </div>
                                </label>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Selected Role Assignments Grouped by Role */}
                    {watchedValues.roleAssignments.length > 0 && (
                      <div className="border rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto bg-muted/30">
                        <div className="flex justify-between items-center text-sm font-medium text-muted-foreground mb-2">
                          <span>Assigned Employees ({totalManpower} total)</span>
                          <span>Monthly Salary Cost: ₹{(monthlySalaryCost / 100000).toFixed(2)}L</span>
                        </div>
                        {watchedValues.roleAssignments.map((assignment, roleIndex) => {
                          const roleData = organizationRoles.find(r => r.id === assignment.role);
                          const assignedEmployees = mockEmployees.filter(emp => 
                            assignment.employeeIds.includes(emp.id)
                          );
                          return (
                            <div key={roleIndex} className="space-y-2">
                              <div className="text-sm font-semibold text-foreground">
                                {roleData?.name} ({assignedEmployees.length})
                              </div>
                              <div className="space-y-1.5 pl-3">
                                {assignedEmployees.map((emp) => (
                                  <div 
                                    key={emp.id}
                                    className="flex items-center justify-between p-2 rounded bg-background border"
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <Badge variant="outline" className="text-xs">{emp.state}</Badge>
                                      <span className="text-sm font-medium">{emp.name}</span>
                                      <span className="text-xs text-muted-foreground">
                                        ₹{(emp.monthlySalary / 1000).toFixed(0)}k/mo
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeEmployeeFromRole(assignment.role, emp.id)}
                                      className="ml-2 hover:text-destructive"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Budget */}
            <div className="grid gap-4 md:grid-cols-2">

              <FormField
                control={form.control}
                name="fixedBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fixed Budget (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2000000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="variableBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variable Budget (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="500000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Expected Profitability */}
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-3">Expected Profitability</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold">₹{(totalBudget / 100000).toFixed(2)}L</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected Profit (15%)</p>
                  <p className="text-2xl font-bold text-green-600">₹{(expectedProfit / 100000).toFixed(2)}L</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cost per Candidate</p>
                  <p className="text-2xl font-bold">
                    ₹{watchedValues.enrolmentTarget > 0 ? (totalBudget / watchedValues.enrolmentTarget).toFixed(0) : '0'}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Work Order'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
