export type LocationType = 'state' | 'district' | 'block' | 'panchayat' | 'village' | 'pincode';

export interface State {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  districtCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface District {
  id: string;
  stateId: string;
  stateName?: string;
  stateCode?: string;
  name: string;
  isActive: boolean;
  blockCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Block {
  id: string;
  districtId: string;
  districtName?: string;
  stateName?: string;
  name: string;
  isActive: boolean;
  panchayatCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Panchayat {
  id: string;
  blockId: string;
  blockName?: string;
  districtName?: string;
  stateName?: string;
  name: string;
  isActive: boolean;
  villageCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Village {
  id: string;
  panchayatId: string;
  panchayatName?: string;
  blockName?: string;
  districtName?: string;
  stateName?: string;
  name: string;
  pincode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pincode {
  id: string;
  code: string;
  area: string;
  districtId: string;
  districtName?: string;
  stateName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStateDTO {
  code: string;
  name: string;
  isActive?: boolean;
}

export interface UpdateStateDTO {
  code?: string;
  name?: string;
  isActive?: boolean;
}

export interface CreateDistrictDTO {
  stateId: string;
  name: string;
  isActive?: boolean;
}

export interface CreateBlockDTO {
  districtId: string;
  name: string;
  isActive?: boolean;
}

export interface CreatePanchayatDTO {
  blockId: string;
  name: string;
  isActive?: boolean;
}

export interface CreateVillageDTO {
  panchayatId: string;
  name: string;
  pincode?: string;
  isActive?: boolean;
}

export interface CreatePincodeDTO {
  districtId: string;
  code: string;
  area: string;
  isActive?: boolean;
}

export interface LocationsQueryParams {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  stateId?: string;
  districtId?: string;
  blockId?: string;
  panchayatId?: string;
  page?: number;
  limit?: number;
}

export interface LocationHierarchy {
  states: State[];
  districts: District[];
  blocks: Block[];
  panchayats: Panchayat[];
  villages: Village[];
}

export interface BulkUploadLocationDTO {
  type: LocationType;
  file: File;
}

export interface BulkUploadLocationResponse {
  success: boolean;
  created: number;
  updated: number;
  errors: { row: number; message: string }[];
}
