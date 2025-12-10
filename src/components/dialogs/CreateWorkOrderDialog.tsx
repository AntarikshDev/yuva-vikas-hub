import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CreateWorkOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: WorkOrderFormData) => void;
  initialData?: WorkOrderFormData;
  isEditing?: boolean;
}

interface WorkOrderFormData {
  workOrderNo: string;
  programId: string;
  programName: string;
  programCode: string;
  assignedDate: string;
  startDate: string;
  endDate: string;
  totalTarget: number;
  targetSc: number;
  targetSt: number;
  targetObc: number;
  targetGeneral: number;
  targetMinority: number;
  stateId?: string;
  stateName?: string;
  districtId?: string;
  districtName?: string;
  assignedNationalHeadId: string;
  assignedNationalHeadName: string;
  status: string;
}

// Mock data
const mockPrograms = [
  { id: 'prog-1', name: 'DDU-GKY', code: 'DDU' },
  { id: 'prog-2', name: 'PMKVY', code: 'PMK' },
  { id: 'prog-3', name: 'NAPS', code: 'NAP' },
  { id: 'prog-4', name: 'SANKALP', code: 'SNK' },
];

const mockStates = [
  { id: 'state-1', name: 'Maharashtra' },
  { id: 'state-2', name: 'Karnataka' },
  { id: 'state-3', name: 'Tamil Nadu' },
  { id: 'state-4', name: 'Gujarat' },
  { id: 'state-5', name: 'Rajasthan' },
];

const mockDistricts: Record<string, { id: string; name: string }[]> = {
  'state-1': [
    { id: 'dist-1', name: 'Pune' },
    { id: 'dist-2', name: 'Mumbai' },
    { id: 'dist-3', name: 'Nagpur' },
  ],
  'state-2': [
    { id: 'dist-4', name: 'Bangalore' },
    { id: 'dist-5', name: 'Mysore' },
  ],
  'state-3': [
    { id: 'dist-6', name: 'Chennai' },
    { id: 'dist-7', name: 'Coimbatore' },
  ],
  'state-4': [
    { id: 'dist-8', name: 'Ahmedabad' },
    { id: 'dist-9', name: 'Surat' },
  ],
  'state-5': [
    { id: 'dist-10', name: 'Jaipur' },
    { id: 'dist-11', name: 'Jodhpur' },
  ],
};

// National Heads filtered by state (from user management)
const mockNationalHeads: Record<string, { id: string; name: string }[]> = {
  'state-1': [
    { id: 'nh-001', name: 'Rajesh Kumar' },
    { id: 'nh-004', name: 'Amit Verma' },
  ],
  'state-2': [
    { id: 'nh-002', name: 'Priya Sharma' },
  ],
  'state-3': [
    { id: 'nh-003', name: 'Arun Patel' },
  ],
  'state-4': [
    { id: 'nh-005', name: 'Neha Gupta' },
  ],
  'state-5': [
    { id: 'nh-006', name: 'Vikram Singh' },
  ],
};

export const CreateWorkOrderDialog: React.FC<CreateWorkOrderDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<Partial<WorkOrderFormData>>({
    workOrderNo: '',
    programId: '',
    totalTarget: 0,
    targetSc: 0,
    targetSt: 0,
    targetObc: 0,
    targetGeneral: 0,
    targetMinority: 0,
    status: 'active',
  });

  const [assignedDate, setAssignedDate] = useState<Date>();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedStateId, setSelectedStateId] = useState<string>('');
  const [availableDistricts, setAvailableDistricts] = useState<{ id: string; name: string }[]>([]);
  const [availableNationalHeads, setAvailableNationalHeads] = useState<{ id: string; name: string }[]>([]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open && initialData) {
      setFormData(initialData);
      setAssignedDate(initialData.assignedDate ? new Date(initialData.assignedDate) : undefined);
      setStartDate(initialData.startDate ? new Date(initialData.startDate) : undefined);
      setEndDate(initialData.endDate ? new Date(initialData.endDate) : undefined);
      
      // Find state ID from state name
      const state = mockStates.find(s => s.name === initialData.stateName);
      if (state) {
        setSelectedStateId(state.id);
        setAvailableDistricts(mockDistricts[state.id] || []);
        setAvailableNationalHeads(mockNationalHeads[state.id] || []);
      }
    } else if (!open) {
      setFormData({
        workOrderNo: '',
        programId: '',
        totalTarget: 0,
        targetSc: 0,
        targetSt: 0,
        targetObc: 0,
        targetGeneral: 0,
        targetMinority: 0,
        status: 'active',
      });
      setAssignedDate(undefined);
      setStartDate(undefined);
      setEndDate(undefined);
      setSelectedStateId('');
      setAvailableDistricts([]);
      setAvailableNationalHeads([]);
    }
  }, [open, initialData]);

  // Update districts and national heads when state changes
  useEffect(() => {
    if (selectedStateId) {
      setAvailableDistricts(mockDistricts[selectedStateId] || []);
      setAvailableNationalHeads(mockNationalHeads[selectedStateId] || []);
    } else {
      setAvailableDistricts([]);
      setAvailableNationalHeads([]);
    }
  }, [selectedStateId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const program = mockPrograms.find(p => p.id === formData.programId);
    const state = mockStates.find(s => s.id === selectedStateId);
    const district = availableDistricts.find(d => d.id === formData.districtId);
    const nationalHead = availableNationalHeads.find(nh => nh.id === formData.assignedNationalHeadId);

    const submitData: WorkOrderFormData = {
      workOrderNo: formData.workOrderNo || '',
      programId: formData.programId || '',
      programName: program?.name || '',
      programCode: program?.code || '',
      assignedDate: assignedDate ? format(assignedDate, 'yyyy-MM-dd') : '',
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : '',
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : '',
      totalTarget: formData.totalTarget || 0,
      targetSc: formData.targetSc || 0,
      targetSt: formData.targetSt || 0,
      targetObc: formData.targetObc || 0,
      targetGeneral: formData.targetGeneral || 0,
      targetMinority: formData.targetMinority || 0,
      stateId: selectedStateId || undefined,
      stateName: state?.name || undefined,
      districtId: formData.districtId || undefined,
      districtName: district?.name || undefined,
      assignedNationalHeadId: formData.assignedNationalHeadId || '',
      assignedNationalHeadName: nationalHead?.name || '',
      status: formData.status || 'active',
    };

    onSubmit(submitData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Work Order' : 'Create Work Order'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="program">Program *</Label>
                <Select
                  value={formData.programId}
                  onValueChange={(value) => setFormData({ ...formData, programId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {mockPrograms.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name} ({program.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workOrderNo">Work Order Number *</Label>
                <Input
                  id="workOrderNo"
                  placeholder="WO-2024-XXX"
                  value={formData.workOrderNo}
                  onChange={(e) => setFormData({ ...formData, workOrderNo: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Timeline</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Assigned Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !assignedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {assignedDate ? format(assignedDate, 'PPP') : 'Pick date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={assignedDate}
                      onSelect={setAssignedDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : 'Pick date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : 'Pick date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Separator />

          {/* Targets */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Targets</h3>
            
            <div className="space-y-2">
              <Label htmlFor="totalTarget">Total Target / Assigned Numbers *</Label>
              <Input
                id="totalTarget"
                type="number"
                placeholder="Enter total target"
                value={formData.totalTarget || ''}
                onChange={(e) => setFormData({ ...formData, totalTarget: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Category-wise Targets (Optional)</Label>
              <div className="grid grid-cols-5 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="targetSc" className="text-xs">SC</Label>
                  <Input
                    id="targetSc"
                    type="number"
                    placeholder="0"
                    value={formData.targetSc || ''}
                    onChange={(e) => setFormData({ ...formData, targetSc: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="targetSt" className="text-xs">ST</Label>
                  <Input
                    id="targetSt"
                    type="number"
                    placeholder="0"
                    value={formData.targetSt || ''}
                    onChange={(e) => setFormData({ ...formData, targetSt: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="targetObc" className="text-xs">OBC</Label>
                  <Input
                    id="targetObc"
                    type="number"
                    placeholder="0"
                    value={formData.targetObc || ''}
                    onChange={(e) => setFormData({ ...formData, targetObc: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="targetGeneral" className="text-xs">General</Label>
                  <Input
                    id="targetGeneral"
                    type="number"
                    placeholder="0"
                    value={formData.targetGeneral || ''}
                    onChange={(e) => setFormData({ ...formData, targetGeneral: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="targetMinority" className="text-xs">Minority</Label>
                  <Input
                    id="targetMinority"
                    type="number"
                    placeholder="0"
                    value={formData.targetMinority || ''}
                    onChange={(e) => setFormData({ ...formData, targetMinority: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Location & Assignment */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Location & Assignment</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>State (Optional)</Label>
                <Select
                  value={selectedStateId}
                  onValueChange={setSelectedStateId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {mockStates.map((state) => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>District (Optional)</Label>
                <Select
                  value={formData.districtId}
                  onValueChange={(value) => setFormData({ ...formData, districtId: value })}
                  disabled={!selectedStateId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {availableDistricts.map((district) => (
                      <SelectItem key={district.id} value={district.id}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assign National Head *</Label>
              <Select
                value={formData.assignedNationalHeadId}
                onValueChange={(value) => setFormData({ ...formData, assignedNationalHeadId: value })}
                disabled={!selectedStateId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedStateId ? "Select national head" : "Select state first"} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {availableNationalHeads.map((nh) => (
                    <SelectItem key={nh.id} value={nh.id}>
                      {nh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                National heads are filtered based on the selected state from user management.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              {isEditing ? 'Update Work Order' : 'Create Work Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkOrderDialog;
