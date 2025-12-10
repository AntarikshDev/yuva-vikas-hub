// Mock API service for Budget data

import { WorkOrderBudget, HigherAuthorityAllocation, ActivityBudget } from '@/components/work-order/WorkOrderBudgetTab';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface TeamSalaryData {
  totalFixedSalary: number;
  members: {
    employeeId: string;
    name: string;
    role: string;
    salary: number;
  }[];
}

// Mock historical data
const mockHistoricalData = {
  travelExpenses: {
    averagePerMobiliser: 3500,
    averagePerManager: 8000,
    averagePerHead: 12000,
  },
  activityCosts: {
    rozgaarSabha: { costPerEvent: 15000, historicalAverage: 14000 },
    mela: { costPerEvent: 50000, historicalAverage: 48000 },
    autoMicing: { costPerEvent: 2500, historicalAverage: 2200 },
  },
  migrationCosts: {
    transportPerCandidate: 2500,
    foodPerCandidate: 500,
    accommodationPerCandidate: 400,
    documentationPerCandidate: 100,
  },
};

// Fetch team salary from assignment data
export const fetchTeamSalary = async (workOrderId: string): Promise<TeamSalaryData> => {
  await delay(500);
  
  // This would come from the Assignment tab's team data
  return {
    totalFixedSalary: 425000,
    members: [
      { employeeId: 'LNJ001', name: 'Rahul Sharma', role: 'State Head', salary: 85000 },
      { employeeId: 'LNJ002', name: 'Priya Singh', role: 'Operation Manager', salary: 55000 },
      { employeeId: 'LNJ003', name: 'Amit Kumar', role: 'Centre Manager', salary: 50000 },
      { employeeId: 'LNJ004', name: 'Neha Gupta', role: 'Mobilisation Manager', salary: 45000 },
      { employeeId: 'LNJ005', name: 'Sanjay Verma', role: 'Mobiliser', salary: 25000 },
      { employeeId: 'LNJ006', name: 'Kavita Das', role: 'Mobiliser', salary: 25000 },
      { employeeId: 'LNJ007', name: 'Rajesh Patel', role: 'Mobiliser', salary: 25000 },
      { employeeId: 'LNJ008', name: 'Sunita Rao', role: 'Mobilisation Manager', salary: 45000 },
      { employeeId: 'LNJ009', name: 'Vikram Joshi', role: 'Mobiliser', salary: 25000 },
    ],
  };
};

// Fetch historical data for budget estimation
export const fetchHistoricalData = async () => {
  await delay(300);
  return mockHistoricalData;
};

// Fetch existing budget for a work order
export const fetchBudget = async (workOrderId: string): Promise<WorkOrderBudget | null> => {
  await delay(500);
  // Return null to simulate no existing budget
  return null;
};

// Create a new budget
export const createBudget = async (budget: Partial<WorkOrderBudget>): Promise<WorkOrderBudget> => {
  await delay(800);
  
  const totalBudget = 
    (budget.teamSalary?.totalTeamSalaryCost || 0) +
    (budget.travelExpenses?.estimatedBudget || 0) +
    (budget.activityCosts?.totalActivityCost || 0) +
    (budget.migrationCosts?.totalMigrationCost || 0);

  const costPerCandidate = budget.migrationCosts?.totalCandidates && budget.migrationCosts.totalCandidates > 0 
    ? Math.round(totalBudget / budget.migrationCosts.totalCandidates) 
    : 0;

  return {
    ...budget,
    id: `BUD${Date.now()}`,
    workOrderId: budget.workOrderId || '',
    totalBudget,
    targetCandidates: budget.migrationCosts?.totalCandidates || 0,
    costPerCandidate,
    status: 'pending_approval',
    createdDate: new Date().toISOString(),
    createdBy: 'Current User',
  } as WorkOrderBudget;
};

// Update an existing budget
export const updateBudget = async (budgetId: string, updates: Partial<WorkOrderBudget>): Promise<WorkOrderBudget> => {
  await delay(600);
  
  const totalBudget = 
    (updates.teamSalary?.totalTeamSalaryCost || 0) +
    (updates.travelExpenses?.estimatedBudget || 0) +
    (updates.activityCosts?.totalActivityCost || 0) +
    (updates.migrationCosts?.totalMigrationCost || 0);

  const costPerCandidate = updates.migrationCosts?.totalCandidates && updates.migrationCosts.totalCandidates > 0 
    ? Math.round(totalBudget / updates.migrationCosts.totalCandidates) 
    : 0;

  return {
    ...updates,
    id: budgetId,
    totalBudget,
    costPerCandidate,
  } as WorkOrderBudget;
};

// Calculate estimated travel budget based on team composition
export const calculateTravelEstimate = (teamMembers: TeamSalaryData['members']): number => {
  const { travelExpenses } = mockHistoricalData;
  
  let estimate = 0;
  teamMembers.forEach(member => {
    if (member.role.includes('Mobiliser')) {
      estimate += travelExpenses.averagePerMobiliser;
    } else if (member.role.includes('Manager')) {
      estimate += travelExpenses.averagePerManager;
    } else if (member.role.includes('Head')) {
      estimate += travelExpenses.averagePerHead;
    }
  });
  
  return estimate * 3; // 3 months estimate
};

// Higher authority options for allocation
export const getHigherAuthorityOptions = async (): Promise<HigherAuthorityAllocation[]> => {
  await delay(200);
  return [
    { role: 'Regional Director', employeeName: 'Mr. Vikram Mehta', baseSalary: 150000, allocationPercentage: 0, allocatedAmount: 0 },
    { role: 'Zonal Manager', employeeName: 'Ms. Kavita Sharma', baseSalary: 100000, allocationPercentage: 0, allocatedAmount: 0 },
    { role: 'Program Manager', employeeName: 'Mr. Suresh Kumar', baseSalary: 80000, allocationPercentage: 0, allocatedAmount: 0 },
  ];
};
