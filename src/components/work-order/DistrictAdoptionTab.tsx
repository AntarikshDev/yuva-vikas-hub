import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  useGetDistrictAdoptionPlanQuery,
  useGetDistrictAnalysisDataByYearQuery
} from '@/store/api/apiSlice';
import { DistrictAnalysisData, getJharkhandMockData } from '@/utils/districtTemplateGenerator';

interface DistrictAdoptionTabProps {
  workOrderId: string;
  role: string;
  isStarted: boolean;
}

// Financial years for filtering
const financialYears = [
  { value: '2024-25', label: 'FY 2024-25' },
  { value: '2023-24', label: 'FY 2023-24' },
  { value: '2022-23', label: 'FY 2022-23' },
  { value: '2021-22', label: 'FY 2021-22' },
  { value: '2020-21', label: 'FY 2020-21' },
];

// Mock data
const mockAdoptedDistricts = ['ranchi', 'hazaribagh', 'dhanbad'];

export const DistrictAdoptionTab: React.FC<DistrictAdoptionTabProps> = ({
  workOrderId,
  role,
  isStarted
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('2022-23');
  const [analysisDataByYear, setAnalysisDataByYear] = useState<Record<string, DistrictAnalysisData>>({
    '2022-23': getJharkhandMockData() // Default demo data
  });
  const [isUsingDemoData, setIsUsingDemoData] = useState(true);
  
  // RTK Query hooks
  const { data: adoptedData, isLoading } = useGetAdoptedDistrictsQuery(workOrderId);
  const { data: overviewData } = useGetDistrictOverviewQuery({ workOrderId });
  const { data: planData } = useGetDistrictAdoptionPlanQuery(workOrderId);
  const [adoptDistrict] = useAdoptDistrictMutation();

  // RTK Query for fetching analysis data by year
  const { data: yearAnalysisData, isFetching: isFetchingYearData } = useGetDistrictAnalysisDataByYearQuery(
    { workOrderId, year: selectedYear },
    { skip: !selectedYear }
  );

  // Update local state when API returns data for selected year
  useEffect(() => {
    if (yearAnalysisData && yearAnalysisData.enrolmentData?.length > 0) {
      const transformedData: DistrictAnalysisData = {
        enrolment: yearAnalysisData.enrolmentData.map((d: any) => ({
          district: d.district,
          total: d.total,
          ssmo: d.ssmo,
          smo: d.smo,
          st: d.st,
          gda: d.gda,
          hha: d.hha,
          it: d.it,
          fma: d.fma
        })),
        tradeWise: yearAnalysisData.tradewiseData?.flatMap((d: any) => 
          ['SSMO', 'SMO', 'ST', 'GDA', 'HHA', 'IT', 'FMA'].map(trade => ({
            district: d.district,
            trade,
            count: d[trade.toLowerCase()] || 0
          }))
        ) || [],
        density: yearAnalysisData.densityData?.map((d: any) => ({
          district: d.district,
          population: d.population,
          area: d.area,
          density: d.density,
          literacy: d.literacy,
          bplPercentage: d.bplPercentage
        })) || [],
        distance: yearAnalysisData.distanceData?.map((d: any) => ({
          district: d.district,
          tc1Name: d.tc1Name,
          tc1Distance: d.tc1Distance,
          tc2Name: d.tc2Name,
          tc2Distance: d.tc2Distance
        })) || [],
        blocks: []
      };
      
      setAnalysisDataByYear(prev => ({
        ...prev,
        [selectedYear]: transformedData
      }));
      setIsUsingDemoData(false);
    }
  }, [yearAnalysisData, selectedYear]);

  // Mock fallback pattern
  let adoptedDistricts: string[];
  if (!adoptedData) {
    adoptedDistricts = mockAdoptedDistricts;
  } else {
    adoptedDistricts = adoptedData;
  }

  // Get current analysis data based on selected year
  const currentAnalysisData = analysisDataByYear[selectedYear] || getJharkhandMockData();

  // Available years that have data
  const availableYears = Object.keys(analysisDataByYear);

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

  const handlePlanCreated = (data: DistrictAnalysisData, year: string) => {
    setAnalysisDataByYear(prev => ({
      ...prev,
      [year]: data
    }));
    setSelectedYear(year);
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
      {/* Header with Year Filter and Create Plan Button */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">District Adoption</h2>
          {isUsingDemoData && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <Info className="h-3 w-3 mr-1" />
              Demo Data (Jharkhand)
            </Badge>
          )}
          {isFetchingYearData && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Year Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Analyze Year:</span>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {financialYears.map((fy) => (
                  <SelectItem 
                    key={fy.value} 
                    value={fy.value}
                  >
                    <div className="flex items-center gap-2">
                      {fy.label}
                      {availableYears.includes(fy.value) && (
                        <Badge variant="secondary" className="text-xs">Data</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {canEdit && (
            <Button onClick={() => setIsPlanDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create District Adoption Plan
            </Button>
          )}
        </div>
      </div>

      {isUsingDemoData && (
        <Alert className="bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            Currently viewing Jharkhand demo data for {selectedYear}. Click "Create District Adoption Plan" to upload your own data for different years.
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
          <DataAnalysisSection analysisData={currentAnalysisData} selectedYear={selectedYear} />
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
          <TeamAssignmentSection 
            canEdit={canEdit} 
            adoptedDistricts={adoptedDistricts}
            workOrderId={workOrderId}
          />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <RozgarEventsSection 
            canEdit={canEdit} 
            adoptedDistricts={adoptedDistricts}
            workOrderId={workOrderId}
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <ActivityCalendarSection canEdit={canEdit} />
        </TabsContent>

        <TabsContent value="crp" className="mt-6">
          <CRPNetworkSection 
            canEdit={canEdit} 
            adoptedDistricts={adoptedDistricts}
            workOrderId={workOrderId}
          />
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
