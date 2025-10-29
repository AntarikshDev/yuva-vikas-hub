import React, { useState } from 'react';
import { District } from '@/store/slices/mobilisationSlice';
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
  districts: District[];
  isLoading: boolean;
  onDistrictSelect: (district: District) => void;
  selectedDistrictId?: string;
}

export const DistrictTable: React.FC<DistrictTableProps> = ({
  districts,
  isLoading,
  onDistrictSelect,
  selectedDistrictId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof District;
    direction: 'asc' | 'desc';
  }>({ key: 'rank', direction: 'asc' });

  const filteredDistricts = districts.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedDistricts = [...filteredDistricts].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof District) => {
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
          <CardTitle>District Performance</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search districts..."
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
                  District
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
              {sortedDistricts.map((district) => (
                <TableRow
                  key={district.id}
                  className={`cursor-pointer ${
                    selectedDistrictId === district.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => onDistrictSelect(district)}
                >
                  <TableCell className="font-medium">
                    #{district.rank}
                  </TableCell>
                  <TableCell className="font-medium">
                    {district.name}
                  </TableCell>
                  <TableCell>{district.managersCount}</TableCell>
                  <TableCell>{district.assignedTarget.toLocaleString()}</TableCell>
                  <TableCell>{district.achieved.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {district.percentAchieved}%
                        </span>
                      </div>
                      <Progress value={district.percentAchieved} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(district.percentAchieved)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Export district:', district.id);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Assign target:', district.id);
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
