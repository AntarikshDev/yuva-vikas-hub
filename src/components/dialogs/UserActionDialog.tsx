
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UserActionDialogProps {
  type: 'deactivate' | 'reactivate' | 'delete';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  onConfirm: () => void;
}

export const UserActionDialog = ({ type, open, onOpenChange, userName, onConfirm }: UserActionDialogProps) => {
  const { toast } = useToast();

  const handleConfirm = () => {
    onConfirm();
    toast({
      title: type === 'deactivate' 
        ? 'User deactivated' 
        : type === 'reactivate'
          ? 'User reactivated'
          : 'User deleted',
      description: `${userName} has been ${type === 'deactivate' ? 'deactivated' : type === 'reactivate' ? 'reactivated' : 'deleted'} successfully.`,
    });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {type === 'deactivate' 
              ? 'Deactivate User' 
              : type === 'reactivate'
                ? 'Reactivate User'
                : 'Delete User'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {type === 'deactivate' 
              ? `Are you sure you want to deactivate ${userName}? They will no longer be able to access the system.` 
              : type === 'reactivate'
                ? `Are you sure you want to reactivate ${userName}? They will regain access to the system.`
                : `Are you sure you want to delete ${userName}? This action cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className={type === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}>
            {type === 'deactivate' ? 'Deactivate' : type === 'reactivate' ? 'Reactivate' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
