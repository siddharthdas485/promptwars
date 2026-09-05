import type {
  NoveltyJudgeResult,
  FeasibilityJudgeResult,
  ImpactJudgeResult,
  BlueprintResult,
  CandidateProfile,
} from '../types';

export async function judgeNovelty(idea: string): Promise<NoveltyJudgeResult> {
  const response = await fetch('/api/judge-novelty', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errData.error || `Novelty analysis failed with HTTP ${response.status}`);
  }

  return response.json();
}

export async function judgeFeasibility(
  idea: string,
  profile: CandidateProfile
): Promise<FeasibilityJudgeResult> {
  const response = await fetch('/api/judge-feasibility', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea, profile }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errData.error || `Feasibility analysis failed with HTTP ${response.status}`);
  }

  return response.json();
}

export async function judgeImpact(idea: string): Promise<ImpactJudgeResult> {
  const response = await fetch('/api/judge-impact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errData.error || `Impact analysis failed with HTTP ${response.status}`);
  }

  return response.json();
}

export async function generateBlueprint(
  idea: string,
  novelty: NoveltyJudgeResult,
  feasibility: FeasibilityJudgeResult,
  impact: ImpactJudgeResult,
  profile: CandidateProfile
): Promise<BlueprintResult> {
  const response = await fetch('/api/generate-blueprint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea, novelty, feasibility, impact, profile }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errData.error || `Blueprint generation failed with HTTP ${response.status}`);
  }

  return response.json();
}
