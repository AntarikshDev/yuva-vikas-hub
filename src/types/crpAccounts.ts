// CRP Accounts & Commission Types

export interface CommissionRate {
  id: string;
  workOrderId: string;
  ratePerOFR: number;
  ratePerEnrollment: number;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface CRPTransaction {
  id: string;
  crpId: string;
  crpName: string;
  districtId: string;
  workOrderId: string;
  transactionType: 'ofr_commission' | 'enrollment_commission' | 'bonus' | 'deduction';
  ofrCount: number;
  enrollmentCount: number;
  rateApplied: number;
  amount: number;
  transactionDate: string;
  paymentStatus: 'pending' | 'processed' | 'paid' | 'failed';
  paymentDate?: string;
  referenceNumber?: string;
  remarks?: string;
  createdAt: string;
}

export interface CRPAccountSummary {
  crpId: string;
  crpName: string;
  districtId: string;
  totalOFRs: number;
  totalEnrollments: number;
  totalEarnings: number;
  totalPaid: number;
  pendingAmount: number;
  lastPaymentDate?: string;
  transactions: CRPTransaction[];
}

export interface StateWiseCRPStats {
  stateId: string;
  stateName: string;
  totalCRPs: number;
  activeCRPs: number;
  totalOFRs: number;
  totalEnrollments: number;
  totalInvestment: number;
  avgROI: number;
  conversionRate: number;
}

export interface CRPNetworkAnalytics {
  summary: {
    totalCRPs: number;
    totalActiveCRPs: number;
    totalOFRs: number;
    totalEnrollments: number;
    totalInvestment: number;
    avgOFRPerCRP: number;
    avgEnrollmentPerCRP: number;
    overallROI: number;
  };
  stateWiseStats: StateWiseCRPStats[];
  topPerformingCRPs: {
    crpId: string;
    crpName: string;
    stateName: string;
    districtName: string;
    ofrCount: number;
    enrollmentCount: number;
    earnings: number;
  }[];
  monthlyTrend: {
    month: string;
    ofrs: number;
    enrollments: number;
    investment: number;
  }[];
}

export interface CreateCommissionRateDTO {
  workOrderId: string;
  ratePerOFR: number;
  ratePerEnrollment: number;
  effectiveFrom: string;
  createdBy: string;
}

export interface RecordTransactionDTO {
  crpId: string;
  workOrderId: string;
  transactionType: 'ofr_commission' | 'enrollment_commission' | 'bonus' | 'deduction';
  ofrCount?: number;
  enrollmentCount?: number;
  amount: number;
  remarks?: string;
}
