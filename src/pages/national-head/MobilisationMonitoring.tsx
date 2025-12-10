import React, { useEffect, useMemo } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchNHMobilisation, setSelectedKPI, toggleProgram, toggleWorkOrder } from '@/store/slices/nationalHeadSlice';
import { MobilisationKPICard } from '@/components/national-head/MobilisationKPICard';
import { ProgramWorkOrderFilter } from '@/components/national-head/ProgramWorkOrderFilter';
import { MobilisationPerformanceTable } from '@/components/national-head/MobilisationPerformanceTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
      team_matrix: [
        { label: 'Target Team Count', value: 25 },
        { label: 'Current Team Count', value: 20 },
      ],
      district_block_matrix: [
        { label: 'Target Districts', value: 25 },
        { label: 'Current Districts', value: 20 },
        { label: 'Target Blocks', value: 125 },
        { label: 'Current Blocks', value: 120 },
      ],
      mobilisation_cost_candidate: [
        { label: 'Target cost/candidate', value: '₹1,000' },
        { label: 'Actual cost/candidate', value: '₹1,200' },
      ],
      mobilisation_budget: [
        { label: 'Total Budget', value: '₹15,00,000' },
        { label: 'Budget Consumed', value: '₹7,50,000' },
        { label: 'Utilization', value: '50%' },
      ],
      ofr_target: [
        { label: 'OFR Target', value: 300 },
        { label: 'OFR Filled', value: 250 },
        { label: 'Conversion %', value: '83%' },
      ],
      approved_ofr_target: [
        { label: 'OFR Filled', value: 250 },
        { label: 'Approved OFR', value: 220 },
        { label: 'Approval %', value: '88%' },
      ],
      migration_target: [
        { label: 'Approved OFR', value: 220 },
        { label: 'Migrated', value: 180 },
        { label: 'Migration %', value: '82%' },
      ],
      enrolment_target: [
        { label: 'Target', value: 55 },
        { label: 'Achieved', value: 45 },
        { label: 'Achievement %', value: '82%' },
      ],
    };
  }, [filteredProjects]);

  // Budget breakdown data
  const budgetBreakdown = [
    { category: 'Team Salary', planned: 500000, consumed: 450000 },
    { category: 'Travel Expenses', planned: 300000, consumed: 280000 },
    { category: 'Activity Costs', planned: 400000, consumed: 350000 },
    { category: 'Migration Costs', planned: 300000, consumed: 170000 },
  ];

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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <MobilisationKPICard
            title="Mobilisation Team Matrix"
            metrics={kpiMetrics.team_matrix}
            isSelected={selectedKPI === 'team_matrix'}
            onClick={() => handleKPIClick('team_matrix')}
          />
          <MobilisationKPICard
            title="District & Block Matrix"
            metrics={kpiMetrics.district_block_matrix}
            isSelected={selectedKPI === 'district_block_matrix'}
            onClick={() => handleKPIClick('district_block_matrix')}
          />
          <MobilisationKPICard
            title="Mobilisation Cost/Candidate"
            metrics={kpiMetrics.mobilisation_cost_candidate}
            isSelected={selectedKPI === 'mobilisation_cost_candidate'}
            onClick={() => handleKPIClick('mobilisation_cost_candidate')}
          />
          <MobilisationKPICard
            title="Mobilisation Budget"
            metrics={kpiMetrics.mobilisation_budget}
            isSelected={selectedKPI === 'mobilisation_budget'}
            onClick={() => handleKPIClick('mobilisation_budget')}
          />
          <MobilisationKPICard
            title="OFR Target"
            metrics={kpiMetrics.ofr_target}
            isSelected={selectedKPI === 'ofr_target'}
            onClick={() => handleKPIClick('ofr_target')}
          />
          <MobilisationKPICard
            title="Approved OFR Target"
            metrics={kpiMetrics.approved_ofr_target}
            isSelected={selectedKPI === 'approved_ofr_target'}
            onClick={() => handleKPIClick('approved_ofr_target')}
          />
          <MobilisationKPICard
            title="Migration Target"
            metrics={kpiMetrics.migration_target}
            isSelected={selectedKPI === 'migration_target'}
            onClick={() => handleKPIClick('migration_target')}
          />
          <MobilisationKPICard
            title="Enrolment Target Matrix"
            metrics={kpiMetrics.enrolment_target}
            isSelected={selectedKPI === 'enrolment_target'}
            onClick={() => handleKPIClick('enrolment_target')}
          />
        </div>

        {/* Budget Breakdown Table - shows when budget KPI is selected */}
        {(selectedKPI === 'mobilisation_budget' || selectedKPI === 'mobilisation_cost_candidate') && (
          <Card>
            <CardHeader>
              <CardTitle>Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Planned (₹)</TableHead>
                    <TableHead className="text-right">Consumed (₹)</TableHead>
                    <TableHead className="text-right">Remaining (₹)</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetBreakdown.map((item) => {
                    const remaining = item.planned - item.consumed;
                    const utilization = Math.round((item.consumed / item.planned) * 100);
                    const isOverspent = item.consumed > item.planned;
                    const isNearLimit = utilization >= 80 && utilization <= 100;
                    
                    return (
                      <TableRow key={item.category}>
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell className="text-right">₹{item.planned.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">₹{item.consumed.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">
                          <span className={isOverspent ? 'text-destructive' : ''}>
                            {isOverspent ? '-' : ''}₹{Math.abs(remaining).toLocaleString('en-IN')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={Math.min(utilization, 100)} 
                              className={`h-2 w-20 ${isOverspent ? '[&>div]:bg-destructive' : isNearLimit ? '[&>div]:bg-yellow-500' : ''}`}
                            />
                            <span className="text-sm">{utilization}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isOverspent ? (
                            <Badge variant="destructive">Overspent</Badge>
                          ) : isNearLimit ? (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Near Limit</Badge>
                          ) : (
                            <Badge variant="outline" className="border-green-500 text-green-600">On Track</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

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
