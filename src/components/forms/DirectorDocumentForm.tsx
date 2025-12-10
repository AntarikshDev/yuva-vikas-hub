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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  code: z.string().min(1, 'Code is required').max(10, 'Code must be 10 characters or less'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  category: z.string().min(1, 'Category is required'),
  required: z.boolean().default(false),
  formats: z.array(z.string()).min(1, 'At least one format is required'),
  maxSize: z.string().optional(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface DirectorDocumentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: number | null;
}

const categories = [
  'Identity Proof',
  'Address Proof',
  'Education',
  'Banking',
  'Category Proof',
  'Income Proof',
  'Work Experience',
  'Medical',
  'Other',
];

const fileFormats = [
  { id: 'pdf', label: 'PDF' },
  { id: 'jpg', label: 'JPG/JPEG' },
  { id: 'png', label: 'PNG' },
  { id: 'doc', label: 'DOC/DOCX' },
];

export function DirectorDocumentForm({ open, onOpenChange, itemId }: DirectorDocumentFormProps) {
  const { toast } = useToast();
  const isEditing = itemId !== null && itemId !== undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      category: '',
      required: false,
      formats: [],
      maxSize: '5',
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (isEditing && open) {
      form.reset({
        code: 'DOC001',
        name: 'Aadhaar Card',
        category: 'Identity Proof',
        required: true,
        formats: ['pdf', 'jpg'],
        maxSize: '5',
        isActive: true,
      });
    } else if (!isEditing && open) {
      form.reset({
        code: '',
        name: '',
        category: '',
        required: false,
        formats: [],
        maxSize: '5',
        isActive: true,
      });
    }
  }, [isEditing, open, form]);

  const onSubmit = (data: FormValues) => {
    toast({
      title: isEditing ? 'Document type updated' : 'Document type created',
      description: `${data.name} has been ${isEditing ? 'updated' : 'created'} successfully.`,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Document Type' : 'Add New Document Type'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the document type details below.' : 'Fill in the details to create a new document type.'}
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
                    <FormLabel>Document Code</FormLabel>
                    <FormControl>
                      <Input placeholder="DOC001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Aadhaar Card" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="formats"
              render={() => (
                <FormItem>
                  <FormLabel>Allowed Formats</FormLabel>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {fileFormats.map((format) => (
                      <FormField
                        key={format.id}
                        control={form.control}
                        name="formats"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(format.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, format.id])
                                    : field.onChange(field.value?.filter((value) => value !== format.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">{format.label}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max File Size (MB)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-6">
                    <FormLabel>Mandatory Document</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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
              <Button type="submit">{isEditing ? 'Update' : 'Create'} Document</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
