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
import { Checkbox } from '@/components/ui/checkbox';
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
  manpower: z.number().min(1, 'Manpower must be at least 1').max(1000, 'Manpower must be at most 1,000'),
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

const districts = [
  'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Thane',
  'Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Chennai', 'Coimbatore', 'Madurai', 'Salem',
];

export function TargetAssignmentDialog({ open, onOpenChange }: TargetAssignmentDialogProps) {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      manpower: 0,
      fixedBudget: 0,
      variableBudget: 0,
    },
  });

  const watchedValues = form.watch();
  const totalBudget = watchedValues.fixedBudget + watchedValues.variableBudget;
  const expectedProfit = totalBudget * 0.15; // 15% profit margin
  const categoryTotal = watchedValues.st + watchedValues.sc + watchedValues.obc + watchedValues.general + watchedValues.minority;

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
        manpower: data.manpower,
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

  const toggleDistrict = (district: string) => {
    const current = form.getValues('districts');
    if (current.includes(district)) {
      form.setValue('districts', current.filter((d) => d !== district));
    } else {
      form.setValue('districts', [...current, district]);
    }
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
                  <FormDescription>Select districts for this work order</FormDescription>
                  <div className="border rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                    {districts.map((district) => (
                      <div key={district} className="flex items-center space-x-2">
                        <Checkbox
                          id={district}
                          checked={watchedValues.districts.includes(district)}
                          onCheckedChange={() => toggleDistrict(district)}
                        />
                        <label
                          htmlFor={district}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {district}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Manpower & Budget */}
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="manpower"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manpower Required</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="15"
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
