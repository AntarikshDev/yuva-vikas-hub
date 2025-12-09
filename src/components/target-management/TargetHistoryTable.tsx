import React, { useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { History, Download, Search, Filter } from 'lucide-react';

export const TargetHistoryTable: React.FC = () => {
  const { targets, reassignmentHistory } = useAppSelector((state) => state.targetManagement);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Combine targets and reassignment history for complete audit trail
  const allHistory = [
    ...targets.map((t) => ({
      id: t.id,
      type: 'target_created' as const,
      targetType: t.type,
      employeeName: t.assignedToName,
      value: t.value,
      status: t.status,
      date: t.createdAt,
      details: `Assigned to ${t.assignedToName} by ${t.assignedByName}`,
    })),
    ...reassignmentHistory.map((r) => ({
      id: r.id,
      type: 'reassignment' as const,
      targetType: 'reassignment',
      employeeName: `${r.fromEmployeeName} → ${r.toEmployeeName}`,
      value: r.amount,
      status: 'reassigned',
      date: r.reassignedAt,
      details: r.reason,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredHistory = allHistory.filter((item) => {
    // Search filter
    if (searchTerm && !item.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Date range filter
    if (dateRange?.from && dateRange?.to) {
      const itemDate = parseISO(item.date);
      if (!isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to })) {
        return false;
      }
    }
    // Type filter
    if (filterType !== 'all' && item.targetType !== filterType) {
      return false;
    }
    // Status filter
    if (filterStatus !== 'all' && item.status !== filterStatus) {
      return false;
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-800',
      completed: 'bg-blue-100 text-blue-800',
      carried_forward: 'bg-amber-100 text-amber-800',
      reassigned: 'bg-purple-100 text-purple-800',
      void: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    if (type === 'target_created') {
      return <Badge className="bg-blue-100 text-blue-800">Created</Badge>;
    }
    return <Badge className="bg-purple-100 text-purple-800">Reassigned</Badge>;
  };

  const handleExport = () => {
    const csv = [
      ['Date', 'Type', 'Target Type', 'Employee', 'Value', 'Status', 'Details'],
      ...filteredHistory.map((item) => [
        format(parseISO(item.date), 'yyyy-MM-dd HH:mm'),
        item.type,
        item.targetType,
        item.employeeName,
        item.value,
        item.status,
        item.details,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `target-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Target History & Audit Trail
            </CardTitle>
            <CardDescription>
              Complete history of all target assignments and reassignments
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            placeholder="Filter by date"
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Target Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="mobilisation">Mobilisation</SelectItem>
              <SelectItem value="counselling">Counselling</SelectItem>
              <SelectItem value="enrolment">Enrolment</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="placement">Placement</SelectItem>
              <SelectItem value="retention">Retention</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="carried_forward">Carried Forward</SelectItem>
              <SelectItem value="reassigned">Reassigned</SelectItem>
              <SelectItem value="void">Void</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target Type</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(parseISO(item.date), 'dd MMM yyyy HH:mm')}
                  </TableCell>
                  <TableCell>{getTypeIcon(item.type)}</TableCell>
                  <TableCell className="capitalize">{item.targetType}</TableCell>
                  <TableCell className="font-medium">{item.employeeName}</TableCell>
                  <TableCell className="text-right">{item.value}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {item.details}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No history records found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Summary */}
        <div className="flex justify-between items-center pt-4 border-t text-sm text-muted-foreground">
          <span>Showing {filteredHistory.length} of {allHistory.length} records</span>
          {dateRange?.from && dateRange?.to && (
            <span>
              Filtered: {format(dateRange.from, 'dd MMM yyyy')} - {format(dateRange.to, 'dd MMM yyyy')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
