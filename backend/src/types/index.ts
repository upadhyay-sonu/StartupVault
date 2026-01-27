export interface JWTPayload {
  userId: string;
  email: string;
  isVerified: boolean;
}

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface DealFilters {
  category?: string;
  accessLevel?: 'public' | 'verified' | 'both';
  search?: string;
  limit?: number;
  skip?: number;
}

export interface ClaimRequest {
  dealId: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  company?: string;
  role?: string;
  createdAt: Date;
}
