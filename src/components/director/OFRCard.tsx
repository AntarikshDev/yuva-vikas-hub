import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, FileText, MapPin, Calendar, Phone, User } from 'lucide-react';
import { OFREntry } from '@/store/slices/directorSlice';

interface OFRCardProps {
  entry: OFREntry;
  onViewDetails: (entry: OFREntry) => void;
}

export const OFRCard: React.FC<OFRCardProps> = ({ entry, onViewDetails }) => {
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
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Candidate Photo */}
        <div className="flex-shrink-0">
          <img
            src={entry.documents.photo}
            alt={entry.candidateName}
            className="w-20 h-20 rounded-lg object-cover border-2 border-border"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{entry.candidateName}</h3>
              <p className="text-sm text-muted-foreground truncate">{entry.id}</p>
            </div>
            <Badge className={`${getStatusColor(entry.status)} ml-2 flex-shrink-0`}>
              {entry.status}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{entry.fatherName}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{entry.mobile}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground col-span-2">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {entry.village}, {entry.block}, {entry.district}, {entry.state}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{entry.registrationDate}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{entry.mobiliserName}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(entry)}
              className="flex-1"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <FileText className="h-3 w-3 mr-1" />
              Documents
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
