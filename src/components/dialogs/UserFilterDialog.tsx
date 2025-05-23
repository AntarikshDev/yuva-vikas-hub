
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface UserFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilter: (filters: UserFilters) => void;
}

export interface UserFilters {
  role: string;
  center: string;
  status: string;
}

export const UserFilterDialog = ({ open, onOpenChange, onApplyFilter }: UserFilterDialogProps) => {
  const { toast } = useToast();
  const [filters, setFilters] = React.useState<UserFilters>({
    role: '',
    center: '',
    status: '',
  });

  const handleApplyFilter = () => {
    onApplyFilter(filters);
    toast({
      title: "Filters applied",
      description: "User list has been filtered based on your criteria.",
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      role: '',
      center: '',
      status: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Users</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="state_head">State Head</SelectItem>
                <SelectItem value="center_manager">Center Manager</SelectItem>
                <SelectItem value="mobilizer">Mobilizer</SelectItem>
                <SelectItem value="trainer">Trainer</SelectItem>
                <SelectItem value="ppc_team">PPC Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="center" className="text-right">
              Center
            </Label>
            <Select value={filters.center} onValueChange={(value) => setFilters({ ...filters, center: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="All Centers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Centers</SelectItem>
                <SelectItem value="delhi">Delhi Center</SelectItem>
                <SelectItem value="mumbai">Mumbai Center</SelectItem>
                <SelectItem value="pune">Pune Center</SelectItem>
                <SelectItem value="chennai">Chennai Center</SelectItem>
                <SelectItem value="kolkata">Kolkata Center</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset} className="gap-1">
            <X className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleApplyFilter}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
