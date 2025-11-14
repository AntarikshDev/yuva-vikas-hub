import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Calendar,
  MapPin,
  User,
  Users,
  Download,
  X,
  Image as ImageIcon,
  Filter,
} from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface ActivityDetail {
  id: string;
  type: 'Rozgaar Mela' | 'Rozgaar Sabha' | 'Auto Mic-ing' | 'Influencer Registration';
  date: string;
  state: string;
  district: string;
  block: string;
  village: string;
  organizer: string;
  organizerRole: 'Mobiliser' | 'Mobiliser Manager';
  participantCount: number;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  description: string;
  images: string[];
  location: {
    coordinates?: { lat: number; lng: number };
    address: string;
  };
  influencersOnboarded?: number;
  candidatesMobilised?: number;
}

interface ActivityDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activities: ActivityDetail[];
}

export const ActivityDetailsDialog: React.FC<ActivityDetailsDialogProps> = ({
  open,
  onOpenChange,
  activities,
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedBlock, setSelectedBlock] = useState<string>('all');
  const [selectedVillage, setSelectedVillage] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Extract unique values for filters
  const states = useMemo(() => ['all', ...Array.from(new Set(activities.map(a => a.state)))], [activities]);
  const districts = useMemo(() => {
    if (selectedState === 'all') return ['all'];
    return ['all', ...Array.from(new Set(activities.filter(a => a.state === selectedState).map(a => a.district)))];
  }, [activities, selectedState]);
  const blocks = useMemo(() => {
    if (selectedDistrict === 'all') return ['all'];
    return ['all', ...Array.from(new Set(activities.filter(a => a.district === selectedDistrict).map(a => a.block)))];
  }, [activities, selectedDistrict]);
  const villages = useMemo(() => {
    if (selectedBlock === 'all') return ['all'];
    return ['all', ...Array.from(new Set(activities.filter(a => a.block === selectedBlock).map(a => a.village)))];
  }, [activities, selectedBlock]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      if (dateRange?.from && dateRange?.to) {
        const activityDate = new Date(activity.date);
        if (activityDate < dateRange.from || activityDate > dateRange.to) return false;
      }
      if (selectedState !== 'all' && activity.state !== selectedState) return false;
      if (selectedDistrict !== 'all' && activity.district !== selectedDistrict) return false;
      if (selectedBlock !== 'all' && activity.block !== selectedBlock) return false;
      if (selectedVillage !== 'all' && activity.village !== selectedVillage) return false;
      if (selectedType !== 'all' && activity.type !== selectedType) return false;
      if (selectedStatus !== 'all' && activity.status !== selectedStatus) return false;
      return true;
    });
  }, [activities, dateRange, selectedState, selectedDistrict, selectedBlock, selectedVillage, selectedType, selectedStatus]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalParticipants = filteredActivities.reduce((sum, a) => sum + a.participantCount, 0);
    const totalCandidates = filteredActivities.reduce((sum, a) => sum + (a.candidatesMobilised || 0), 0);
    const totalInfluencers = filteredActivities.reduce((sum, a) => sum + (a.influencersOnboarded || 0), 0);
    const uniqueDistricts = new Set(filteredActivities.map(a => a.district)).size;
    const uniqueBlocks = new Set(filteredActivities.map(a => a.block)).size;
    const uniqueVillages = new Set(filteredActivities.map(a => a.village)).size;

    return {
      total: filteredActivities.length,
      participants: totalParticipants,
      candidates: totalCandidates,
      influencers: totalInfluencers,
      districts: uniqueDistricts,
      blocks: uniqueBlocks,
      villages: uniqueVillages,
    };
  }, [filteredActivities]);

  const clearFilters = () => {
    setDateRange(undefined);
    setSelectedState('all');
    setSelectedDistrict('all');
    setSelectedBlock('all');
    setSelectedVillage('all');
    setSelectedType('all');
    setSelectedStatus('all');
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'Rozgaar Mela': return 'bg-primary';
      case 'Rozgaar Sabha': return 'bg-orange-500';
      case 'Auto Mic-ing': return 'bg-blue-500';
      case 'Influencer Registration': return 'bg-green-500';
      default: return 'bg-secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'In Progress': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Scheduled': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default: return 'bg-secondary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Activity Details</DialogTitle>
            <Button variant="outline" size="sm" onClick={() => console.log('Export')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </DialogHeader>

        {/* Statistics Bar */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <div className="text-xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Activities</div>
            </div>
            <div className="text-center p-3 bg-blue-500/5 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{stats.participants}</div>
              <div className="text-xs text-muted-foreground">Participants</div>
            </div>
            <div className="text-center p-3 bg-green-500/5 rounded-lg">
              <div className="text-xl font-bold text-green-600">{stats.candidates}</div>
              <div className="text-xs text-muted-foreground">Mobilised</div>
            </div>
            <div className="text-center p-3 bg-orange-500/5 rounded-lg">
              <div className="text-xl font-bold text-orange-600">{stats.influencers}</div>
              <div className="text-xs text-muted-foreground">Influencers</div>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <div className="text-xl font-bold text-foreground">{stats.districts}</div>
              <div className="text-xs text-muted-foreground">Districts</div>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <div className="text-xl font-bold text-foreground">{stats.blocks}</div>
              <div className="text-xs text-muted-foreground">Blocks</div>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <div className="text-xl font-bold text-foreground">{stats.villages}</div>
              <div className="text-xs text-muted-foreground">Villages</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Filters Section */}
        <div className="px-6 py-4 bg-muted/30">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters</span>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto h-7 text-xs">
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                {states.map(state => (
                  <SelectItem key={state} value={state}>
                    {state === 'all' ? 'All States' : state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                {districts.map(district => (
                  <SelectItem key={district} value={district}>
                    {district === 'all' ? 'All Districts' : district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedBlock} onValueChange={setSelectedBlock}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Block" />
              </SelectTrigger>
              <SelectContent>
                {blocks.map(block => (
                  <SelectItem key={block} value={block}>
                    {block === 'all' ? 'All Blocks' : block}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedVillage} onValueChange={setSelectedVillage}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Village" />
              </SelectTrigger>
              <SelectContent>
                {villages.map(village => (
                  <SelectItem key={village} value={village}>
                    {village === 'all' ? 'All Villages' : village}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Rozgaar Mela">Rozgaar Mela</SelectItem>
                <SelectItem value="Rozgaar Sabha">Rozgaar Sabha</SelectItem>
                <SelectItem value="Auto Mic-ing">Auto Mic-ing</SelectItem>
                <SelectItem value="Influencer Registration">Influencer Registration</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Activities List */}
        <ScrollArea className="h-[400px] px-6">
          <div className="space-y-4 py-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No activities found matching the selected filters.</p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Activity Images */}
                      {activity.images.length > 0 ? (
                        <div className="flex gap-2 md:w-48 flex-shrink-0">
                          {activity.images.slice(0, 2).map((image, idx) => (
                            <img
                              key={idx}
                              src={image}
                              alt={`Activity ${activity.id}`}
                              className="w-full md:w-20 h-20 object-cover rounded-lg"
                            />
                          ))}
                          {activity.images.length > 2 && (
                            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                              +{activity.images.length - 2}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="md:w-48 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}

                      {/* Activity Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${getActivityColor(activity.type)} text-white border-0`}>
                              {activity.type}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(activity.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>

                        <p className="text-sm text-foreground font-medium">{activity.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{activity.village}, {activity.block}, {activity.district}, {activity.state}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{activity.organizer} ({activity.organizerRole})</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{activity.participantCount} participants</span>
                          </div>
                          {activity.candidatesMobilised !== undefined && (
                            <div className="flex items-center gap-2 text-green-600">
                              <span className="font-medium">{activity.candidatesMobilised} mobilised</span>
                            </div>
                          )}
                          {activity.influencersOnboarded !== undefined && (
                            <div className="flex items-center gap-2 text-orange-600">
                              <span className="font-medium">{activity.influencersOnboarded} influencers</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
