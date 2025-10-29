import React from 'react';
import { Manager } from '@/store/slices/mobilisationSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ManagersTableProps {
  managers: Manager[];
}

export const ManagersTable: React.FC<ManagersTableProps> = ({ managers }) => {
  if (managers.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No managers data available
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Manager Name</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Achieved</TableHead>
            <TableHead>% Achieved</TableHead>
            <TableHead>Mobilisers</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {managers.map((manager) => (
            <TableRow key={manager.id}>
              <TableCell className="font-medium">{manager.name}</TableCell>
              <TableCell>{manager.target.toLocaleString()}</TableCell>
              <TableCell>{manager.achieved.toLocaleString()}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <span className="text-sm font-medium">
                    {manager.percentAchieved}%
                  </span>
                  <Progress value={manager.percentAchieved} className="h-2" />
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{manager.mobilisersCount}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
