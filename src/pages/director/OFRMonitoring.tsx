import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Download, Search, Filter, Grid3x3, List, LayoutGrid } from 'lucide-react';
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
    district: 'all',
    block: 'all',
    status: 'all',
    searchQuery: '',
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [selectedEntry, setSelectedEntry] = useState<OFREntry | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOFRData({
      dateRange: filters.dateRange,
      state: filters.state !== 'all' ? filters.state : undefined,
      district: filters.district !== 'all' ? filters.district : undefined,
      block: filters.block !== 'all' ? filters.block : undefined,
      status: filters.status !== 'all' ? filters.status : undefined,
    }));
  }, [dispatch, filters.dateRange, filters.state, filters.district, filters.block, filters.status]);

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
      <div className="space-y-4 lg:space-y-6 p-4 lg:p-6 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">OFR Monitoring</h1>
            <p className="text-sm text-muted-foreground">Monitor and track On Field Registration entries nationwide</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button className="hidden sm:flex">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="icon" className="sm:hidden">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Statistics Bar */}
        {ofrData && <OFRStatisticsBar statistics={ofrData.statistics} />}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
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
              <div className="w-full lg:w-[180px]">
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
              </div>

              {/* State Filter */}
              <Select
                value={filters.state}
                onValueChange={(value) => setFilters({ ...filters, state: value, district: 'all', block: 'all' })}
              >
                <SelectTrigger className="w-full lg:w-[140px]">
                  <SelectValue placeholder="State" />
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

              {/* District Filter */}
              <Select
                value={filters.district}
                onValueChange={(value) => setFilters({ ...filters, district: value, block: 'all' })}
                disabled={filters.state === 'all'}
              >
                <SelectTrigger className="w-full lg:w-[140px]">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {filters.state === 'Maharashtra' && (
                    <>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Nagpur">Nagpur</SelectItem>
                    </>
                  )}
                  {filters.state === 'Gujarat' && (
                    <>
                      <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                      <SelectItem value="Surat">Surat</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                    </>
                  )}
                  {filters.state === 'Tamil Nadu' && (
                    <>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                      <SelectItem value="Coimbatore">Coimbatore</SelectItem>
                      <SelectItem value="Madurai">Madurai</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>

              {/* Block Filter */}
              <Select
                value={filters.block}
                onValueChange={(value) => setFilters({ ...filters, block: value })}
                disabled={filters.district === 'all'}
              >
                <SelectTrigger className="w-full lg:w-[120px]">
                  <SelectValue placeholder="Block" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blocks</SelectItem>
                  <SelectItem value="Block A">Block A</SelectItem>
                  <SelectItem value="Block B">Block B</SelectItem>
                  <SelectItem value="Block C">Block C</SelectItem>
                  <SelectItem value="Block D">Block D</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger className="w-full lg:w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending Verification">Pending</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Ready for Migration">Ready</SelectItem>
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

        {/* OFR Entries Grid/List */}
        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4' : 'space-y-3 lg:space-y-4'}>
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="h-32 bg-muted rounded" />
              </Card>
            ))}
          </div>
        ) : filteredEntries.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4' : 'space-y-3 lg:space-y-4'}>
            {filteredEntries.map((entry) => (
              <OFRCard
                key={entry.id}
                entry={entry}
                onViewDetails={handleViewDetails}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 lg:p-12">
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
