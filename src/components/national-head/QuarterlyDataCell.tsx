import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuarterData {
  months: {
    name: string;
    value: number;
  }[];
  total: number;
}

interface QuarterlyDataCellProps {
  quarter: string;
  data: QuarterData;
  showData?: boolean;
}

export const QuarterlyDataCell: React.FC<QuarterlyDataCellProps> = ({
  quarter,
  data,
  showData = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!showData) {
    return <td className="p-2 text-center text-muted-foreground">-</td>;
  }

  return (
    <td className="p-2 align-top">
      <div className="space-y-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md w-full justify-center",
            "bg-primary/10 hover:bg-primary/20 transition-colors"
          )}
        >
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <span>{data.total}</span>
        </button>
        {isExpanded && (
          <div className="text-xs space-y-0.5 pl-2 border-l-2 border-primary/20 ml-2">
            {data.months.map((month) => (
              <div key={month.name} className="flex justify-between text-muted-foreground">
                <span>{month.name}</span>
                <span className="font-medium text-foreground">{month.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </td>
  );
};
