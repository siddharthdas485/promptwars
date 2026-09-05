export type VerdictType = 'pass' | 'pass_with_conditions' | 'rebuild';

export interface SimilarProject {
  name: string;
  url: string;
  similarity: number;
}

export interface NoveltyJudgeResult {
  similarProjects: SimilarProject[];
  differentiationGap: string;
  verdict: VerdictType;
  rawSearchSources?: Array<{ title: string; url: string }>;
}

export interface FeasibilityJudgeResult {
  scopedFeatures: string[];
  effortEstimate: string;
  verdict: VerdictType;
}

export interface ImpactJudgeResult {
  followUpQuestions: string[];
  verdict: VerdictType;
}

export interface BlueprintResult {
  problem: string;
  objectives: string;
  mvp: string;
  features: string[];
  architecture: string;
  milestones: string[];
}

export interface CandidateProfile {
  candidateName: string;
  primaryInterests: string;
  teamSize: number;
  timelineWeeks: number;
  skills: string[];
  selectedStack: string[];
  abstractInput: string;
}

export interface CaseSessionData {
  docketId: string;
  timestamp: string;
  profile: CandidateProfile;
  novelty?: NoveltyJudgeResult;
  feasibility?: FeasibilityJudgeResult;
  impact?: ImpactJudgeResult;
  combinedVerdict?: VerdictType;
  blueprint?: BlueprintResult;
}
