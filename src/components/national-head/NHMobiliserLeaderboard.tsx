import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Phone, User, Trophy, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MobiliserData {
  mobiliserId: string;
  name: string;
  cluster: string;
  state: string;
  ofrCount: number;
  convertRate: number;
  costPerCandidate: number;
  rank: number;
}

interface Props {
  mobilisers: MobiliserData[];
  isLoading: boolean;
  onViewProfile?: (mobiliserId: string) => void;
  onSendMessage?: (mobiliserId: string) => void;
  onCall?: (mobiliserId: string) => void;
}

export const NHMobiliserLeaderboard: React.FC<Props> = ({
  mobilisers,
  isLoading,
  onViewProfile,
  onSendMessage,
  onCall,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof MobiliserData>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

  const handleSort = (field: keyof MobiliserData) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedMobilisers = mobilisers
    .filter(
      (mobiliser) =>
        mobiliser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mobiliser.cluster.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mobiliser.state.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const modifier = sortOrder === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * modifier;
      }
      return String(aValue).localeCompare(String(bValue)) * modifier;
    });

  const columns: Column<MobiliserData>[] = [
    {
      id: 'rank',
      header: 'Rank',
      cell: (item) => (
        <div className="flex items-center gap-2">
          {item.rank <= 3 && <Trophy className="h-4 w-4 text-yellow-500" />}
          <span className="font-medium">{item.rank}</span>
        </div>
      ),
    },
    {
      id: 'name',
      header: 'Mobiliser Name',
      cell: (item) => <div className="font-medium">{item.name}</div>,
    },
    {
      id: 'cluster',
      header: 'Cluster',
      cell: (item) => (
        <div>
          <div className="text-sm">{item.cluster}</div>
          <div className="text-xs text-muted-foreground">{item.state}</div>
        </div>
      ),
    },
    {
      id: 'ofrCount',
      header: 'OFR Count',
      cell: (item) => (
        <div className="text-center">
          <Badge variant="outline">{item.ofrCount}</Badge>
        </div>
      ),
    },
    {
      id: 'convertRate',
      header: 'Conversion Rate',
      cell: (item) => (
        <div className="text-center">
          <Badge 
            variant={
              item.convertRate >= 0.4 ? 'default' : 
              item.convertRate >= 0.3 ? 'secondary' : 
              'destructive'
            }
          >
            {(item.convertRate * 100).toFixed(1)}%
          </Badge>
        </div>
      ),
    },
    {
      id: 'costPerCandidate',
      header: 'Cost/Candidate',
      cell: (item) => (
        <div className="text-right font-medium">
          ₹{item.costPerCandidate.toLocaleString()}
        </div>
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
            onClick={() => onSendMessage?.(item.mobiliserId)}
            title="Send Message"
          >
            <MessageSquare className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCall?.(item.mobiliserId)}
            title="Call"
          >
            <Phone className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => onViewProfile?.(item.mobiliserId)}
          >
            <User className="h-3 w-3 mr-1" />
            Profile
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <CardTitle>Mobiliser Leaderboard</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as keyof MobiliserData)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rank">Rank</SelectItem>
                <SelectItem value="ofrCount">OFR Count</SelectItem>
                <SelectItem value="convertRate">Conversion Rate</SelectItem>
                <SelectItem value="costPerCandidate">Cost/Candidate</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search mobilisers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={filteredAndSortedMobilisers}
        />
      </CardContent>
    </Card>
  );
};
