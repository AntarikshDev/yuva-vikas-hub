import React, { useEffect, useMemo, useCallback } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { 
  fetchNHMobilisation, 
  setSelectedKPI, 
  toggleProgram, 
  toggleState,
  setKPILoading,
  setKPITableData 
} from '@/store/slices/nationalHeadSlice';
import { MobilisationKPICard } from '@/components/national-head/MobilisationKPICard';
import { ProgramStateFilter } from '@/components/national-head/ProgramStateFilter';
import { MobilisationPerformanceTable } from '@/components/national-head/MobilisationPerformanceTable';

// API endpoints for each KPI
const KPI_API_ENDPOINTS = {
  mobilisation_team: '/api/national-head/kpi/mobilisation-team',
  enrolment_target: '/api/national-head/kpi/enrolment-target',
  mobilisation_cost: '/api/national-head/kpi/mobilisation-cost',
  training_completion: '/api/national-head/kpi/training-completion',
  conversion_pe: '/api/national-head/kpi/conversion-pe',
  conversion_rp: '/api/national-head/kpi/conversion-rp',
} as const;

type KPIType = keyof typeof KPI_API_ENDPOINTS;

const NationalHeadMobilisationMonitoring = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    mobilisation, 
    selectedKPI, 
    selectedPrograms, 
    selectedStates, 
    kpiTableData,
    isLoading,
    isKPILoading 
  } = useAppSelector((state) => state.nationalHead);

  // Fetch initial mobilisation data
  useEffect(() => {
    dispatch(fetchNHMobilisation({ programs: selectedPrograms, states: selectedStates }));
  }, [dispatch, selectedPrograms, selectedStates]);

  // Filter projects based on selected programs
  const filteredProjects = useMemo(() => {
    if (!mobilisation?.projects) return [];
    return mobilisation.projects.filter(project => 
      selectedPrograms.length === 0 || selectedPrograms.includes(project.program)
    );
  }, [mobilisation?.projects, selectedPrograms]);

  // Calculate KPI metrics for card display
  const kpiMetrics = useMemo(() => {
    const totalTarget = filteredProjects.reduce((sum, p) => sum + p.totalTarget, 0);
    const totalAchieved = filteredProjects.reduce((sum, p) => sum + p.totalAchieved, 0);
    const totalCost = filteredProjects.reduce((sum, p) => sum + (p.teamBreakdown.mobilisers.reduce((s, m) => s + (m.cost || 0), 0)), 0);
    const avgCostPerCandidate = totalAchieved > 0 ? Math.round(totalCost / totalAchieved) : 0;

    return {
      mobilisation_team: [
        { label: 'Team', target: 20, achieved: 25 },
        { label: 'District', target: 20, achieved: 25 },
        { label: 'Block', target: 120, achieved: 125 },
      ],
      enrolment_target: [
        { label: 'Target', target: 550, achieved: 380 },
        { label: 'Achieved', target: 550, achieved: 380 },
      ],
      mobilisation_cost: [
        { label: 'Total Cost', target: 250, achieved: 200 },
        { label: 'Cost/Candidate', target: 500, achieved: 500 },
      ],
      training_completion: [
        { label: 'Enrolled', target: 200, achieved: 150 },
        { label: 'Training', target: 200, achieved: 150 },
      ],
      conversion_pe: [
        { label: 'P/E Ratio', target: 100, achieved: 75 },
      ],
      conversion_rp: [
        { label: 'R/P Ratio', target: 100, achieved: 80 },
      ],
    };
  }, [filteredProjects]);

  const handleProgramToggle = (program: string) => {
    dispatch(toggleProgram(program));
  };

  const handleStateToggle = (state: string) => {
    dispatch(toggleState(state));
  };

  // Handle KPI card click - calls specific API with payload
  const handleKPIClick = useCallback(async (kpiType: KPIType) => {
    dispatch(setSelectedKPI(kpiType));
    dispatch(setKPILoading(true));

    const payload = {
      programs: selectedPrograms,
      states: selectedStates,
      kpi: kpiType,
    };

    try {
      const response = await fetch(KPI_API_ENDPOINTS[kpiType], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setKPITableData(data.programs || []));
      } else {
        // Use mock data for now
        dispatch(setKPITableData(getMockTableData(kpiType)));
      }
    } catch (error) {
      console.log('KPI API call failed, using mock data:', error);
      dispatch(setKPITableData(getMockTableData(kpiType)));
    } finally {
      dispatch(setKPILoading(false));
    }
  }, [dispatch, selectedPrograms, selectedStates]);

  return (
    <MainLayout role="national-head">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mobilisation Monitoring</h1>
          <p className="text-muted-foreground">Track mobilisation performance across programs and states</p>
        </div>

        {/* Program and State Filters */}
        <ProgramStateFilter
          selectedPrograms={selectedPrograms}
          selectedStates={selectedStates}
          onProgramToggle={handleProgramToggle}
          onStateToggle={handleStateToggle}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MobilisationKPICard
            title="Mobilisation Team"
            metrics={kpiMetrics.mobilisation_team}
            isSelected={selectedKPI === 'mobilisation_team'}
            onClick={() => handleKPIClick('mobilisation_team')}
          />
          <MobilisationKPICard
            title="Enrolment Target"
            metrics={kpiMetrics.enrolment_target}
            isSelected={selectedKPI === 'enrolment_target'}
            onClick={() => handleKPIClick('enrolment_target')}
          />
          <MobilisationKPICard
            title="Mobilisation Cost"
            metrics={kpiMetrics.mobilisation_cost}
            isSelected={selectedKPI === 'mobilisation_cost'}
            onClick={() => handleKPIClick('mobilisation_cost')}
          />
          <MobilisationKPICard
            title="Training Completion"
            metrics={kpiMetrics.training_completion}
            isSelected={selectedKPI === 'training_completion'}
            onClick={() => handleKPIClick('training_completion')}
          />
          <MobilisationKPICard
            title="Conversion Ratio (P/E)"
            metrics={kpiMetrics.conversion_pe}
            isSelected={selectedKPI === 'conversion_pe'}
            onClick={() => handleKPIClick('conversion_pe')}
          />
          <MobilisationKPICard
            title="Conversion Ratio (R/P)"
            metrics={kpiMetrics.conversion_rp}
            isSelected={selectedKPI === 'conversion_rp'}
            onClick={() => handleKPIClick('conversion_rp')}
          />
        </div>

        {/* Dynamic Performance Table */}
        <MobilisationPerformanceTable
          projects={filteredProjects}
          selectedKPI={selectedKPI}
          isLoading={isLoading || isKPILoading}
        />
      </div>
    </MainLayout>
  );
};

// Mock data function for fallback
function getMockTableData(kpiType: KPIType) {
  return [
    {
      projectId: 'ddugky-5',
      projectName: 'DDUGKY 5',
      program: 'DDUGKY',
      workOrder: 'W/O:UP',
      manpowerPercent: 70,
      teamBreakdown: {
        mobilisers: [
          { name: 'Ramesh', target: 100, achieved: { total: 90, april: 60, may: 400, june: 0 }, ytd: 90, cost: 45000, costPerCandidate: 500 },
          { name: 'Suresh', target: 100, achieved: { total: 80, april: 40, may: 400, june: 0 }, ytd: 80, cost: 40000, costPerCandidate: 500 },
        ],
        mobiliserManagers: { count: 3, target: 5 },
        centreManagers: { count: 1, target: 2 },
        operationManagers: { count: 1, target: 1 },
      },
      totalTarget: 250,
      totalAchieved: 170,
      monthlyData: {
        april: { target: 100, achieved: 100, percent: 100 },
        may: { target: 100, achieved: 800, percent: 800 },
        june: { target: 50, achieved: 0, percent: 0 },
      },
    },
  ];
}

export default NationalHeadMobilisationMonitoring;
