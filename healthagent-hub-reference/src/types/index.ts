// User roles in HealthLink platform
export type UserRole = 'agent' | 'agency' | 'ops';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  agencyId?: string; // For agents belonging to an agency
  onboardingComplete: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Onboarding wizard types
export interface OnboardingProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  npn: string; // National Producer Number
  ssn: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface LicenseInfo {
  state: string;
  licenseNumber: string;
  expirationDate: string;
  linesOfAuthority: LineOfAuthority[];
}

export type LineOfAuthority = 'health' | 'life' | 'variable' | 'property' | 'casualty';

export interface BackgroundQuestion {
  id: string;
  question: string;
  answer: boolean | null;
  explanation?: string;
}

export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  status: 'pending' | 'uploaded' | 'approved' | 'rejected';
  file?: File;
  uploadedAt?: string;
  expiresAt?: string;
}

export interface OnboardingData {
  profile: OnboardingProfile;
  licenses: LicenseInfo[];
  backgroundQuestions: BackgroundQuestion[];
  documents: DocumentRequirement[];
  currentStep: number;
  completedSteps: number[];
}

// Document center types
export interface DocumentFolder {
  id: string;
  name: string;
  parentId?: string;
  children?: DocumentFolder[];
  documents?: DocumentItem[];
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  expiresAt?: string;
  url: string;
  metadata?: Record<string, string>;
}

// Agent compliance status
export interface AgentCompliance {
  agentId: string;
  agentName: string;
  email: string;
  status: 'complete' | 'pending' | 'action-required' | 'expired';
  onboardingProgress: number;
  licenses: {
    total: number;
    active: number;
    expiringSoon: number;
  };
  documents: {
    total: number;
    approved: number;
    pending: number;
  };
  lastActivity: string;
}
