/**
 * Cultural Protocols Types
 * Defines types for Aboriginal cultural content validation and workflows
 */

export enum CulturalSensitivity {
  PUBLIC = 'public',
  COMMUNITY = 'community', 
  SENSITIVE = 'sensitive',
  SACRED = 'sacred',
  RESTRICTED = 'restricted'
}

export enum ApprovalStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  ELDER_APPROVED = 'elder_approved',
  COMMUNITY_APPROVED = 'community_approved',
  PUBLISHED = 'published',
  REJECTED = 'rejected'
}

export enum ApprovalStage {
  ELDER = 'elder',
  CULTURAL_ADVISOR = 'cultural_advisor',
  COMMUNITY = 'community'
}

export interface CulturalValidationRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  category: 'visual' | 'textual' | 'contextual' | 'ceremonial';
  validator: (content: any) => CulturalValidationResult;
}

export interface CulturalValidationResult {
  valid: boolean;
  violations: CulturalViolation[];
  warnings: CulturalWarning[];
  suggestions: string[];
}

export interface CulturalViolation {
  ruleId: string;
  message: string;
  severity: 'error' | 'warning';
  location?: string;
  suggestedFix?: string;
}

export interface CulturalWarning {
  message: string;
  category: string;
  requiresReview: boolean;
}

export interface ElderApproval {
  elderId: string;
  elderName: string;
  community: string;
  approvalDate: Date;
  comments?: string;
  restrictions?: string[];
}

export interface CulturalMetadata {
  sensitivity: CulturalSensitivity;
  approvalStatus: ApprovalStatus;
  approvals: ElderApproval[];
  communityRelevance: string[];
  culturalTags: string[];
  restrictions?: string[];
  lastReviewDate?: Date;
  nextReviewDate?: Date;
}

export interface ContentValidationContext {
  contentType: string;
  contentId: string;
  author?: {
    name: string;
    community?: string;
    role?: string;
  };
  location?: {
    name: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  intendedAudience: 'internal' | 'community' | 'public' | 'funding_body';
  publicationDate?: Date;
}

export interface CulturalGuideline {
  id: string;
  title: string;
  description: string;
  category: 'photography' | 'language' | 'symbols' | 'ceremonies' | 'stories';
  severity: 'must' | 'should' | 'may';
  examples: {
    correct: string[];
    incorrect: string[];
  };
  communitySpecific?: string[];
}

export interface ApprovalWorkflow {
  contentId: string;
  currentStage: ApprovalStage;
  stages: ApprovalWorkflowStage[];
  status: ApprovalStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadlineDate?: Date;
  submittedBy: string;
  submittedDate: Date;
}

export interface ApprovalWorkflowStage {
  stage: ApprovalStage;
  assignedTo?: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'requires_changes';
  startDate?: Date;
  completedDate?: Date;
  comments?: string;
  feedback?: string;
  requirements?: string[];
}

export interface CulturalProtocolConfig {
  strictMode: boolean;
  defaultSensitivity: CulturalSensitivity;
  requiredApprovals: ApprovalStage[];
  autoFlagKeywords: string[];
  communitySpecificRules: Map<string, CulturalValidationRule[]>;
  escalationRules: {
    sensitivity: CulturalSensitivity;
    requiredStages: ApprovalStage[];
  }[];
}