import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, ChevronDown, Building2, MapPin } from 'lucide-react';

const formSchema = z.object({
  code: z.string().min(1, 'Code is required').max(10, 'Code must be 10 characters or less'),
  name: z.string().min(1, 'Name is required').max(20, 'Name must be 20 characters or less'),
  fullName: z.string().min(1, 'Full name is required').max(200, 'Full name must be 200 characters or less'),
  selectedCentres: z.array(z.string()).min(1, 'At least one centre must be selected'),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface ProgramFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: number | null;
}

// Mock data for states and centres
const statesWithCentres = [
  {
    id: 'state_1',
    name: 'Maharashtra',
    centres: [
      { id: 'centre_1_1', name: 'Mumbai Training Centre' },
      { id: 'centre_1_2', name: 'Pune Skill Centre' },
      { id: 'centre_1_3', name: 'Nagpur Development Centre' },
      { id: 'centre_1_4', name: 'Nashik Vocational Centre' },
    ],
  },
  {
    id: 'state_2',
    name: 'Karnataka',
    centres: [
      { id: 'centre_2_1', name: 'Bangalore Tech Hub' },
      { id: 'centre_2_2', name: 'Mysore Training Institute' },
      { id: 'centre_2_3', name: 'Hubli Skill Centre' },
    ],
  },
  {
    id: 'state_3',
    name: 'Tamil Nadu',
    centres: [
      { id: 'centre_3_1', name: 'Chennai Central Centre' },
      { id: 'centre_3_2', name: 'Coimbatore Industrial Training' },
      { id: 'centre_3_3', name: 'Madurai Skill Hub' },
      { id: 'centre_3_4', name: 'Trichy Development Centre' },
    ],
  },
  {
    id: 'state_4',
    name: 'Uttar Pradesh',
    centres: [
      { id: 'centre_4_1', name: 'Lucknow Main Centre' },
      { id: 'centre_4_2', name: 'Noida IT Training Centre' },
      { id: 'centre_4_3', name: 'Kanpur Vocational Institute' },
      { id: 'centre_4_4', name: 'Varanasi Skill Centre' },
      { id: 'centre_4_5', name: 'Agra Training Hub' },
    ],
  },
  {
    id: 'state_5',
    name: 'Gujarat',
    centres: [
      { id: 'centre_5_1', name: 'Ahmedabad Skill Centre' },
      { id: 'centre_5_2', name: 'Surat Training Institute' },
      { id: 'centre_5_3', name: 'Vadodara Development Centre' },
    ],
  },
  {
    id: 'state_6',
    name: 'Rajasthan',
    centres: [
      { id: 'centre_6_1', name: 'Jaipur Central Hub' },
      { id: 'centre_6_2', name: 'Jodhpur Skill Centre' },
      { id: 'centre_6_3', name: 'Udaipur Training Institute' },
    ],
  },
];

export function ProgramForm({ open, onOpenChange, itemId }: ProgramFormProps) {
  const { toast } = useToast();
  const isEditing = itemId !== null && itemId !== undefined;
  const [expandedStates, setExpandedStates] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      fullName: '',
      selectedCentres: [],
      isActive: true,
    },
  });

  const selectedCentres = form.watch('selectedCentres');

  React.useEffect(() => {
    if (isEditing && open) {
      form.reset({
        code: 'PRG001',
        name: 'DDU-GKY',
        fullName: 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana',
        selectedCentres: ['centre_1_1', 'centre_1_2', 'centre_2_1'],
        isActive: true,
      });
      setExpandedStates(['state_1', 'state_2']);
    } else if (!isEditing && open) {
      form.reset({
        code: '',
        name: '',
        fullName: '',
        selectedCentres: [],
        isActive: true,
      });
      setExpandedStates([]);
    }
  }, [isEditing, open, form]);

  const toggleState = (stateId: string) => {
    setExpandedStates(prev =>
      prev.includes(stateId)
        ? prev.filter(id => id !== stateId)
        : [...prev, stateId]
    );
  };

  const isStateFullySelected = (state: typeof statesWithCentres[0]) => {
    return state.centres.every(centre => selectedCentres.includes(centre.id));
  };

  const isStatePartiallySelected = (state: typeof statesWithCentres[0]) => {
    const selectedCount = state.centres.filter(centre => selectedCentres.includes(centre.id)).length;
    return selectedCount > 0 && selectedCount < state.centres.length;
  };

  const toggleStateSelection = (state: typeof statesWithCentres[0]) => {
    const allCentreIds = state.centres.map(c => c.id);
    const isFullySelected = isStateFullySelected(state);

    if (isFullySelected) {
      form.setValue(
        'selectedCentres',
        selectedCentres.filter(id => !allCentreIds.includes(id))
      );
    } else {
      const newSelection = [...new Set([...selectedCentres, ...allCentreIds])];
      form.setValue('selectedCentres', newSelection);
    }
  };

  const toggleCentreSelection = (centreId: string) => {
    const newSelection = selectedCentres.includes(centreId)
      ? selectedCentres.filter(id => id !== centreId)
      : [...selectedCentres, centreId];
    form.setValue('selectedCentres', newSelection);
  };

  const selectAllCentres = () => {
    const allCentreIds = statesWithCentres.flatMap(state => state.centres.map(c => c.id));
    form.setValue('selectedCentres', allCentreIds);
    setExpandedStates(statesWithCentres.map(s => s.id));
  };

  const clearAllCentres = () => {
    form.setValue('selectedCentres', []);
  };

  const getSelectionSummary = () => {
    const statesWithSelection = statesWithCentres.filter(state =>
      state.centres.some(centre => selectedCentres.includes(centre.id))
    );
    return `${selectedCentres.length} centres in ${statesWithSelection.length} states`;
  };

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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Program' : 'Add New Program'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the program details below.' : 'Fill in the details to create a new program.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
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
                name="selectedCentres"
                render={() => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-2">
                      <FormLabel>States & Centres</FormLabel>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={selectAllCentres}
                          className="text-xs h-7"
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearAllCentres}
                          className="text-xs h-7"
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {selectedCentres.length > 0 ? getSelectionSummary() : 'No centres selected'}
                    </div>
                    <ScrollArea className="h-[280px] rounded-md border p-3 bg-muted/30">
                      <div className="space-y-1">
                        {statesWithCentres.map((state) => (
                          <Collapsible
                            key={state.id}
                            open={expandedStates.includes(state.id)}
                            onOpenChange={() => toggleState(state.id)}
                          >
                            <div className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors">
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-0 h-5 w-5">
                                  {expandedStates.includes(state.id) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                              <Checkbox
                                checked={isStateFullySelected(state)}
                                ref={undefined}
                                onCheckedChange={() => toggleStateSelection(state)}
                                className={isStatePartiallySelected(state) ? 'data-[state=checked]:bg-primary/50' : ''}
                              />
                              <MapPin className="h-4 w-4 text-primary" />
                              <span className="font-medium text-sm">{state.name}</span>
                              <span className="text-xs text-muted-foreground ml-auto">
                                ({state.centres.filter(c => selectedCentres.includes(c.id)).length}/{state.centres.length})
                              </span>
                            </div>
                            <CollapsibleContent>
                              <div className="ml-8 mt-1 space-y-1 border-l-2 border-muted pl-3">
                                {state.centres.map((centre) => (
                                  <div
                                    key={centre.id}
                                    className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => toggleCentreSelection(centre.id)}
                                  >
                                    <Checkbox
                                      checked={selectedCentres.includes(centre.id)}
                                      onCheckedChange={() => toggleCentreSelection(centre.id)}
                                    />
                                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-sm">{centre.name}</span>
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </ScrollArea>
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
            </div>

            <DialogFooter className="mt-4 pt-4 border-t">
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
