import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

interface StateDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stateName: string;
  stateData: {
    target: number;
    achieved: number;
    percent: number;
  };
}

export function StateDetailDialog({ open, onOpenChange, stateName, stateData }: StateDetailDialogProps) {
  // Mock cluster data
  const clusterData = [
    {
      id: 1,
      name: `${stateName} North Cluster`,
      target: Math.floor(stateData.target * 0.3),
      achieved: Math.floor(stateData.achieved * 0.32),
      percent: 87,
      districts: 8,
      centers: 24,
    },
    {
      id: 2,
      name: `${stateName} South Cluster`,
      target: Math.floor(stateData.target * 0.28),
      achieved: Math.floor(stateData.achieved * 0.26),
      percent: 82,
      districts: 7,
      centers: 21,
    },
    {
      id: 3,
      name: `${stateName} East Cluster`,
      target: Math.floor(stateData.target * 0.22),
      achieved: Math.floor(stateData.achieved * 0.24),
      percent: 91,
      districts: 6,
      centers: 18,
    },
    {
      id: 4,
      name: `${stateName} West Cluster`,
      target: Math.floor(stateData.target * 0.2),
      achieved: Math.floor(stateData.achieved * 0.18),
      percent: 76,
      districts: 5,
      centers: 15,
    },
  ];

  // Mock district data
  const districtData = [
    {
      id: 1,
      name: `${stateName} Capital District`,
      cluster: `${stateName} North Cluster`,
      target: 450,
      achieved: 398,
      percent: 88,
      centers: 6,
      mobilizers: 12,
    },
    {
      id: 2,
      name: `${stateName} Central District`,
      cluster: `${stateName} South Cluster`,
      target: 380,
      achieved: 342,
      percent: 90,
      centers: 5,
      mobilizers: 10,
    },
    {
      id: 3,
      name: `${stateName} Northern District`,
      cluster: `${stateName} North Cluster`,
      target: 420,
      achieved: 361,
      percent: 86,
      centers: 5,
      mobilizers: 11,
    },
    {
      id: 4,
      name: `${stateName} Southern District`,
      cluster: `${stateName} South Cluster`,
      target: 340,
      achieved: 278,
      percent: 82,
      centers: 4,
      mobilizers: 9,
    },
    {
      id: 5,
      name: `${stateName} Eastern District`,
      cluster: `${stateName} East Cluster`,
      target: 390,
      achieved: 359,
      percent: 92,
      centers: 5,
      mobilizers: 10,
    },
  ];

  const getPerformanceBadge = (percent: number) => {
    if (percent >= 90) return <Badge className="bg-green-500">Excellent</Badge>;
    if (percent >= 80) return <Badge className="bg-green-400">Good</Badge>;
    if (percent >= 70) return <Badge className="bg-yellow-400 text-foreground">Fair</Badge>;
    if (percent >= 60) return <Badge className="bg-orange-400">At Risk</Badge>;
    return <Badge variant="destructive">Critical</Badge>;
  };

  const clusterColumns = [
    {
      id: 'cluster',
      header: 'Cluster Name',
      cell: (row: any) => <div className="font-medium">{row.name}</div>,
    },
    {
      id: 'target',
      header: 'Target',
      cell: (row: any) => <div className="text-center font-medium">{row.target.toLocaleString()}</div>,
    },
    {
      id: 'achieved',
      header: 'Achieved',
      cell: (row: any) => <div className="text-center font-medium">{row.achieved.toLocaleString()}</div>,
    },
    {
      id: 'percent',
      header: 'Achievement %',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-bold mb-1">{row.percent}%</div>
          {getPerformanceBadge(row.percent)}
        </div>
      ),
    },
    {
      id: 'districts',
      header: 'Districts',
      cell: (row: any) => <div className="text-center">{row.districts}</div>,
    },
    {
      id: 'centers',
      header: 'Centers',
      cell: (row: any) => <div className="text-center">{row.centers}</div>,
    },
  ];

  const districtColumns = [
    {
      id: 'district',
      header: 'District Name',
      cell: (row: any) => <div className="font-medium">{row.name}</div>,
    },
    {
      id: 'cluster',
      header: 'Cluster',
      cell: (row: any) => <div className="text-sm text-muted-foreground">{row.cluster}</div>,
    },
    {
      id: 'target',
      header: 'Target',
      cell: (row: any) => <div className="text-center font-medium">{row.target.toLocaleString()}</div>,
    },
    {
      id: 'achieved',
      header: 'Achieved',
      cell: (row: any) => <div className="text-center font-medium">{row.achieved.toLocaleString()}</div>,
    },
    {
      id: 'percent',
      header: 'Achievement %',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-bold mb-1">{row.percent}%</div>
          {getPerformanceBadge(row.percent)}
        </div>
      ),
    },
    {
      id: 'centers',
      header: 'Centers',
      cell: (row: any) => <div className="text-center">{row.centers}</div>,
    },
    {
      id: 'mobilizers',
      header: 'Mobilizers',
      cell: (row: any) => <div className="text-center">{row.mobilizers}</div>,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{stateName} - Detailed Metrics</DialogTitle>
        </DialogHeader>

        <Card className="p-4 mb-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">State Target</div>
              <div className="text-2xl font-bold">{stateData.target.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Achieved</div>
              <div className="text-2xl font-bold text-primary">{stateData.achieved.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Achievement Rate</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{stateData.percent}%</div>
                {getPerformanceBadge(stateData.percent)}
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="clusters" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="clusters">Cluster Performance</TabsTrigger>
            <TabsTrigger value="districts">District Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="clusters" className="mt-4">
            <DataTable columns={clusterColumns} data={clusterData} />
          </TabsContent>

          <TabsContent value="districts" className="mt-4">
            <DataTable columns={districtColumns} data={districtData} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
