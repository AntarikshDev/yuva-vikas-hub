import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  User, 
  UserPlus, 
  UserMinus, 
  RefreshCw,
  History,
  Phone,
  Mail,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { RoleNode, TeamMember } from '@/pages/national-head/TeamManagement';
import { format } from 'date-fns';

interface TeamHierarchyTreeProps {
  hierarchy: RoleNode;
  searchTerm: string;
  onAssign: (node: RoleNode) => void;
  onRemove: (node: RoleNode) => void;
  onReassign: (node: RoleNode) => void;
  onViewHistory: (node: RoleNode) => void;
}

interface HierarchyNodeProps {
  node: RoleNode;
  level: number;
  searchTerm: string;
  onAssign: (node: RoleNode) => void;
  onRemove: (node: RoleNode) => void;
  onReassign: (node: RoleNode) => void;
  onViewHistory: (node: RoleNode) => void;
}

const roleColorMap: Record<string, string> = {
  state_head: 'bg-purple-100 text-purple-800 border-purple-200',
  state_admin: 'bg-blue-100 text-blue-800 border-blue-200',
  mis: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  counsellor: 'bg-teal-100 text-teal-800 border-teal-200',
  centre_manager: 'bg-green-100 text-green-800 border-green-200',
  mobiliser_manager: 'bg-amber-100 text-amber-800 border-amber-200',
  mobiliser: 'bg-orange-100 text-orange-800 border-orange-200',
};

const HierarchyNode: React.FC<HierarchyNodeProps> = ({
  node,
  level,
  searchTerm,
  onAssign,
  onRemove,
  onReassign,
  onViewHistory,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isVacant = !node.currentAssignee;
  const hasHistory = node.pastAssignees && node.pastAssignees.length > 0;

  // Check if this node or its children match search
  const matchesSearch = (n: RoleNode): boolean => {
    const searchLower = searchTerm.toLowerCase();
    if (n.roleDisplayName.toLowerCase().includes(searchLower)) return true;
    if (n.currentAssignee?.name.toLowerCase().includes(searchLower)) return true;
    if (n.pastAssignees?.some(p => p.name.toLowerCase().includes(searchLower))) return true;
    if (n.children?.some(c => matchesSearch(c))) return true;
    return false;
  };

  if (searchTerm && !matchesSearch(node)) {
    return null;
  }

  const roleColor = roleColorMap[node.role] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <div className={cn("relative", level > 0 && "ml-8")}>
      {/* Connector line */}
      {level > 0 && (
        <div className="absolute left-[-24px] top-0 bottom-0 w-px bg-border" />
      )}
      {level > 0 && (
        <div className="absolute left-[-24px] top-6 w-6 h-px bg-border" />
      )}

      <Card className={cn(
        "mb-3 transition-all duration-200 hover:shadow-md",
        isVacant && "border-amber-300 bg-amber-50/50"
      )}>
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            {/* Left side - Role and assignee info */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Expand/Collapse button */}
              {hasChildren && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-1 p-1 hover:bg-muted rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              )}
              {!hasChildren && <div className="w-6" />}

              {/* Avatar/Status indicator */}
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                isVacant ? "bg-amber-100" : "bg-primary/10"
              )}>
                {isVacant ? (
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
              </div>

              {/* Role and Person details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={cn("font-medium", roleColor)}>
                    {node.roleDisplayName}
                  </Badge>
                  {hasHistory && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="secondary" className="gap-1">
                          <History className="h-3 w-3" />
                          {node.pastAssignees.length}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {node.pastAssignees.length} previous assignment(s)
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {isVacant && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Vacant
                    </Badge>
                  )}
                </div>

                {node.currentAssignee ? (
                  <div className="mt-2">
                    <p className="font-semibold text-foreground">
                      {node.currentAssignee.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {node.currentAssignee.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {node.currentAssignee.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Since {format(new Date(node.currentAssignee.assignmentStartDate), 'dd MMM yyyy')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-muted-foreground italic">
                    No one currently assigned to this role
                  </p>
                )}
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {isVacant ? (
                <Button 
                  size="sm" 
                  onClick={() => onAssign(node)}
                  className="gap-1"
                >
                  <UserPlus className="h-4 w-4" />
                  Assign
                </Button>
              ) : (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onReassign(node)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reassign Role</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onRemove(node)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove from Role</TooltipContent>
                  </Tooltip>
                </>
              )}
              {hasHistory && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onViewHistory(node)}
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View History</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {node.children.map((child) => (
            <HierarchyNode
              key={child.id}
              node={child}
              level={level + 1}
              searchTerm={searchTerm}
              onAssign={onAssign}
              onRemove={onRemove}
              onReassign={onReassign}
              onViewHistory={onViewHistory}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TeamHierarchyTree: React.FC<TeamHierarchyTreeProps> = ({
  hierarchy,
  searchTerm,
  onAssign,
  onRemove,
  onReassign,
  onViewHistory,
}) => {
  return (
    <div className="py-2">
      <HierarchyNode
        node={hierarchy}
        level={0}
        searchTerm={searchTerm}
        onAssign={onAssign}
        onRemove={onRemove}
        onReassign={onReassign}
        onViewHistory={onViewHistory}
      />
    </div>
  );
};
