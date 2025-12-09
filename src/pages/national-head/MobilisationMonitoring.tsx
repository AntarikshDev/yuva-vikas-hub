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
    return {
      mobilisation_team: [
        { label: 'Team', target: 25, achieved: 20 },
        { label: 'District', target: 25, achieved: 20 },
        { label: 'Block', target: 125, achieved: 120 },
      ],
      enrolment_target: [
        { label: 'Target', target: 55, achieved: 45 },
        { label: 'Achieved', target: 55, achieved: 45 },
      ],
      mobilisation_cost: [
        { label: 'Budget', target: 1500000, achieved: 750000 },
        { label: 'Cost/Candidate', target: 1000, achieved: 1200 },
      ],
      trained_over_enrolled: [
        { label: 'Enrolled', target: 250, achieved: 200 },
        { label: 'Trained', target: 250, achieved: 150 },
      ],
      placed_over_trained: [
        { label: 'Trained', target: 250, achieved: 150 },
        { label: 'Placed', target: 250, achieved: 125 },
      ],
      retained_over_placed: [
        { label: 'Placed', target: 250, achieved: 125 },
        { label: 'Retained', target: 250, achieved: 102 },
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
            isCurrency={true}
          />
          <MobilisationKPICard
            title="Trained over Enrolled"
            metrics={kpiMetrics.trained_over_enrolled}
            isSelected={selectedKPI === 'trained_over_enrolled'}
            onClick={() => handleKPIClick('trained_over_enrolled')}
          />
          <MobilisationKPICard
            title="Placed over Trained"
            metrics={kpiMetrics.placed_over_trained}
            isSelected={selectedKPI === 'placed_over_trained'}
            onClick={() => handleKPIClick('placed_over_trained')}
          />
          <MobilisationKPICard
            title="Retained over Placed"
            metrics={kpiMetrics.retained_over_placed}
            isSelected={selectedKPI === 'retained_over_placed'}
            onClick={() => handleKPIClick('retained_over_placed')}
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
