import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProgramStateFilterProps {
  selectedPrograms: string[];
  selectedStates: string[];
  onProgramToggle: (program: string) => void;
  onStateToggle: (state: string) => void;
}

const PROGRAMS = ['DDUGKY', 'UPSDM', 'WDC'];
const STATES = ['UP', 'MP', 'JH', 'MH', 'KA'];

export const ProgramStateFilter: React.FC<ProgramStateFilterProps> = ({
  selectedPrograms,
  selectedStates,
  onProgramToggle,
  onStateToggle,
}) => {
  return (
    <div className="space-y-3">
      {/* Programs Row */}
      <div className="flex flex-wrap items-center gap-2">
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

      {/* States Row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-2">States:</span>
        {STATES.map((state) => (
          <Badge
            key={state}
            variant={selectedStates.includes(state) ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-all',
              selectedStates.includes(state) 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent'
            )}
            onClick={() => onStateToggle(state)}
          >
            {state}
          </Badge>
        ))}
      </div>
    </div>
  );
};
