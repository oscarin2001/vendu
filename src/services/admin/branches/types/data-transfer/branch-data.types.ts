/**
 * Create branch data interface
 */
export interface CreateBranchData {
  name: string;
  phone?: string;
  address: string;
  city: string;
  department?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Update branch data interface
 */
export interface UpdateBranchData {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}
