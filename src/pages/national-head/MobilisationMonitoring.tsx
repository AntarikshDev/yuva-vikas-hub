import React, { useEffect, useMemo } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchNHMobilisation, setSelectedKPI, toggleProgram, toggleWorkOrder } from '@/store/slices/nationalHeadSlice';
import { MobilisationKPICard } from '@/components/national-head/MobilisationKPICard';
import { ProgramWorkOrderFilter } from '@/components/national-head/ProgramWorkOrderFilter';
import { MobilisationPerformanceTable } from '@/components/national-head/MobilisationPerformanceTable';

const NationalHeadMobilisationMonitoring = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mobilisation, selectedKPI, selectedPrograms, selectedWorkOrders, isLoading } = useAppSelector((state) => state.nationalHead);

  useEffect(() => {
    dispatch(fetchNHMobilisation({ programs: selectedPrograms, workOrders: selectedWorkOrders }));
  }, [dispatch, selectedPrograms, selectedWorkOrders]);

  // Filter projects based on selected programs and work orders
  const filteredProjects = useMemo(() => {
    if (!mobilisation?.projects) return [];
    return mobilisation.projects.filter(project => 
      (selectedPrograms.length === 0 || selectedPrograms.includes(project.program)) &&
      (selectedWorkOrders.length === 0 || selectedWorkOrders.includes(project.workOrder))
    );
  }, [mobilisation?.projects, selectedPrograms, selectedWorkOrders]);

  // Calculate KPI metrics
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
        { label: 'Target', target: totalTarget, achieved: totalAchieved },
        { label: 'Achieved', target: totalTarget, achieved: totalAchieved },
      ],
      mobilisation_cost: [
        { label: 'Total Cost', target: 250, achieved: 200 },
        { label: 'Cost/Candidate', target: avgCostPerCandidate, achieved: avgCostPerCandidate },
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

  const handleWorkOrderToggle = (workOrder: string) => {
    dispatch(toggleWorkOrder(workOrder));
  };

  const handleKPIClick = (kpiType: typeof selectedKPI) => {
    dispatch(setSelectedKPI(kpiType));
  };

  return (
    <MainLayout role="national-head">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mobilisation Monitoring</h1>
          <p className="text-muted-foreground">Track mobilisation performance across programs and work orders</p>
        </div>

        {/* Program and Work Order Filters */}
        <ProgramWorkOrderFilter
          selectedPrograms={selectedPrograms}
          selectedWorkOrders={selectedWorkOrders}
          onProgramToggle={handleProgramToggle}
          onWorkOrderToggle={handleWorkOrderToggle}
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
            title="Placement over Enrolment"
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
          isLoading={isLoading}
        />
      </div>
    </MainLayout>
  );
};

export default NationalHeadMobilisationMonitoring;
