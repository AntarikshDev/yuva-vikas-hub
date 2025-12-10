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
import { useToast } from '@/hooks/use-toast';

type LocationType = 'state' | 'district' | 'block' | 'panchayat' | 'village' | 'pincode';

const getSchema = (locationType: LocationType) => {
  const baseSchema = {
    code: z.string().min(1, 'Code is required').max(10, 'Code must be 10 characters or less'),
    name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
    isActive: z.boolean().default(true),
  };

  switch (locationType) {
    case 'state':
      return z.object(baseSchema);
    case 'district':
      return z.object({ ...baseSchema, state: z.string().min(1, 'State is required') });
    case 'block':
      return z.object({ ...baseSchema, state: z.string().min(1, 'State is required'), district: z.string().min(1, 'District is required') });
    case 'panchayat':
      return z.object({ ...baseSchema, state: z.string().min(1, 'State is required'), district: z.string().min(1, 'District is required'), block: z.string().min(1, 'Block is required') });
    case 'village':
      return z.object({ ...baseSchema, panchayat: z.string().min(1, 'Panchayat is required'), pincode: z.string().length(6, 'Pincode must be 6 digits') });
    case 'pincode':
      return z.object({ 
        code: z.string().length(6, 'Pincode must be 6 digits'),
        area: z.string().min(1, 'Area is required'),
        state: z.string().min(1, 'State is required'),
        district: z.string().min(1, 'District is required'),
        isActive: z.boolean().default(true),
      });
    default:
      return z.object(baseSchema);
  }
};

interface DirectorLocationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: number | null;
  locationType: LocationType;
}

const states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Bihar'];
const districts: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane'],
  'Karnataka': ['Bangalore Urban', 'Mysore', 'Mangalore'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
};
const blocks: Record<string, string[]> = {
  'Mumbai': ['Andheri', 'Bandra', 'Kurla', 'Borivali'],
  'Pune': ['Haveli', 'Mulshi', 'Maval'],
};
const panchayats: Record<string, string[]> = {
  'Andheri': ['Versova Gram Panchayat', 'Marol Gram Panchayat'],
  'Haveli': ['Uruli Kanchan GP', 'Loni Kalbhor GP'],
};

export function DirectorLocationForm({ open, onOpenChange, itemId, locationType }: DirectorLocationFormProps) {
  const { toast } = useToast();
  const isEditing = itemId !== null && itemId !== undefined;
  const [selectedState, setSelectedState] = React.useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>('');
  const [selectedBlock, setSelectedBlock] = React.useState<string>('');

  const schema = getSchema(locationType);
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      name: '',
      isActive: true,
    } as FormValues,
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        code: '',
        name: '',
        isActive: true,
      } as FormValues);
      setSelectedState('');
      setSelectedDistrict('');
      setSelectedBlock('');
    }
  }, [open, form, locationType]);

  const onSubmit = (data: FormValues) => {
    const locationTypeName = locationType.charAt(0).toUpperCase() + locationType.slice(1);
    toast({
      title: isEditing ? `${locationTypeName} updated` : `${locationTypeName} created`,
      description: `${(data as any).name || (data as any).area || data.code} has been ${isEditing ? 'updated' : 'created'} successfully.`,
    });
    onOpenChange(false);
    form.reset();
  };

  const getTitle = () => {
    const name = locationType.charAt(0).toUpperCase() + locationType.slice(1);
    return isEditing ? `Edit ${name}` : `Add New ${name}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Update the ${locationType} details below.` : `Fill in the details to create a new ${locationType}.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* State selection for district, block, panchayat, pincode */}
            {(locationType === 'district' || locationType === 'block' || locationType === 'panchayat' || locationType === 'pincode') && (
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedState(value);
                        setSelectedDistrict('');
                        setSelectedBlock('');
                      }} 
                      value={field.value as string}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* District selection for block, panchayat, pincode */}
            {(locationType === 'block' || locationType === 'panchayat' || locationType === 'pincode') && (
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedDistrict(value);
                        setSelectedBlock('');
                      }} 
                      value={field.value as string}
                      disabled={!selectedState}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(districts[selectedState] || []).map((district) => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Block selection for panchayat */}
            {locationType === 'panchayat' && (
              <FormItem>
                <FormLabel>Block</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    form.setValue('block' as any, value);
                    setSelectedBlock(value);
                  }} 
                  value={selectedBlock}
                  disabled={!selectedDistrict}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select block" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(blocks[selectedDistrict] || []).map((block) => (
                      <SelectItem key={block} value={block}>{block}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}

            {/* Panchayat selection for village */}
            {locationType === 'village' && (
              <FormItem>
                <FormLabel>Panchayat</FormLabel>
                <Select onValueChange={(value) => form.setValue('panchayat' as any, value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select panchayat" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Versova Gram Panchayat">Versova Gram Panchayat</SelectItem>
                    <SelectItem value="Marol Gram Panchayat">Marol Gram Panchayat</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}

            {/* Code field */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{locationType === 'pincode' ? 'Pincode' : `${locationType.charAt(0).toUpperCase() + locationType.slice(1)} Code`}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={locationType === 'pincode' ? '400001' : 'Enter code'} 
                      {...field} 
                      maxLength={locationType === 'pincode' ? 6 : 10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name/Area field */}
            {locationType === 'pincode' ? (
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter area name" {...(field as any)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locationType.charAt(0).toUpperCase() + locationType.slice(1)} Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Pincode for village */}
            {locationType === 'village' && (
              <FormItem>
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="400001" 
                    maxLength={6} 
                    onChange={(e) => form.setValue('pincode' as any, e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value as boolean} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
