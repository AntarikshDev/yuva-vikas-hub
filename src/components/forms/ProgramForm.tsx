import React, { useState, useMemo } from 'react';
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
import { ChevronRight, ChevronDown, Building2, MapPin, FileText, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetStatesQuery } from '@/store/api/locationsApi';
import { useGetCentresQuery } from '@/store/api/programsApi';
import { useGetDocumentTypesQuery } from '@/store/api/documentTypesApi';

// Mock data for states with centres (fallback when API not available)
const mockStatesWithCentres = [
  {
    id: 'state_1',
    name: 'Maharashtra',
    centres: [
      { id: 'centre_mh_1', name: 'Mumbai Training Centre', stateId: 'state_1' },
      { id: 'centre_mh_2', name: 'Pune Skill Development Centre', stateId: 'state_1' },
      { id: 'centre_mh_3', name: 'Nagpur Vocational Institute', stateId: 'state_1' },
      { id: 'centre_mh_4', name: 'Nashik Employment Hub', stateId: 'state_1' },
    ],
  },
  {
    id: 'state_2',
    name: 'Karnataka',
    centres: [
      { id: 'centre_ka_1', name: 'Bangalore Tech Training Hub', stateId: 'state_2' },
      { id: 'centre_ka_2', name: 'Mysore Skill Centre', stateId: 'state_2' },
      { id: 'centre_ka_3', name: 'Hubli Industrial Training', stateId: 'state_2' },
    ],
  },
  {
    id: 'state_3',
    name: 'Tamil Nadu',
    centres: [
      { id: 'centre_tn_1', name: 'Chennai Central Training', stateId: 'state_3' },
      { id: 'centre_tn_2', name: 'Coimbatore Skill Development', stateId: 'state_3' },
      { id: 'centre_tn_3', name: 'Madurai Vocational Centre', stateId: 'state_3' },
      { id: 'centre_tn_4', name: 'Trichy Employment Training', stateId: 'state_3' },
    ],
  },
  {
    id: 'state_4',
    name: 'Uttar Pradesh',
    centres: [
      { id: 'centre_up_1', name: 'Lucknow Main Training Centre', stateId: 'state_4' },
      { id: 'centre_up_2', name: 'Noida IT & Software Training', stateId: 'state_4' },
      { id: 'centre_up_3', name: 'Kanpur Industrial Skills', stateId: 'state_4' },
      { id: 'centre_up_4', name: 'Varanasi Craft Centre', stateId: 'state_4' },
      { id: 'centre_up_5', name: 'Agra Tourism Training Hub', stateId: 'state_4' },
    ],
  },
  {
    id: 'state_5',
    name: 'Gujarat',
    centres: [
      { id: 'centre_gj_1', name: 'Ahmedabad Skill Academy', stateId: 'state_5' },
      { id: 'centre_gj_2', name: 'Surat Textile Training', stateId: 'state_5' },
      { id: 'centre_gj_3', name: 'Vadodara Technical Institute', stateId: 'state_5' },
    ],
  },
  {
    id: 'state_6',
    name: 'Rajasthan',
    centres: [
      { id: 'centre_rj_1', name: 'Jaipur Central Hub', stateId: 'state_6' },
      { id: 'centre_rj_2', name: 'Jodhpur Desert Crafts Centre', stateId: 'state_6' },
      { id: 'centre_rj_3', name: 'Udaipur Heritage Skills', stateId: 'state_6' },
    ],
  },
  {
    id: 'state_7',
    name: 'West Bengal',
    centres: [
      { id: 'centre_wb_1', name: 'Kolkata Metropolitan Training', stateId: 'state_7' },
      { id: 'centre_wb_2', name: 'Howrah Industrial Centre', stateId: 'state_7' },
      { id: 'centre_wb_3', name: 'Siliguri North Bengal Hub', stateId: 'state_7' },
    ],
  },
  {
    id: 'state_8',
    name: 'Kerala',
    centres: [
      { id: 'centre_kl_1', name: 'Thiruvananthapuram Skill Centre', stateId: 'state_8' },
      { id: 'centre_kl_2', name: 'Kochi Marine Training', stateId: 'state_8' },
      { id: 'centre_kl_3', name: 'Kozhikode Tourism Training', stateId: 'state_8' },
    ],
  },
];

// Mock data for document types (fallback when API not available)
const mockDocuments = [
  { id: 'doc_1', code: 'DOC001', name: 'Aadhaar Card', category: 'Identity Proof', isRequired: true, allowedFormats: ['PDF', 'JPG'], isActive: true },
  { id: 'doc_2', code: 'DOC002', name: 'PAN Card', category: 'Identity Proof', isRequired: false, allowedFormats: ['PDF', 'JPG'], isActive: true },
  { id: 'doc_3', code: 'DOC003', name: 'Bank Passbook / Cancelled Cheque', category: 'Banking', isRequired: true, allowedFormats: ['PDF', 'JPG'], isActive: true },
  { id: 'doc_4', code: 'DOC004', name: '10th Marksheet', category: 'Education', isRequired: true, allowedFormats: ['PDF'], isActive: true },
  { id: 'doc_5', code: 'DOC005', name: '12th Marksheet', category: 'Education', isRequired: false, allowedFormats: ['PDF'], isActive: true },
  { id: 'doc_6', code: 'DOC006', name: 'Caste Certificate (SC/ST/OBC)', category: 'Category Proof', isRequired: false, allowedFormats: ['PDF'], isActive: true },
  { id: 'doc_7', code: 'DOC007', name: 'Income Certificate', category: 'Income Proof', isRequired: true, allowedFormats: ['PDF'], isActive: true },
  { id: 'doc_8', code: 'DOC008', name: 'Domicile Certificate', category: 'Address Proof', isRequired: true, allowedFormats: ['PDF'], isActive: true },
  { id: 'doc_9', code: 'DOC009', name: 'Passport Size Photo', category: 'Other', isRequired: true, allowedFormats: ['JPG', 'PNG'], isActive: true },
  { id: 'doc_10', code: 'DOC010', name: 'Parent/Guardian Consent Form', category: 'Other', isRequired: true, allowedFormats: ['PDF'], isActive: true },
  { id: 'doc_11', code: 'DOC011', name: 'Voter ID Card', category: 'Identity Proof', isRequired: false, allowedFormats: ['PDF', 'JPG'], isActive: true },
  { id: 'doc_12', code: 'DOC012', name: 'Driving License', category: 'Identity Proof', isRequired: false, allowedFormats: ['PDF', 'JPG'], isActive: true },
];

const formSchema = z.object({
  code: z.string().min(1, 'Code is required').max(10, 'Code must be 10 characters or less'),
  name: z.string().min(1, 'Name is required').max(20, 'Name must be 20 characters or less'),
  fullName: z.string().min(1, 'Full name is required').max(200, 'Full name must be 200 characters or less'),
  selectedCentres: z.array(z.string()).min(1, 'At least one centre must be selected'),
  requiredDocuments: z.array(z.string()).default([]),
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
  const [expandedStates, setExpandedStates] = useState<string[]>([]);

  // RTK Query hooks for fetching data (with fallback to mock data)
  const { data: statesData, isLoading: isLoadingStates, error: statesError } = useGetStatesQuery({});
  const { data: centresData, isLoading: isLoadingCentres, error: centresError } = useGetCentresQuery({});
  const { data: documentsData, isLoading: isLoadingDocuments, error: documentsError } = useGetDocumentTypesQuery({});

  // Use mock data as fallback when API fails or returns no data
  const statesWithCentres = useMemo(() => {
    // If API data is available, use it
    if (statesData && centresData && !statesError && !centresError) {
      const grouped = statesData.map(state => ({
        id: state.id,
        name: state.name,
        centres: centresData.filter(centre => centre.stateId === state.id),
      })).filter(state => state.centres.length > 0);
      
      if (grouped.length > 0) return grouped;
    }
    
    // Otherwise use mock data
    return mockStatesWithCentres;
  }, [statesData, centresData, statesError, centresError]);

  // Use mock documents as fallback
  const documents = useMemo(() => {
    if (documentsData && !documentsError && documentsData.length > 0) {
      return documentsData;
    }
    return mockDocuments;
  }, [documentsData, documentsError]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      fullName: '',
      selectedCentres: [],
      requiredDocuments: [],
      isActive: true,
    },
  });

  const selectedCentres = form.watch('selectedCentres');
  const selectedDocuments = form.watch('requiredDocuments');

  React.useEffect(() => {
    if (isEditing && open) {
      form.reset({
        code: 'PRG001',
        name: 'DDU-GKY',
        fullName: 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana',
        selectedCentres: ['centre_mh_1', 'centre_mh_2', 'centre_ka_1'],
        requiredDocuments: ['doc_1', 'doc_3', 'doc_4', 'doc_7', 'doc_8', 'doc_9', 'doc_10'],
        isActive: true,
      });
      setExpandedStates(['state_1', 'state_2']);
    } else if (!isEditing && open) {
      form.reset({
        code: '',
        name: '',
        fullName: '',
        selectedCentres: [],
        requiredDocuments: [],
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

  const toggleDocumentSelection = (docId: string) => {
    const newSelection = selectedDocuments.includes(docId)
      ? selectedDocuments.filter(id => id !== docId)
      : [...selectedDocuments, docId];
    form.setValue('requiredDocuments', newSelection);
  };

  const selectAllCentres = () => {
    const allCentreIds = statesWithCentres.flatMap(state => state.centres.map(c => c.id));
    form.setValue('selectedCentres', allCentreIds);
    setExpandedStates(statesWithCentres.map(s => s.id));
  };

  const clearAllCentres = () => {
    form.setValue('selectedCentres', []);
  };

  const selectAllDocuments = () => {
    form.setValue('requiredDocuments', documents.map(d => d.id));
  };

  const clearAllDocuments = () => {
    form.setValue('requiredDocuments', []);
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

  const isLoading = isLoadingStates || isLoadingCentres || isLoadingDocuments;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
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

              {/* States & Centres Selection */}
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
                    <ScrollArea className="h-[200px] rounded-md border p-3 bg-muted/30">
                      {isLoadingStates || isLoadingCentres ? (
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-2 py-1.5">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-4 w-32" />
                            </div>
                          ))}
                        </div>
                      ) : (
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
                                  checked={isStateFullySelected(state) ? true : isStatePartiallySelected(state) ? 'indeterminate' : false}
                                  onCheckedChange={() => toggleStateSelection(state)}
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
                                        onClick={(e) => e.stopPropagation()}
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
                      )}
                    </ScrollArea>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Required Documents Selection */}
              <FormField
                control={form.control}
                name="requiredDocuments"
                render={() => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-2">
                      <FormLabel>Required Documents for Verification</FormLabel>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={selectAllDocuments}
                          className="text-xs h-7"
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearAllDocuments}
                          className="text-xs h-7"
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {selectedDocuments.length > 0 
                        ? `${selectedDocuments.length} documents selected` 
                        : 'No documents selected'}
                    </div>
                    <ScrollArea className="h-[180px] rounded-md border p-3 bg-muted/30">
                      {isLoadingDocuments ? (
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-2 py-1.5">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-4 w-40" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-muted"
                              onClick={() => toggleDocumentSelection(doc.id)}
                            >
                              <Checkbox
                                checked={selectedDocuments.includes(doc.id)}
                                onCheckedChange={() => toggleDocumentSelection(doc.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium block truncate">{doc.name}</span>
                                <span className="text-xs text-muted-foreground block truncate">
                                  {doc.category}
                                </span>
                              </div>
                              {doc.isRequired && (
                                <span className="text-xs bg-destructive/10 text-destructive px-1.5 py-0.5 rounded flex-shrink-0">
                                  Required
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
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
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update' : 'Create'} Program
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
