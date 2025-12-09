import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define types
interface NHSummary {
  targetAssigned: number;
  targetAchieved: number;
  placementAchieved: number;
  retention6m: number;
  activeClusters: number;
  trend: Array<{ week: string; target: number; achieved: number }>;
}

interface StatePerformance {
  stateId: string;
  name: string;
  target: number;
  achieved: number;
  percent: number;
  status: 'On Track' | 'At Risk' | 'Off Track';
}

interface Funnel {
  mobilisations: number;
  counselling: number;
  registered: number;
  migrated: number;
  enrolled: number;
  placed: number;
}

interface ProgramHealth {
  trainingCompletion: number;
  assessmentPass: number;
  avgTimeToMigrate: number;
}

interface CentreHealth {
  avgUtilisation: number;
  avgAttendance: number;
  dropoutPercent: number;
  pendingDocuments: number;
}

interface Alert {
  id: string;
  type: 'off_track' | 'pending_approval' | 'compliance' | 'high_dropout';
  state: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

interface Cluster {
  clusterId: string;
  name: string;
  state: string;
  managers: number;
  districts: string[];
  target: number;
  achieved: number;
  percentAchieved: number;
  status: 'On Track' | 'At Risk' | 'Off Track';
}

interface Mobiliser {
  mobiliserId: string;
  name: string;
  cluster: string;
  state: string;
  ofrCount: number;
  convertRate: number;
  costPerCandidate: number;
  rank: number;
}

interface PendingDocument {
  candidateId: string;
  candidateName: string;
  cluster: string;
  pendingDocs: string[];
  assignedCounsellor: string;
  daysOverdue: number;
}

interface ActivityMetrics {
  rozgaarMelaCount: number;
  sabhaCount: number;
  byStateDistrict: Array<{ state: string; district: string; count: number }>;
}

interface CostEfficiency {
  totalMobilisationCost: number;
  travelCost: number;
  costPerCandidate: number;
  byCluster: Array<{ cluster: string; cost: number; avgCost: number }>;
}

interface MobiliserData {
  name: string;
  target: number;
  achieved: Record<string, number>;
  ytd: number;
  cost?: number;
  costPerCandidate?: number;
}

interface TeamBreakdown {
  mobilisers: MobiliserData[];
  mobiliserManagers: { count: number; target: number };
  centreManagers: { count: number; target: number };
  operationManagers: { count: number; target: number };
}

interface ProjectPerformance {
  projectId: string;
  projectName: string;
  program: string;
  workOrder: string;
  manpowerPercent: number;
  teamBreakdown: TeamBreakdown;
  totalTarget: number;
  totalAchieved: number;
  monthlyData: Record<string, { target: number; achieved: number; percent: number }>;
}

interface MobilisationData {
  topKPIs: {
    assignedTarget: number;
    achieved: number;
    percentComplete: number;
    activeClusters: number;
  };
  clusters: Cluster[];
  funnel: Funnel;
  mobiliserLeaderboard: Mobiliser[];
  projects: ProjectPerformance[];
}

interface NationalHeadState {
  summary: NHSummary | null;
  assignedStates: string[];
  statePerformance: StatePerformance[];
  funnel: Funnel | null;
  programHealth: ProgramHealth | null;
  centreHealth: CentreHealth | null;
  alerts: Alert[];
  mobilisation: MobilisationData | null;
  mobiliserLeaderboard: Mobiliser[];
  pendingDocuments: PendingDocument[];
  activityMetrics: ActivityMetrics | null;
  costEfficiency: CostEfficiency | null;
  selectedKPI: 'mobilisation_team' | 'enrolment_target' | 'mobilisation_cost' | 'training_completion' | 'conversion_pe' | 'conversion_rp';
  selectedPrograms: string[];
  selectedWorkOrders: string[];
  filters: {
    dateRange: [string | null, string | null];
    states: string[];
    program: string;
    cluster: string;
    district: string;
  };
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: NationalHeadState = {
  summary: null,
  assignedStates: ['maharashtra', 'karnataka', 'tamil-nadu', 'gujarat'],
  statePerformance: [],
  funnel: null,
  programHealth: null,
  centreHealth: null,
  alerts: [],
  mobilisation: null,
  mobiliserLeaderboard: [],
  pendingDocuments: [],
  activityMetrics: null,
  costEfficiency: null,
  selectedKPI: 'mobilisation_team',
  selectedPrograms: ['DDUGKY'],
  selectedWorkOrders: ['W/O:UP', 'W/O:BR'],
  filters: {
    dateRange: [null, null],
    states: [],
    program: 'all',
    cluster: 'all',
    district: 'all',
  },
  isLoading: false,
  error: null,
};

// Async thunks with mock data
export const fetchNHSummary = createAsyncThunk(
  'nationalHead/fetchNHSummary',
  async (filters: any) => {
    try {
      const response = await fetch('/api/national-head/summary?' + new URLSearchParams(filters));
      return await response.json();
    } catch (error) {
      return {
        targetAssigned: 12000,
        targetAchieved: 8420,
        placementAchieved: 3500,
        retention6m: 76,
        activeClusters: 128,
        trend: [
          { week: 'W1', target: 3000, achieved: 2100 },
          { week: 'W2', target: 3000, achieved: 2050 },
          { week: 'W3', target: 3000, achieved: 2270 },
          { week: 'W4', target: 3000, achieved: 2000 },
        ],
      };
    }
  }
);

export const fetchNHStates = createAsyncThunk(
  'nationalHead/fetchNHStates',
  async (filters: any) => {
    try {
      const response = await fetch('/api/national-head/states?' + new URLSearchParams(filters));
      return await response.json();
    } catch (error) {
      return [
        { stateId: '1', name: 'Maharashtra', target: 3000, achieved: 2400, percent: 80, status: 'On Track' },
        { stateId: '2', name: 'Karnataka', target: 2500, achieved: 2200, percent: 88, status: 'On Track' },
        { stateId: '3', name: 'Tamil Nadu', target: 2000, achieved: 1500, percent: 75, status: 'At Risk' },
        { stateId: '4', name: 'Gujarat', target: 2500, achieved: 1320, percent: 53, status: 'Off Track' },
      ];
    }
  }
);

export const fetchNHFunnel = createAsyncThunk(
  'nationalHead/fetchNHFunnel',
  async (filters: any) => {
    try {
      const response = await fetch('/api/national-head/funnel?' + new URLSearchParams(filters));
      return await response.json();
    } catch (error) {
      return {
        mobilisations: 15000,
        counselling: 11000,
        registered: 9000,
        migrated: 6000,
        enrolled: 5200,
        placed: 3500,
      };
    }
  }
);

export const fetchNHProgramHealth = createAsyncThunk(
  'nationalHead/fetchNHProgramHealth',
  async () => {
    try {
      const response = await fetch('/api/national-head/program-health');
      return await response.json();
    } catch (error) {
      return {
        trainingCompletion: 87.5,
        assessmentPass: 82.3,
        avgTimeToMigrate: 14,
      };
    }
  }
);

export const fetchNHCentreHealth = createAsyncThunk(
  'nationalHead/fetchNHCentreHealth',
  async () => {
    try {
      const response = await fetch('/api/national-head/centre-health');
      return await response.json();
    } catch (error) {
      return {
        avgUtilisation: 74.2,
        avgAttendance: 88.5,
        dropoutPercent: 8.3,
        pendingDocuments: 145,
      };
    }
  }
);

export const fetchNHAlerts = createAsyncThunk(
  'nationalHead/fetchNHAlerts',
  async () => {
    try {
      const response = await fetch('/api/national-head/alerts');
      return await response.json();
    } catch (error) {
      return [
        {
          id: '1',
          type: 'off_track' as const,
          state: 'Gujarat',
          message: 'Gujarat is 47% behind mobilisation target for Q4',
          priority: 'high' as const,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'compliance' as const,
          state: 'Tamil Nadu',
          message: '23 pending document verifications exceeding 7 days',
          priority: 'medium' as const,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          type: 'high_dropout' as const,
          state: 'Karnataka',
          message: 'Dropout rate increased to 12% in Bangalore cluster',
          priority: 'high' as const,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
    }
  }
);

export const fetchNHMobilisation = createAsyncThunk(
  'nationalHead/fetchNHMobilisation',
  async (filters: any) => {
    try {
      const response = await fetch('/api/national-head/mobilisation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });
      return await response.json();
    } catch (error) {
      return {
        topKPIs: {
          assignedTarget: 12000,
          achieved: 8420,
          percentComplete: 70.2,
          activeClusters: 128,
        },
        clusters: [
          {
            clusterId: '1',
            name: 'Mumbai Metro',
            state: 'Maharashtra',
            managers: 3,
            districts: ['Mumbai', 'Thane', 'Navi Mumbai'],
            target: 2500,
            achieved: 2420,
            percentAchieved: 96.8,
            status: 'On Track' as const,
          },
          {
            clusterId: '2',
            name: 'Pune Region',
            state: 'Maharashtra',
            managers: 2,
            districts: ['Pune', 'Pimpri-Chinchwad'],
            target: 2000,
            achieved: 1890,
            percentAchieved: 94.5,
            status: 'On Track' as const,
          },
          {
            clusterId: '3',
            name: 'Bangalore Urban',
            state: 'Karnataka',
            managers: 2,
            districts: ['Bangalore Urban', 'Bangalore Rural'],
            target: 2200,
            achieved: 2080,
            percentAchieved: 94.5,
            status: 'On Track' as const,
          },
          {
            clusterId: '4',
            name: 'Chennai Metro',
            state: 'Tamil Nadu',
            managers: 2,
            districts: ['Chennai', 'Kanchipuram'],
            target: 1800,
            achieved: 1350,
            percentAchieved: 75.0,
            status: 'At Risk' as const,
          },
          {
            clusterId: '5',
            name: 'Ahmedabad Region',
            state: 'Gujarat',
            managers: 2,
            districts: ['Ahmedabad', 'Gandhinagar'],
            target: 2000,
            achieved: 1120,
            percentAchieved: 56.0,
            status: 'Off Track' as const,
          },
        ],
        funnel: {
          mobilisations: 15000,
          counselling: 11000,
          registered: 9000,
          migrated: 6000,
          enrolled: 5200,
          placed: 3500,
        },
        mobiliserLeaderboard: [
          { mobiliserId: '101', name: 'Rajesh Kumar', cluster: 'Mumbai Metro', state: 'Maharashtra', ofrCount: 150, convertRate: 0.45, costPerCandidate: 320, rank: 1 },
          { mobiliserId: '102', name: 'Priya Sharma', cluster: 'Pune Region', state: 'Maharashtra', ofrCount: 142, convertRate: 0.48, costPerCandidate: 310, rank: 2 },
          { mobiliserId: '103', name: 'Anil Verma', cluster: 'Bangalore Urban', state: 'Karnataka', ofrCount: 135, convertRate: 0.42, costPerCandidate: 340, rank: 3 },
          { mobiliserId: '104', name: 'Sunita Patel', cluster: 'Chennai Metro', state: 'Tamil Nadu', ofrCount: 120, convertRate: 0.38, costPerCandidate: 380, rank: 4 },
          { mobiliserId: '105', name: 'Mohammed Ali', cluster: 'Ahmedabad Region', state: 'Gujarat', ofrCount: 98, convertRate: 0.30, costPerCandidate: 450, rank: 5 },
          { mobiliserId: '106', name: 'Deepak Nair', cluster: 'Mumbai Metro', state: 'Maharashtra', ofrCount: 95, convertRate: 0.35, costPerCandidate: 400, rank: 6 },
          { mobiliserId: '107', name: 'Anjali Mehta', cluster: 'Bangalore Urban', state: 'Karnataka', ofrCount: 88, convertRate: 0.40, costPerCandidate: 360, rank: 7 },
        ],
        projects: [
          // DDUGKY Projects
          {
            projectId: 'ddugky-5',
            projectName: 'DDUGKY 5',
            program: 'DDUGKY',
            workOrder: 'W/O:UP',
            manpowerPercent: 80,
            teamBreakdown: {
              mobilisers: [
                { name: 'Ramesh', target: 50, achieved: { total: 45, april: 8, may: 7, june: 8 }, ytd: 45, cost: 22500, costPerCandidate: 500 },
                { name: 'Suresh', target: 50, achieved: { total: 43, april: 7, may: 8, june: 7 }, ytd: 43, cost: 21500, costPerCandidate: 500 },
              ],
              mobiliserManagers: { count: 8, target: 10 },
              centreManagers: { count: 1, target: 2 },
              operationManagers: { count: 1, target: 1 },
            },
            totalTarget: 25,
            totalAchieved: 20,
            monthlyData: {
              april: { target: 10, achieved: 10, percent: 100 },
              may: { target: 12, achieved: 12, percent: 100 },
              june: { target: 14, achieved: 14, percent: 100 },
            },
          },
          {
            projectId: 'ddugky-6',
            projectName: 'DDUGKY 6',
            program: 'DDUGKY',
            workOrder: 'W/O:BR',
            manpowerPercent: 85,
            teamBreakdown: {
              mobilisers: [
                { name: 'Vijay', target: 60, achieved: { total: 55, april: 9, may: 10, june: 9 }, ytd: 55, cost: 27500, costPerCandidate: 500 },
                { name: 'Ajay', target: 55, achieved: { total: 50, april: 8, may: 9, june: 8 }, ytd: 50, cost: 25000, costPerCandidate: 500 },
              ],
              mobiliserManagers: { count: 4, target: 5 },
              centreManagers: { count: 2, target: 2 },
              operationManagers: { count: 1, target: 1 },
            },
            totalTarget: 30,
            totalAchieved: 25,
            monthlyData: {
              april: { target: 12, achieved: 12, percent: 100 },
              may: { target: 14, achieved: 13, percent: 93 },
              june: { target: 15, achieved: 15, percent: 100 },
            },
          },
          // UPSDM Projects
          {
            projectId: 'upsdm-1',
            projectName: 'UPSDM 1',
            program: 'UPSDM',
            workOrder: 'W/O:UP',
            manpowerPercent: 92,
            teamBreakdown: {
              mobilisers: [
                { name: 'Priya Verma', target: 70, achieved: { total: 65, april: 11, may: 12, june: 10 }, ytd: 65, cost: 29250, costPerCandidate: 450 },
                { name: 'Ankur Jain', target: 65, achieved: { total: 62, april: 10, may: 11, june: 10 }, ytd: 62, cost: 27900, costPerCandidate: 450 },
              ],
              mobiliserManagers: { count: 6, target: 6 },
              centreManagers: { count: 2, target: 2 },
              operationManagers: { count: 1, target: 1 },
            },
            totalTarget: 28,
            totalAchieved: 26,
            monthlyData: {
              april: { target: 11, achieved: 11, percent: 100 },
              may: { target: 12, achieved: 12, percent: 100 },
              june: { target: 10, achieved: 10, percent: 100 },
            },
          },
          {
            projectId: 'upsdm-2',
            projectName: 'UPSDM 2',
            program: 'UPSDM',
            workOrder: 'W/O:BR',
            manpowerPercent: 78,
            teamBreakdown: {
              mobilisers: [
                { name: 'Rohit Gupta', target: 55, achieved: { total: 42, april: 7, may: 8, june: 6 }, ytd: 42, cost: 23100, costPerCandidate: 550 },
                { name: 'Kavita Singh', target: 50, achieved: { total: 39, april: 6, may: 7, june: 6 }, ytd: 39, cost: 21450, costPerCandidate: 550 },
              ],
              mobiliserManagers: { count: 5, target: 7 },
              centreManagers: { count: 1, target: 2 },
              operationManagers: { count: 1, target: 1 },
            },
            totalTarget: 22,
            totalAchieved: 17,
            monthlyData: {
              april: { target: 8, achieved: 7, percent: 88 },
              may: { target: 9, achieved: 8, percent: 89 },
              june: { target: 8, achieved: 7, percent: 88 },
            },
          },
          // WDC Projects
          {
            projectId: 'wdc-1',
            projectName: 'WDC 1',
            program: 'WDC',
            workOrder: 'W/O:UP',
            manpowerPercent: 65,
            teamBreakdown: {
              mobilisers: [
                { name: 'Amit Patel', target: 40, achieved: { total: 26, april: 4, may: 5, june: 4 }, ytd: 26, cost: 16900, costPerCandidate: 650 },
                { name: 'Sunita Devi', target: 38, achieved: { total: 24, april: 4, may: 4, june: 3 }, ytd: 24, cost: 15600, costPerCandidate: 650 },
              ],
              mobiliserManagers: { count: 4, target: 6 },
              centreManagers: { count: 1, target: 2 },
              operationManagers: { count: 1, target: 1 },
            },
            totalTarget: 18,
            totalAchieved: 12,
            monthlyData: {
              april: { target: 6, achieved: 5, percent: 83 },
              may: { target: 7, achieved: 5, percent: 71 },
              june: { target: 6, achieved: 4, percent: 67 },
            },
          },
          {
            projectId: 'wdc-2',
            projectName: 'WDC 2',
            program: 'WDC',
            workOrder: 'W/O:BR',
            manpowerPercent: 88,
            teamBreakdown: {
              mobilisers: [
                { name: 'Deepak Kumar', target: 48, achieved: { total: 44, april: 8, may: 8, june: 7 }, ytd: 44, cost: 19800, costPerCandidate: 450 },
                { name: 'Rekha Rani', target: 45, achieved: { total: 41, april: 7, may: 7, june: 6 }, ytd: 41, cost: 18450, costPerCandidate: 450 },
              ],
              mobiliserManagers: { count: 5, target: 5 },
              centreManagers: { count: 2, target: 2 },
              operationManagers: { count: 1, target: 1 },
            },
            totalTarget: 20,
            totalAchieved: 18,
            monthlyData: {
              april: { target: 8, achieved: 8, percent: 100 },
              may: { target: 8, achieved: 7, percent: 88 },
              june: { target: 7, achieved: 7, percent: 100 },
            },
          },
        ],
      };
    }
  }
);

export const fetchMobiliserLeaderboard = createAsyncThunk(
  'nationalHead/fetchMobiliserLeaderboard',
  async (filters: any) => {
    try {
      const response = await fetch('/api/national-head/leaderboard?' + new URLSearchParams(filters));
      return await response.json();
    } catch (error) {
      return [
        { mobiliserId: '101', name: 'Rajesh Kumar', cluster: 'Mumbai Metro', state: 'Maharashtra', ofrCount: 150, convertRate: 0.45, costPerCandidate: 320, rank: 1 },
        { mobiliserId: '102', name: 'Priya Sharma', cluster: 'Pune Region', state: 'Maharashtra', ofrCount: 142, convertRate: 0.48, costPerCandidate: 310, rank: 2 },
        { mobiliserId: '103', name: 'Anil Verma', cluster: 'Bangalore Urban', state: 'Karnataka', ofrCount: 135, convertRate: 0.42, costPerCandidate: 340, rank: 3 },
        { mobiliserId: '104', name: 'Sunita Patel', cluster: 'Chennai Metro', state: 'Tamil Nadu', ofrCount: 120, convertRate: 0.38, costPerCandidate: 380, rank: 4 },
        { mobiliserId: '105', name: 'Mohammed Ali', cluster: 'Ahmedabad Region', state: 'Gujarat', ofrCount: 98, convertRate: 0.30, costPerCandidate: 450, rank: 5 },
      ];
    }
  }
);

export const fetchPendingDocuments = createAsyncThunk(
  'nationalHead/fetchPendingDocuments',
  async (filters: any) => {
    try {
      const response = await fetch('/api/national-head/pending-documents?' + new URLSearchParams(filters));
      return await response.json();
    } catch (error) {
      return [
        { candidateId: 'C001', candidateName: 'Amit Singh', cluster: 'Mumbai Metro', pendingDocs: ['Aadhaar', 'Photo'], assignedCounsellor: 'Neha Gupta', daysOverdue: 5 },
        { candidateId: 'C002', candidateName: 'Sneha Reddy', cluster: 'Bangalore Urban', pendingDocs: ['Medical Certificate'], assignedCounsellor: 'Ravi Kumar', daysOverdue: 8 },
        { candidateId: 'C003', candidateName: 'Rohit Joshi', cluster: 'Pune Region', pendingDocs: ['Bank Details', 'Educational Certificate'], assignedCounsellor: 'Pooja Desai', daysOverdue: 3 },
      ];
    }
  }
);

export const fetchActivityMetrics = createAsyncThunk(
  'nationalHead/fetchActivityMetrics',
  async (filters: any) => {
    try {
      const response = await fetch('/api/national-head/activities?' + new URLSearchParams(filters));
      return await response.json();
    } catch (error) {
      return {
        rozgaarMelaCount: 145,
        sabhaCount: 89,
        byStateDistrict: [
          { state: 'Maharashtra', district: 'Mumbai', count: 28 },
          { state: 'Maharashtra', district: 'Pune', count: 22 },
          { state: 'Karnataka', district: 'Bangalore', count: 24 },
          { state: 'Tamil Nadu', district: 'Chennai', count: 19 },
          { state: 'Gujarat', district: 'Ahmedabad', count: 15 },
        ],
      };
    }
  }
);

export const fetchCostEfficiency = createAsyncThunk(
  'nationalHead/fetchCostEfficiency',
  async (filters: any) => {
    try {
      const response = await fetch('/api/national-head/cost-efficiency?' + new URLSearchParams(filters));
      return await response.json();
    } catch (error) {
      return {
        totalMobilisationCost: 2850000,
        travelCost: 450000,
        costPerCandidate: 338,
        byCluster: [
          { cluster: 'Mumbai Metro', cost: 774800, avgCost: 320 },
          { cluster: 'Pune Region', cost: 585900, avgCost: 310 },
          { cluster: 'Bangalore Urban', cost: 707200, avgCost: 340 },
          { cluster: 'Chennai Metro', cost: 513000, avgCost: 380 },
          { cluster: 'Ahmedabad Region', cost: 504000, avgCost: 450 },
        ],
      };
    }
  }
);

export const assignTargetsToStates = createAsyncThunk(
  'nationalHead/assignTargets',
  async (targetData: any, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/targets/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetData),
      });
      if (!response.ok) throw new Error('Failed to assign targets');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// National Head slice
const nationalHeadSlice = createSlice({
  name: 'nationalHead',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<NationalHeadState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedKPI: (state, action: PayloadAction<NationalHeadState['selectedKPI']>) => {
      state.selectedKPI = action.payload;
    },
    toggleProgram: (state, action: PayloadAction<string>) => {
      const program = action.payload;
      if (state.selectedPrograms.includes(program)) {
        state.selectedPrograms = state.selectedPrograms.filter(p => p !== program);
      } else {
        state.selectedPrograms.push(program);
      }
    },
    toggleWorkOrder: (state, action: PayloadAction<string>) => {
      const workOrder = action.payload;
      if (state.selectedWorkOrders.includes(workOrder)) {
        state.selectedWorkOrders = state.selectedWorkOrders.filter(wo => wo !== workOrder);
      } else {
        state.selectedWorkOrders.push(workOrder);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch NH Summary
      .addCase(fetchNHSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNHSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchNHSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch NH States
      .addCase(fetchNHStates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNHStates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statePerformance = action.payload;
      })
      .addCase(fetchNHStates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch NH Funnel
      .addCase(fetchNHFunnel.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNHFunnel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.funnel = action.payload;
      })
      .addCase(fetchNHFunnel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Program Health
      .addCase(fetchNHProgramHealth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNHProgramHealth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.programHealth = action.payload;
      })
      .addCase(fetchNHProgramHealth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Centre Health
      .addCase(fetchNHCentreHealth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNHCentreHealth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.centreHealth = action.payload;
      })
      .addCase(fetchNHCentreHealth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Alerts
      .addCase(fetchNHAlerts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNHAlerts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchNHAlerts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Mobilisation Data
      .addCase(fetchNHMobilisation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNHMobilisation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mobilisation = action.payload;
      })
      .addCase(fetchNHMobilisation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Mobiliser Leaderboard
      .addCase(fetchMobiliserLeaderboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMobiliserLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mobiliserLeaderboard = action.payload;
      })
      .addCase(fetchMobiliserLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Pending Documents
      .addCase(fetchPendingDocuments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPendingDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingDocuments = action.payload;
      })
      .addCase(fetchPendingDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Activity Metrics
      .addCase(fetchActivityMetrics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchActivityMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activityMetrics = action.payload;
      })
      .addCase(fetchActivityMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Cost Efficiency
      .addCase(fetchCostEfficiency.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCostEfficiency.fulfilled, (state, action) => {
        state.isLoading = false;
        state.costEfficiency = action.payload;
      })
      .addCase(fetchCostEfficiency.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Assign Targets
      .addCase(assignTargetsToStates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignTargetsToStates.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(assignTargetsToStates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearError, setSelectedKPI, toggleProgram, toggleWorkOrder } = nationalHeadSlice.actions;
export default nationalHeadSlice.reducer;
