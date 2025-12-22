import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, X, FileText, Image, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { crpCategories, jharkhandDistricts } from '@/data/jharkhandCensusData';
import { useGetCRPByIdQuery, useCreateCRPMutation, useUpdateCRPMutation } from '@/store/api/apiSlice';
import type { CRP, CRPDocument } from '@/types/crp';

// Validation Schema
const bankDetailsSchema = z.object({
  accountHolderName: z.string().min(2, 'Account holder name is required').max(100),
  accountNumber: z.string().min(9, 'Invalid account number').max(18, 'Invalid account number').regex(/^\d+$/, 'Account number must be numeric'),
  ifscCode: z.string().length(11, 'IFSC code must be 11 characters').regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
  bankName: z.string().min(2, 'Bank name is required').max(100),
  branchName: z.string().min(2, 'Branch name is required').max(100),
});

const crpFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  category: z.string().min(1, 'Category is required'),
  districtId: z.string().min(1, 'District is required'),
  homeLocation: z.string().min(1, 'Home location is required').max(100),
  workLocation: z.string().min(1, 'Work location is required').max(100),
  phone: z.string().length(10, 'Phone must be 10 digits').regex(/^\d+$/, 'Phone must be numeric'),
  aadhaarNumber: z.string().length(12, 'Aadhaar must be 12 digits').regex(/^\d+$/, 'Aadhaar must be numeric'),
  panNumber: z.string().length(10, 'PAN must be 10 characters').regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  bankDetails: bankDetailsSchema,
});

type CRPFormValues = z.infer<typeof crpFormSchema>;

interface DocumentUpload {
  type: 'aadhaar' | 'pan' | 'bankPassbook' | 'photo' | 'loi';
  label: string;
  acceptedFormats: string;
  file?: File;
  preview?: string;
  existingDoc?: CRPDocument;
}

interface CRPFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crpId?: string;
  workOrderId: string;
  adoptedDistricts: string[];
  onSuccess?: () => void;
}

export const CRPForm: React.FC<CRPFormProps> = ({
  open,
  onOpenChange,
  crpId,
  workOrderId,
  adoptedDistricts,
  onSuccess,
}) => {
  const isEditMode = !!crpId;
  
  // RTK Query hooks
  const { data: existingCRP, isLoading: isLoadingCRP } = useGetCRPByIdQuery(
    { workOrderId, crpId: crpId! },
    { skip: !crpId || !open }
  );
  const [createCRP, { isLoading: isCreating }] = useCreateCRPMutation();
  const [updateCRP, { isLoading: isUpdating }] = useUpdateCRPMutation();
  
  const isSubmitting = isCreating || isUpdating;

  // Documents state
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { type: 'aadhaar', label: 'Aadhaar Card', acceptedFormats: '.pdf,.jpg,.jpeg,.png' },
    { type: 'pan', label: 'PAN Card', acceptedFormats: '.pdf,.jpg,.jpeg,.png' },
    { type: 'bankPassbook', label: 'Bank Passbook / Cancelled Cheque', acceptedFormats: '.pdf,.jpg,.jpeg,.png' },
    { type: 'photo', label: 'CRP Photo', acceptedFormats: '.jpg,.jpeg,.png' },
    { type: 'loi', label: 'Letter of Intent (LOI)', acceptedFormats: '.pdf,.jpg,.jpeg,.png' },
  ]);

  const form = useForm<CRPFormValues>({
    resolver: zodResolver(crpFormSchema),
    defaultValues: {
      name: '',
      category: '',
      districtId: '',
      homeLocation: '',
      workLocation: '',
      phone: '',
      aadhaarNumber: '',
      panNumber: '',
      bankDetails: {
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        branchName: '',
      },
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (existingCRP && isEditMode) {
      form.reset({
        name: existingCRP.name,
        category: existingCRP.category,
        districtId: existingCRP.districtId,
        homeLocation: existingCRP.homeLocation,
        workLocation: existingCRP.workLocation,
        phone: existingCRP.phone,
        aadhaarNumber: existingCRP.aadhaarNumber,
        panNumber: existingCRP.panNumber,
        bankDetails: existingCRP.bankDetails,
      });

      // Set existing documents
      if (existingCRP.documents) {
        setDocuments(prev => prev.map(doc => {
          const existing = existingCRP.documents.find((d: CRPDocument) => d.type === doc.type);
          return existing ? { ...doc, existingDoc: existing } : doc;
        }));
      }
    }
  }, [existingCRP, isEditMode, form]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setDocuments([
        { type: 'aadhaar', label: 'Aadhaar Card', acceptedFormats: '.pdf,.jpg,.jpeg,.png' },
        { type: 'pan', label: 'PAN Card', acceptedFormats: '.pdf,.jpg,.jpeg,.png' },
        { type: 'bankPassbook', label: 'Bank Passbook / Cancelled Cheque', acceptedFormats: '.pdf,.jpg,.jpeg,.png' },
        { type: 'photo', label: 'CRP Photo', acceptedFormats: '.jpg,.jpeg,.png' },
        { type: 'loi', label: 'Letter of Intent (LOI)', acceptedFormats: '.pdf,.jpg,.jpeg,.png' },
      ]);
    }
  }, [open, form]);

  const handleFileUpload = (type: DocumentUpload['type'], file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setDocuments(prev => prev.map(doc => 
        doc.type === type 
          ? { ...doc, file, preview: e.target?.result as string }
          : doc
      ));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (type: DocumentUpload['type']) => {
    setDocuments(prev => prev.map(doc => 
      doc.type === type 
        ? { ...doc, file: undefined, preview: undefined }
        : doc
    ));
  };

  const onSubmit = async (values: CRPFormValues) => {
    try {
      // Check if LOI is uploaded to set loi flag
      const loiDoc = documents.find(d => d.type === 'loi');
      const hasLOI = !!(loiDoc?.file || loiDoc?.existingDoc);

      const payload = {
        ...values,
        workOrderId,
        loi: hasLOI,
        createdBy: 'current-user', // Replace with actual user ID
      };

      if (isEditMode) {
        await updateCRP({
          workOrderId,
          crpId: crpId!,
          data: payload,
        }).unwrap();
        toast.success('CRP updated successfully');
      } else {
        await createCRP({
          workOrderId,
          crp: payload,
        }).unwrap();
        toast.success('CRP created successfully');
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(isEditMode ? 'Failed to update CRP' : 'Failed to create CRP');
    }
  };

  const FileUploadField = ({ doc }: { doc: DocumentUpload }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const hasFile = doc.file || doc.existingDoc;
    const isImage = doc.type === 'photo' || (doc.file?.type || '').startsWith('image/');

    return (
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          {doc.label}
          {doc.type === 'loi' && (
            <Badge variant="outline" className="text-xs">Required for LOI Status</Badge>
          )}
        </Label>
        <div 
          className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
            hasFile ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-muted-foreground/25 hover:border-primary'
          }`}
        >
          {hasFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isImage && doc.preview ? (
                  <img src={doc.preview} alt={doc.label} className="h-10 w-10 rounded object-cover" />
                ) : (
                  <FileText className="h-8 w-8 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {doc.file?.name || doc.existingDoc?.fileName}
                  </p>
                  {doc.existingDoc && !doc.file && (
                    <p className="text-xs text-muted-foreground">Previously uploaded</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(doc.type)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="flex flex-col items-center justify-center cursor-pointer py-2"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-6 w-6 text-muted-foreground mb-1" />
              <p className="text-sm text-muted-foreground">Click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">
                {doc.acceptedFormats.replace(/\./g, '').toUpperCase()}
              </p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={doc.acceptedFormats}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(doc.type, file);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Update CRP' : 'Add New CRP'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update the CRP details and documents'
              : 'Register a new Community Resource Person with payment verification details'
            }
          </DialogDescription>
        </DialogHeader>

        {isLoadingCRP ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="max-h-[70vh] pr-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="10 digit number" maxLength={10} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {crpCategories.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="districtId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select district" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {adoptedDistricts.map(id => {
                                  const district = jharkhandDistricts.find(d => d.id === id);
                                  return <SelectItem key={id} value={id}>{district?.name}</SelectItem>;
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="homeLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Home Location *</FormLabel>
                            <FormControl>
                              <Input placeholder="Village/Town name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="workLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Work Location *</FormLabel>
                            <FormControl>
                              <Input placeholder="Block/Area name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Identity & Verification */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Identity & Verification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="aadhaarNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Aadhaar Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="12 digit Aadhaar" maxLength={12} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="panNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PAN Number *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="ABCDE1234F" 
                                maxLength={10} 
                                {...field}
                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Bank Account Details */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Bank Account Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="bankDetails.accountHolderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Holder Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Name as per bank records" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="bankDetails.accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="Bank account number" maxLength={18} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bankDetails.ifscCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IFSC Code *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="SBIN0001234" 
                                maxLength={11} 
                                {...field}
                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="bankDetails.bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="State Bank of India" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bankDetails.branchName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Branch Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Main Branch, Ranchi" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Document Uploads */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Document Uploads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {documents.map(doc => (
                        <FileUploadField key={doc.type} doc={doc} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {isEditMode ? 'Update CRP' : 'Create CRP'}
                  </Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
