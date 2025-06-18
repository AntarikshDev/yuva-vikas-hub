
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, User } from 'lucide-react';

interface CenterContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  centerData: {
    centerName: string;
    manager: string;
    contact: {
      phone: string;
      email: string;
    };
    district: string;
  };
}

export function CenterContactDialog({ open, onOpenChange, centerData }: CenterContactDialogProps) {
  const handleCall = () => {
    window.open(`tel:${centerData.contact.phone}`);
  };

  const handleEmail = () => {
    window.open(`mailto:${centerData.contact.email}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Information</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg">{centerData.centerName}</h3>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{centerData.district}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">Center Manager</div>
                <div className="text-gray-600">{centerData.manager}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Phone</div>
                <div className="text-gray-600">{centerData.contact.phone}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-red-600" />
              <div>
                <div className="font-medium">Email</div>
                <div className="text-gray-600">{centerData.contact.email}</div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={handleCall} className="flex-1">
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <Button onClick={handleEmail} variant="outline" className="flex-1">
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
