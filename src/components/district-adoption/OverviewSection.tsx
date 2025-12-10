import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Users, Calendar, TrendingUp, Building2, Target } from 'lucide-react';
import { trainingCenters, jharkhandDistricts, conversionRates } from '@/data/jharkhandCensusData';

interface OverviewSectionProps {
  workOrderId: string;
  adoptedDistricts: string[];
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ workOrderId, adoptedDistricts }) => {
  // Calculate summary stats
  const totalDistricts = jharkhandDistricts.length;
  const adoptedCount = adoptedDistricts.length;
  
  // Mock event data
  const activeEvents = 12;
  const totalMigrated = 1847;
  const totalCRPs = 234;

  // Funnel data (mock based on conversion rates)
  const funnelData = {
    footfall: 2500,
    ofrFilled: Math.round(2500 * conversionRates.ofrFilled),
    counselled: Math.round(2500 * conversionRates.ofrFilled * conversionRates.counselled),
    interested: Math.round(2500 * conversionRates.ofrFilled * conversionRates.counselled * conversionRates.interested),
    migrated: totalMigrated
  };

  const kpiCards = [
    { title: 'Districts Adopted', value: adoptedCount, total: totalDistricts, icon: MapPin, color: 'text-blue-500' },
    { title: 'Active Events', value: activeEvents, icon: Calendar, color: 'text-green-500' },
    { title: 'Candidates Migrated', value: totalMigrated, icon: Users, color: 'text-purple-500' },
    { title: 'CRPs Registered', value: totalCRPs, icon: TrendingUp, color: 'text-orange-500' }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-3xl font-bold mt-1">
                    {kpi.value}
                    {kpi.total && <span className="text-lg text-muted-foreground">/{kpi.total}</span>}
                  </p>
                </div>
                <kpi.icon className={`h-10 w-10 ${kpi.color} opacity-80`} />
              </div>
              {kpi.total && (
                <Progress value={(kpi.value / kpi.total) * 100} className="mt-3 h-2" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Training Centers & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training Centers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Training Centers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trainingCenters.map((tc) => (
              <div key={tc.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{tc.name}</h4>
                    <p className="text-sm text-muted-foreground">{tc.location}</p>
                  </div>
                  <Badge variant="outline">Capacity: {tc.capacity}</Badge>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-1">Trades Offered</p>
                  <div className="flex flex-wrap gap-1">
                    {tc.trades.map((trade) => (
                      <Badge key={trade} variant="secondary" className="text-xs">{trade}</Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-1">Assigned Districts ({tc.assignedDistricts.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {tc.assignedDistricts.slice(0, 4).map((distId) => {
                      const district = jharkhandDistricts.find(d => d.id === distId);
                      return (
                        <Badge key={distId} variant={adoptedDistricts.includes(distId) ? 'default' : 'outline'} className="text-xs">
                          {district?.name || distId}
                        </Badge>
                      );
                    })}
                    {tc.assignedDistricts.length > 4 && (
                      <Badge variant="outline" className="text-xs">+{tc.assignedDistricts.length - 4} more</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* State Overview Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Jharkhand State Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-[350px] rounded-lg border bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Interactive Jharkhand Map</p>
                <p className="text-sm text-muted-foreground mt-1">Showing {totalDistricts} districts</p>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs">Adopted ({adoptedCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-xs">Proposed (0)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                    <span className="text-xs">Available ({totalDistricts - adoptedCount})</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Mobilization Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {[
              { label: 'Footfall', value: funnelData.footfall, rate: '100%', color: 'bg-blue-500' },
              { label: 'OFR Filled', value: funnelData.ofrFilled, rate: '80%', color: 'bg-indigo-500' },
              { label: 'Counselled', value: funnelData.counselled, rate: '80%', color: 'bg-purple-500' },
              { label: 'Interested', value: funnelData.interested, rate: '50%', color: 'bg-pink-500' },
              { label: 'Migrated', value: funnelData.migrated, rate: '75%', color: 'bg-green-500' }
            ].map((stage, index, arr) => (
              <React.Fragment key={stage.label}>
                <div className="flex flex-col items-center">
                  <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full ${stage.color} flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <p className="text-xl md:text-2xl font-bold">{stage.value.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="mt-2 font-medium text-sm">{stage.label}</p>
                  <Badge variant="outline" className="mt-1 text-xs">{stage.rate}</Badge>
                </div>
                {index < arr.length - 1 && (
                  <div className="hidden md:block text-muted-foreground text-2xl">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
