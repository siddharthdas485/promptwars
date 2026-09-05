import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  CandidateProfile,
  NoveltyJudgeResult,
  FeasibilityJudgeResult,
  ImpactJudgeResult,
  BlueprintResult,
  VerdictType,
  CaseSessionData,
} from '../types';
import { subscribeToAuth, type AppUser, saveDocketRecord } from '../lib/firebase';

interface CaseContextType {
  user: AppUser | null;
  profile: CandidateProfile;
  setProfile: React.Dispatch<React.SetStateAction<CandidateProfile>>;
  novelty: NoveltyJudgeResult | null;
  setNovelty: React.Dispatch<React.SetStateAction<NoveltyJudgeResult | null>>;
  feasibility: FeasibilityJudgeResult | null;
  setFeasibility: React.Dispatch<React.SetStateAction<FeasibilityJudgeResult | null>>;
  impact: ImpactJudgeResult | null;
  setImpact: React.Dispatch<React.SetStateAction<ImpactJudgeResult | null>>;
  blueprint: BlueprintResult | null;
  setBlueprint: React.Dispatch<React.SetStateAction<BlueprintResult | null>>;
  combinedVerdict: VerdictType | null;
  isDeliberating: boolean;
  setIsDeliberating: React.Dispatch<React.SetStateAction<boolean>>;
  docketId: string;
  saveCurrentDocket: () => Promise<void>;
  resetCase: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const defaultProfile: CandidateProfile = {
  candidateName: 'Alex Vance — 4th Year B.Tech CSE (AIML)',
  primaryInterests: 'Multi-agent autonomous systems, legal document summarization, low-latency edge inference',
  teamSize: 3,
  timelineWeeks: 16,
  skills: ['Deep Learning', 'FastAPI', 'Rust', 'Distributed Systems', 'Next.js', 'PyTorch'],
  selectedStack: [
    'Python / Torch 2.4 (CUDA accelerated tensors)',
    'Vector DB / Pinecone (HNSW index embedding search)',
    'React 19 Server Actions (Optimistic tribunal displays)',
    'Ollama / Llama 3 70B (Air-gapped offline inference)',
  ],
  abstractInput:
    'NeuroLex: An autonomous multi-agent courtroom simulation that stress-tests algorithmic patents against 50 years of USPTO precedent using localized LLMs, verifiable formal proofs, and automated prior-art graph discovery.',
};

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [docketId] = useState(() => 'PJ-' + Math.floor(1000 + Math.random() * 9000));
  const [profile, setProfile] = useState<CandidateProfile>(() => {
    const saved = localStorage.getItem('projectjury_current_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [novelty, setNovelty] = useState<NoveltyJudgeResult | null>(null);
  const [feasibility, setFeasibility] = useState<FeasibilityJudgeResult | null>(null);
  const [impact, setImpact] = useState<ImpactJudgeResult | null>(null);
  const [blueprint, setBlueprint] = useState<BlueprintResult | null>(null);
  const [isDeliberating, setIsDeliberating] = useState(false);

  // Compute combined verdict:
  // if any judge says "rebuild" -> "rebuild"
  // if all pass -> "pass"
  // otherwise "pass_with_conditions"
  const combinedVerdict: VerdictType | null = React.useMemo(() => {
    if (!novelty || !feasibility || !impact) return null;
    const verdicts = [novelty.verdict, feasibility.verdict, impact.verdict];
    if (verdicts.includes('rebuild')) return 'rebuild';
    if (verdicts.every((v) => v === 'pass')) return 'pass';
    return 'pass_with_conditions';
  }, [novelty, feasibility, impact]);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('projectjury_current_profile', JSON.stringify(profile));
  }, [profile]);

  const saveCurrentDocket = async () => {
    const sessionData: CaseSessionData = {
      docketId,
      timestamp: new Date().toISOString(),
      profile,
      novelty: novelty || undefined,
      feasibility: feasibility || undefined,
      impact: impact || undefined,
      combinedVerdict: combinedVerdict || undefined,
      blueprint: blueprint || undefined,
    };
    await saveDocketRecord(sessionData);
  };

  const resetCase = () => {
    setProfile(defaultProfile);
    setNovelty(null);
    setFeasibility(null);
    setImpact(null);
    setBlueprint(null);
    localStorage.removeItem('projectjury_current_profile');
  };

  return (
    <CaseContext.Provider
      value={{
        user,
        profile,
        setProfile,
        novelty,
        setNovelty,
        feasibility,
        setFeasibility,
        impact,
        setImpact,
        blueprint,
        setBlueprint,
        combinedVerdict,
        isDeliberating,
        setIsDeliberating,
        docketId,
        saveCurrentDocket,
        resetCase,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export function useCase() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error('useCase must be used within CaseProvider');
  return ctx;
}
