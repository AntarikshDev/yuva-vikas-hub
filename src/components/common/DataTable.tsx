
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from './StatusBadge';

export type Column<T> = {
  id: string;
  header: React.ReactNode;
  cell: (item: T) => React.ReactNode;
  className?: string;
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
  rowClassName?: (item: T) => string;
  onRowClick?: (item: T) => void;
};

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyState,
  className = '',
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  const renderEmptyState = () => {
    if (emptyState) return emptyState;
    
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-4xl">📋</div>
        <h3 className="mt-2 text-lg font-medium">No data available</h3>
        <p className="text-sm text-neutral-500">No records found to display.</p>
      </div>
    );
  };

  const renderLoading = () => {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-primary-500"></div>
        <p className="mt-2 text-sm text-neutral-600">Loading data...</p>
      </div>
    );
  };

  return (
    <div className={`rounded-md border ${className}`}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  {renderLoading()}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  {renderEmptyState()}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={`${rowClassName ? rowClassName(item) : ''} ${onRowClick ? 'cursor-pointer hover:bg-neutral-50' : ''}`}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.id}`} className={column.className}>
                      {column.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
