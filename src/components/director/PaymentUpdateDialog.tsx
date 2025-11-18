import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaymentCycle } from '@/store/slices/directorSlice';

const paymentUpdateSchema = z.object({
  status: z.enum(['Pending', 'Received', 'Delayed']),
  receivedDate: z.date().optional(),
  receivedAmount: z.number().min(0),
  notes: z.string().optional(),
  transactionId: z.string().optional(),
});

type PaymentUpdateForm = z.infer<typeof paymentUpdateSchema>;

interface PaymentUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cycle: PaymentCycle | null;
  workOrderId: string;
  onUpdate: (workOrderId: string, cycleNumber: number, data: PaymentUpdateForm) => void;
}

export const PaymentUpdateDialog: React.FC<PaymentUpdateDialogProps> = ({
  open,
  onOpenChange,
  cycle,
  workOrderId,
  onUpdate,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentUpdateForm>({
    resolver: zodResolver(paymentUpdateSchema),
    defaultValues: {
      status: cycle?.status || 'Pending',
      receivedAmount: cycle?.amount || 0,
      receivedDate: cycle?.receivedDate ? new Date(cycle.receivedDate) : undefined,
      notes: '',
      transactionId: '',
    },
  });

  const status = watch('status');
  const receivedDate = watch('receivedDate');

  const onSubmit = (data: PaymentUpdateForm) => {
    if (cycle) {
      onUpdate(workOrderId, cycle.cycleNumber, data);
      onOpenChange(false);
    }
  };

  if (!cycle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Payment - Cycle #{cycle.cycleNumber}</DialogTitle>
          <DialogDescription>
            Expected Amount: ₹{(cycle.amount / 100000).toFixed(2)}L | 
            Expected Date: {format(new Date(cycle.expectedDate), 'dd MMM yyyy')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Payment Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setValue('status', value as 'Pending' | 'Received' | 'Delayed')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status === 'Received' && (
            <>
              <div className="space-y-2">
                <Label>Received Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !receivedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {receivedDate ? format(receivedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={receivedDate}
                      onSelect={(date) => setValue('receivedDate', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receivedAmount">Received Amount (₹)</Label>
                <Input
                  id="receivedAmount"
                  type="number"
                  {...register('receivedAmount', { valueAsNumber: true })}
                  placeholder="Enter received amount"
                />
                {errors.receivedAmount && (
                  <p className="text-sm text-destructive">{errors.receivedAmount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction/Reference ID</Label>
                <Input
                  id="transactionId"
                  {...register('transactionId')}
                  placeholder="Enter transaction ID"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes/Remarks</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Add any notes or remarks"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Payment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
