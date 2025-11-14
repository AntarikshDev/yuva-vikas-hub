import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Download, Search, Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchOFRData } from '@/store/slices/directorSlice';
import { OFRStatisticsBar } from '@/components/director/OFRStatisticsBar';
import { OFRCard } from '@/components/director/OFRCard';
import { OFRDetailsDialog } from '@/components/director/OFRDetailsDialog';
import { OFREntry } from '@/store/slices/directorSlice';

const OFRMonitoring = () => {
  const dispatch = useAppDispatch();
  const { ofrData, isLoading } = useAppSelector((state) => state.director);
  
  const [filters, setFilters] = useState({
    dateRange: [null, null] as [Date | null, Date | null],
    state: 'all',
    status: 'all',
    searchQuery: '',
  });
  
  const [selectedEntry, setSelectedEntry] = useState<OFREntry | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOFRData({
      dateRange: filters.dateRange,
      state: filters.state !== 'all' ? filters.state : undefined,
      status: filters.status !== 'all' ? filters.status : undefined,
    }));
  }, [dispatch, filters.dateRange, filters.state, filters.status]);

  const handleViewDetails = (entry: OFREntry) => {
    setSelectedEntry(entry);
    setDetailsDialogOpen(true);
  };

  const filteredEntries = ofrData?.entries.filter(entry => {
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        entry.candidateName.toLowerCase().includes(query) ||
        entry.mobile.includes(query) ||
        entry.id.toLowerCase().includes(query)
      );
    }
    return true;
  }) || [];

  return (
    <MainLayout role="director">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">OFR Monitoring</h1>
            <p className="text-muted-foreground">Monitor and track On Field Registration entries nationwide</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Statistics Bar */}
        {ofrData && <OFRStatisticsBar statistics={ofrData.statistics} />}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, mobile, or ID..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Date Range */}
              <DateRangePicker
                dateRange={
                  filters.dateRange[0] && filters.dateRange[1]
                    ? { from: filters.dateRange[0], to: filters.dateRange[1] }
                    : undefined
                }
                onDateRangeChange={(range) => 
                  setFilters({ ...filters, dateRange: range ? [range.from || null, range.to || null] : [null, null] })
                }
              />

              {/* State Filter */}
              <Select
                value={filters.state}
                onValueChange={(value) => setFilters({ ...filters, state: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="Gujarat">Gujarat</SelectItem>
                  <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Ready for Migration">Ready for Migration</SelectItem>
                  <SelectItem value="Migrated">Migrated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredEntries.length} of {ofrData?.entries.length || 0} entries
          </p>
        </div>

        {/* OFR Entries Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="h-32 bg-muted rounded" />
              </Card>
            ))}
          </div>
        ) : filteredEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntries.map((entry) => (
              <OFRCard
                key={entry.id}
                entry={entry}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No entries found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more results
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Details Dialog */}
      <OFRDetailsDialog
        entry={selectedEntry}
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
      />
    </MainLayout>
  );
};

export default OFRMonitoring;
