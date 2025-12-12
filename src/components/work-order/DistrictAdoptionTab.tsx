import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LayoutDashboard, BarChart3, MapPin, Users, Calendar, CalendarDays, Network, FileText, Loader2, Plus, Info } from 'lucide-react';

import { OverviewSection } from '@/components/district-adoption/OverviewSection';
import { DataAnalysisSection } from '@/components/district-adoption/DataAnalysisSection';
import { DistrictSelectionSection } from '@/components/district-adoption/DistrictSelectionSection';
import { TeamAssignmentSection } from '@/components/district-adoption/TeamAssignmentSection';
import { RozgarEventsSection } from '@/components/district-adoption/RozgarEventsSection';
import { ActivityCalendarSection } from '@/components/district-adoption/ActivityCalendarSection';
import { CRPNetworkSection } from '@/components/district-adoption/CRPNetworkSection';
import { ReportsSection } from '@/components/district-adoption/ReportsSection';
import { CreateDistrictAdoptionPlanDialog } from '@/components/dialogs/CreateDistrictAdoptionPlanDialog';
import { 
  useGetAdoptedDistrictsQuery, 
  useAdoptDistrictMutation,
  useGetDistrictOverviewQuery,
  useGetDistrictAdoptionPlanQuery
} from '@/store/api/apiSlice';
import { DistrictAnalysisData, getJharkhandMockData } from '@/utils/districtTemplateGenerator';

interface DistrictAdoptionTabProps {
  workOrderId: string;
  role: string;
  isStarted: boolean;
}

// Mock data
const mockAdoptedDistricts = ['ranchi', 'hazaribagh', 'dhanbad'];

export const DistrictAdoptionTab: React.FC<DistrictAdoptionTabProps> = ({
  workOrderId,
  role,
  isStarted
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<DistrictAnalysisData | null>(null);
  const [isUsingDemoData, setIsUsingDemoData] = useState(true);
  
  // RTK Query hooks
  const { data: adoptedData, isLoading } = useGetAdoptedDistrictsQuery(workOrderId);
  const { data: overviewData } = useGetDistrictOverviewQuery({ workOrderId });
  const { data: planData } = useGetDistrictAdoptionPlanQuery(workOrderId);
  const [adoptDistrict] = useAdoptDistrictMutation();

  // Mock fallback pattern
  let adoptedDistricts: string[];
  if (!adoptedData) {
    adoptedDistricts = mockAdoptedDistricts;
  } else {
    adoptedDistricts = adoptedData;
  }

  // Use uploaded data or fallback to Jharkhand mock data
  const currentAnalysisData = analysisData || getJharkhandMockData();

  // Allow editing for national-head regardless of status for demo purposes
  const canEdit = role === 'national-head';

  const handleAdoptDistrict = async (districtId: string) => {
    if (!adoptedDistricts.includes(districtId)) {
      try {
        await adoptDistrict({ workOrderId, districtId }).unwrap();
      } catch (err) {
        // Fallback handled by mock data
      }
    }
  };

  const handlePlanCreated = (data: DistrictAnalysisData) => {
    setAnalysisData(data);
    setIsUsingDemoData(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Plan Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">District Adoption</h2>
          {isUsingDemoData && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <Info className="h-3 w-3 mr-1" />
              Demo Data (Jharkhand)
            </Badge>
          )}
        </div>
        {canEdit && (
          <Button onClick={() => setIsPlanDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create District Adoption Plan
          </Button>
        )}
      </div>

      {isUsingDemoData && (
        <Alert className="bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            Currently viewing Jharkhand demo data. Click "Create District Adoption Plan" to upload your own data or load tutorial data.
          </AlertDescription>
        </Alert>
      )}

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
          <OverviewSection 
            workOrderId={workOrderId} 
            adoptedDistricts={adoptedDistricts}
            analysisData={currentAnalysisData}
          />
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <DataAnalysisSection analysisData={currentAnalysisData} />
        </TabsContent>

        <TabsContent value="selection" className="mt-6">
          <DistrictSelectionSection 
            canEdit={canEdit} 
            adoptedDistricts={adoptedDistricts}
            onAdoptDistrict={handleAdoptDistrict}
            analysisData={currentAnalysisData}
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

      {/* Create Plan Dialog */}
      <CreateDistrictAdoptionPlanDialog
        open={isPlanDialogOpen}
        onOpenChange={setIsPlanDialogOpen}
        workOrderId={workOrderId}
        onPlanCreated={handlePlanCreated}
      />
    </div>
  );
};

export default DistrictAdoptionTab;