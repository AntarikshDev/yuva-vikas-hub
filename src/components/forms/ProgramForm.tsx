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
  name: z.string().min(1, 'Name is required').max(20, 'Name must be 20 characters or less'),
  fullName: z.string().min(1, 'Full name is required').max(200, 'Full name must be 200 characters or less'),
  ministry: z.string().min(1, 'Ministry is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface ProgramFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: number | null;
}

export function ProgramForm({ open, onOpenChange, itemId }: ProgramFormProps) {
  const { toast } = useToast();
  const isEditing = itemId !== null && itemId !== undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      fullName: '',
      ministry: '',
      description: '',
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (isEditing && open) {
      // Simulate fetching data for editing
      form.reset({
        code: 'PRG001',
        name: 'DDU-GKY',
        fullName: 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana',
        ministry: 'MoRD',
        description: 'Rural youth employment program',
        isActive: true,
      });
    } else if (!isEditing && open) {
      form.reset({
        code: '',
        name: '',
        fullName: '',
        ministry: '',
        description: '',
        isActive: true,
      });
    }
  }, [isEditing, open, form]);

  const onSubmit = (data: FormValues) => {
    toast({
      title: isEditing ? 'Program updated' : 'Program created',
      description: `${data.name} has been ${isEditing ? 'updated' : 'created'} successfully.`,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Program' : 'Add New Program'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the program details below.' : 'Fill in the details to create a new program.'}
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
                    <FormLabel>Program Code</FormLabel>
                    <FormControl>
                      <Input placeholder="PRG001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Name</FormLabel>
                    <FormControl>
                      <Input placeholder="DDU-GKY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full program name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ministry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ministry</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ministry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MoRD">Ministry of Rural Development (MoRD)</SelectItem>
                      <SelectItem value="MSDE">Ministry of Skill Development (MSDE)</SelectItem>
                      <SelectItem value="MoHUA">Ministry of Housing & Urban Affairs (MoHUA)</SelectItem>
                      <SelectItem value="MoLE">Ministry of Labour & Employment (MoLE)</SelectItem>
                      <SelectItem value="MoSJE">Ministry of Social Justice (MoSJE)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief description of the program" {...field} />
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
              <Button type="submit">{isEditing ? 'Update' : 'Create'} Program</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
