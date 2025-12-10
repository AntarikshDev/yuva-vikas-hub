import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, BarChart3, MapPin, Users, Calendar, CalendarDays, Network, FileText } from 'lucide-react';

import { OverviewSection } from '@/components/district-adoption/OverviewSection';
import { DataAnalysisSection } from '@/components/district-adoption/DataAnalysisSection';
import { DistrictSelectionSection } from '@/components/district-adoption/DistrictSelectionSection';
import { TeamAssignmentSection } from '@/components/district-adoption/TeamAssignmentSection';
import { RozgarEventsSection } from '@/components/district-adoption/RozgarEventsSection';
import { ActivityCalendarSection } from '@/components/district-adoption/ActivityCalendarSection';
import { CRPNetworkSection } from '@/components/district-adoption/CRPNetworkSection';
import { ReportsSection } from '@/components/district-adoption/ReportsSection';

interface DistrictAdoptionTabProps {
  workOrderId: string;
  role: string;
  isStarted: boolean;
}

export const DistrictAdoptionTab: React.FC<DistrictAdoptionTabProps> = ({
  workOrderId,
  role,
  isStarted
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [adoptedDistricts, setAdoptedDistricts] = useState<string[]>(['ranchi', 'hazaribagh', 'dhanbad']);
  
  const canEdit = role === 'national-head' && isStarted;

  const handleAdoptDistrict = (districtId: string) => {
    if (!adoptedDistricts.includes(districtId)) {
      setAdoptedDistricts([...adoptedDistricts, districtId]);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'analysis', label: 'Data Analysis', icon: BarChart3 },
    { id: 'selection', label: 'District Selection', icon: MapPin },
    { id: 'team', label: 'Team Assignment', icon: Users },
    { id: 'events', label: 'Rozgar Events', icon: Calendar },
    { id: 'calendar', label: 'Activity Calendar', icon: CalendarDays },
    { id: 'crp', label: 'CRP Network', icon: Network },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex flex-col gap-1 py-2 px-2 text-xs"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewSection workOrderId={workOrderId} adoptedDistricts={adoptedDistricts} />
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <DataAnalysisSection />
        </TabsContent>

        <TabsContent value="selection" className="mt-6">
          <DistrictSelectionSection 
            canEdit={canEdit} 
            adoptedDistricts={adoptedDistricts}
            onAdoptDistrict={handleAdoptDistrict}
          />
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <TeamAssignmentSection canEdit={canEdit} adoptedDistricts={adoptedDistricts} />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <RozgarEventsSection canEdit={canEdit} adoptedDistricts={adoptedDistricts} />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <ActivityCalendarSection canEdit={canEdit} />
        </TabsContent>

        <TabsContent value="crp" className="mt-6">
          <CRPNetworkSection canEdit={canEdit} adoptedDistricts={adoptedDistricts} />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ReportsSection adoptedDistricts={adoptedDistricts} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistrictAdoptionTab;
