import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { processCarryForward, CarryForwardItem, CARRY_FORWARD_ALLOWED_TYPES, NO_CARRY_FORWARD_TYPES } from '@/store/slices/targetManagementSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const CarryForwardList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { carryForwardQueue, loading } = useAppSelector((state) => state.targetManagement);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [actions, setActions] = useState<Record<string, 'add_to_next' | 'redistribute' | 'void'>>({});

  const handleSelectItem = (targetId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, targetId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== targetId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(carryForwardQueue.map((item) => item.targetId));
    } else {
      setSelectedItems([]);
    }
  };

  const handleActionChange = (targetId: string, action: 'add_to_next' | 'redistribute' | 'void') => {
    setActions({ ...actions, [targetId]: action });
  };

  const handleProcessSelected = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to process');
      return;
    }

    const itemsToProcess = carryForwardQueue
      .filter((item) => selectedItems.includes(item.targetId))
      .map((item) => ({
        ...item,
        action: actions[item.targetId] || 'add_to_next',
      }));

    try {
      await dispatch(processCarryForward({ items: itemsToProcess })).unwrap();
      toast.success(`Processed ${selectedItems.length} carry-forward items`);
      setSelectedItems([]);
      setActions({});
    } catch (error) {
      toast.error('Failed to process carry-forward items');
    }
  };

  const getTargetTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      mobilisation: 'bg-blue-100 text-blue-800',
      ofr_registration: 'bg-purple-100 text-purple-800',
      approved_ofr: 'bg-indigo-100 text-indigo-800',
      migration: 'bg-cyan-100 text-cyan-800',
      enrolment: 'bg-green-100 text-green-800',
      training_completion: 'bg-orange-100 text-orange-800',
      assessment: 'bg-yellow-100 text-yellow-800',
      placement: 'bg-teal-100 text-teal-800',
      retention: 'bg-pink-100 text-pink-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTargetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      mobilisation: 'Mobilisation',
      ofr_registration: 'OFR Registration',
      approved_ofr: 'Approved OFR',
      migration: 'Migration',
      enrolment: 'Enrolment',
      training_completion: 'Training Completion',
      assessment: 'Assessment',
      placement: 'Placement',
      retention: 'Retention',
    };
    return labels[type] || type;
  };

  const canCarryForward = (type: string) => {
    return CARRY_FORWARD_ALLOWED_TYPES.includes(type as any);
  };

  if (carryForwardQueue.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
          <h3 className="text-lg font-medium">No Pending Carry-Forwards</h3>
          <p className="text-muted-foreground text-center mt-2">
            All targets from previous periods have been processed or completed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Carry Forward Queue
            </CardTitle>
            <CardDescription>
              Incomplete targets from previous periods that need action
            </CardDescription>
          </div>
          <Button
            onClick={handleProcessSelected}
            disabled={selectedItems.length === 0 || loading}
          >
            Process Selected ({selectedItems.length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedItems.length === carryForwardQueue.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Target Type</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Original</TableHead>
              <TableHead className="text-right">Achieved</TableHead>
              <TableHead className="text-right">Pending</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carryForwardQueue.map((item) => {
              const allowCarryForward = canCarryForward(item.targetType);
              return (
                <TableRow key={item.targetId} className={!allowCarryForward ? 'bg-red-50/50' : ''}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.targetId)}
                      onCheckedChange={(checked) => handleSelectItem(item.targetId, checked as boolean)}
                      disabled={!allowCarryForward}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge className={getTargetTypeColor(item.targetType)}>
                        {getTargetTypeLabel(item.targetType)}
                      </Badge>
                      {!allowCarryForward && (
                        <span className="text-xs text-red-600">Cannot carry forward</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.employeeName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{item.fromPeriod}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{item.toPeriod}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.originalValue}</TableCell>
                  <TableCell className="text-right text-emerald-600">{item.achieved}</TableCell>
                  <TableCell className="text-right text-amber-600 font-medium">
                    {item.pending}
                    {!allowCarryForward && (
                      <span className="block text-xs text-red-600">= Dropout</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {allowCarryForward ? (
                      <Select
                        value={actions[item.targetId] || 'add_to_next'}
                        onValueChange={(value) => handleActionChange(item.targetId, value as any)}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="add_to_next">Add to Next Month</SelectItem>
                          <SelectItem value="redistribute">Redistribute</SelectItem>
                          <SelectItem value="void">Mark as Void</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Marked as Dropout
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Summary */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Pending</p>
            <p className="text-xl font-bold">
              {carryForwardQueue.reduce((sum, item) => sum + item.pending, 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Items Selected</p>
            <p className="text-xl font-bold">{selectedItems.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">To Carry Forward</p>
            <p className="text-xl font-bold text-amber-600">
              {carryForwardQueue
                .filter((item) => selectedItems.includes(item.targetId) && actions[item.targetId] === 'add_to_next')
                .reduce((sum, item) => sum + item.pending, 0) || 
                selectedItems.reduce((sum, id) => {
                  const item = carryForwardQueue.find((i) => i.targetId === id);
                  return sum + (item?.pending || 0);
                }, 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
