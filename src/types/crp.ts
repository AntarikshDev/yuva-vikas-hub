// CRP Types

export interface CRPDocument {
  id: string;
  type: 'aadhaar' | 'pan' | 'bankPassbook' | 'photo' | 'loi';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface CRPBankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
}

export interface CRP {
  id: string;
  name: string;
  category: string;
  homeLocation: string;
  workLocation: string;
  phone: string;
  districtId: string;
  // New payment & verification fields
  aadhaarNumber: string;
  panNumber: string;
  bankDetails: CRPBankDetails;
  // Documents
  documents: CRPDocument[];
  // Status fields
  loi: boolean;
  loiDate?: string;
  appRegistered: boolean;
  appRegistrationDate?: string;
  lastPaymentDate?: string;
  totalPayments: number;
  isActive: boolean;
  // Audit fields
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  workOrderId: string;
}

export interface CRPPayment {
  id: string;
  crpId: string;
  amount: number;
  paymentDate: string;
  referenceNumber: string;
  ofrCount: number;
  status: 'pending' | 'completed' | 'failed';
  remarks?: string;
}

export interface CRPOFRSummary {
  totalOFRs: number;
  paymentPerOFR: number;
  totalPaymentAmount: number;
  payments: CRPPayment[];
}

export interface CreateCRPDTO {
  name: string;
  category: string;
  homeLocation: string;
  workLocation: string;
  phone: string;
  districtId: string;
  aadhaarNumber: string;
  panNumber: string;
  bankDetails: CRPBankDetails;
  workOrderId: string;
  createdBy: string;
}

export interface UpdateCRPDTO extends Partial<CreateCRPDTO> {
  id: string;
  loi?: boolean;
  appRegistered?: boolean;
}
