import { useState } from "react";
import { ChevronDown, ChevronRight, User, MoreVertical, Eye, UserMinus, UserPlus, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobilisationTeamMember, TeamHierarchyNode } from "./WorkOrderAssignmentTab";
import { cn } from "@/lib/utils";

interface MobilisationOrgChartProps {
  hierarchy: TeamHierarchyNode;
  onViewProfile: (member: MobilisationTeamMember) => void;
  onRemove?: (memberId: string) => void;
  onReplace?: (member: MobilisationTeamMember) => void;
  canEdit: boolean;
}

const roleColors: Record<string, string> = {
  state_head: "bg-purple-100 text-purple-800 border-purple-300",
  project_head: "bg-purple-100 text-purple-800 border-purple-300",
  operation_manager: "bg-blue-100 text-blue-800 border-blue-300",
  centre_manager: "bg-green-100 text-green-800 border-green-300",
  mobilisation_manager: "bg-amber-100 text-amber-800 border-amber-300",
  mobiliser: "bg-orange-100 text-orange-800 border-orange-300",
};

const statusColors: Record<string, string> = {
  active: "bg-green-500",
  pending_approval: "bg-amber-500",
  removed: "bg-red-500",
  vacant: "bg-gray-400",
};

interface OrgNodeProps {
  node: TeamHierarchyNode;
  level: number;
  onViewProfile: (member: MobilisationTeamMember) => void;
  onRemove?: (memberId: string) => void;
  onReplace?: (member: MobilisationTeamMember) => void;
  canEdit: boolean;
  isLast?: boolean;
  parentHasMore?: boolean;
}

const OrgNode = ({ node, level, onViewProfile, onRemove, onReplace, canEdit, isLast, parentHasMore }: OrgNodeProps) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const member = node.member;

  return (
    <div className="relative">
      {/* Vertical line from parent */}
      {level > 0 && (
        <div 
          className="absolute left-0 top-0 w-px bg-border"
          style={{ 
            height: isLast ? '24px' : '100%',
            left: '-24px'
          }}
        />
      )}
      
      {/* Horizontal connector line */}
      {level > 0 && (
        <div 
          className="absolute top-6 h-px bg-border"
          style={{ 
            width: '24px',
            left: '-24px'
          }}
        />
      )}

      <div className="flex flex-col">
        {/* Node Card */}
        <div 
          className={cn(
            "relative flex items-center gap-3 p-3 rounded-lg border-2 bg-card shadow-sm min-w-[280px] transition-all hover:shadow-md",
            member ? roleColors[member.role] : "bg-muted border-dashed"
          )}
        >
          {/* Status Indicator */}
          {member && (
            <div 
              className={cn(
                "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
                statusColors[member.status]
              )}
            />
          )}

          {/* Expand/Collapse Button */}
          {hasChildren && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 shrink-0"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          {!hasChildren && <div className="w-6" />}

          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shrink-0">
            {member ? (
              <span className="text-sm font-semibold">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            ) : (
              <User className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate">
                {member ? member.name : 'Vacant Position'}
              </span>
              {member && (
                <Badge variant="outline" className="text-xs shrink-0">
                  {member.employeeId}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{node.roleDisplayName}</p>
            {member && (
              <p className="text-xs font-medium mt-0.5">₹{member.salary.toLocaleString()}/mo</p>
            )}
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {member && (
                <DropdownMenuItem onClick={() => onViewProfile(member)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
              )}
              {canEdit && member && onReplace && (
                <DropdownMenuItem onClick={() => onReplace(member)}>
                  <UserCog className="h-4 w-4 mr-2" />
                  Replace
                </DropdownMenuItem>
              )}
              {canEdit && member && onRemove && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onRemove(member.id)}
                    className="text-destructive"
                  >
                    <UserMinus className="h-4 w-4 mr-2" />
                    Remove
                  </DropdownMenuItem>
                </>
              )}
              {canEdit && !member && (
                <DropdownMenuItem>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Employee
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Children */}
        {hasChildren && expanded && (
          <div className="relative ml-12 mt-4 space-y-4 pl-6 border-l border-border">
            {node.children.map((child, index) => (
              <OrgNode
                key={child.id}
                node={child}
                level={level + 1}
                onViewProfile={onViewProfile}
                onRemove={onRemove}
                onReplace={onReplace}
                canEdit={canEdit}
                isLast={index === node.children.length - 1}
                parentHasMore={index < node.children.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MobilisationOrgChart = ({ hierarchy, onViewProfile, onRemove, onReplace, canEdit }: MobilisationOrgChartProps) => {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-max p-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">Role Legend:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-purple-400" />
            <span className="text-xs">State/Project Head</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-400" />
            <span className="text-xs">Operation Manager</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-400" />
            <span className="text-xs">Centre Manager</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-amber-400" />
            <span className="text-xs">Mobilisation Manager</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-400" />
            <span className="text-xs">Mobiliser</span>
          </div>
          <span className="text-sm font-medium ml-4">Status:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs">Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs">Pending</span>
          </div>
        </div>

        {/* Org Chart */}
        <OrgNode
          node={hierarchy}
          level={0}
          onViewProfile={onViewProfile}
          onRemove={onRemove}
          onReplace={onReplace}
          canEdit={canEdit}
        />
      </div>
    </div>
  );
};

export default MobilisationOrgChart;
