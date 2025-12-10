export interface DocumentType {
  id: string;
  code: string;
  name: string;
  category: string;
  isRequired: boolean;
  allowedFormats: string[];
  maxSizeKb?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentTypeDTO {
  code: string;
  name: string;
  category: string;
  isRequired: boolean;
  allowedFormats: string[];
  maxSizeKb?: number;
  isActive?: boolean;
}

export interface UpdateDocumentTypeDTO {
  code?: string;
  name?: string;
  category?: string;
  isRequired?: boolean;
  allowedFormats?: string[];
  maxSizeKb?: number;
  isActive?: boolean;
}

export interface DocumentTypesQueryParams {
  search?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'all';
  page?: number;
  limit?: number;
}

export type DocumentCategory = 
  | 'Identity Proof'
  | 'Address Proof'
  | 'Education'
  | 'Banking'
  | 'Category Proof'
  | 'Income Proof'
  | 'Other';
