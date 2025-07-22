import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  location: z.string().min(2, 'Location is required'),
  address: z.string().min(10, 'Full address is required'),
  contactPersonName: z.string().min(2, 'Contact person name is required'),
  contactPersonDesignation: z.string().min(2, 'Designation is required'),
  contactPhone: z.string().min(10, 'Valid phone number is required'),
  contactEmail: z.string().email('Valid email is required'),
  alternatePhone: z.string().optional(),
  numberOfOpenings: z.string().min(1, 'Number of openings is required'),
  salaryRange: z.string().min(1, 'Salary range is required'),
  jobRoles: z.string().min(2, 'Job roles are required'),
  requiredSkills: z.string().min(2, 'Required skills are required'),
  workingHours: z.string().min(1, 'Working hours are required'),
  benefits: z.string().optional(),
  description: z.string().optional(),
});

interface LocalCompanyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LocalCompanyForm = ({ open, onOpenChange }: LocalCompanyFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      industry: '',
      location: '',
      address: '',
      contactPersonName: '',
      contactPersonDesignation: '',
      contactPhone: '',
      contactEmail: '',
      alternatePhone: '',
      numberOfOpenings: '',
      salaryRange: '',
      jobRoles: '',
      requiredSkills: '',
      workingHours: '',
      benefits: '',
      description: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Local company form submitted:', values);
    toast({
      title: "Company Added Successfully",
      description: `${values.companyName} has been added to your local company list.`,
    });
    form.reset();
    onOpenChange(false);
  };

  const industries = [
    'Information Technology',
    'Manufacturing',
    'Healthcare',
    'Retail',
    'Banking & Finance',
    'Education',
    'Real Estate',
    'Food & Beverage',
    'Textile',
    'Automobile',
    'Construction',
    'Logistics',
    'Other'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Local Company</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Company Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Company Information</h3>
                
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
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
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (City) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter complete address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Contact Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactPersonName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPersonDesignation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter designation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder="+91-XXXXXXXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alternatePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternate Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+91-XXXXXXXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="contact@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Job Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Job Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="numberOfOpenings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Openings *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salaryRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary Range *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 15000-25000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="jobRoles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Roles/Positions *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Data Entry Operator, Computer Operator" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiredSkills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Skills *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="List required skills, certifications, or qualifications" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Hours *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 9 AM - 6 PM (Monday to Friday)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="benefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benefits & Perks</FormLabel>
                      <FormControl>
                        <Textarea placeholder="List any benefits, insurance, transport, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any additional information about the company or job" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Company</Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LocalCompanyForm;