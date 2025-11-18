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

// New interfaces for Work Orders and Programs
interface Program {
  id: string;
  name: string;
  code: string;
  workOrderCount: number;
  activeWorkOrders: number;
  totalEnrolment: number;
  totalPlacement: number;
  totalBudget: number;
  profitMargin: number;
}

interface PaymentCycle {
  cycleNumber: number;
  amount: number;
  expectedDate: string;
  receivedDate?: string;
  status: 'Pending' | 'Received' | 'Delayed';
  percentage: number;
}

interface CategoryTarget {
  st: number;
  sc: number;
  obc: number;
  general: number;
  minority: number;
}

interface WorkOrder {
  id: string;
  workOrderNo: string;
  workOrderDate: string;
  programId: string;
  programName: string;
  businessHead: string;
  businessHeadId: string;
  cycle: number;
  
  // Targets
  enrolmentTarget: number;
  enrolmentStartDate: string;
  enrolmentDeadline: string;
  placementTarget: number;
  placementStartDate: string;
  placementDeadline: string;
  categoryTarget: CategoryTarget;
  
  // Locations
  districts: string[];
  
  // Manpower & Budget
  manpowerRequired: number;
  manpowerCurrent: number;
  fixedBudget: number;
  variableBudget: number;
  totalBudget: number;
  
  // Progress
  centreSetupDate?: string;
  mobilisationStartDate?: string;
  batchIncorporationDate?: string;
  districtsAssigned: number;
  districtsActive: number;
  enrolmentAchieved: number;
  placementAchieved: number;
  costIncurred: number;
  
  // Financial
  paymentCycles: PaymentCycle[];
  expectedProfit: number;
  tillDateProfit: number;
  grossProfit?: number;
  
  status: 'Planning' | 'Active' | 'Completed' | 'On Hold';
}

interface TargetAssignmentForm {
  programName: string;
  workOrderNo: string;
  businessHead: string;
  cycle: number;
  enrolmentTarget: number;
  enrolmentDateRange: [string, string];
  placementTarget: number;
  placementDateRange: [string, string];
  categoryTarget: CategoryTarget;
  districts: string[];
  manpower: number;
  fixedBudget: number;
  variableBudget: number;
}

interface OFREntry {
  id: string;
  candidateId: string;
  candidateName: string;
  fatherName: string;
  mobile: string;
  email: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  
  state: string;
  district: string;
  block: string;
  village: string;
  address: string;
  pincode: string;
  
  community: 'General' | 'OBC' | 'SC' | 'ST';
  religion: string;
  bloodGroup: string;
  motherTongue: string;
  maritalStatus: 'Single' | 'Married';
  education: string;
  
  mobiliserName: string;
  mobiliserRole: 'Mobiliser' | 'Mobiliser Manager';
  mobiliserId: string;
  
  registrationDate: string;
  registrationTime: string;
  status: 'Pending Verification' | 'Verified' | 'Rejected' | 'Ready for Migration' | 'Migrated';
  
  documents: {
    photo: string;
    aadhar: string;
    pan?: string;
    educationCertificate: string;
    casteCertificate?: string;
    incomeCertificate?: string;
  };
  
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  rejectionReason?: string;
}

interface OFRStatistics {
  totalEntries: number;
  pendingVerification: number;
  verified: number;
  rejected: number;
  readyForMigration: number;
  migrated: number;
  byState: Array<{
    state: string;
    total: number;
    pending: number;
    verified: number;
  }>;
  byMobiliser: Array<{
    name: string;
    role: string;
    total: number;
    verified: number;
  }>;
  recentEntries: number;
  conversionRate: number;
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
  ofrData: {
    entries: OFREntry[];
    statistics: OFRStatistics;
  } | null;
  
  // New fields for Work Orders & Programs
  programs: Program[];
  workOrders: WorkOrder[];
  selectedProgram: Program | null;
  
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
  ofrData: null,
  
  // Initialize new fields
  programs: [],
  workOrders: [],
  selectedProgram: null,
  
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
              id: 'ACT-001',
              type: 'Rozgaar Mela',
              date: '2024-11-10T10:00:00Z',
              state: 'Maharashtra',
              district: 'Mumbai',
              block: 'Andheri',
              village: 'Andheri West',
              organizer: 'Rajesh Kumar',
              organizerRole: 'Mobiliser Manager',
              participantCount: 250,
              status: 'Completed',
              description: 'Large scale job fair with 15+ employers including IT, Manufacturing, and Retail sectors. Special focus on digital skills training and placement assistance.',
              images: ['https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400'],
              location: { address: 'Mumbai Central, Andheri West, Mumbai', coordinates: { lat: 19.1197, lng: 72.8464 } },
              candidatesMobilised: 180,
            },
            {
              id: 'ACT-002',
              type: 'Rozgaar Sabha',
              date: '2024-11-12T14:00:00Z',
              state: 'Karnataka',
              district: 'Bangalore Urban',
              block: 'Whitefield',
              village: 'ITPL',
              organizer: 'Priya Sharma',
              organizerRole: 'Mobiliser',
              participantCount: 120,
              status: 'Completed',
              description: 'Community gathering for employment awareness with focus on tech careers. Local youth leaders participated to spread awareness about skill development programs.',
              images: ['https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400'],
              location: { address: 'ITPL Main Road, Whitefield, Bangalore' },
              candidatesMobilised: 85,
            },
            {
              id: 'ACT-003',
              type: 'Auto Mic-ing',
              date: '2024-11-13T09:00:00Z',
              state: 'Tamil Nadu',
              district: 'Chennai',
              block: 'T Nagar',
              village: 'Pondy Bazaar',
              organizer: 'Arun Vijay',
              organizerRole: 'Mobiliser',
              participantCount: 500,
              status: 'Completed',
              description: 'Mobile announcement campaign in busy market area covering 5 major locations. Distributed 1000+ pamphlets about upcoming training programs and job opportunities.',
              images: ['https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400'],
              location: { address: 'Pondy Bazaar, T Nagar, Chennai' },
              candidatesMobilised: 45,
            },
            {
              id: 'ACT-004',
              type: 'Influencer Registration',
              date: '2024-11-11T11:00:00Z',
              state: 'Gujarat',
              district: 'Ahmedabad',
              block: 'Satellite',
              village: 'Jodhpur',
              organizer: 'Neha Patel',
              organizerRole: 'Mobiliser Manager',
              participantCount: 35,
              status: 'Completed',
              description: 'Influencer onboarding and training session. Trained community leaders on program benefits, registration process, and mobilization strategies.',
              images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=400', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400'],
              location: { address: 'Satellite Road, Ahmedabad' },
              influencersOnboarded: 35,
            },
            {
              id: 'ACT-005',
              type: 'Rozgaar Mela',
              date: '2024-11-14T10:30:00Z',
              state: 'Uttar Pradesh',
              district: 'Lucknow',
              block: 'Gomti Nagar',
              village: 'Vibhuti Khand',
              organizer: 'Amit Singh',
              organizerRole: 'Mobiliser Manager',
              participantCount: 300,
              status: 'In Progress',
              description: 'Major employment fair with government participation. District Collector inaugurated the event. 20+ employers from manufacturing and service sectors participating.',
              images: ['https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400'],
              location: { address: 'Vibhuti Khand, Gomti Nagar, Lucknow' },
              candidatesMobilised: 220,
            },
            {
              id: 'ACT-006',
              type: 'Rozgaar Sabha',
              date: '2024-11-15T15:00:00Z',
              state: 'Rajasthan',
              district: 'Jaipur',
              block: 'Malviya Nagar',
              village: 'Jagatpura',
              organizer: 'Kavita Meena',
              organizerRole: 'Mobiliser',
              participantCount: 90,
              status: 'Scheduled',
              description: 'Employment awareness session for youth focusing on traditional crafts and modern skill development. Partnership with local artisan groups.',
              images: [],
              location: { address: 'Jagatpura, Malviya Nagar, Jaipur' },
            },
            {
              id: 'ACT-007',
              type: 'Rozgaar Mela',
              date: '2024-11-08T09:00:00Z',
              state: 'Maharashtra',
              district: 'Pune',
              block: 'Hinjewadi',
              village: 'Phase 1',
              organizer: 'Suresh Patil',
              organizerRole: 'Mobiliser Manager',
              participantCount: 280,
              status: 'Completed',
              description: 'IT sector focused job fair in collaboration with 12 tech companies. On-spot interviews conducted for suitable candidates with pre-screening.',
              images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400'],
              location: { address: 'Hinjewadi Phase 1, Pune', coordinates: { lat: 18.5912, lng: 73.7394 } },
              candidatesMobilised: 195,
            },
            {
              id: 'ACT-008',
              type: 'Auto Mic-ing',
              date: '2024-11-09T08:30:00Z',
              state: 'Karnataka',
              district: 'Mysuru',
              block: 'Chamundi Hill',
              village: 'Yadavagiri',
              organizer: 'Lakshmi Devi',
              organizerRole: 'Mobiliser',
              participantCount: 350,
              status: 'Completed',
              description: 'Morning announcement drive covering residential areas. Focused on reaching out to women candidates for hospitality and retail sector training programs.',
              images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'],
              location: { address: 'Yadavagiri, Mysuru' },
              candidatesMobilised: 38,
            },
            {
              id: 'ACT-009',
              type: 'Influencer Registration',
              date: '2024-11-07T16:00:00Z',
              state: 'Tamil Nadu',
              district: 'Coimbatore',
              block: 'RS Puram',
              village: 'Race Course',
              organizer: 'Ganesh Kumar',
              organizerRole: 'Mobiliser',
              participantCount: 28,
              status: 'Completed',
              description: 'Trained local influencers including school teachers, retired govt employees, and social workers. Provided detailed materials and digital tools for mobilization.',
              images: ['https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400'],
              location: { address: 'Race Course, RS Puram, Coimbatore' },
              influencersOnboarded: 28,
            },
            {
              id: 'ACT-010',
              type: 'Rozgaar Sabha',
              date: '2024-11-06T14:30:00Z',
              state: 'Gujarat',
              district: 'Surat',
              block: 'Varachha',
              village: 'Varachha Main Road',
              organizer: 'Jignesh Shah',
              organizerRole: 'Mobiliser Manager',
              participantCount: 145,
              status: 'Completed',
              description: 'Community meeting focused on textile and diamond industry opportunities. Industry experts shared insights about career growth in traditional sectors.',
              images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=400', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400'],
              location: { address: 'Varachha Main Road, Surat' },
              candidatesMobilised: 98,
            },
            {
              id: 'ACT-011',
              type: 'Rozgaar Mela',
              date: '2024-11-05T11:00:00Z',
              state: 'Uttar Pradesh',
              district: 'Noida',
              block: 'Sector 62',
              village: 'Electronic City',
              organizer: 'Ravi Verma',
              organizerRole: 'Mobiliser Manager',
              participantCount: 320,
              status: 'Completed',
              description: 'Electronics and manufacturing sector mega job fair. 25+ companies participated with immediate placement offers for skilled candidates.',
              images: ['https://images.unsplash.com/photo-1511578314322-379afb476865?w=400', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400'],
              location: { address: 'Electronic City, Sector 62, Noida', coordinates: { lat: 28.6251, lng: 77.3566 } },
              candidatesMobilised: 245,
            },
            {
              id: 'ACT-012',
              type: 'Auto Mic-ing',
              date: '2024-11-04T07:00:00Z',
              state: 'Rajasthan',
              district: 'Udaipur',
              block: 'City Palace',
              village: 'Old City',
              organizer: 'Meera Rathore',
              organizerRole: 'Mobiliser',
              participantCount: 420,
              status: 'Completed',
              description: 'Early morning awareness drive in tourist areas and local markets. Emphasized tourism and hospitality sector opportunities.',
              images: ['https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400'],
              location: { address: 'Old City, Udaipur' },
              candidatesMobilised: 52,
            },
            {
              id: 'ACT-013',
              type: 'Influencer Registration',
              date: '2024-11-03T13:00:00Z',
              state: 'Maharashtra',
              district: 'Nagpur',
              block: 'Sitabuldi',
              village: 'Central Avenue',
              organizer: 'Ashok Deshmukh',
              organizerRole: 'Mobiliser',
              participantCount: 42,
              status: 'Completed',
              description: 'Comprehensive training session for community influencers. Covered digital outreach strategies and grassroots mobilization techniques.',
              images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=400'],
              location: { address: 'Central Avenue, Sitabuldi, Nagpur' },
              influencersOnboarded: 42,
            },
            {
              id: 'ACT-014',
              type: 'Rozgaar Sabha',
              date: '2024-11-02T10:00:00Z',
              state: 'Karnataka',
              district: 'Hubli',
              block: 'Vidyanagar',
              village: 'College Area',
              organizer: 'Santosh Gowda',
              organizerRole: 'Mobiliser',
              participantCount: 110,
              status: 'Completed',
              description: 'Youth awareness program conducted at community center. Focused on emerging opportunities in renewable energy and logistics sectors.',
              images: ['https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400'],
              location: { address: 'College Area, Vidyanagar, Hubli' },
              candidatesMobilised: 76,
            },
            {
              id: 'ACT-015',
              type: 'Rozgaar Mela',
              date: '2024-11-01T09:30:00Z',
              state: 'Tamil Nadu',
              district: 'Madurai',
              block: 'Anna Nagar',
              village: 'West Extension',
              organizer: 'Selvi Murugan',
              organizerRole: 'Mobiliser Manager',
              participantCount: 195,
              status: 'Completed',
              description: 'Regional employment fair with focus on healthcare and education sectors. 18 organizations conducted preliminary interviews.',
              images: ['https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400'],
              location: { address: 'West Extension, Anna Nagar, Madurai', coordinates: { lat: 9.9252, lng: 78.1198 } },
              candidatesMobilised: 142,
            },
            {
              id: 'ACT-016',
              type: 'Auto Mic-ing',
              date: '2024-10-31T08:00:00Z',
              state: 'Gujarat',
              district: 'Vadodara',
              block: 'Alkapuri',
              village: 'RC Dutt Road',
              organizer: 'Kiran Prajapati',
              organizerRole: 'Mobiliser',
              participantCount: 380,
              status: 'Completed',
              description: 'Comprehensive announcement campaign covering commercial and residential zones. Highlighted petrochemical industry opportunities.',
              images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'],
              location: { address: 'RC Dutt Road, Alkapuri, Vadodara' },
              candidatesMobilised: 41,
            },
            {
              id: 'ACT-017',
              type: 'Rozgaar Sabha',
              date: '2024-10-30T15:30:00Z',
              state: 'Uttar Pradesh',
              district: 'Kanpur',
              block: 'Civil Lines',
              village: 'Mall Road',
              organizer: 'Deepak Tiwari',
              organizerRole: 'Mobiliser',
              participantCount: 135,
              status: 'Completed',
              description: 'Employment awareness session targeting leather and textile industry workers. Discussed skill upgradation and certification programs.',
              images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=400'],
              location: { address: 'Mall Road, Civil Lines, Kanpur' },
              candidatesMobilised: 92,
            },
            {
              id: 'ACT-018',
              type: 'Influencer Registration',
              date: '2024-10-29T12:00:00Z',
              state: 'Rajasthan',
              district: 'Jodhpur',
              block: 'Ratanada',
              village: 'Chopasni Road',
              organizer: 'Sunita Rajput',
              organizerRole: 'Mobiliser Manager',
              participantCount: 31,
              status: 'Completed',
              description: 'Influencer training program with special focus on reaching rural youth. Trained on using WhatsApp and social media for program awareness.',
              images: ['https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400'],
              location: { address: 'Chopasni Road, Ratanada, Jodhpur' },
              influencersOnboarded: 31,
            },
            {
              id: 'ACT-019',
              type: 'Rozgaar Mela',
              date: '2024-10-28T10:00:00Z',
              state: 'Maharashtra',
              district: 'Thane',
              block: 'Ghodbunder',
              village: 'Manpada',
              organizer: 'Vijay Pawar',
              organizerRole: 'Mobiliser Manager',
              participantCount: 265,
              status: 'Completed',
              description: 'Large scale job fair focusing on construction, real estate, and facility management sectors. 22 employers participated.',
              images: ['https://images.unsplash.com/photo-1511578314322-379afb476865?w=400', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400'],
              location: { address: 'Manpada, Ghodbunder, Thane', coordinates: { lat: 19.2403, lng: 72.9850 } },
              candidatesMobilised: 188,
            },
            {
              id: 'ACT-020',
              type: 'Auto Mic-ing',
              date: '2024-10-27T09:00:00Z',
              state: 'Karnataka',
              district: 'Mangalore',
              block: 'Hampankatta',
              village: 'Market Area',
              organizer: 'Prakash Shetty',
              organizerRole: 'Mobiliser',
              participantCount: 460,
              status: 'Completed',
              description: 'Morning announcement drive in busy market district. Emphasized banking, finance, and port logistics job opportunities.',
              images: ['https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400'],
              location: { address: 'Market Area, Hampankatta, Mangalore' },
              candidatesMobilised: 48,
            },
            {
              id: 'ACT-021',
              type: 'Rozgaar Sabha',
              date: '2024-10-26T14:00:00Z',
              state: 'Tamil Nadu',
              district: 'Trichy',
              block: 'Thillai Nagar',
              village: 'BHELtownship',
              organizer: 'Karthik Raman',
              organizerRole: 'Mobiliser',
              participantCount: 102,
              status: 'Completed',
              description: 'Community gathering focused on heavy engineering and manufacturing sector careers. BHEL officials shared insights about skill requirements.',
              images: ['https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400'],
              location: { address: 'BHEL Township, Thillai Nagar, Trichy' },
              candidatesMobilised: 71,
            },
            {
              id: 'ACT-022',
              type: 'Rozgaar Mela',
              date: '2024-10-25T11:00:00Z',
              state: 'Gujarat',
              district: 'Rajkot',
              block: 'University Road',
              village: 'Kalawad Road',
              organizer: 'Hardik Doshi',
              organizerRole: 'Mobiliser Manager',
              participantCount: 215,
              status: 'Completed',
              description: 'Auto components and engineering sector job fair. 16 manufacturing companies participated with immediate hiring requirements.',
              images: ['https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400'],
              location: { address: 'Kalawad Road, Rajkot', coordinates: { lat: 22.3039, lng: 70.8022 } },
              candidatesMobilised: 156,
            },
            {
              id: 'ACT-023',
              type: 'Influencer Registration',
              date: '2024-10-24T16:30:00Z',
              state: 'Uttar Pradesh',
              district: 'Agra',
              block: 'Tajganj',
              village: 'Fatehabad Road',
              organizer: 'Pooja Agarwal',
              organizerRole: 'Mobiliser',
              participantCount: 38,
              status: 'Completed',
              description: 'Training session for community leaders focusing on tourism and handicraft sector mobilization strategies.',
              images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=400'],
              location: { address: 'Fatehabad Road, Tajganj, Agra' },
              influencersOnboarded: 38,
            },
            {
              id: 'ACT-024',
              type: 'Auto Mic-ing',
              date: '2024-10-23T07:30:00Z',
              state: 'Rajasthan',
              district: 'Kota',
              block: 'Dadabari',
              village: 'Gumanpura',
              organizer: 'Rohit Sharma',
              organizerRole: 'Mobiliser',
              participantCount: 395,
              status: 'Completed',
              description: 'Early morning campaign targeting student community and coaching areas. Highlighted opportunities in education technology sector.',
              images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'],
              location: { address: 'Gumanpura, Dadabari, Kota' },
              candidatesMobilised: 44,
            },
            {
              id: 'ACT-025',
              type: 'Rozgaar Sabha',
              date: '2024-11-16T10:00:00Z',
              state: 'Maharashtra',
              district: 'Aurangabad',
              block: 'Cidco',
              village: 'Nirala Bazaar',
              organizer: 'Sanjay Deshmukh',
              organizerRole: 'Mobiliser Manager',
              participantCount: 125,
              status: 'Scheduled',
              description: 'Upcoming employment awareness program focusing on pharmaceutical and manufacturing sectors. Expected participation from local industry leaders.',
              images: [],
              location: { address: 'Nirala Bazaar, Cidco, Aurangabad' },
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

export const fetchOFRData = createAsyncThunk(
  'director/fetchOFRData',
  async (filters: {
    dateRange?: [Date | null, Date | null];
    state?: string;
    district?: string;
    block?: string;
    village?: string;
    status?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/director/ofr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });
      if (!response.ok) throw new Error('Failed to fetch OFR data');
      return await response.json();
    } catch (error: any) {
      // Mock data fallback
      const states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Uttar Pradesh'];
      const districts = ['Mumbai', 'Bangalore', 'Chennai', 'Ahmedabad', 'Jaipur', 'Lucknow'];
      const blocks = ['Block A', 'Block B', 'Block C', 'Block D'];
      const villages = ['Village 1', 'Village 2', 'Village 3', 'Village 4', 'Village 5'];
      const statuses: OFREntry['status'][] = ['Pending Verification', 'Verified', 'Rejected', 'Ready for Migration', 'Migrated'];
      const communities: OFREntry['community'][] = ['General', 'OBC', 'SC', 'ST'];
      const educations = ['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'ITI', 'Diploma'];
      
      const entries: OFREntry[] = Array.from({ length: 250 }, (_, i) => {
        const state = states[Math.floor(Math.random() * states.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const registrationDate = new Date(2024, 10, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0];
        
        return {
          id: `OFR-${String(i + 1).padStart(6, '0')}`,
          candidateId: `CND-${String(i + 1).padStart(6, '0')}`,
          candidateName: `Candidate ${i + 1}`,
          fatherName: `Father ${i + 1}`,
          mobile: `98${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
          email: `candidate${i + 1}@email.com`,
          dateOfBirth: `${1995 + Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          state,
          district: districts[Math.floor(Math.random() * districts.length)],
          block: blocks[Math.floor(Math.random() * blocks.length)],
          village: villages[Math.floor(Math.random() * villages.length)],
          address: `Address line ${i + 1}, Locality ${i + 1}`,
          pincode: String(400000 + Math.floor(Math.random() * 100000)),
          community: communities[Math.floor(Math.random() * communities.length)],
          religion: Math.random() > 0.5 ? 'Hindu' : Math.random() > 0.5 ? 'Muslim' : 'Christian',
          bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'][Math.floor(Math.random() * 8)],
          motherTongue: ['Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Gujarati'][Math.floor(Math.random() * 6)],
          maritalStatus: Math.random() > 0.7 ? 'Married' : 'Single',
          education: educations[Math.floor(Math.random() * educations.length)],
          mobiliserName: `Mobiliser ${Math.floor(Math.random() * 50) + 1}`,
          mobiliserRole: Math.random() > 0.7 ? 'Mobiliser Manager' : 'Mobiliser',
          mobiliserId: `MOB-${String(Math.floor(Math.random() * 500) + 1).padStart(4, '0')}`,
          registrationDate,
          registrationTime: `${Math.floor(Math.random() * 12) + 8}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
          status,
          documents: {
            photo: '/api/placeholder/200/200',
            aadhar: '/api/placeholder/400/300',
            educationCertificate: '/api/placeholder/400/300',
            pan: Math.random() > 0.5 ? '/api/placeholder/400/300' : undefined,
            casteCertificate: Math.random() > 0.7 ? '/api/placeholder/400/300' : undefined,
            incomeCertificate: Math.random() > 0.8 ? '/api/placeholder/400/300' : undefined,
          },
          verificationNotes: status === 'Verified' ? 'All documents verified' : undefined,
          verifiedBy: status === 'Verified' ? `Verifier ${Math.floor(Math.random() * 10) + 1}` : undefined,
          verifiedDate: status === 'Verified' ? new Date(2024, 10, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0] : undefined,
          rejectionReason: status === 'Rejected' ? 'Incomplete documents' : undefined,
        };
      });
      
      // Apply filters
      let filteredEntries = entries;
      if (filters.state && filters.state !== 'all') {
        filteredEntries = filteredEntries.filter(e => e.state === filters.state);
      }
      if (filters.district && filters.district !== 'all') {
        filteredEntries = filteredEntries.filter(e => e.district === filters.district);
      }
      if (filters.block && filters.block !== 'all') {
        filteredEntries = filteredEntries.filter(e => e.block === filters.block);
      }
      if (filters.status && filters.status !== 'all') {
        filteredEntries = filteredEntries.filter(e => e.status === filters.status);
      }
      
      const statistics: OFRStatistics = {
        totalEntries: filteredEntries.length,
        pendingVerification: filteredEntries.filter(e => e.status === 'Pending Verification').length,
        verified: filteredEntries.filter(e => e.status === 'Verified').length,
        rejected: filteredEntries.filter(e => e.status === 'Rejected').length,
        readyForMigration: filteredEntries.filter(e => e.status === 'Ready for Migration').length,
        migrated: filteredEntries.filter(e => e.status === 'Migrated').length,
        byState: states.map(state => ({
          state,
          total: entries.filter(e => e.state === state).length,
          pending: entries.filter(e => e.state === state && e.status === 'Pending Verification').length,
          verified: entries.filter(e => e.state === state && e.status === 'Verified').length,
        })),
        byMobiliser: Array.from({ length: 10 }, (_, i) => ({
          name: `Mobiliser ${i + 1}`,
          role: Math.random() > 0.7 ? 'Mobiliser Manager' : 'Mobiliser',
          total: Math.floor(Math.random() * 50) + 10,
          verified: Math.floor(Math.random() * 30) + 5,
        })),
        recentEntries: filteredEntries.filter(e => {
          const entryDate = new Date(e.registrationDate);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return entryDate >= weekAgo;
        }).length,
        conversionRate: Math.floor(Math.random() * 30) + 50,
      };
      
      return {
        entries: filteredEntries,
        statistics,
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

// Mock data generators (moved before thunks for reference)
const generateMockPrograms = (): Program[] => [
  {
    id: 'ddugky',
    name: 'DDUGKY',
    code: 'DDUGKY',
    workOrderCount: 5,
    activeWorkOrders: 3,
    totalEnrolment: 2500,
    totalPlacement: 1890,
    totalBudget: 12500000,
    profitMargin: 18.5
  },
  {
    id: 'upsdm',
    name: 'UPSDM',
    code: 'UPSDM',
    workOrderCount: 2,
    activeWorkOrders: 2,
    totalEnrolment: 800,
    totalPlacement: 620,
    totalBudget: 4800000,
    profitMargin: 15.2
  },
  {
    id: 'jsdms',
    name: 'JSDMS',
    code: 'JSDMS',
    workOrderCount: 2,
    activeWorkOrders: 1,
    totalEnrolment: 600,
    totalPlacement: 480,
    totalBudget: 3600000,
    profitMargin: 16.8
  },
  {
    id: 'osda',
    name: 'OSDA',
    code: 'OSDA',
    workOrderCount: 2,
    activeWorkOrders: 2,
    totalEnrolment: 750,
    totalPlacement: 590,
    totalBudget: 4200000,
    profitMargin: 17.3
  },
  {
    id: 'wdc',
    name: 'WDC',
    code: 'WDC',
    workOrderCount: 2,
    activeWorkOrders: 1,
    totalEnrolment: 500,
    totalPlacement: 380,
    totalBudget: 3000000,
    profitMargin: 14.5
  }
];

const generateMockWorkOrders = (): WorkOrder[] => [
  // DDUGKY Work Orders (5)
  {
    id: 'wo-001',
    workOrderNo: 'DDUGKY/2024/001',
    workOrderDate: '2024-01-15',
    programId: 'ddugky',
    programName: 'DDUGKY',
    businessHead: 'Rajesh Kumar',
    businessHeadId: 'bh-001',
    cycle: 1,
    enrolmentTarget: 500,
    enrolmentStartDate: '2024-02-01',
    enrolmentDeadline: '2024-05-31',
    placementTarget: 400,
    placementStartDate: '2024-06-01',
    placementDeadline: '2024-08-31',
    categoryTarget: { st: 50, sc: 100, obc: 150, general: 150, minority: 50 },
    districts: ['Mumbai', 'Pune', 'Nagpur'],
    manpowerRequired: 15,
    manpowerCurrent: 12,
    fixedBudget: 2000000,
    variableBudget: 500000,
    totalBudget: 2500000,
    centreSetupDate: '2024-01-25',
    mobilisationStartDate: '2024-02-01',
    batchIncorporationDate: '2024-03-15',
    districtsAssigned: 3,
    districtsActive: 3,
    enrolmentAchieved: 420,
    placementAchieved: 320,
    costIncurred: 1850000,
    paymentCycles: [
      { cycleNumber: 1, amount: 625000, expectedDate: '2024-03-31', receivedDate: '2024-04-05', status: 'Received', percentage: 25 },
      { cycleNumber: 2, amount: 625000, expectedDate: '2024-06-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 625000, expectedDate: '2024-09-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 625000, expectedDate: '2024-12-31', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 462500,
    tillDateProfit: 105000,
    status: 'Active'
  },
  {
    id: 'wo-002',
    workOrderNo: 'DDUGKY/2024/002',
    workOrderDate: '2024-03-10',
    programId: 'ddugky',
    programName: 'DDUGKY',
    businessHead: 'Rajesh Kumar',
    businessHeadId: 'bh-001',
    cycle: 2,
    enrolmentTarget: 600,
    enrolmentStartDate: '2024-04-01',
    enrolmentDeadline: '2024-07-31',
    placementTarget: 480,
    placementStartDate: '2024-08-01',
    placementDeadline: '2024-10-31',
    categoryTarget: { st: 60, sc: 120, obc: 180, general: 180, minority: 60 },
    districts: ['Thane', 'Nashik', 'Aurangabad'],
    manpowerRequired: 18,
    manpowerCurrent: 15,
    fixedBudget: 2400000,
    variableBudget: 600000,
    totalBudget: 3000000,
    centreSetupDate: '2024-03-20',
    mobilisationStartDate: '2024-04-01',
    batchIncorporationDate: '2024-05-10',
    districtsAssigned: 3,
    districtsActive: 2,
    enrolmentAchieved: 380,
    placementAchieved: 180,
    costIncurred: 1600000,
    paymentCycles: [
      { cycleNumber: 1, amount: 750000, expectedDate: '2024-05-31', receivedDate: '2024-06-02', status: 'Received', percentage: 25 },
      { cycleNumber: 2, amount: 750000, expectedDate: '2024-08-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 750000, expectedDate: '2024-11-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 750000, expectedDate: '2025-02-28', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 555000,
    tillDateProfit: 85000,
    status: 'Active'
  },
  {
    id: 'wo-003',
    workOrderNo: 'DDUGKY/2023/003',
    workOrderDate: '2023-09-15',
    programId: 'ddugky',
    programName: 'DDUGKY',
    businessHead: 'Rajesh Kumar',
    businessHeadId: 'bh-001',
    cycle: 1,
    enrolmentTarget: 400,
    enrolmentStartDate: '2023-10-01',
    enrolmentDeadline: '2024-01-31',
    placementTarget: 320,
    placementStartDate: '2024-02-01',
    placementDeadline: '2024-04-30',
    categoryTarget: { st: 40, sc: 80, obc: 120, general: 120, minority: 40 },
    districts: ['Solapur', 'Kolhapur'],
    manpowerRequired: 12,
    manpowerCurrent: 12,
    fixedBudget: 1600000,
    variableBudget: 400000,
    totalBudget: 2000000,
    centreSetupDate: '2023-09-25',
    mobilisationStartDate: '2023-10-01',
    batchIncorporationDate: '2023-11-20',
    districtsAssigned: 2,
    districtsActive: 2,
    enrolmentAchieved: 400,
    placementAchieved: 320,
    costIncurred: 1780000,
    paymentCycles: [
      { cycleNumber: 1, amount: 500000, expectedDate: '2023-12-31', receivedDate: '2024-01-05', status: 'Received', percentage: 25 },
      { cycleNumber: 2, amount: 500000, expectedDate: '2024-03-31', receivedDate: '2024-04-02', status: 'Received', percentage: 25 },
      { cycleNumber: 3, amount: 500000, expectedDate: '2024-06-30', receivedDate: '2024-07-01', status: 'Received', percentage: 25 },
      { cycleNumber: 4, amount: 500000, expectedDate: '2024-09-30', receivedDate: '2024-10-01', status: 'Received', percentage: 25 }
    ],
    expectedProfit: 370000,
    tillDateProfit: 370000,
    grossProfit: 220000,
    status: 'Completed'
  },
  {
    id: 'wo-004',
    workOrderNo: 'DDUGKY/2024/004',
    workOrderDate: '2024-05-20',
    programId: 'ddugky',
    programName: 'DDUGKY',
    businessHead: 'Priya Sharma',
    businessHeadId: 'bh-002',
    cycle: 1,
    enrolmentTarget: 550,
    enrolmentStartDate: '2024-06-15',
    enrolmentDeadline: '2024-09-30',
    placementTarget: 440,
    placementStartDate: '2024-10-01',
    placementDeadline: '2024-12-31',
    categoryTarget: { st: 55, sc: 110, obc: 165, general: 165, minority: 55 },
    districts: ['Ratnagiri', 'Sindhudurg', 'Raigad'],
    manpowerRequired: 16,
    manpowerCurrent: 10,
    fixedBudget: 2200000,
    variableBudget: 550000,
    totalBudget: 2750000,
    centreSetupDate: '2024-06-01',
    mobilisationStartDate: '2024-06-15',
    batchIncorporationDate: '2024-07-25',
    districtsAssigned: 3,
    districtsActive: 1,
    enrolmentAchieved: 280,
    placementAchieved: 0,
    costIncurred: 950000,
    paymentCycles: [
      { cycleNumber: 1, amount: 687500, expectedDate: '2024-08-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 2, amount: 687500, expectedDate: '2024-11-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 687500, expectedDate: '2025-02-28', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 687500, expectedDate: '2025-05-31', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 508750,
    tillDateProfit: 0,
    status: 'Active'
  },
  {
    id: 'wo-005',
    workOrderNo: 'DDUGKY/2024/005',
    workOrderDate: '2024-07-10',
    programId: 'ddugky',
    programName: 'DDUGKY',
    businessHead: 'Priya Sharma',
    businessHeadId: 'bh-002',
    cycle: 1,
    enrolmentTarget: 300,
    enrolmentStartDate: '2024-08-01',
    enrolmentDeadline: '2024-11-30',
    placementTarget: 240,
    placementStartDate: '2024-12-01',
    placementDeadline: '2025-02-28',
    categoryTarget: { st: 30, sc: 60, obc: 90, general: 90, minority: 30 },
    districts: ['Ahmednagar', 'Beed'],
    manpowerRequired: 10,
    manpowerCurrent: 5,
    fixedBudget: 1200000,
    variableBudget: 300000,
    totalBudget: 1500000,
    centreSetupDate: '2024-07-20',
    mobilisationStartDate: '2024-08-01',
    districtsAssigned: 2,
    districtsActive: 0,
    enrolmentAchieved: 0,
    placementAchieved: 0,
    costIncurred: 150000,
    paymentCycles: [
      { cycleNumber: 1, amount: 375000, expectedDate: '2024-10-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 2, amount: 375000, expectedDate: '2025-01-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 375000, expectedDate: '2025-04-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 375000, expectedDate: '2025-07-31', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 277500,
    tillDateProfit: 0,
    status: 'Planning'
  },

  // UPSDM Work Orders (5)
  {
    id: 'wo-006',
    workOrderNo: 'UPSDM/2024/001',
    workOrderDate: '2024-02-01',
    programId: 'upsdm',
    programName: 'UPSDM',
    businessHead: 'Amit Verma',
    businessHeadId: 'bh-003',
    cycle: 1,
    enrolmentTarget: 400,
    enrolmentStartDate: '2024-03-01',
    enrolmentDeadline: '2024-06-30',
    placementTarget: 320,
    placementStartDate: '2024-07-01',
    placementDeadline: '2024-09-30',
    categoryTarget: { st: 40, sc: 80, obc: 120, general: 120, minority: 40 },
    districts: ['Lucknow', 'Kanpur', 'Agra'],
    manpowerRequired: 14,
    manpowerCurrent: 14,
    fixedBudget: 1800000,
    variableBudget: 450000,
    totalBudget: 2250000,
    centreSetupDate: '2024-02-15',
    mobilisationStartDate: '2024-03-01',
    batchIncorporationDate: '2024-04-10',
    districtsAssigned: 3,
    districtsActive: 3,
    enrolmentAchieved: 385,
    placementAchieved: 290,
    costIncurred: 1680000,
    paymentCycles: [
      { cycleNumber: 1, amount: 562500, expectedDate: '2024-04-30', receivedDate: '2024-05-03', status: 'Received', percentage: 25 },
      { cycleNumber: 2, amount: 562500, expectedDate: '2024-07-31', receivedDate: '2024-08-01', status: 'Received', percentage: 25 },
      { cycleNumber: 3, amount: 562500, expectedDate: '2024-10-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 562500, expectedDate: '2025-01-31', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 416250,
    tillDateProfit: 195000,
    status: 'Active'
  },
  {
    id: 'wo-007',
    workOrderNo: 'UPSDM/2024/002',
    workOrderDate: '2024-04-15',
    programId: 'upsdm',
    programName: 'UPSDM',
    businessHead: 'Amit Verma',
    businessHeadId: 'bh-003',
    cycle: 2,
    enrolmentTarget: 350,
    enrolmentStartDate: '2024-05-15',
    enrolmentDeadline: '2024-08-31',
    placementTarget: 280,
    placementStartDate: '2024-09-01',
    placementDeadline: '2024-11-30',
    categoryTarget: { st: 35, sc: 70, obc: 105, general: 105, minority: 35 },
    districts: ['Varanasi', 'Prayagraj'],
    manpowerRequired: 12,
    manpowerCurrent: 10,
    fixedBudget: 1600000,
    variableBudget: 400000,
    totalBudget: 2000000,
    centreSetupDate: '2024-05-01',
    mobilisationStartDate: '2024-05-15',
    batchIncorporationDate: '2024-06-20',
    districtsAssigned: 2,
    districtsActive: 2,
    enrolmentAchieved: 310,
    placementAchieved: 120,
    costIncurred: 1200000,
    paymentCycles: [
      { cycleNumber: 1, amount: 500000, expectedDate: '2024-07-31', receivedDate: '2024-08-03', status: 'Received', percentage: 25 },
      { cycleNumber: 2, amount: 500000, expectedDate: '2024-10-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 500000, expectedDate: '2025-01-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 500000, expectedDate: '2025-04-30', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 370000,
    tillDateProfit: 75000,
    status: 'Active'
  },
  {
    id: 'wo-008',
    workOrderNo: 'UPSDM/2024/003',
    workOrderDate: '2024-06-01',
    programId: 'upsdm',
    programName: 'UPSDM',
    businessHead: 'Neha Singh',
    businessHeadId: 'bh-004',
    cycle: 1,
    enrolmentTarget: 300,
    enrolmentStartDate: '2024-07-01',
    enrolmentDeadline: '2024-10-31',
    placementTarget: 240,
    placementStartDate: '2024-11-01',
    placementDeadline: '2025-01-31',
    categoryTarget: { st: 30, sc: 60, obc: 90, general: 90, minority: 30 },
    districts: ['Meerut', 'Ghaziabad'],
    manpowerRequired: 10,
    manpowerCurrent: 8,
    fixedBudget: 1400000,
    variableBudget: 350000,
    totalBudget: 1750000,
    centreSetupDate: '2024-06-15',
    mobilisationStartDate: '2024-07-01',
    batchIncorporationDate: '2024-08-05',
    districtsAssigned: 2,
    districtsActive: 1,
    enrolmentAchieved: 180,
    placementAchieved: 0,
    costIncurred: 780000,
    paymentCycles: [
      { cycleNumber: 1, amount: 437500, expectedDate: '2024-09-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 2, amount: 437500, expectedDate: '2024-12-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 437500, expectedDate: '2025-03-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 437500, expectedDate: '2025-06-30', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 323750,
    tillDateProfit: 0,
    status: 'Active'
  },
  {
    id: 'wo-009',
    workOrderNo: 'UPSDM/2023/004',
    workOrderDate: '2023-10-10',
    programId: 'upsdm',
    programName: 'UPSDM',
    businessHead: 'Neha Singh',
    businessHeadId: 'bh-004',
    cycle: 1,
    enrolmentTarget: 450,
    enrolmentStartDate: '2023-11-01',
    enrolmentDeadline: '2024-02-29',
    placementTarget: 360,
    placementStartDate: '2024-03-01',
    placementDeadline: '2024-05-31',
    categoryTarget: { st: 45, sc: 90, obc: 135, general: 135, minority: 45 },
    districts: ['Noida', 'Bareilly'],
    manpowerRequired: 15,
    manpowerCurrent: 15,
    fixedBudget: 1900000,
    variableBudget: 475000,
    totalBudget: 2375000,
    centreSetupDate: '2023-10-20',
    mobilisationStartDate: '2023-11-01',
    batchIncorporationDate: '2023-12-15',
    districtsAssigned: 2,
    districtsActive: 2,
    enrolmentAchieved: 450,
    placementAchieved: 360,
    costIncurred: 2180000,
    paymentCycles: [
      { cycleNumber: 1, amount: 593750, expectedDate: '2024-01-31', receivedDate: '2024-02-02', status: 'Received', percentage: 25 },
      { cycleNumber: 2, amount: 593750, expectedDate: '2024-04-30', receivedDate: '2024-05-01', status: 'Received', percentage: 25 },
      { cycleNumber: 3, amount: 593750, expectedDate: '2024-07-31', receivedDate: '2024-08-01', status: 'Received', percentage: 25 },
      { cycleNumber: 4, amount: 593750, expectedDate: '2024-10-31', receivedDate: '2024-10-31', status: 'Received', percentage: 25 }
    ],
    expectedProfit: 439375,
    tillDateProfit: 439375,
    grossProfit: 195000,
    status: 'Completed'
  },
  {
    id: 'wo-010',
    workOrderNo: 'UPSDM/2024/005',
    workOrderDate: '2024-08-01',
    programId: 'upsdm',
    programName: 'UPSDM',
    businessHead: 'Amit Verma',
    businessHeadId: 'bh-003',
    cycle: 3,
    enrolmentTarget: 250,
    enrolmentStartDate: '2024-09-01',
    enrolmentDeadline: '2024-12-31',
    placementTarget: 200,
    placementStartDate: '2025-01-01',
    placementDeadline: '2025-03-31',
    categoryTarget: { st: 25, sc: 50, obc: 75, general: 75, minority: 25 },
    districts: ['Gorakhpur'],
    manpowerRequired: 8,
    manpowerCurrent: 3,
    fixedBudget: 1100000,
    variableBudget: 275000,
    totalBudget: 1375000,
    centreSetupDate: '2024-08-15',
    mobilisationStartDate: '2024-09-01',
    districtsAssigned: 1,
    districtsActive: 0,
    enrolmentAchieved: 0,
    placementAchieved: 0,
    costIncurred: 120000,
    paymentCycles: [
      { cycleNumber: 1, amount: 343750, expectedDate: '2024-11-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 2, amount: 343750, expectedDate: '2025-02-28', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 343750, expectedDate: '2025-05-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 343750, expectedDate: '2025-08-31', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 254375,
    tillDateProfit: 0,
    status: 'Planning'
  },

  // JSDMS Work Orders (5)
  {
    id: 'wo-011',
    workOrderNo: 'JSDMS/2024/001',
    workOrderDate: '2024-01-20',
    programId: 'jsdms',
    programName: 'JSDMS',
    businessHead: 'Rohit Mehra',
    businessHeadId: 'bh-005',
    cycle: 1,
    enrolmentTarget: 320,
    enrolmentStartDate: '2024-02-15',
    enrolmentDeadline: '2024-05-31',
    placementTarget: 256,
    placementStartDate: '2024-06-01',
    placementDeadline: '2024-08-31',
    categoryTarget: { st: 96, sc: 64, obc: 80, general: 64, minority: 16 },
    districts: ['Ranchi', 'Jamshedpur'],
    manpowerRequired: 11,
    manpowerCurrent: 11,
    fixedBudget: 1500000,
    variableBudget: 375000,
    totalBudget: 1875000,
    centreSetupDate: '2024-02-05',
    mobilisationStartDate: '2024-02-15',
    batchIncorporationDate: '2024-03-25',
    districtsAssigned: 2,
    districtsActive: 2,
    enrolmentAchieved: 305,
    placementAchieved: 240,
    costIncurred: 1420000,
    paymentCycles: [
      { cycleNumber: 1, amount: 468750, expectedDate: '2024-04-30', receivedDate: '2024-05-02', status: 'Received', percentage: 25 },
      { cycleNumber: 2, amount: 468750, expectedDate: '2024-07-31', receivedDate: '2024-08-02', status: 'Received', percentage: 25 },
      { cycleNumber: 3, amount: 468750, expectedDate: '2024-10-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 468750, expectedDate: '2025-01-31', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 346875,
    tillDateProfit: 162500,
    status: 'Active'
  },
  {
    id: 'wo-012',
    workOrderNo: 'JSDMS/2024/002',
    workOrderDate: '2024-03-25',
    programId: 'jsdms',
    programName: 'JSDMS',
    businessHead: 'Rohit Mehra',
    businessHeadId: 'bh-005',
    cycle: 2,
    enrolmentTarget: 280,
    enrolmentStartDate: '2024-04-20',
    enrolmentDeadline: '2024-07-31',
    placementTarget: 224,
    placementStartDate: '2024-08-01',
    placementDeadline: '2024-10-31',
    categoryTarget: { st: 84, sc: 56, obc: 70, general: 56, minority: 14 },
    districts: ['Dhanbad', 'Bokaro'],
    manpowerRequired: 10,
    manpowerCurrent: 9,
    fixedBudget: 1350000,
    variableBudget: 337500,
    totalBudget: 1687500,
    centreSetupDate: '2024-04-10',
    mobilisationStartDate: '2024-04-20',
    batchIncorporationDate: '2024-05-30',
    districtsAssigned: 2,
    districtsActive: 2,
    enrolmentAchieved: 250,
    placementAchieved: 150,
    costIncurred: 1050000,
    paymentCycles: [
      { cycleNumber: 1, amount: 421875, expectedDate: '2024-06-30', receivedDate: '2024-07-01', status: 'Received', percentage: 25 },
      { cycleNumber: 2, amount: 421875, expectedDate: '2024-09-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 421875, expectedDate: '2024-12-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 421875, expectedDate: '2025-03-31', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 312187,
    tillDateProfit: 68000,
    status: 'Active'
  },
  {
    id: 'wo-013',
    workOrderNo: 'JSDMS/2024/003',
    workOrderDate: '2024-05-10',
    programId: 'jsdms',
    programName: 'JSDMS',
    businessHead: 'Kavita Rao',
    businessHeadId: 'bh-006',
    cycle: 1,
    enrolmentTarget: 200,
    enrolmentStartDate: '2024-06-10',
    enrolmentDeadline: '2024-09-30',
    placementTarget: 160,
    placementStartDate: '2024-10-01',
    placementDeadline: '2024-12-31',
    categoryTarget: { st: 60, sc: 40, obc: 50, general: 40, minority: 10 },
    districts: ['Giridih'],
    manpowerRequired: 7,
    manpowerCurrent: 5,
    fixedBudget: 900000,
    variableBudget: 225000,
    totalBudget: 1125000,
    centreSetupDate: '2024-05-25',
    mobilisationStartDate: '2024-06-10',
    batchIncorporationDate: '2024-07-20',
    districtsAssigned: 1,
    districtsActive: 1,
    enrolmentAchieved: 120,
    placementAchieved: 0,
    costIncurred: 510000,
    paymentCycles: [
      { cycleNumber: 1, amount: 281250, expectedDate: '2024-08-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 2, amount: 281250, expectedDate: '2024-11-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 281250, expectedDate: '2025-02-28', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 281250, expectedDate: '2025-05-31', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 208125,
    tillDateProfit: 0,
    status: 'Active'
  },
  {
    id: 'wo-014',
    workOrderNo: 'JSDMS/2023/004',
    workOrderDate: '2023-09-01',
    programId: 'jsdms',
    programName: 'JSDMS',
    businessHead: 'Kavita Rao',
    businessHeadId: 'bh-006',
    cycle: 1,
    enrolmentTarget: 350,
    enrolmentStartDate: '2023-10-01',
    enrolmentDeadline: '2024-01-31',
    placementTarget: 280,
    placementStartDate: '2024-02-01',
    placementDeadline: '2024-04-30',
    categoryTarget: { st: 105, sc: 70, obc: 87, general: 70, minority: 18 },
    districts: ['Deoghar', 'Dumka'],
    manpowerRequired: 12,
    manpowerCurrent: 12,
    fixedBudget: 1600000,
    variableBudget: 400000,
    totalBudget: 2000000,
    centreSetupDate: '2023-09-15',
    mobilisationStartDate: '2023-10-01',
    batchIncorporationDate: '2023-11-10',
    districtsAssigned: 2,
    districtsActive: 2,
    enrolmentAchieved: 350,
    placementAchieved: 280,
    costIncurred: 1850000,
    paymentCycles: [
      { cycleNumber: 1, amount: 500000, expectedDate: '2023-12-31', receivedDate: '2024-01-03', status: 'Received', percentage: 25 },
      { cycleNumber: 2, amount: 500000, expectedDate: '2024-03-31', receivedDate: '2024-04-01', status: 'Received', percentage: 25 },
      { cycleNumber: 3, amount: 500000, expectedDate: '2024-06-30', receivedDate: '2024-06-30', status: 'Received', percentage: 25 },
      { cycleNumber: 4, amount: 500000, expectedDate: '2024-09-30', receivedDate: '2024-09-29', status: 'Received', percentage: 25 }
    ],
    expectedProfit: 370000,
    tillDateProfit: 370000,
    grossProfit: 150000,
    status: 'Completed'
  },
  {
    id: 'wo-015',
    workOrderNo: 'JSDMS/2024/005',
    workOrderDate: '2024-07-15',
    programId: 'jsdms',
    programName: 'JSDMS',
    businessHead: 'Rohit Mehra',
    businessHeadId: 'bh-005',
    cycle: 3,
    enrolmentTarget: 180,
    enrolmentStartDate: '2024-08-15',
    enrolmentDeadline: '2024-11-30',
    placementTarget: 144,
    placementStartDate: '2024-12-01',
    placementDeadline: '2025-02-28',
    categoryTarget: { st: 54, sc: 36, obc: 45, general: 36, minority: 9 },
    districts: ['Hazaribagh'],
    manpowerRequired: 6,
    manpowerCurrent: 2,
    fixedBudget: 800000,
    variableBudget: 200000,
    totalBudget: 1000000,
    centreSetupDate: '2024-08-01',
    mobilisationStartDate: '2024-08-15',
    districtsAssigned: 1,
    districtsActive: 0,
    enrolmentAchieved: 0,
    placementAchieved: 0,
    costIncurred: 95000,
    paymentCycles: [
      { cycleNumber: 1, amount: 250000, expectedDate: '2024-10-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 2, amount: 250000, expectedDate: '2025-01-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 250000, expectedDate: '2025-04-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 250000, expectedDate: '2025-07-31', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 185000,
    tillDateProfit: 0,
    status: 'Planning'
  },

  // OSDA Work Orders (5)
  {
    id: 'wo-016',
    workOrderNo: 'OSDA/2024/001',
    workOrderDate: '2024-02-05',
    programId: 'osda',
    programName: 'OSDA',
    businessHead: 'Sunita Patel',
    businessHeadId: 'bh-007',
    cycle: 1,
    enrolmentTarget: 380,
    enrolmentStartDate: '2024-03-01',
    enrolmentDeadline: '2024-06-30',
    placementTarget: 304,
    placementStartDate: '2024-07-01',
    placementDeadline: '2024-09-30',
    categoryTarget: { st: 57, sc: 114, obc: 95, general: 95, minority: 19 },
    districts: ['Bhubaneswar', 'Cuttack'],
    manpowerRequired: 13,
    manpowerCurrent: 13,
    fixedBudget: 1700000,
    variableBudget: 425000,
    totalBudget: 2125000,
    centreSetupDate: '2024-02-20',
    mobilisationStartDate: '2024-03-01',
    batchIncorporationDate: '2024-04-15',
    districtsAssigned: 2,
    districtsActive: 2,
    enrolmentAchieved: 360,
    placementAchieved: 280,
    costIncurred: 1590000,
    paymentCycles: [
      { cycleNumber: 1, amount: 531250, expectedDate: '2024-05-31', receivedDate: '2024-06-01', status: 'Received', percentage: 25 },
      { cycleNumber: 2, amount: 531250, expectedDate: '2024-08-31', receivedDate: '2024-09-02', status: 'Received', percentage: 25 },
      { cycleNumber: 3, amount: 531250, expectedDate: '2024-11-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 531250, expectedDate: '2025-02-28', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 393125,
    tillDateProfit: 180000,
    status: 'Active'
  },
  {
    id: 'wo-017',
    workOrderNo: 'OSDA/2024/002',
    workOrderDate: '2024-04-01',
    programId: 'osda',
    programName: 'OSDA',
    businessHead: 'Sunita Patel',
    businessHeadId: 'bh-007',
    cycle: 2,
    enrolmentTarget: 320,
    enrolmentStartDate: '2024-05-01',
    enrolmentDeadline: '2024-08-31',
    placementTarget: 256,
    placementStartDate: '2024-09-01',
    placementDeadline: '2024-11-30',
    categoryTarget: { st: 48, sc: 96, obc: 80, general: 80, minority: 16 },
    districts: ['Berhampur', 'Rourkela'],
    manpowerRequired: 11,
    manpowerCurrent: 10,
    fixedBudget: 1500000,
    variableBudget: 375000,
    totalBudget: 1875000,
    centreSetupDate: '2024-04-15',
    mobilisationStartDate: '2024-05-01',
    batchIncorporationDate: '2024-06-10',
    districtsAssigned: 2,
    districtsActive: 2,
    enrolmentAchieved: 290,
    placementAchieved: 160,
    costIncurred: 1180000,
    paymentCycles: [
      { cycleNumber: 1, amount: 468750, expectedDate: '2024-07-31', receivedDate: '2024-08-01', status: 'Received', percentage: 25 },
      { cycleNumber: 2, amount: 468750, expectedDate: '2024-10-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 468750, expectedDate: '2025-01-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 468750, expectedDate: '2025-04-30', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 346875,
    tillDateProfit: 85000,
    status: 'Active'
  },
  {
    id: 'wo-018',
    workOrderNo: 'OSDA/2024/003',
    workOrderDate: '2024-06-10',
    programId: 'osda',
    programName: 'OSDA',
    businessHead: 'Rajat Mishra',
    businessHeadId: 'bh-008',
    cycle: 1,
    enrolmentTarget: 270,
    enrolmentStartDate: '2024-07-10',
    enrolmentDeadline: '2024-10-31',
    placementTarget: 216,
    placementStartDate: '2024-11-01',
    placementDeadline: '2025-01-31',
    categoryTarget: { st: 40, sc: 81, obc: 68, general: 68, minority: 13 },
    districts: ['Puri', 'Balasore'],
    manpowerRequired: 9,
    manpowerCurrent: 7,
    fixedBudget: 1250000,
    variableBudget: 312500,
    totalBudget: 1562500,
    centreSetupDate: '2024-06-25',
    mobilisationStartDate: '2024-07-10',
    batchIncorporationDate: '2024-08-20',
    districtsAssigned: 2,
    districtsActive: 1,
    enrolmentAchieved: 160,
    placementAchieved: 0,
    costIncurred: 680000,
    paymentCycles: [
      { cycleNumber: 1, amount: 390625, expectedDate: '2024-09-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 2, amount: 390625, expectedDate: '2024-12-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 390625, expectedDate: '2025-03-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 390625, expectedDate: '2025-06-30', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 289062,
    tillDateProfit: 0,
    status: 'Active'
  },
  {
    id: 'wo-019',
    workOrderNo: 'OSDA/2023/004',
    workOrderDate: '2023-10-15',
    programId: 'osda',
    programName: 'OSDA',
    businessHead: 'Rajat Mishra',
    businessHeadId: 'bh-008',
    cycle: 1,
    enrolmentTarget: 400,
    enrolmentStartDate: '2023-11-15',
    enrolmentDeadline: '2024-02-29',
    placementTarget: 320,
    placementStartDate: '2024-03-01',
    placementDeadline: '2024-05-31',
    categoryTarget: { st: 60, sc: 120, obc: 100, general: 100, minority: 20 },
    districts: ['Sambalpur', 'Angul'],
    manpowerRequired: 14,
    manpowerCurrent: 14,
    fixedBudget: 1800000,
    variableBudget: 450000,
    totalBudget: 2250000,
    centreSetupDate: '2023-11-01',
    mobilisationStartDate: '2023-11-15',
    batchIncorporationDate: '2023-12-20',
    districtsAssigned: 2,
    districtsActive: 2,
    enrolmentAchieved: 400,
    placementAchieved: 320,
    costIncurred: 2080000,
    paymentCycles: [
      { cycleNumber: 1, amount: 562500, expectedDate: '2024-01-31', receivedDate: '2024-02-01', status: 'Received', percentage: 25 },
      { cycleNumber: 2, amount: 562500, expectedDate: '2024-04-30', receivedDate: '2024-05-01', status: 'Received', percentage: 25 },
      { cycleNumber: 3, amount: 562500, expectedDate: '2024-07-31', receivedDate: '2024-07-31', status: 'Received', percentage: 25 },
      { cycleNumber: 4, amount: 562500, expectedDate: '2024-10-31', receivedDate: '2024-10-30', status: 'Received', percentage: 25 }
    ],
    expectedProfit: 416250,
    tillDateProfit: 416250,
    grossProfit: 170000,
    status: 'Completed'
  },
  {
    id: 'wo-020',
    workOrderNo: 'OSDA/2024/005',
    workOrderDate: '2024-08-05',
    programId: 'osda',
    programName: 'OSDA',
    businessHead: 'Sunita Patel',
    businessHeadId: 'bh-007',
    cycle: 3,
    enrolmentTarget: 220,
    enrolmentStartDate: '2024-09-05',
    enrolmentDeadline: '2024-12-31',
    placementTarget: 176,
    placementStartDate: '2025-01-01',
    placementDeadline: '2025-03-31',
    categoryTarget: { st: 33, sc: 66, obc: 55, general: 55, minority: 11 },
    districts: ['Koraput'],
    manpowerRequired: 7,
    manpowerCurrent: 3,
    fixedBudget: 1000000,
    variableBudget: 250000,
    totalBudget: 1250000,
    centreSetupDate: '2024-08-20',
    mobilisationStartDate: '2024-09-05',
    districtsAssigned: 1,
    districtsActive: 0,
    enrolmentAchieved: 0,
    placementAchieved: 0,
    costIncurred: 105000,
    paymentCycles: [
      { cycleNumber: 1, amount: 312500, expectedDate: '2024-11-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 2, amount: 312500, expectedDate: '2025-02-28', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 312500, expectedDate: '2025-05-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 312500, expectedDate: '2025-08-31', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 231250,
    tillDateProfit: 0,
    status: 'Planning'
  },

  // WDC Work Orders (5)
  {
    id: 'wo-021',
    workOrderNo: 'WDC/2024/001',
    workOrderDate: '2024-02-10',
    programId: 'wdc',
    programName: 'WDC',
    businessHead: 'Vikram Joshi',
    businessHeadId: 'bh-009',
    cycle: 1,
    enrolmentTarget: 250,
    enrolmentStartDate: '2024-03-10',
    enrolmentDeadline: '2024-06-30',
    placementTarget: 200,
    placementStartDate: '2024-07-01',
    placementDeadline: '2024-09-30',
    categoryTarget: { st: 38, sc: 50, obc: 62, general: 75, minority: 25 },
    districts: ['Siliguri', 'Durgapur'],
    manpowerRequired: 9,
    manpowerCurrent: 9,
    fixedBudget: 1200000,
    variableBudget: 300000,
    totalBudget: 1500000,
    centreSetupDate: '2024-02-25',
    mobilisationStartDate: '2024-03-10',
    batchIncorporationDate: '2024-04-20',
    districtsAssigned: 2,
    districtsActive: 2,
    enrolmentAchieved: 235,
    placementAchieved: 180,
    costIncurred: 1150000,
    paymentCycles: [
      { cycleNumber: 1, amount: 375000, expectedDate: '2024-05-31', receivedDate: '2024-06-02', status: 'Received', percentage: 25 },
      { cycleNumber: 2, amount: 375000, expectedDate: '2024-08-31', receivedDate: '2024-09-01', status: 'Received', percentage: 25 },
      { cycleNumber: 3, amount: 375000, expectedDate: '2024-11-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 375000, expectedDate: '2025-02-28', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 277500,
    tillDateProfit: 125000,
    status: 'Active'
  },
  {
    id: 'wo-022',
    workOrderNo: 'WDC/2024/002',
    workOrderDate: '2024-04-05',
    programId: 'wdc',
    programName: 'WDC',
    businessHead: 'Vikram Joshi',
    businessHeadId: 'bh-009',
    cycle: 2,
    enrolmentTarget: 200,
    enrolmentStartDate: '2024-05-05',
    enrolmentDeadline: '2024-08-31',
    placementTarget: 160,
    placementStartDate: '2024-09-01',
    placementDeadline: '2024-11-30',
    categoryTarget: { st: 30, sc: 40, obc: 50, general: 60, minority: 20 },
    districts: ['Asansol', 'Haldia'],
    manpowerRequired: 8,
    manpowerCurrent: 7,
    fixedBudget: 1000000,
    variableBudget: 250000,
    totalBudget: 1250000,
    centreSetupDate: '2024-04-20',
    mobilisationStartDate: '2024-05-05',
    batchIncorporationDate: '2024-06-15',
    districtsAssigned: 2,
    districtsActive: 2,
    enrolmentAchieved: 175,
    placementAchieved: 90,
    costIncurred: 780000,
    paymentCycles: [
      { cycleNumber: 1, amount: 312500, expectedDate: '2024-07-31', receivedDate: '2024-08-02', status: 'Received', percentage: 25 },
      { cycleNumber: 2, amount: 312500, expectedDate: '2024-10-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 312500, expectedDate: '2025-01-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 312500, expectedDate: '2025-04-30', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 231250,
    tillDateProfit: 55000,
    status: 'Active'
  },
  {
    id: 'wo-023',
    workOrderNo: 'WDC/2024/003',
    workOrderDate: '2024-06-01',
    programId: 'wdc',
    programName: 'WDC',
    businessHead: 'Meera Das',
    businessHeadId: 'bh-010',
    cycle: 1,
    enrolmentTarget: 180,
    enrolmentStartDate: '2024-07-01',
    enrolmentDeadline: '2024-10-31',
    placementTarget: 144,
    placementStartDate: '2024-11-01',
    placementDeadline: '2025-01-31',
    categoryTarget: { st: 27, sc: 36, obc: 45, general: 54, minority: 18 },
    districts: ['Howrah'],
    manpowerRequired: 6,
    manpowerCurrent: 4,
    fixedBudget: 850000,
    variableBudget: 212500,
    totalBudget: 1062500,
    centreSetupDate: '2024-06-15',
    mobilisationStartDate: '2024-07-01',
    batchIncorporationDate: '2024-08-10',
    districtsAssigned: 1,
    districtsActive: 1,
    enrolmentAchieved: 110,
    placementAchieved: 0,
    costIncurred: 480000,
    paymentCycles: [
      { cycleNumber: 1, amount: 265625, expectedDate: '2024-09-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 2, amount: 265625, expectedDate: '2024-12-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 265625, expectedDate: '2025-03-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 265625, expectedDate: '2025-06-30', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 196562,
    tillDateProfit: 0,
    status: 'Active'
  },
  {
    id: 'wo-024',
    workOrderNo: 'WDC/2023/004',
    workOrderDate: '2023-09-20',
    programId: 'wdc',
    programName: 'WDC',
    businessHead: 'Meera Das',
    businessHeadId: 'bh-010',
    cycle: 1,
    enrolmentTarget: 300,
    enrolmentStartDate: '2023-10-20',
    enrolmentDeadline: '2024-01-31',
    placementTarget: 240,
    placementStartDate: '2024-02-01',
    placementDeadline: '2024-04-30',
    categoryTarget: { st: 45, sc: 60, obc: 75, general: 90, minority: 30 },
    districts: ['Kolkata North', 'Kolkata South'],
    manpowerRequired: 10,
    manpowerCurrent: 10,
    fixedBudget: 1400000,
    variableBudget: 350000,
    totalBudget: 1750000,
    centreSetupDate: '2023-10-05',
    mobilisationStartDate: '2023-10-20',
    batchIncorporationDate: '2023-11-25',
    districtsAssigned: 2,
    districtsActive: 2,
    enrolmentAchieved: 300,
    placementAchieved: 240,
    costIncurred: 1620000,
    paymentCycles: [
      { cycleNumber: 1, amount: 437500, expectedDate: '2023-12-31', receivedDate: '2024-01-02', status: 'Received', percentage: 25 },
      { cycleNumber: 2, amount: 437500, expectedDate: '2024-03-31', receivedDate: '2024-04-01', status: 'Received', percentage: 25 },
      { cycleNumber: 3, amount: 437500, expectedDate: '2024-06-30', receivedDate: '2024-06-30', status: 'Received', percentage: 25 },
      { cycleNumber: 4, amount: 437500, expectedDate: '2024-09-30', receivedDate: '2024-09-28', status: 'Received', percentage: 25 }
    ],
    expectedProfit: 323750,
    tillDateProfit: 323750,
    grossProfit: 130000,
    status: 'Completed'
  },
  {
    id: 'wo-025',
    workOrderNo: 'WDC/2024/005',
    workOrderDate: '2024-07-20',
    programId: 'wdc',
    programName: 'WDC',
    businessHead: 'Vikram Joshi',
    businessHeadId: 'bh-009',
    cycle: 3,
    enrolmentTarget: 150,
    enrolmentStartDate: '2024-08-20',
    enrolmentDeadline: '2024-12-31',
    placementTarget: 120,
    placementStartDate: '2025-01-01',
    placementDeadline: '2025-03-31',
    categoryTarget: { st: 23, sc: 30, obc: 38, general: 45, minority: 14 },
    districts: ['Bardhaman'],
    manpowerRequired: 5,
    manpowerCurrent: 2,
    fixedBudget: 700000,
    variableBudget: 175000,
    totalBudget: 875000,
    centreSetupDate: '2024-08-05',
    mobilisationStartDate: '2024-08-20',
    districtsAssigned: 1,
    districtsActive: 0,
    enrolmentAchieved: 0,
    placementAchieved: 0,
    costIncurred: 85000,
    paymentCycles: [
      { cycleNumber: 1, amount: 218750, expectedDate: '2024-11-30', status: 'Pending', percentage: 25 },
      { cycleNumber: 2, amount: 218750, expectedDate: '2025-02-28', status: 'Pending', percentage: 25 },
      { cycleNumber: 3, amount: 218750, expectedDate: '2025-05-31', status: 'Pending', percentage: 25 },
      { cycleNumber: 4, amount: 218750, expectedDate: '2025-08-31', status: 'Pending', percentage: 25 }
    ],
    expectedProfit: 161875,
    tillDateProfit: 0,
    status: 'Planning'
  }
];

// Async thunks for fetching programs and work orders
export const fetchPrograms = createAsyncThunk(
  'director/fetchPrograms',
  async () => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockPrograms();
  }
);

export const fetchWorkOrders = createAsyncThunk(
  'director/fetchWorkOrders',
  async (programId?: string) => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const allWorkOrders = generateMockWorkOrders();
    return programId ? allWorkOrders.filter(wo => wo.programId === programId) : allWorkOrders;
  }
);

export const createTargetAssignment = createAsyncThunk(
  'director/createTargetAssignment',
  async (formData: TargetAssignmentForm) => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newWorkOrder: WorkOrder = {
      id: `wo-${Date.now()}`,
      workOrderNo: formData.workOrderNo,
      workOrderDate: new Date().toISOString().split('T')[0],
      programId: formData.programName.toLowerCase(),
      programName: formData.programName,
      businessHead: formData.businessHead,
      businessHeadId: `bh-${Date.now()}`,
      cycle: formData.cycle,
      enrolmentTarget: formData.enrolmentTarget,
      enrolmentStartDate: formData.enrolmentDateRange[0],
      enrolmentDeadline: formData.enrolmentDateRange[1],
      placementTarget: formData.placementTarget,
      placementStartDate: formData.placementDateRange[0],
      placementDeadline: formData.placementDateRange[1],
      categoryTarget: formData.categoryTarget,
      districts: formData.districts,
      manpowerRequired: formData.manpower,
      manpowerCurrent: 0,
      fixedBudget: formData.fixedBudget,
      variableBudget: formData.variableBudget,
      totalBudget: formData.fixedBudget + formData.variableBudget,
      districtsAssigned: formData.districts.length,
      districtsActive: 0,
      enrolmentAchieved: 0,
      placementAchieved: 0,
      costIncurred: 0,
      paymentCycles: [],
      expectedProfit: (formData.fixedBudget + formData.variableBudget) * 0.15,
      tillDateProfit: 0,
      status: 'Planning'
    };
    return newWorkOrder;
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
      // Fetch OFR Data
      .addCase(fetchOFRData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOFRData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ofrData = action.payload;
      })
      .addCase(fetchOFRData.rejected, (state, action) => {
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
      })
      // Handle programs
      .addCase(fetchPrograms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.programs = action.payload;
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch programs';
      })
      // Handle work orders
      .addCase(fetchWorkOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWorkOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workOrders = action.payload;
      })
      .addCase(fetchWorkOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch work orders';
      })
      // Handle target assignment
      .addCase(createTargetAssignment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTargetAssignment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workOrders.push(action.payload);
      })
      .addCase(createTargetAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create target assignment';
      });
  },
});

export const { setFilters, clearError } = directorSlice.actions;
export default directorSlice.reducer;

// Export types
export type { OFREntry, OFRStatistics, Program, WorkOrder, TargetAssignmentForm, CategoryTarget, PaymentCycle };
