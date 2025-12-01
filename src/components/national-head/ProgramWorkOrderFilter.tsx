import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProgramWorkOrderFilterProps {
  selectedPrograms: string[];
  selectedWorkOrders: string[];
  onProgramToggle: (program: string) => void;
  onWorkOrderToggle: (workOrder: string) => void;
}

const PROGRAMS = ['DDUGKY', 'UPSDM', 'WDC'];
const WORK_ORDERS = ['W/O:UP', 'W/O:MP', 'W/O:JH'];

export const ProgramWorkOrderFilter: React.FC<ProgramWorkOrderFilterProps> = ({
  selectedPrograms,
  selectedWorkOrders,
  onProgramToggle,
  onWorkOrderToggle,
}) => {
  return (
    <div className="space-y-3">
      {/* Programs Row */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-2">Programs:</span>
        {PROGRAMS.map((program) => (
          <Badge
            key={program}
            variant={selectedPrograms.includes(program) ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-all',
              selectedPrograms.includes(program) 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent'
            )}
            onClick={() => onProgramToggle(program)}
          >
            {program}
          </Badge>
        ))}
      </div>

      {/* Work Orders Row */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-2">Work Orders:</span>
        {WORK_ORDERS.map((workOrder) => (
          <Badge
            key={workOrder}
            variant={selectedWorkOrders.includes(workOrder) ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-all',
              selectedWorkOrders.includes(workOrder) 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent'
            )}
            onClick={() => onWorkOrderToggle(workOrder)}
          >
            {workOrder}
          </Badge>
        ))}
      </div>
    </div>
  );
};
