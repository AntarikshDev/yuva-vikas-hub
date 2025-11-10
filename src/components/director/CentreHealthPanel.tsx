import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CentreHealthPanelProps {
  centreHealth: {
    capacityUtilisation: Array<{
      centreId: string;
      name: string;
      capacity: number;
      current: number;
    }>;
    leaveDropoutSummary: Array<{
      week: string;
      leaves: number;
      dropouts: number;
    }>;
  } | undefined;
  isLoading: boolean;
}

export const CentreHealthPanel: React.FC<CentreHealthPanelProps> = ({ centreHealth, isLoading }) => {
  if (isLoading || !centreHealth) {
    return <Skeleton className="h-96" />;
  }

  const utilisationData = centreHealth.capacityUtilisation.map((centre) => ({
    name: centre.name,
    utilisation: ((centre.current / centre.capacity) * 100).toFixed(1),
    current: centre.current,
    capacity: centre.capacity,
  }));

  const getUtilisationColor = (utilisation: number) => {
    if (utilisation >= 80) return 'hsl(var(--chart-2))';
    if (utilisation >= 50) return 'hsl(var(--primary))';
    return 'hsl(var(--destructive))';
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Centre Capacity Utilisation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utilisationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip 
                formatter={(value: any, name: any, props: any) => [
                  `${value}% (${props.payload.current}/${props.payload.capacity})`,
                  'Utilisation'
                ]}
              />
              <Bar dataKey="utilisation">
                {utilisationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getUtilisationColor(parseFloat(entry.utilisation))} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leave & Dropout Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week</TableHead>
                <TableHead className="text-right">Leaves</TableHead>
                <TableHead className="text-right">Dropouts</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {centreHealth.leaveDropoutSummary.map((row) => (
                <TableRow key={row.week}>
                  <TableCell className="font-medium">{row.week}</TableCell>
                  <TableCell className="text-right">{row.leaves}</TableCell>
                  <TableCell className="text-right text-destructive">{row.dropouts}</TableCell>
                  <TableCell className="text-right font-bold">{row.leaves + row.dropouts}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
