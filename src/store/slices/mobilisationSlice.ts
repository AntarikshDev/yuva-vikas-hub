import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface District {
  id: string;
  name: string;
  managersCount: number;
  assignedTarget: number;
  achieved: number;
  percentAchieved: number;
  avgMobiliserScore: number;
  trend: number[];
  rank: number;
}

export interface Manager {
  id: string;
  name: string;
  districtId: string;
  target: number;
  achieved: number;
  percentAchieved: number;
  mobilisersCount: number;
}

export interface Mobiliser {
  id: string;
  name: string;
  managerId: string;
  target: number;
  achieved: number;
  percentAchieved: number;
  lastSync: string;
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  entityType: 'district' | 'manager' | 'mobiliser';
  entityId: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface StateKPIs {
  stateTarget: number;
  achieved: number;
  percentAchieved: number;
  activeDistricts: number;
  onTrackPercentage: number;
  mobilisations: number;
  counselling: number;
  enrollments: number;
}

export interface TargetAssignment {
  id: string;
  assignedBy: string;
  assignedTo: string;
  targetType: string;
  value: number;
  period: string;
  notes: string;
  timestamp: string;
}

interface MobilisationState {
  stateKPIs: StateKPIs | null;
  districts: District[];
  selectedDistrict: District | null;
  managers: Manager[];
  mobilisers: Mobiliser[];
  alerts: Alert[];
  auditTrail: TargetAssignment[];
  chartData: {
    targetVsAchieved: any[];
    heatmapData: any[];
    funnelData: any[];
  };
  filters: {
    dateRange: [string | null, string | null];
    campaign: string;
    targetType: string;
    geoLevel: string;
    status: string;
    searchQuery: string;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: MobilisationState = {
  stateKPIs: null,
  districts: [],
  selectedDistrict: null,
  managers: [],
  mobilisers: [],
  alerts: [],
  auditTrail: [],
  chartData: {
    targetVsAchieved: [],
    heatmapData: [],
    funnelData: [],
  },
  filters: {
    dateRange: [null, null],
    campaign: 'all',
    targetType: 'mobilisations',
    geoLevel: 'state',
    status: 'all',
    searchQuery: '',
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchStateKPIs = createAsyncThunk(
  'mobilisation/fetchStateKPIs',
  async (filters: any, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/mobilisation/state/kpis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });
      if (!response.ok) {
        // Return mock data for development
        return {
          stateTarget: 10000,
          achieved: 7543,
          percentAchieved: 75.43,
          activeDistricts: 12,
          onTrackPercentage: 83.3,
          mobilisations: 7543,
          counselling: 6234,
          enrollments: 4521,
        };
      }
      return await response.json();
    } catch (error: any) {
      // Return mock data on error
      return {
        stateTarget: 10000,
        achieved: 7543,
        percentAchieved: 75.43,
        activeDistricts: 12,
        onTrackPercentage: 83.3,
        mobilisations: 7543,
        counselling: 6234,
        enrollments: 4521,
      };
    }
  }
);

export const fetchDistricts = createAsyncThunk(
  'mobilisation/fetchDistricts',
  async (filters: any, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/mobilisation/districts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });
      if (!response.ok) {
        // Return mock districts for development
        return Array.from({ length: 12 }, (_, i) => ({
          id: `district-${i + 1}`,
          name: `District ${i + 1}`,
          managersCount: Math.floor(Math.random() * 10) + 5,
          assignedTarget: Math.floor(Math.random() * 1000) + 500,
          achieved: Math.floor(Math.random() * 800) + 300,
          percentAchieved: Math.random() * 100,
          avgMobiliserScore: Math.random() * 5,
          trend: Array.from({ length: 7 }, () => Math.random() * 100),
          rank: i + 1,
        }));
      }
      return await response.json();
    } catch (error: any) {
      // Return mock districts on error
      return Array.from({ length: 12 }, (_, i) => ({
        id: `district-${i + 1}`,
        name: `District ${i + 1}`,
        managersCount: Math.floor(Math.random() * 10) + 5,
        assignedTarget: Math.floor(Math.random() * 1000) + 500,
        achieved: Math.floor(Math.random() * 800) + 300,
        percentAchieved: Math.random() * 100,
        avgMobiliserScore: Math.random() * 5,
        trend: Array.from({ length: 7 }, () => Math.random() * 100),
        rank: i + 1,
      }));
    }
  }
);

export const fetchDistrictDetails = createAsyncThunk(
  'mobilisation/fetchDistrictDetails',
  async (districtId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/mobilisation/districts/${districtId}`);
      if (!response.ok) throw new Error('Failed to fetch district details');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAlerts = createAsyncThunk(
  'mobilisation/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/mobilisation/alerts');
      if (!response.ok) {
        // Return mock alerts for development
        return [
          {
            id: 'alert-1',
            severity: 'critical' as const,
            title: 'Low Achievement Rate',
            description: 'District 3 is at 45% achievement, below 50% threshold',
            entityType: 'district' as const,
            entityId: 'district-3',
            timestamp: new Date().toISOString(),
            acknowledged: false,
          },
          {
            id: 'alert-2',
            severity: 'warning' as const,
            title: 'Mobiliser No Sync',
            description: 'Mobiliser MBL-234 has not synced data for 36 hours',
            entityType: 'mobiliser' as const,
            entityId: 'mbl-234',
            timestamp: new Date().toISOString(),
            acknowledged: false,
          },
        ];
      }
      return await response.json();
    } catch (error: any) {
      // Return mock alerts on error
      return [
        {
          id: 'alert-1',
          severity: 'critical' as const,
          title: 'Low Achievement Rate',
          description: 'District 3 is at 45% achievement, below 50% threshold',
          entityType: 'district' as const,
          entityId: 'district-3',
          timestamp: new Date().toISOString(),
          acknowledged: false,
        },
        {
          id: 'alert-2',
          severity: 'warning' as const,
          title: 'Mobiliser No Sync',
          description: 'Mobiliser MBL-234 has not synced data for 36 hours',
          entityType: 'mobiliser' as const,
          entityId: 'mbl-234',
          timestamp: new Date().toISOString(),
          acknowledged: false,
        },
      ];
    }
  }
);

export const assignTargets = createAsyncThunk(
  'mobilisation/assignTargets',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/mobilisation/targets/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to assign targets');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const acknowledgeAlert = createAsyncThunk(
  'mobilisation/acknowledgeAlert',
  async (alertId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/mobilisation/alerts/${alertId}/acknowledge`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to acknowledge alert');
      return alertId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const mobilisationSlice = createSlice({
  name: 'mobilisation',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<MobilisationState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedDistrict: (state, action: PayloadAction<District | null>) => {
      state.selectedDistrict = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // State KPIs
      .addCase(fetchStateKPIs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStateKPIs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stateKPIs = action.payload;
      })
      .addCase(fetchStateKPIs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Districts
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.districts = action.payload;
      })
      // District details
      .addCase(fetchDistrictDetails.fulfilled, (state, action) => {
        state.managers = action.payload.managers || [];
        state.mobilisers = action.payload.mobilisers || [];
        state.auditTrail = action.payload.auditTrail || [];
      })
      // Alerts
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload;
      })
      .addCase(acknowledgeAlert.fulfilled, (state, action) => {
        const alert = state.alerts.find(a => a.id === action.payload);
        if (alert) alert.acknowledged = true;
      })
      // Assign targets
      .addCase(assignTargets.fulfilled, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setFilters, setSelectedDistrict, clearError } = mobilisationSlice.actions;
export default mobilisationSlice.reducer;
