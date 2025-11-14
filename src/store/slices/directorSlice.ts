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
      });
  },
});

export const { setFilters, clearError } = directorSlice.actions;
export default directorSlice.reducer;

// Export types
export type { OFREntry, OFRStatistics };
