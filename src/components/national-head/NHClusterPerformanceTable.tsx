import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Target, MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface ClusterData {
  clusterId: string;
  name: string;
  state: string;
  districts: string[];
  managers: number;
  target: number;
  achieved: number;
  percentAchieved: number;
  status: 'On Track' | 'At Risk' | 'Off Track';
}

interface Props {
  clusters: ClusterData[];
  isLoading: boolean;
  onDrillDown?: (clusterId: string) => void;
  onExport?: (clusterId: string) => void;
  onSendMessage?: (clusterId: string) => void;
}

export const NHClusterPerformanceTable: React.FC<Props> = ({
  clusters,
  isLoading,
  onDrillDown,
  onExport,
  onSendMessage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96" />
        </CardContent>
      </Card>
    );
  }

  const toggleRowExpansion = (clusterId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(clusterId)) {
      newExpanded.delete(clusterId);
    } else {
      newExpanded.add(clusterId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusVariant = (status: string) => {
    if (status === 'On Track') return 'default';
    if (status === 'At Risk') return 'secondary';
    return 'destructive';
  };

  const filteredClusters = clusters.filter(
    (cluster) =>
      cluster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cluster.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<ClusterData>[] = [
    {
      id: 'expand',
      header: '',
      cell: (item) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleRowExpansion(item.clusterId)}
        >
          {expandedRows.has(item.clusterId) ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      ),
    },
    {
      id: 'rank',
      header: 'Rank',
      cell: (item) => {
        const index = filteredClusters.findIndex(c => c.clusterId === item.clusterId);
        return <div className="font-medium text-sm">{index + 1}</div>;
      },
    },
    {
      id: 'name',
      header: 'Cluster / State',
      cell: (item) => (
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-muted-foreground">{item.state}</div>
        </div>
      ),
    },
    {
      id: 'districts',
      header: 'Districts',
      cell: (item) => (
        <div className="text-sm max-w-xs truncate" title={item.districts.join(', ')}>
          {item.districts.slice(0, 2).join(', ')}
          {item.districts.length > 2 && ` +${item.districts.length - 2} more`}
        </div>
      ),
    },
    {
      id: 'managers',
      header: 'Managers',
      cell: (item) => (
        <div className="text-center font-medium">{item.managers}</div>
      ),
    },
    {
      id: 'target',
      header: 'Target',
      cell: (item) => (
        <div className="text-right font-medium">{item.target.toLocaleString()}</div>
      ),
    },
    {
      id: 'achieved',
      header: 'Achieved',
      cell: (item) => (
        <div className="text-right font-medium text-primary">{item.achieved.toLocaleString()}</div>
      ),
    },
    {
      id: 'percentAchieved',
      header: '% Achieved',
      cell: (item) => (
        <div className="space-y-1">
          <div className="text-right text-sm font-medium">
            {item.percentAchieved.toFixed(1)}%
          </div>
          <Progress value={item.percentAchieved} className="h-1" />
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item) => (
        <Badge variant={getStatusVariant(item.status)}>
          {item.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (item) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onExport?.(item.clusterId)}
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSendMessage?.(item.clusterId)}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Message
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => onDrillDown?.(item.clusterId)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Cluster Performance</CardTitle>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search clusters or states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Assign Targets
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredClusters.map((cluster) => (
            <div key={cluster.clusterId}>
              <DataTable
                columns={columns}
                data={[cluster]}
                className="mb-0"
              />
              {expandedRows.has(cluster.clusterId) && (
                <div className="bg-muted/30 p-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Districts</h4>
                      <div className="flex flex-wrap gap-1">
                        {cluster.districts.map((district, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {district}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Performance</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-medium">{cluster.target.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Achieved:</span>
                          <span className="font-medium text-primary">{cluster.achieved.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gap:</span>
                          <span className="font-medium">{(cluster.target - cluster.achieved).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" className="justify-start">
                          View Managers
                        </Button>
                        <Button size="sm" variant="outline" className="justify-start">
                          View Alerts
                        </Button>
                        <Button size="sm" variant="outline" className="justify-start">
                          Audit Log
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
