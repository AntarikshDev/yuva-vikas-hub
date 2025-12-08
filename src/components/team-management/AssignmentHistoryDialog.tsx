import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  History, 
  User, 
  Calendar, 
  ArrowRight,
  Mail,
  Phone,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { RoleNode, TeamMember } from '@/pages/national-head/TeamManagement';

interface AssignmentHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleNode: RoleNode | null;
}

interface TimelineItemProps {
  member: TeamMember;
  isCurrent: boolean;
  isFirst: boolean;
  isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ member, isCurrent, isFirst, isLast }) => {
  const duration = member.assignmentEndDate 
    ? differenceInDays(new Date(member.assignmentEndDate), new Date(member.assignmentStartDate))
    : differenceInDays(new Date(), new Date(member.assignmentStartDate));

  const formatDuration = (days: number) => {
    if (days < 30) return `${days} days`;
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    if (months < 12) {
      return remainingDays > 0 ? `${months} month${months > 1 ? 's' : ''}, ${remainingDays} days` : `${months} month${months > 1 ? 's' : ''}`;
    }
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : `${years} year${years > 1 ? 's' : ''}`;
  };

  return (
    <div className="relative pl-8">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-border" />
      )}
      
      {/* Timeline dot */}
      <div className={cn(
        "absolute left-0 top-2 w-6 h-6 rounded-full flex items-center justify-center",
        isCurrent ? "bg-green-100" : "bg-muted"
      )}>
        {isCurrent ? (
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        ) : (
          <Clock className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "pb-6 border rounded-lg p-4 mb-4",
        isCurrent ? "border-green-200 bg-green-50/50" : "border-border bg-muted/30"
      )}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              isCurrent ? "bg-green-100" : "bg-muted"
            )}>
              <User className={cn(
                "h-5 w-5",
                isCurrent ? "text-green-600" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <p className="font-semibold text-foreground">{member.name}</p>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {member.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {member.phone}
                </span>
              </div>
            </div>
          </div>
          <Badge variant={isCurrent ? "default" : "secondary"}>
            {isCurrent ? 'Current' : 'Past'}
          </Badge>
        </div>

        <Separator className="my-3" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Start Date</p>
            <p className="font-medium flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(member.assignmentStartDate), 'dd MMM yyyy')}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">End Date</p>
            <p className="font-medium flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {member.assignmentEndDate 
                ? format(new Date(member.assignmentEndDate), 'dd MMM yyyy')
                : <span className="text-green-600">Ongoing</span>
              }
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <p className="text-sm">
            <span className="text-muted-foreground">Duration: </span>
            <span className="font-medium">{formatDuration(duration)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export const AssignmentHistoryDialog: React.FC<AssignmentHistoryDialogProps> = ({
  open,
  onOpenChange,
  roleNode,
}) => {
  if (!roleNode) return null;

  // Combine current and past assignees, sorted by date (most recent first)
  const allAssignments: TeamMember[] = [
    ...(roleNode.currentAssignee ? [roleNode.currentAssignee] : []),
    ...roleNode.pastAssignees,
  ].sort((a, b) => 
    new Date(b.assignmentStartDate).getTime() - new Date(a.assignmentStartDate).getTime()
  );

  const hasHistory = allAssignments.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Assignment History
          </DialogTitle>
          <DialogDescription>
            Complete assignment history for <span className="font-medium">{roleNode.roleDisplayName}</span> role
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          {hasHistory ? (
            <div className="py-4">
              {allAssignments.map((member, index) => (
                <TimelineItem
                  key={member.id}
                  member={member}
                  isCurrent={member.isCurrentlyAssigned}
                  isFirst={index === 0}
                  isLast={index === allAssignments.length - 1}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No assignment history available</p>
              <p className="text-sm text-muted-foreground mt-1">
                This role has never been assigned to anyone
              </p>
            </div>
          )}
        </ScrollArea>

        {hasHistory && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Total assignments: {allAssignments.length}</span>
              <span>
                {roleNode.currentAssignee 
                  ? 'Currently assigned' 
                  : 'Position vacant'
                }
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
