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

  // RTK Query hooks for fetching data
  const { data: statesData, isLoading: isLoadingStates } = useGetStatesQuery({});
  const { data: centresData, isLoading: isLoadingCentres } = useGetCentresQuery({});
  const { data: documentsData, isLoading: isLoadingDocuments } = useGetDocumentTypesQuery({});

  // Group centres by state
  const statesWithCentres = useMemo(() => {
    if (!statesData || !centresData) return [];
    
    return statesData.map(state => ({
      id: state.id,
      name: state.name,
      centres: centresData.filter(centre => centre.stateId === state.id),
    })).filter(state => state.centres.length > 0);
  }, [statesData, centresData]);

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
        selectedCentres: ['centre_1_1', 'centre_1_2', 'centre_2_1'],
        requiredDocuments: ['doc_1', 'doc_2'],
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
    if (documentsData) {
      form.setValue('requiredDocuments', documentsData.map(d => d.id));
    }
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
                          disabled={isLoading}
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearAllCentres}
                          className="text-xs h-7"
                          disabled={isLoading}
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
                      ) : statesWithCentres.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <MapPin className="h-8 w-8 mb-2 opacity-50" />
                          <p className="text-sm">No states or centres available</p>
                          <p className="text-xs">Add locations in Master Data first</p>
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
                                    >
                                      <Checkbox
                                        checked={selectedCentres.includes(centre.id)}
                                        onCheckedChange={(checked) => {
                                          if (checked !== 'indeterminate') {
                                            toggleCentreSelection(centre.id);
                                          }
                                        }}
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
                          disabled={isLoading}
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearAllDocuments}
                          className="text-xs h-7"
                          disabled={isLoading}
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
                    <ScrollArea className="h-[150px] rounded-md border p-3 bg-muted/30">
                      {isLoadingDocuments ? (
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-2 py-1.5">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-4 w-40" />
                            </div>
                          ))}
                        </div>
                      ) : !documentsData || documentsData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <FileText className="h-8 w-8 mb-2 opacity-50" />
                          <p className="text-sm">No document types available</p>
                          <p className="text-xs">Add documents in Master Data first</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {documentsData.map((doc) => (
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
                              <FileText className="h-4 w-4 text-primary" />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium block truncate">{doc.name}</span>
                                {doc.category && (
                                  <span className="text-xs text-muted-foreground block truncate">
                                    {doc.category}
                                  </span>
                                )}
                              </div>
                              {doc.isRequired && (
                                <span className="text-xs bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">
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
