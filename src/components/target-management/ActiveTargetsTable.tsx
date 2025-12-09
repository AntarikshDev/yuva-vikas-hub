import React, { useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Target } from 'lucide-react';

export const ActiveTargetsTable: React.FC = () => {
  const { targets, loading } = useAppSelector((state) => state.targetManagement);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  const activeTargets = targets.filter((t) => t.status === 'active');

  const filteredTargets = activeTargets.filter((target) => {
    if (searchTerm && !target.assignedToName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterType !== 'all' && target.type !== filterType) {
      return false;
    }
    if (filterRole !== 'all' && target.assignedToRole !== filterRole) {
      return false;
    }
    if (filterPeriod !== 'all' && target.period !== filterPeriod) {
      return false;
    }
    return true;
  });

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      mobilisation: 'bg-blue-100 text-blue-800',
      counselling: 'bg-purple-100 text-purple-800',
      enrolment: 'bg-green-100 text-green-800',
      training: 'bg-orange-100 text-orange-800',
      placement: 'bg-teal-100 text-teal-800',
      retention: 'bg-pink-100 text-pink-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getRoleDisplay = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Active Targets
            </CardTitle>
            <CardDescription>
              All currently active target assignments
            </CardDescription>
          </div>
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
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="national_head">National Head</SelectItem>
              <SelectItem value="state_head">State Head</SelectItem>
              <SelectItem value="cluster_manager">Cluster Manager</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="mobiliser">Mobiliser</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assigned To</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Target</TableHead>
              <TableHead className="text-right">Achieved</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>State</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTargets.length > 0 ? (
              filteredTargets.map((target) => {
                const progress = Math.round((target.achieved / target.value) * 100);
                return (
                  <TableRow key={target.id}>
                    <TableCell className="font-medium">{target.assignedToName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {getRoleDisplay(target.assignedToRole)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(target.type)}>{target.type}</Badge>
                    </TableCell>
                    <TableCell className="capitalize">{target.period}</TableCell>
                    <TableCell className="text-right">{target.value}</TableCell>
                    <TableCell className="text-right text-emerald-600 font-medium">
                      {target.achieved}
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="h-2 flex-1" />
                        <span className={`text-xs font-medium ${
                          progress >= 80 ? 'text-emerald-600' :
                          progress >= 50 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{target.state || '-'}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No active targets found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Summary */}
        <div className="flex justify-between items-center pt-4 border-t text-sm text-muted-foreground">
          <span>Showing {filteredTargets.length} of {activeTargets.length} active targets</span>
          <div className="flex gap-4">
            <span>
              Total Target: {filteredTargets.reduce((sum, t) => sum + t.value, 0).toLocaleString()}
            </span>
            <span>
              Total Achieved: {filteredTargets.reduce((sum, t) => sum + t.achieved, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
