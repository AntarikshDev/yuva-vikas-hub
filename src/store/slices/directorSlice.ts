import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define types
interface NationalKPIs {
  totalCandidates: number;
  totalCandidatesGrowth: number;
  activeCentres: number;
  placementRate: number;
  retentionRate6Months: number;
  centreUtilisation: { current: number; total: number };
  stateHeadSalary: number;
  mobManagerSalary: number;
  mobilisationTeamCost: number;
  transportationCost: number;
  candidatesPerMonth: number;
  mobilisationCostPerCandidate: number;
}

interface ProgramTarget {
  programId: string;
  name: string;
  target: number;
  achieved: number;
}

interface WeeklyTrend {
  week: string;
  achieved: number;
}

interface TargetTracking {
  national: { target: number; achieved: number };
  byProgram: ProgramTarget[];
  weeklyTrend: WeeklyTrend[];
}

interface StatePerformance {
  stateId: string;
  name: string;
  score: number;
  mobilisation: number;
  training: number;
  placement: number;
}

interface StateOffTrack {
  stateId: string;
  name: string;
  achievementRate: number;
  status: 'critical' | 'warning';
}

interface UpcomingBatch {
  id: string;
  name: string;
  state: string;
  trainer: string;
  launchDate: string;
  remarks: string;
}

interface Compliance {
  centreComplianceRate: number;
  statesOffTrack: StateOffTrack[];
  upcomingBatches: UpcomingBatch[];
}

interface ConversionFunnel {
  mobilisations: number;
  counselling: number;
  enrollments: number;
  trainingCompletion: number;
  placements: number;
  retention: number;
}

interface StateLeaderboardItem {
  stateId: string;
  name: string;
  target: number;
  achieved: number;
  percentAchieved: number;
  rank: number;
}

interface ClusterPerformance {
  clusterId: string;
  name: string;
  state: string;
  districts: string[];
  managers: number;
  target: number;
  achieved: number;
  percentAchieved: number;
  status: 'On Track' | 'At Risk' | 'Off Track';
}

interface ActivityMetrics {
  rozgaarMelaCount: number;
  sabhaCount: number;
  influencersRegistered: number;
  byState: Array<{ 
    state: string; 
    rozgaarMela: number;
    rozgaarSabha: number;
    influencers: number;
  }>;
  recentActivities: ActivityDetail[];
}

interface ActivityDetail {
  id: string;
  type: 'Rozgaar Mela' | 'Rozgaar Sabha' | 'Auto Mic-ing' | 'Influencer Registration';
  date: string;
  state: string;
  district: string;
  block: string;
  village: string;
  organizer: string;
  organizerRole: 'Mobiliser' | 'Mobiliser Manager';
  participantCount: number;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  description: string;
  images: string[];
  location: {
    coordinates?: { lat: number; lng: number };
    address: string;
  };
  influencersOnboarded?: number;
  candidatesMobilised?: number;
}

interface CandidatePipeline {
  registered: number;
  ready: number;
  migrated: number;
  enrolled: number;
  placed: number;
  retained: number;
}

interface CentreUtilisation {
  centreId: string;
  name: string;
  capacity: number;
  current: number;
}

interface LeaveDropoutSummary {
  week: string;
  leaves: number;
  dropouts: number;
}

interface CentreHealth {
  capacityUtilisation: CentreUtilisation[];
  leaveDropoutSummary: LeaveDropoutSummary[];
}

interface MobilisationData {
  nationalTarget: number;
  achieved: number;
  achievementPercent: number;
  conversionFunnel: ConversionFunnel;
  stateLeaderboard: StateLeaderboardItem[];
  clusterPerformance: ClusterPerformance[];
  activities: ActivityMetrics;
  candidatePipeline: CandidatePipeline;
  centreHealth: CentreHealth;
}

interface DirectorState {
  nationalKPIs: NationalKPIs | null;
  targetTracking: TargetTracking | null;
  statePerformance: StatePerformance[];
  compliance: Compliance | null;
  mobilisationData: MobilisationData | null;
  filters: {
    dateRange: [string | null, string | null];
    state: string;
    program: string;
    jobRole: string;
    cluster: string;
  };
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: DirectorState = {
  nationalKPIs: null,
  targetTracking: null,
  statePerformance: [],
  compliance: null,
  mobilisationData: null,
  filters: {
    dateRange: [null, null],
    state: 'all',
    program: 'all',
    jobRole: 'all',
    cluster: 'all',
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchNationalKPIs = createAsyncThunk(
  'director/fetchNationalKPIs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/director/kpis');
      if (!response.ok) throw new Error('Failed to fetch KPIs');
      return await response.json();
    } catch (error: any) {
      // Mock data fallback
      const stateHeadSalary = 120000;
      const mobManagerSalary = 85000;
      const mobilisationTeamCost = 450000;
      const transportationCost = 280000;
      const candidatesPerMonth = 3803;
      
      const mobilisationCostPerCandidate = 
        ((stateHeadSalary * 0.4) + mobManagerSalary + mobilisationTeamCost + transportationCost) / candidatesPerMonth;
      
      return {
        totalCandidates: 45632,
        totalCandidatesGrowth: 12.5,
        activeCentres: 284,
        placementRate: 78.4,
        retentionRate6Months: 85.2,
        centreUtilisation: { current: 18456, total: 24800 },
        stateHeadSalary,
        mobManagerSalary,
        mobilisationTeamCost,
        transportationCost,
        candidatesPerMonth,
        mobilisationCostPerCandidate: Math.round(mobilisationCostPerCandidate),
      };
    }
  }
);

export const fetchTargetTracking = createAsyncThunk(
  'director/fetchTargetTracking',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/director/targets');
      if (!response.ok) throw new Error('Failed to fetch targets');
      return await response.json();
    } catch (error: any) {
      // Mock data fallback
      return {
        national: { target: 50000, achieved: 45632 },
        byProgram: [
          { programId: '1', name: 'Retail Management', target: 15000, achieved: 14230 },
          { programId: '2', name: 'Healthcare Assistant', target: 12000, achieved: 11890 },
          { programId: '3', name: 'Hospitality Services', target: 10000, achieved: 9280 },
          { programId: '4', name: 'IT Support', target: 8000, achieved: 7132 },
          { programId: '5', name: 'Manufacturing', target: 5000, achieved: 3100 },
        ],
        weeklyTrend: [
          { week: 'Week 1', achieved: 8500 },
          { week: 'Week 2', achieved: 9200 },
          { week: 'Week 3', achieved: 9800 },
          { week: 'Week 4', achieved: 10132 },
          { week: 'Week 5', achieved: 8000 },
        ],
      };
    }
  }
);

export const fetchStatePerformance = createAsyncThunk(
  'director/fetchStatePerformance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/director/states/performance');
      if (!response.ok) throw new Error('Failed to fetch state performance');
      return await response.json();
    } catch (error: any) {
      // Mock data fallback
      return [
        { stateId: '1', name: 'Maharashtra', score: 92, mobilisation: 95, training: 90, placement: 91 },
        { stateId: '2', name: 'Karnataka', score: 88, mobilisation: 90, training: 87, placement: 87 },
        { stateId: '3', name: 'Tamil Nadu', score: 85, mobilisation: 88, training: 84, placement: 83 },
        { stateId: '4', name: 'Gujarat', score: 82, mobilisation: 85, training: 80, placement: 81 },
        { stateId: '5', name: 'Rajasthan', score: 78, mobilisation: 82, training: 76, placement: 76 },
        { stateId: '6', name: 'Uttar Pradesh', score: 72, mobilisation: 75, training: 70, placement: 71 },
        { stateId: '7', name: 'Madhya Pradesh', score: 68, mobilisation: 70, training: 67, placement: 67 },
        { stateId: '8', name: 'West Bengal', score: 65, mobilisation: 68, training: 64, placement: 63 },
      ];
    }
  }
);

export const fetchCompliance = createAsyncThunk(
  'director/fetchCompliance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/director/compliance');
      if (!response.ok) throw new Error('Failed to fetch compliance');
      return await response.json();
    } catch (error: any) {
      // Mock data fallback
      return {
        centreComplianceRate: 87.5,
        statesOffTrack: [
          { stateId: '8', name: 'West Bengal', achievementRate: 65, status: 'critical' as const },
          { stateId: '7', name: 'Madhya Pradesh', achievementRate: 68, status: 'critical' as const },
          { stateId: '6', name: 'Uttar Pradesh', achievementRate: 72, status: 'warning' as const },
          { stateId: '5', name: 'Rajasthan', achievementRate: 78, status: 'warning' as const },
        ],
        upcomingBatches: [
          {
            id: '1',
            name: 'Healthcare Assistant Batch 45',
            state: 'Maharashtra',
            trainer: 'Dr. Priya Sharma',
            launchDate: '2025-12-05',
            remarks: 'Trainer pending final approval',
          },
          {
            id: '2',
            name: 'Retail Management Batch 32',
            state: 'Karnataka',
            trainer: 'Rajesh Kumar',
            launchDate: '2025-12-08',
            remarks: 'Venue confirmation pending',
          },
          {
            id: '3',
            name: 'IT Support Batch 18',
            state: 'Tamil Nadu',
            trainer: 'Anil Verma',
            launchDate: '2025-12-10',
            remarks: 'All set for launch',
          },
        ],
      };
    }
  }
);

export const fetchMobilisationData = createAsyncThunk(
  'director/fetchMobilisationData',
  async (filters: any, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/director/mobilisation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });
      if (!response.ok) throw new Error('Failed to fetch mobilisation data');
      return await response.json();
    } catch (error: any) {
      // Mock data fallback
      return {
        nationalTarget: 50000,
        achieved: 45632,
        achievementPercent: 91.3,
        conversionFunnel: {
          mobilisations: 52000,
          counselling: 48500,
          enrollments: 45632,
          trainingCompletion: 42150,
          placements: 35780,
          retention: 30480,
        },
        stateLeaderboard: [
          { stateId: '1', name: 'Maharashtra', target: 8000, achieved: 7580, percentAchieved: 94.75, rank: 1 },
          { stateId: '2', name: 'Karnataka', target: 6500, achieved: 6050, percentAchieved: 93.08, rank: 2 },
          { stateId: '3', name: 'Tamil Nadu', target: 6000, achieved: 5420, percentAchieved: 90.33, rank: 3 },
          { stateId: '4', name: 'Gujarat', target: 5500, achieved: 4920, percentAchieved: 89.45, rank: 4 },
          { stateId: '5', name: 'Rajasthan', target: 5000, achieved: 4180, percentAchieved: 83.60, rank: 5 },
          { stateId: '6', name: 'Uttar Pradesh', target: 7000, achieved: 5632, percentAchieved: 80.46, rank: 6 },
          { stateId: '7', name: 'Madhya Pradesh', target: 4500, achieved: 3420, percentAchieved: 76.00, rank: 7 },
          { stateId: '8', name: 'West Bengal', target: 4000, achieved: 2880, percentAchieved: 72.00, rank: 8 },
        ],
        clusterPerformance: [
          {
            clusterId: '1',
            name: 'Mumbai Metro',
            state: 'Maharashtra',
            districts: ['Mumbai', 'Thane', 'Navi Mumbai'],
            managers: 3,
            target: 2500,
            achieved: 2420,
            percentAchieved: 96.8,
            status: 'On Track' as const,
          },
          {
            clusterId: '2',
            name: 'Pune Region',
            state: 'Maharashtra',
            districts: ['Pune', 'Pimpri-Chinchwad'],
            managers: 2,
            target: 2000,
            achieved: 1890,
            percentAchieved: 94.5,
            status: 'On Track' as const,
          },
          {
            clusterId: '3',
            name: 'Bangalore Urban',
            state: 'Karnataka',
            districts: ['Bangalore Urban', 'Bangalore Rural'],
            managers: 2,
            target: 2200,
            achieved: 2080,
            percentAchieved: 94.5,
            status: 'On Track' as const,
          },
          {
            clusterId: '4',
            name: 'Chennai Metro',
            state: 'Tamil Nadu',
            districts: ['Chennai', 'Kanchipuram'],
            managers: 2,
            target: 1800,
            achieved: 1650,
            percentAchieved: 91.7,
            status: 'On Track' as const,
          },
          {
            clusterId: '5',
            name: 'Lucknow Region',
            state: 'Uttar Pradesh',
            districts: ['Lucknow', 'Unnao'],
            managers: 2,
            target: 1500,
            achieved: 1150,
            percentAchieved: 76.7,
            status: 'At Risk' as const,
          },
          {
            clusterId: '6',
            name: 'Kolkata Metro',
            state: 'West Bengal',
            districts: ['Kolkata', 'Howrah'],
            managers: 2,
            target: 1400,
            achieved: 980,
            percentAchieved: 70.0,
            status: 'Off Track' as const,
          },
        ],
        activities: {
          rozgaarMelaCount: 145,
          sabhaCount: 89,
          influencersRegistered: 2340,
          byState: [
            { state: 'Maharashtra', rozgaarMela: 28, rozgaarSabha: 18, influencers: 420 },
            { state: 'Karnataka', rozgaarMela: 22, rozgaarSabha: 15, influencers: 350 },
            { state: 'Tamil Nadu', rozgaarMela: 19, rozgaarSabha: 12, influencers: 310 },
            { state: 'Gujarat', rozgaarMela: 18, rozgaarSabha: 11, influencers: 290 },
            { state: 'Rajasthan', rozgaarMela: 15, rozgaarSabha: 9, influencers: 240 },
            { state: 'Uttar Pradesh', rozgaarMela: 23, rozgaarSabha: 14, influencers: 380 },
            { state: 'Madhya Pradesh', rozgaarMela: 12, rozgaarSabha: 6, influencers: 190 },
            { state: 'West Bengal', rozgaarMela: 8, rozgaarSabha: 4, influencers: 160 },
          ],
          recentActivities: [
            {
              id: '1',
              type: 'Rozgaar Mela',
              date: '2025-11-10T10:00:00Z',
              state: 'Maharashtra',
              district: 'Mumbai',
              block: 'Andheri',
              village: 'Andheri West',
              organizer: 'Rajesh Kumar',
              organizerRole: 'Mobiliser Manager',
              participantCount: 250,
              status: 'Completed',
              description: 'Large scale job fair with 15+ employers',
              images: ['https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400'],
              location: { address: 'Mumbai Central, Andheri West, Mumbai', coordinates: { lat: 19.1197, lng: 72.8464 } },
              candidatesMobilised: 180,
            },
            {
              id: '2',
              type: 'Rozgaar Sabha',
              date: '2025-11-12T14:00:00Z',
              state: 'Karnataka',
              district: 'Bangalore Urban',
              block: 'Whitefield',
              village: 'ITPL',
              organizer: 'Priya Sharma',
              organizerRole: 'Mobiliser',
              participantCount: 120,
              status: 'Completed',
              description: 'Community gathering for employment awareness',
              images: ['https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400'],
              location: { address: 'ITPL Main Road, Whitefield, Bangalore' },
              candidatesMobilised: 85,
            },
            {
              id: '3',
              type: 'Auto Mic-ing',
              date: '2025-11-13T09:00:00Z',
              state: 'Tamil Nadu',
              district: 'Chennai',
              block: 'T Nagar',
              village: 'Pondy Bazaar',
              organizer: 'Arun Vijay',
              organizerRole: 'Mobiliser',
              participantCount: 500,
              status: 'Completed',
              description: 'Mobile announcement campaign in busy market area',
              images: ['https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400'],
              location: { address: 'Pondy Bazaar, T Nagar, Chennai' },
              candidatesMobilised: 45,
            },
            {
              id: '4',
              type: 'Influencer Registration',
              date: '2025-11-11T11:00:00Z',
              state: 'Gujarat',
              district: 'Ahmedabad',
              block: 'Satellite',
              village: 'Jodhpur',
              organizer: 'Neha Patel',
              organizerRole: 'Mobiliser Manager',
              participantCount: 35,
              status: 'Completed',
              description: 'Influencer onboarding and training session',
              images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=400'],
              location: { address: 'Satellite Road, Ahmedabad' },
              influencersOnboarded: 35,
            },
            {
              id: '5',
              type: 'Rozgaar Mela',
              date: '2025-11-14T10:30:00Z',
              state: 'Uttar Pradesh',
              district: 'Lucknow',
              block: 'Gomti Nagar',
              village: 'Vibhuti Khand',
              organizer: 'Amit Singh',
              organizerRole: 'Mobiliser Manager',
              participantCount: 300,
              status: 'In Progress',
              description: 'Major employment fair with government participation',
              images: ['https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400'],
              location: { address: 'Vibhuti Khand, Gomti Nagar, Lucknow' },
              candidatesMobilised: 220,
            },
            {
              id: '6',
              type: 'Rozgaar Sabha',
              date: '2025-11-15T15:00:00Z',
              state: 'Rajasthan',
              district: 'Jaipur',
              block: 'Malviya Nagar',
              village: 'Jagatpura',
              organizer: 'Kavita Meena',
              organizerRole: 'Mobiliser',
              participantCount: 90,
              status: 'Scheduled',
              description: 'Employment awareness session for youth',
              images: [],
              location: { address: 'Jagatpura, Malviya Nagar, Jaipur' },
            },
          ],
        },
        candidatePipeline: {
          registered: 52000,
          ready: 48500,
          migrated: 45632,
          enrolled: 45632,
          placed: 35780,
          retained: 30480,
        },
        centreHealth: {
          capacityUtilisation: [
            { centreId: '1', name: 'Mumbai Central TC', capacity: 500, current: 485 },
            { centreId: '2', name: 'Pune Tech Centre', capacity: 400, current: 375 },
            { centreId: '3', name: 'Bangalore Hub', capacity: 450, current: 420 },
            { centreId: '4', name: 'Chennai Centre', capacity: 380, current: 340 },
            { centreId: '5', name: 'Lucknow TC', capacity: 320, current: 190 },
            { centreId: '6', name: 'Kolkata Centre', capacity: 350, current: 180 },
          ],
          leaveDropoutSummary: [
            { week: 'Week 1', leaves: 45, dropouts: 12 },
            { week: 'Week 2', leaves: 52, dropouts: 18 },
            { week: 'Week 3', leaves: 38, dropouts: 9 },
            { week: 'Week 4', leaves: 41, dropouts: 15 },
          ],
        },
      };
    }
  }
);

export const assignNationalTargets = createAsyncThunk(
  'director/assignTargets',
  async (targetData: any, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/director/targets/assign', {
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

// Director slice
const directorSlice = createSlice({
  name: 'director',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<DirectorState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch National KPIs
      .addCase(fetchNationalKPIs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNationalKPIs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nationalKPIs = action.payload;
      })
      .addCase(fetchNationalKPIs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Target Tracking
      .addCase(fetchTargetTracking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTargetTracking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.targetTracking = action.payload;
      })
      .addCase(fetchTargetTracking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch State Performance
      .addCase(fetchStatePerformance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStatePerformance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statePerformance = action.payload;
      })
      .addCase(fetchStatePerformance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Compliance
      .addCase(fetchCompliance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCompliance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.compliance = action.payload;
      })
      .addCase(fetchCompliance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Mobilisation Data
      .addCase(fetchMobilisationData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMobilisationData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mobilisationData = action.payload;
      })
      .addCase(fetchMobilisationData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Assign Targets
      .addCase(assignNationalTargets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignNationalTargets.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(assignNationalTargets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearError } = directorSlice.actions;
export default directorSlice.reducer;
