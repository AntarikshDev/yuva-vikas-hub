import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export type TargetType = 'mobilisation' | 'counselling' | 'enrolment' | 'training' | 'placement' | 'retention';
export type TargetPeriod = 'day' | 'week' | 'month';
export type TargetStatus = 'active' | 'completed' | 'carried_forward' | 'reassigned' | 'void';
export type EmployeeStatus = 'active' | 'departed' | 'on_leave';
export type RoleType = 'director' | 'national_head' | 'state_head' | 'cluster_manager' | 'manager' | 'mobiliser';
export type AllocationMethod = 'equal' | 'weighted' | 'capacity' | 'manual';

export interface Target {
  id: string;
  type: TargetType;
  period: TargetPeriod;
  periodStart: string;
  periodEnd: string;
  value: number;
  achieved: number;
  assignedTo: string;
  assignedToName: string;
  assignedToRole: RoleType;
  assignedBy: string;
  assignedByName: string;
  status: TargetStatus;
  carryForwardFrom?: string;
  carryForwardAmount?: number;
  originalValue?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  state?: string;
  program?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RoleType;
  state: string;
  cluster?: string;
  managerId?: string;
  managerName?: string;
  status: EmployeeStatus;
  joiningDate: string;
  departureDate?: string;
  pendingTargets: number;
  activeTargets: number;
}

export interface CarryForwardItem {
  targetId: string;
  originalValue: number;
  achieved: number;
  pending: number;
  fromPeriod: string;
  toPeriod: string;
  employeeId: string;
  employeeName: string;
  targetType: TargetType;
  action?: 'add_to_next' | 'redistribute' | 'void';
}

export interface ReassignmentRecord {
  id: string;
  targetId: string;
  fromEmployeeId: string;
  fromEmployeeName: string;
  toEmployeeId: string;
  toEmployeeName: string;
  amount: number;
  reason: string;
  reassignedBy: string;
  reassignedAt: string;
}

interface TargetManagementState {
  targets: Target[];
  employees: Employee[];
  carryForwardQueue: CarryForwardItem[];
  reassignmentHistory: ReassignmentRecord[];
  loading: boolean;
  error: string | null;
  filters: {
    period: TargetPeriod | 'all';
    targetType: TargetType | 'all';
    role: RoleType | 'all';
    state: string;
    status: TargetStatus | 'all';
  };
  stats: {
    totalActiveTargets: number;
    pendingAssignments: number;
    carryForwardTargets: number;
    unassignedTargets: number;
  };
}

const initialState: TargetManagementState = {
  targets: [],
  employees: [],
  carryForwardQueue: [],
  reassignmentHistory: [],
  loading: false,
  error: null,
  filters: {
    period: 'all',
    targetType: 'all',
    role: 'all',
    state: 'all',
    status: 'all',
  },
  stats: {
    totalActiveTargets: 0,
    pendingAssignments: 0,
    carryForwardTargets: 0,
    unassignedTargets: 0,
  },
};

// Mock data generators
const generateMockTargets = (): Target[] => [
  {
    id: 'T001',
    type: 'mobilisation',
    period: 'month',
    periodStart: '2024-12-01',
    periodEnd: '2024-12-31',
    value: 500,
    achieved: 320,
    assignedTo: 'EMP001',
    assignedToName: 'Rahul Sharma',
    assignedToRole: 'state_head',
    assignedBy: 'DIR001',
    assignedByName: 'Amit Kumar',
    status: 'active',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-09T00:00:00Z',
    state: 'Maharashtra',
    program: 'DDU-GKY',
  },
  {
    id: 'T002',
    type: 'enrolment',
    period: 'month',
    periodStart: '2024-12-01',
    periodEnd: '2024-12-31',
    value: 200,
    achieved: 150,
    assignedTo: 'EMP002',
    assignedToName: 'Priya Patel',
    assignedToRole: 'cluster_manager',
    assignedBy: 'EMP001',
    assignedByName: 'Rahul Sharma',
    status: 'active',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-09T00:00:00Z',
    state: 'Maharashtra',
    program: 'DDU-GKY',
  },
  {
    id: 'T003',
    type: 'training',
    period: 'week',
    periodStart: '2024-12-02',
    periodEnd: '2024-12-08',
    value: 50,
    achieved: 45,
    assignedTo: 'EMP003',
    assignedToName: 'Suresh Kumar',
    assignedToRole: 'manager',
    assignedBy: 'EMP002',
    assignedByName: 'Priya Patel',
    status: 'completed',
    createdAt: '2024-12-02T00:00:00Z',
    updatedAt: '2024-12-08T00:00:00Z',
    state: 'Maharashtra',
  },
  {
    id: 'T004',
    type: 'mobilisation',
    period: 'month',
    periodStart: '2024-11-01',
    periodEnd: '2024-11-30',
    value: 400,
    achieved: 350,
    assignedTo: 'EMP004',
    assignedToName: 'Anjali Singh',
    assignedToRole: 'mobiliser',
    assignedBy: 'EMP003',
    assignedByName: 'Suresh Kumar',
    status: 'carried_forward',
    carryForwardAmount: 50,
    originalValue: 400,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    state: 'Gujarat',
  },
];

const generateMockEmployees = (): Employee[] => [
  {
    id: 'EMP001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@lnj.com',
    phone: '+91 98765 43210',
    role: 'state_head',
    state: 'Maharashtra',
    managerId: 'DIR001',
    managerName: 'Amit Kumar',
    status: 'active',
    joiningDate: '2022-01-15',
    pendingTargets: 2,
    activeTargets: 5,
  },
  {
    id: 'EMP002',
    name: 'Priya Patel',
    email: 'priya.patel@lnj.com',
    phone: '+91 98765 43211',
    role: 'cluster_manager',
    state: 'Maharashtra',
    cluster: 'Pune',
    managerId: 'EMP001',
    managerName: 'Rahul Sharma',
    status: 'active',
    joiningDate: '2022-03-20',
    pendingTargets: 1,
    activeTargets: 3,
  },
  {
    id: 'EMP003',
    name: 'Suresh Kumar',
    email: 'suresh.kumar@lnj.com',
    phone: '+91 98765 43212',
    role: 'manager',
    state: 'Maharashtra',
    cluster: 'Mumbai',
    managerId: 'EMP002',
    managerName: 'Priya Patel',
    status: 'active',
    joiningDate: '2022-06-10',
    pendingTargets: 0,
    activeTargets: 4,
  },
  {
    id: 'EMP004',
    name: 'Anjali Singh',
    email: 'anjali.singh@lnj.com',
    phone: '+91 98765 43213',
    role: 'mobiliser',
    state: 'Gujarat',
    cluster: 'Ahmedabad',
    managerId: 'EMP003',
    managerName: 'Suresh Kumar',
    status: 'active',
    joiningDate: '2023-01-05',
    pendingTargets: 1,
    activeTargets: 2,
  },
  {
    id: 'EMP005',
    name: 'Vikram Joshi',
    email: 'vikram.joshi@lnj.com',
    phone: '+91 98765 43214',
    role: 'mobiliser',
    state: 'Maharashtra',
    cluster: 'Nashik',
    managerId: 'EMP003',
    managerName: 'Suresh Kumar',
    status: 'departed',
    joiningDate: '2022-08-15',
    departureDate: '2024-12-01',
    pendingTargets: 3,
    activeTargets: 0,
  },
];

const generateCarryForwardQueue = (): CarryForwardItem[] => [
  {
    targetId: 'T004',
    originalValue: 400,
    achieved: 350,
    pending: 50,
    fromPeriod: 'November 2024',
    toPeriod: 'December 2024',
    employeeId: 'EMP004',
    employeeName: 'Anjali Singh',
    targetType: 'mobilisation',
  },
  {
    targetId: 'T005',
    originalValue: 100,
    achieved: 80,
    pending: 20,
    fromPeriod: 'November 2024',
    toPeriod: 'December 2024',
    employeeId: 'EMP002',
    employeeName: 'Priya Patel',
    targetType: 'enrolment',
  },
];

// Async thunks
export const fetchTargetManagementData = createAsyncThunk(
  'targetManagement/fetchData',
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      targets: generateMockTargets(),
      employees: generateMockEmployees(),
      carryForwardQueue: generateCarryForwardQueue(),
    };
  }
);

export const createTarget = createAsyncThunk(
  'targetManagement/createTarget',
  async (targetData: Omit<Target, 'id' | 'createdAt' | 'updatedAt' | 'achieved'>) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newTarget: Target = {
      ...targetData,
      id: `T${Date.now()}`,
      achieved: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newTarget;
  }
);

export const reassignTarget = createAsyncThunk(
  'targetManagement/reassignTarget',
  async (data: {
    targetId: string;
    fromEmployeeId: string;
    toEmployeeId: string;
    toEmployeeName: string;
    toEmployeeRole: RoleType;
    amount: number;
    reason: string;
    reassignedBy: string;
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return data;
  }
);

export const processCarryForward = createAsyncThunk(
  'targetManagement/processCarryForward',
  async (data: { items: CarryForwardItem[] }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return data.items;
  }
);

export const handleEmployeeDeparture = createAsyncThunk(
  'targetManagement/handleEmployeeDeparture',
  async (data: {
    departedEmployeeId: string;
    reassignments: Array<{
      targetId: string;
      newEmployeeId: string;
      newEmployeeName: string;
    }>;
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return data;
  }
);

const targetManagementSlice = createSlice({
  name: 'targetManagement',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    updateStats: (state) => {
      state.stats = {
        totalActiveTargets: state.targets.filter((t) => t.status === 'active').length,
        pendingAssignments: state.employees.filter((e) => e.status === 'active' && e.pendingTargets > 0).length,
        carryForwardTargets: state.carryForwardQueue.length,
        unassignedTargets: state.employees
          .filter((e) => e.status === 'departed')
          .reduce((sum, e) => sum + e.pendingTargets, 0),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTargetManagementData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTargetManagementData.fulfilled, (state, action) => {
        state.loading = false;
        state.targets = action.payload.targets;
        state.employees = action.payload.employees;
        state.carryForwardQueue = action.payload.carryForwardQueue;
        state.stats = {
          totalActiveTargets: action.payload.targets.filter((t) => t.status === 'active').length,
          pendingAssignments: action.payload.employees.filter((e) => e.pendingTargets > 0).length,
          carryForwardTargets: action.payload.carryForwardQueue.length,
          unassignedTargets: action.payload.employees
            .filter((e) => e.status === 'departed')
            .reduce((sum, e) => sum + e.pendingTargets, 0),
        };
      })
      .addCase(fetchTargetManagementData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      })
      .addCase(createTarget.fulfilled, (state, action) => {
        state.targets.push(action.payload);
        state.stats.totalActiveTargets += 1;
      })
      .addCase(reassignTarget.fulfilled, (state, action) => {
        const target = state.targets.find((t) => t.id === action.payload.targetId);
        if (target) {
          target.assignedTo = action.payload.toEmployeeId;
          target.assignedToName = action.payload.toEmployeeName;
          target.assignedToRole = action.payload.toEmployeeRole;
          target.status = 'reassigned';
          target.updatedAt = new Date().toISOString();
        }
        state.reassignmentHistory.push({
          id: `R${Date.now()}`,
          targetId: action.payload.targetId,
          fromEmployeeId: action.payload.fromEmployeeId,
          fromEmployeeName: '',
          toEmployeeId: action.payload.toEmployeeId,
          toEmployeeName: action.payload.toEmployeeName,
          amount: action.payload.amount,
          reason: action.payload.reason,
          reassignedBy: action.payload.reassignedBy,
          reassignedAt: new Date().toISOString(),
        });
      })
      .addCase(processCarryForward.fulfilled, (state, action) => {
        action.payload.forEach((item) => {
          const index = state.carryForwardQueue.findIndex((cf) => cf.targetId === item.targetId);
          if (index > -1) {
            state.carryForwardQueue.splice(index, 1);
          }
        });
      })
      .addCase(handleEmployeeDeparture.fulfilled, (state, action) => {
        const employee = state.employees.find((e) => e.id === action.payload.departedEmployeeId);
        if (employee) {
          employee.pendingTargets = 0;
        }
      });
  },
});

export const { setFilters, clearFilters, updateStats } = targetManagementSlice.actions;
export default targetManagementSlice.reducer;
