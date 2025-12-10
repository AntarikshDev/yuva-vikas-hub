import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  code: z.string().min(1, 'Code is required').max(10, 'Code must be 10 characters or less'),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  sector: z.string().min(1, 'Sector is required'),
  nsqfLevel: z.string().min(1, 'NSQF Level is required'),
  trainingHours: z.string().min(1, 'Training hours is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface DirectorJobRoleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: number | null;
}

const sectors = [
  'IT-ITES',
  'Retail',
  'Healthcare',
  'Hospitality',
  'Banking & Finance',
  'Automotive',
  'Construction',
  'Electronics',
  'Apparel',
  'Agriculture',
];

export function DirectorJobRoleForm({ open, onOpenChange, itemId }: DirectorJobRoleFormProps) {
  const { toast } = useToast();
  const isEditing = itemId !== null && itemId !== undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      title: '',
      sector: '',
      nsqfLevel: '',
      trainingHours: '',
      description: '',
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (isEditing && open) {
      form.reset({
        code: 'JR001',
        title: 'Customer Service Executive',
        sector: 'IT-ITES',
        nsqfLevel: '4',
        trainingHours: '400',
        description: 'Customer service and support role',
        isActive: true,
      });
    } else if (!isEditing && open) {
      form.reset({
        code: '',
        title: '',
        sector: '',
        nsqfLevel: '',
        trainingHours: '',
        description: '',
        isActive: true,
      });
    }
  }, [isEditing, open, form]);

  const onSubmit = (data: FormValues) => {
    toast({
      title: isEditing ? 'Job Role updated' : 'Job Role created',
      description: `${data.title} has been ${isEditing ? 'updated' : 'created'} successfully.`,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Job Role' : 'Add New Job Role'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the job role details below.' : 'Fill in the details to create a new job role.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Role Code</FormLabel>
                    <FormControl>
                      <Input placeholder="JR001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sectors.map((sector) => (
                          <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Role Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer Service Executive" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nsqfLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NSQF Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Level 1</SelectItem>
                        <SelectItem value="2">Level 2</SelectItem>
                        <SelectItem value="3">Level 3</SelectItem>
                        <SelectItem value="4">Level 4</SelectItem>
                        <SelectItem value="5">Level 5</SelectItem>
                        <SelectItem value="6">Level 6</SelectItem>
                        <SelectItem value="7">Level 7</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trainingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Hours</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="400" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief description of the job role" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Update' : 'Create'} Job Role</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
