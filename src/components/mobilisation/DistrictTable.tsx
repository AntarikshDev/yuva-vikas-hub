import React, { useState } from 'react';
import { Cluster } from '@/store/slices/mobilisationSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Search, Download, Target, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface DistrictTableProps {
  clusters: Cluster[];
  isLoading: boolean;
  onClusterSelect: (cluster: Cluster) => void;
  selectedClusterId?: string;
}

export const DistrictTable: React.FC<DistrictTableProps> = ({
  clusters,
  isLoading,
  onClusterSelect,
  selectedClusterId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Cluster;
    direction: 'asc' | 'desc';
  }>({ key: 'rank', direction: 'asc' });

  const filteredClusters = clusters.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedClusters = [...filteredClusters].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Cluster) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const getStatusBadge = (percent: number) => {
    if (percent >= 90) return <Badge className="bg-green-600">On Track</Badge>;
    if (percent >= 60) return <Badge className="bg-yellow-600">At Risk</Badge>;
    return <Badge variant="destructive">Off Track</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Cluster Performance</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clusters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('rank')}
                >
                  Rank
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Cluster
                </TableHead>
                <TableHead>Managers</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('assignedTarget')}
                >
                  Target
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('achieved')}
                >
                  Achieved
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('percentAchieved')}
                >
                  % Achieved
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedClusters.map((cluster) => (
                <TableRow
                  key={cluster.id}
                  className={`cursor-pointer ${
                    selectedClusterId === cluster.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => onClusterSelect(cluster)}
                >
                  <TableCell className="font-medium">
                    #{cluster.rank}
                  </TableCell>
                  <TableCell className="font-medium">
                    {cluster.name}
                  </TableCell>
                  <TableCell>{cluster.managersCount}</TableCell>
                  <TableCell>{cluster.assignedTarget.toLocaleString()}</TableCell>
                  <TableCell>{cluster.achieved.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {cluster.percentAchieved.toFixed(2)}%
                        </span>
                      </div>
                      <Progress value={cluster.percentAchieved} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(cluster.percentAchieved)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Export cluster data
                          console.log('Export cluster:', cluster.id);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Assign target to cluster
                          console.log('Assign target to cluster:', cluster.id);
                        }}
                      >
                        <Target className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
