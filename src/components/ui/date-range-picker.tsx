import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
  align?: "center" | "start" | "end";
}
export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
  placeholder = "Select date range",
  align = "start"
}: DateRangePickerProps) {
  return <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={onDateRangeChange} numberOfMonths={2} className="rounded-md border shadow-xl bg-white" />
        </PopoverContent>
      </Popover>
    </div>;
}