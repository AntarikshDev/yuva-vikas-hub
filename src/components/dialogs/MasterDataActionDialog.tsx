
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface MasterDataActionDialogProps {
  type: 'archive' | 'delete';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  category: string;
  onConfirm: () => void;
}

export const MasterDataActionDialog = ({
  type,
  open,
  onOpenChange,
  itemName,
  category,
  onConfirm
}: MasterDataActionDialogProps) => {
  const { toast } = useToast();

  const handleConfirm = () => {
    onConfirm();
    toast({
      title: `${type === 'archive' ? 'Archived' : 'Deleted'} successfully`,
      description: `${itemName} has been ${type === 'archive' ? 'archived' : 'deleted'}.`,
    });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {type === 'archive' ? `Archive ${category}` : `Delete ${category}`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {type === 'archive'
              ? `Are you sure you want to archive ${itemName}? This item will be marked as inactive.`
              : `Are you sure you want to delete ${itemName}? This action cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={type === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
          >
            {type === 'archive' ? 'Archive' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
