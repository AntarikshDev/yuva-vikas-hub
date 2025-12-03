import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, Mail, MapPin, Calendar, Building, Briefcase, Clock, Pencil, Check, X, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CandidateDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  candidate: any;
  onStatusUpdate: (candidateId: string, newMigrationStatus: string, newEnrollmentStatus: string) => void;
}

interface EditableFieldProps {
  label: string;
  value: string;
  field: string;
  icon: React.ReactNode;
  isEditing: boolean;
  editedValue: string;
  onChange: (field: string, value: string) => void;
  type?: string;
}

function EditableField({ label, value, field, icon, isEditing, editedValue, onChange, type = 'text' }: EditableFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-muted-foreground">{icon}</div>
      <div className="flex-1 space-y-1">
        <Label className="text-sm text-muted-foreground">{label}</Label>
        {isEditing ? (
          <Input
            type={type}
            value={editedValue}
            onChange={(e) => onChange(field, e.target.value)}
            className="h-9"
          />
        ) : (
          <p className="font-medium">{value || '-'}</p>
        )}
      </div>
    </div>
  );
}

export function CandidateDetailsDialog({ open, onClose, candidate, onStatusUpdate }: CandidateDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Editable form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    batchId: '',
    jobRole: '',
    company: '',
    placementLocation: '',
    counsellorApproval: '',
    travelDate: '',
    migrationStatus: '',
    enrollmentStatus: '',
  });

  // Reset form when candidate changes or dialog opens
  useEffect(() => {
    if (candidate && open) {
      setFormData({
        name: candidate.name || '',
        phone: candidate.phone || '',
        email: candidate.email || '',
        batchId: candidate.batchId || '',
        jobRole: candidate.jobRole || '',
        company: candidate.company || '',
        placementLocation: candidate.placementLocation || '',
        counsellorApproval: candidate.counsellorApproval || '',
        travelDate: candidate.travelDate || '',
        migrationStatus: candidate.migrationStatus || '',
        enrollmentStatus: candidate.enrollmentStatus || '',
      });
      setIsEditing(false);
    }
  }, [candidate, open]);

  if (!candidate) return null;

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update status if changed
      if (formData.migrationStatus !== candidate.migrationStatus || 
          formData.enrollmentStatus !== candidate.enrollmentStatus) {
        onStatusUpdate(candidate.id, formData.migrationStatus, formData.enrollmentStatus);
      }
      
      toast({
        title: "Changes Saved",
        description: "Candidate details have been updated successfully.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setFormData({
      name: candidate.name || '',
      phone: candidate.phone || '',
      email: candidate.email || '',
      batchId: candidate.batchId || '',
      jobRole: candidate.jobRole || '',
      company: candidate.company || '',
      placementLocation: candidate.placementLocation || '',
      counsellorApproval: candidate.counsellorApproval || '',
      travelDate: candidate.travelDate || '',
      migrationStatus: candidate.migrationStatus || '',
      enrollmentStatus: candidate.enrollmentStatus || '',
    });
    setIsEditing(false);
  };

  const hasChanges = 
    formData.name !== candidate.name ||
    formData.phone !== candidate.phone ||
    formData.email !== candidate.email ||
    formData.batchId !== candidate.batchId ||
    formData.jobRole !== candidate.jobRole ||
    formData.company !== candidate.company ||
    formData.placementLocation !== candidate.placementLocation ||
    formData.counsellorApproval !== candidate.counsellorApproval ||
    formData.travelDate !== candidate.travelDate ||
    formData.migrationStatus !== candidate.migrationStatus ||
    formData.enrollmentStatus !== candidate.enrollmentStatus;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Candidate Details & Verification
            <Badge variant="outline" className="ml-2">{candidate.id}</Badge>
          </DialogTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel} className="gap-1">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!hasChanges || isSaving} className="gap-1">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                  label="Full Name"
                  value={candidate.name}
                  field="name"
                  icon={<User className="h-4 w-4" />}
                  isEditing={isEditing}
                  editedValue={formData.name}
                  onChange={handleFieldChange}
                />
                <EditableField
                  label="Phone Number"
                  value={candidate.phone}
                  field="phone"
                  icon={<Phone className="h-4 w-4" />}
                  isEditing={isEditing}
                  editedValue={formData.phone}
                  onChange={handleFieldChange}
                  type="tel"
                />
                <EditableField
                  label="Email Address"
                  value={candidate.email}
                  field="email"
                  icon={<Mail className="h-4 w-4" />}
                  isEditing={isEditing}
                  editedValue={formData.email}
                  onChange={handleFieldChange}
                  type="email"
                />
              </div>
            </CardContent>
          </Card>

          {/* Training & Placement Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Training & Placement Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                  label="Batch ID"
                  value={candidate.batchId}
                  field="batchId"
                  icon={<Building className="h-4 w-4" />}
                  isEditing={isEditing}
                  editedValue={formData.batchId}
                  onChange={handleFieldChange}
                />
                <EditableField
                  label="Job Role"
                  value={candidate.jobRole}
                  field="jobRole"
                  icon={<Briefcase className="h-4 w-4" />}
                  isEditing={isEditing}
                  editedValue={formData.jobRole}
                  onChange={handleFieldChange}
                />
                <EditableField
                  label="Company"
                  value={candidate.company}
                  field="company"
                  icon={<Building className="h-4 w-4" />}
                  isEditing={isEditing}
                  editedValue={formData.company}
                  onChange={handleFieldChange}
                />
                <EditableField
                  label="Placement Location"
                  value={candidate.placementLocation}
                  field="placementLocation"
                  icon={<MapPin className="h-4 w-4" />}
                  isEditing={isEditing}
                  editedValue={formData.placementLocation}
                  onChange={handleFieldChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                  label="Counsellor Approval Date"
                  value={candidate.counsellorApproval}
                  field="counsellorApproval"
                  icon={<Calendar className="h-4 w-4" />}
                  isEditing={isEditing}
                  editedValue={formData.counsellorApproval}
                  onChange={handleFieldChange}
                  type="date"
                />
                <EditableField
                  label="Travel Date"
                  value={candidate.travelDate}
                  field="travelDate"
                  icon={<Clock className="h-4 w-4" />}
                  isEditing={isEditing}
                  editedValue={formData.travelDate}
                  onChange={handleFieldChange}
                  type="date"
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Status Management */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Check className="h-4 w-4" />
                Status Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Migration Status</Label>
                  <Select 
                    value={formData.migrationStatus} 
                    onValueChange={(value) => handleFieldChange('migrationStatus', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className={!isEditing ? 'bg-muted' : ''}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ready for Migration">Ready for Migration</SelectItem>
                      <SelectItem value="Migrated">Migrated</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  {!isEditing && (
                    <p className="text-xs text-muted-foreground">
                      Current: <Badge variant="outline" className="ml-1">{candidate.migrationStatus}</Badge>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Enrollment Status</Label>
                  <Select 
                    value={formData.enrollmentStatus} 
                    onValueChange={(value) => handleFieldChange('enrollmentStatus', value)}
                    disabled={!isEditing || formData.migrationStatus !== 'Migrated'}
                  >
                    <SelectTrigger className={!isEditing ? 'bg-muted' : ''}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Enrolled">Enrolled</SelectItem>
                      <SelectItem value="Dropped">Dropped</SelectItem>
                    </SelectContent>
                  </Select>
                  {!isEditing && (
                    <p className="text-xs text-muted-foreground">
                      Current: <Badge variant="outline" className="ml-1">{candidate.enrollmentStatus}</Badge>
                    </p>
                  )}
                  {isEditing && formData.migrationStatus !== 'Migrated' && (
                    <p className="text-xs text-amber-600">
                      Enrollment can only be updated for migrated candidates
                    </p>
                  )}
                </div>
              </div>

              {/* Changes Preview */}
              {isEditing && hasChanges && (
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Pending Changes
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {formData.name !== candidate.name && (
                      <p><span className="text-muted-foreground">Name:</span> {candidate.name} → <span className="text-primary font-medium">{formData.name}</span></p>
                    )}
                    {formData.phone !== candidate.phone && (
                      <p><span className="text-muted-foreground">Phone:</span> {candidate.phone} → <span className="text-primary font-medium">{formData.phone}</span></p>
                    )}
                    {formData.email !== candidate.email && (
                      <p><span className="text-muted-foreground">Email:</span> {candidate.email} → <span className="text-primary font-medium">{formData.email}</span></p>
                    )}
                    {formData.batchId !== candidate.batchId && (
                      <p><span className="text-muted-foreground">Batch ID:</span> {candidate.batchId} → <span className="text-primary font-medium">{formData.batchId}</span></p>
                    )}
                    {formData.jobRole !== candidate.jobRole && (
                      <p><span className="text-muted-foreground">Job Role:</span> {candidate.jobRole} → <span className="text-primary font-medium">{formData.jobRole}</span></p>
                    )}
                    {formData.company !== candidate.company && (
                      <p><span className="text-muted-foreground">Company:</span> {candidate.company} → <span className="text-primary font-medium">{formData.company}</span></p>
                    )}
                    {formData.placementLocation !== candidate.placementLocation && (
                      <p><span className="text-muted-foreground">Location:</span> {candidate.placementLocation} → <span className="text-primary font-medium">{formData.placementLocation}</span></p>
                    )}
                    {formData.migrationStatus !== candidate.migrationStatus && (
                      <p><span className="text-muted-foreground">Migration:</span> {candidate.migrationStatus} → <span className="text-primary font-medium">{formData.migrationStatus}</span></p>
                    )}
                    {formData.enrollmentStatus !== candidate.enrollmentStatus && (
                      <p><span className="text-muted-foreground">Enrollment:</span> {candidate.enrollmentStatus} → <span className="text-primary font-medium">{formData.enrollmentStatus}</span></p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
