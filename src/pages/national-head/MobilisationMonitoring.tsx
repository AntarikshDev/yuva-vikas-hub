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
        { label: 'Target Team Count', value: 25 },
        { label: 'Current Team Count', value: 20 },
        { label: 'Target Districts', value: 25 },
        { label: 'Current Districts', value: 20 },
        { label: 'Target Blocks', value: 125 },
        { label: 'Current Blocks', value: 120 },
      ],
      enrolment_target: [
        { label: 'Target', value: 55 },
        { label: 'Achieved', value: 45 },
      ],
      mobilisation_cost: [
        { label: 'Target cost/candidate', value: '₹1,000' },
        { label: 'Actual cost/candidate', value: '₹1,200' },
        { label: 'Mobilisation Budget', value: '₹15,00,000' },
        { label: 'Budget Consumed', value: '₹7,50,000' },
      ],
      trained_over_enrolled: [
        { label: 'Target Enrolment', value: 250 },
        { label: 'Enrolled', value: 200 },
        { label: 'Target Trained', value: 250 },
        { label: 'Trained', value: 150 },
      ],
      placed_over_trained: [
        { label: 'Target Trained', value: 250 },
        { label: 'Trained', value: 150 },
        { label: 'Target Placed', value: 250 },
        { label: 'Placed', value: 125 },
      ],
      retained_over_placed: [
        { label: 'Target Placed', value: 250 },
        { label: 'Placed', value: 125 },
        { label: 'Target Retained', value: 250 },
        { label: 'Retained', value: 102 },
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
