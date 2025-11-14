import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OFREntry } from '@/store/slices/directorSlice';
import { 
  User, Phone, Mail, MapPin, Calendar, Briefcase, 
  GraduationCap, Heart, Users, FileText, CheckCircle, XCircle 
} from 'lucide-react';

interface OFRDetailsDialogProps {
  entry: OFREntry | null;
  open: boolean;
  onClose: () => void;
}

export const OFRDetailsDialog: React.FC<OFRDetailsDialogProps> = ({ entry, open, onClose }) => {
  if (!entry) return null;

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground font-medium">{value}</p>
      </div>
    </div>
  );

  const getStatusColor = (status: OFREntry['status']) => {
    switch (status) {
      case 'Pending Verification':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Verified':
        return 'bg-success/10 text-success border-success/20';
      case 'Rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Ready for Migration':
        return 'bg-info/10 text-info border-info/20';
      case 'Migrated':
        return 'bg-purple-600/10 text-purple-600 border-purple-600/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">OFR Details</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{entry.id}</p>
            </div>
            <Badge className={getStatusColor(entry.status)}>
              {entry.status}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Candidate Photo and Basic Info */}
            <Card className="p-4">
              <div className="flex gap-4">
                <img
                  src={entry.documents.photo}
                  alt={entry.candidateName}
                  className="w-32 h-32 rounded-lg object-cover border-2 border-border"
                />
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <InfoRow icon={User} label="Full Name" value={entry.candidateName} />
                  <InfoRow icon={User} label="Father's Name" value={entry.fatherName} />
                  <InfoRow icon={Phone} label="Mobile" value={entry.mobile} />
                  <InfoRow icon={Mail} label="Email" value={entry.email} />
                  <InfoRow icon={Calendar} label="Date of Birth" value={entry.dateOfBirth} />
                  <InfoRow icon={User} label="Gender" value={entry.gender} />
                </div>
              </div>
            </Card>

            {/* Location Details */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow icon={MapPin} label="State" value={entry.state} />
                <InfoRow icon={MapPin} label="District" value={entry.district} />
                <InfoRow icon={MapPin} label="Block" value={entry.block} />
                <InfoRow icon={MapPin} label="Village" value={entry.village} />
                <div className="col-span-2">
                  <InfoRow icon={MapPin} label="Address" value={entry.address} />
                </div>
                <InfoRow icon={MapPin} label="Pincode" value={entry.pincode} />
              </div>
            </Card>

            {/* Personal Details */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Personal & Socio-Economic Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow icon={Users} label="Community" value={entry.community} />
                <InfoRow icon={Users} label="Religion" value={entry.religion} />
                <InfoRow icon={Heart} label="Blood Group" value={entry.bloodGroup} />
                <InfoRow icon={Users} label="Mother Tongue" value={entry.motherTongue} />
                <InfoRow icon={Users} label="Marital Status" value={entry.maritalStatus} />
                <InfoRow icon={GraduationCap} label="Education" value={entry.education} />
              </div>
            </Card>

            {/* Registration Details */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Registration Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow icon={User} label="Mobiliser" value={entry.mobiliserName} />
                <InfoRow icon={Briefcase} label="Mobiliser Role" value={entry.mobiliserRole} />
                <InfoRow icon={FileText} label="Mobiliser ID" value={entry.mobiliserId} />
                <InfoRow icon={Calendar} label="Registration Date" value={entry.registrationDate} />
                <InfoRow icon={Calendar} label="Registration Time" value={entry.registrationTime} />
              </div>
            </Card>

            {/* Verification Status */}
            {entry.status === 'Verified' && entry.verifiedBy && (
              <Card className="p-4 bg-success/5 border-success/20">
                <h3 className="font-semibold text-success mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Verification Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow icon={User} label="Verified By" value={entry.verifiedBy} />
                  <InfoRow icon={Calendar} label="Verified Date" value={entry.verifiedDate || ''} />
                  {entry.verificationNotes && (
                    <div className="col-span-2">
                      <InfoRow icon={FileText} label="Notes" value={entry.verificationNotes} />
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Rejection Status */}
            {entry.status === 'Rejected' && entry.rejectionReason && (
              <Card className="p-4 bg-destructive/5 border-destructive/20">
                <h3 className="font-semibold text-destructive mb-4 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Rejection Details
                </h3>
                <InfoRow icon={FileText} label="Reason" value={entry.rejectionReason} />
              </Card>
            )}

            {/* Documents */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Photo</p>
                  <img src={entry.documents.photo} alt="Photo" className="w-full rounded border" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Aadhar</p>
                  <img src={entry.documents.aadhar} alt="Aadhar" className="w-full rounded border" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Education Certificate</p>
                  <img src={entry.documents.educationCertificate} alt="Education" className="w-full rounded border" />
                </div>
                {entry.documents.pan && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">PAN</p>
                    <img src={entry.documents.pan} alt="PAN" className="w-full rounded border" />
                  </div>
                )}
                {entry.documents.casteCertificate && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Caste Certificate</p>
                    <img src={entry.documents.casteCertificate} alt="Caste" className="w-full rounded border" />
                  </div>
                )}
                {entry.documents.incomeCertificate && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Income Certificate</p>
                    <img src={entry.documents.incomeCertificate} alt="Income" className="w-full rounded border" />
                  </div>
                )}
              </div>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
