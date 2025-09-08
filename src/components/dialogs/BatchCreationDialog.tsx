import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Upload, Users, BookOpen, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BatchCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBatchCreated: (batch: any) => void;
}

export const BatchCreationDialog = ({ open, onOpenChange, onBatchCreated }: BatchCreationDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [formData, setFormData] = useState({
    program: '',
    trainer: '',
    capacity: '',
    candidatesFile: null as File | null
  });

  // Mock data
  const programs = [
    { id: 'retail-sales', name: 'Retail Sales Associate' },
    { id: 'customer-service', name: 'Customer Service Executive' },
    { id: 'data-entry', name: 'Data Entry Operator' },
    { id: 'warehouse', name: 'Warehouse Operations' },
    { id: 'hospitality', name: 'Hospitality & Tourism' }
  ];

  const trainers = [
    { id: 'trainer-1', name: 'Priya Sharma', expertise: 'Retail & Sales' },
    { id: 'trainer-2', name: 'Rajesh Kumar', expertise: 'Customer Service' },
    { id: 'trainer-3', name: 'Anita Patel', expertise: 'Data Operations' },
    { id: 'trainer-4', name: 'Suresh Reddy', expertise: 'Warehouse Management' },
    { id: 'trainer-5', name: 'Meera Singh', expertise: 'Hospitality' }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file only.",
          variant: "destructive"
        });
        return;
      }
      setFormData(prev => ({ ...prev, candidatesFile: file }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.program || !formData.trainer || !formData.capacity || !startDate || !formData.candidatesFile) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields and upload candidates file.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newBatch = {
        id: `B${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`,
        name: `Batch ${programs.find(p => p.id === formData.program)?.name}`,
        program: formData.program,
        trainer: formData.trainer,
        capacity: parseInt(formData.capacity),
        startDate: startDate,
        candidates: Math.floor(Math.random() * parseInt(formData.capacity)) + 1,
        status: 'Active'
      };

      onBatchCreated(newBatch);
      
      toast({
        title: "Batch created successfully",
        description: `${newBatch.id} has been created with ${newBatch.candidates} candidates enrolled.`
      });

      // Reset form
      setFormData({
        program: '',
        trainer: '',
        capacity: '',
        candidatesFile: null
      });
      setStartDate(undefined);
      onOpenChange(false);

    } catch (error) {
      toast({
        title: "Error creating batch",
        description: "Failed to create batch. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Create New Batch
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Configure the basic batch details and training program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="program">Program *</Label>
                  <Select value={formData.program} onValueChange={(value) => setFormData(prev => ({ ...prev, program: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trainer">Trainer *</Label>
                  <Select value={formData.trainer} onValueChange={(value) => setFormData(prev => ({ ...prev, trainer: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainers.map((trainer) => (
                        <SelectItem key={trainer.id} value={trainer.id}>
                          <div className="flex flex-col">
                            <span>{trainer.name}</span>
                            <span className="text-xs text-muted-foreground">{trainer.expertise}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Batch Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="e.g., 50"
                    min="1"
                    max="100"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidates Upload */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Candidate Enrollment
              </CardTitle>
              <CardDescription>
                Upload candidate details to assign them to this batch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="candidates-file">Upload Candidates CSV *</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="candidates-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-1" />
                    Template
                  </Button>
                </div>
                {formData.candidatesFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {formData.candidatesFile.name}
                  </p>
                )}
              </div>

              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">CSV Requirements:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Include columns: Name, Email, Phone, Address, Education</li>
                  <li>• Maximum 100 candidates per batch</li>
                  <li>• File size should not exceed 2MB</li>
                  <li>• Use UTF-8 encoding for special characters</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Batch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};