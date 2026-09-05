import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCase } from '../context/CaseContext';
import { StepperNav } from '../components/StepperNav';
import { judgeNovelty, judgeFeasibility, judgeImpact } from '../lib/api';
import type { VerdictType } from '../types';
import {
  Gavel,
  Lightbulb,
  Cpu,
  Globe2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Search,
  BookOpen,
} from 'lucide-react';

export const PanelPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    profile,
    novelty,
    setNovelty,
    feasibility,
    setFeasibility,
    impact,
    setImpact,
    combinedVerdict,
    docketId,
  } = useCase();

  const [loadingNovelty, setLoadingNovelty] = useState(false);
  const [loadingFeasibility, setLoadingFeasibility] = useState(false);
  const [loadingImpact, setLoadingImpact] = useState(false);
  const [errorNovelty, setErrorNovelty] = useState<string | null>(null);
  const [errorFeasibility, setErrorFeasibility] = useState<string | null>(null);
  const [errorImpact, setErrorImpact] = useState<string | null>(null);

  const runAllJudges = async () => {
    if (!profile.abstractInput) return;

    setErrorNovelty(null);
    setErrorFeasibility(null);
    setErrorImpact(null);

    setLoadingNovelty(true);
    setLoadingFeasibility(true);
    setLoadingImpact(true);

    // Run all three judges in parallel
    const p1 = judgeNovelty(profile.abstractInput)
      .then((res) => {
        setNovelty(res);
      })
      .catch((err) => {
        console.error('Novelty judge error:', err);
        setErrorNovelty(err.message || 'Novelty evaluation failed');
      })
      .finally(() => setLoadingNovelty(false));

    const p2 = judgeFeasibility(profile.abstractInput, profile)
      .then((res) => {
        setFeasibility(res);
      })
      .catch((err) => {
        console.error('Feasibility judge error:', err);
        setErrorFeasibility(err.message || 'Feasibility evaluation failed');
      })
      .finally(() => setLoadingFeasibility(false));

    const p3 = judgeImpact(profile.abstractInput)
      .then((res) => {
        setImpact(res);
      })
      .catch((err) => {
        console.error('Impact judge error:', err);
        setErrorImpact(err.message || 'Impact evaluation failed');
      })
      .finally(() => setLoadingImpact(false));

    await Promise.allSettled([p1, p2, p3]);
  };

  useEffect(() => {
    // Run tribunal on first landing if not yet deliberated
    if (!novelty && !feasibility && !impact) {
      runAllJudges();
    }
  }, []);

  const allFinished = !loadingNovelty && !loadingFeasibility && !loadingImpact && !!novelty && !!feasibility && !!impact;
  const isAnyLoading = loadingNovelty || loadingFeasibility || loadingImpact;

  const getVerdictBadge = (verdict: VerdictType) => {
    switch (verdict) {
      case 'pass':
        return (
          <span className="text-[10px] bg-[#13261B] text-[#4ade80] px-2.5 py-1 rounded-full border border-[#4ade80]/30 font-mono font-bold tracking-tighter">
            VERDICT: PASS
          </span>
        );
      case 'pass_with_conditions':
        return (
          <span className="text-[10px] bg-[#2E2413] text-[#FBBF24] px-2.5 py-1 rounded-full border border-[#FBBF24]/30 uppercase font-mono font-bold tracking-tighter">
            REVIEW REQUIRED
          </span>
        );
      case 'rebuild':
        return (
          <span className="text-[10px] bg-[#2B1419] text-[#F87171] px-2.5 py-1 rounded-full border border-[#F87171]/30 uppercase font-mono font-bold tracking-tighter">
            VERDICT: REBUILD
          </span>
        );
    }
  };

  return (
    <div className="relative min-h-screen pb-16">
      <StepperNav currentStep={2} />

      {/* Case Brief Banner */}
      <section className="w-full px-4 md:px-8 max-w-7xl mx-auto py-3">
        <div className="bg-[#101522] border border-white/10 p-6 rounded-sm shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="1">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#FBBF24] font-bold">
                  Indictment / Case File
                </h2>
                <span className="text-white/30">•</span>
                <span className="font-mono text-[10px] text-[#94A3B8]">Docket #{docketId}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-white mb-2 font-medium">
                {profile.abstractInput.length > 70
                  ? profile.abstractInput.substring(0, 70) + '...'
                  : profile.abstractInput}
              </h3>
              <p className="text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
                {profile.abstractInput}
              </p>
            </div>

            <button
              type="button"
              onClick={runAllJudges}
              disabled={isAnyLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-sm bg-[#161D2E] hover:bg-[#FBBF24]/20 text-xs font-semibold text-[#FBBF24] border border-[#FBBF24]/30 transition-all flex-shrink-0 disabled:opacity-50 shadow-sm"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isAnyLoading ? 'animate-spin' : ''}`} />
              <span>{isAnyLoading ? 'Arbiters Deliberating...' : 'Re-Run All Arbiters'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Three Judge Cards Grid */}
      <section className="w-full px-4 md:px-8 max-w-7xl mx-auto pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Novelty Judge (with Google Search Grounding) */}
          <div className="bg-[#101522] border border-white/10 border-t-2 border-t-[#FBBF24] p-5 rounded-sm shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-sm bg-[#161D2E] border border-[#FBBF24]/40 flex items-center justify-center text-[#FBBF24]">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif italic text-base text-[#FBBF24]">
                      Novelty Judge
                    </h4>
                    <span className="text-[10px] font-mono text-[#94A3B8] flex items-center gap-1">
                      <Search className="w-3 h-3 text-[#FBBF24]" />
                      Google Search Grounding
                    </span>
                  </div>
                </div>

                {novelty && !loadingNovelty ? (
                  getVerdictBadge(novelty.verdict)
                ) : (
                  <span className="text-[10px] font-mono text-[#94A3B8]">Arbiter #1</span>
                )}
              </div>

              {/* Body */}
              {loadingNovelty ? (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                  <div className="relative">
                    <Loader2 className="w-8 h-8 text-[#FBBF24] animate-spin" />
                    <Search className="w-4 h-4 text-[#FBBF24] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-white">Searching Grounded Repos...</span>
                    <span className="text-xs text-[#94A3B8] max-w-xs">
                      Scanning live Google Search indexes, GitHub repositories & academic papers for prior art...
                    </span>
                  </div>
                </div>
              ) : errorNovelty ? (
                <div className="p-4 rounded-sm bg-[#2B1419] border border-[#F87171]/30 text-[#F87171] text-xs">
                  {errorNovelty}
                </div>
              ) : novelty ? (
                <div className="space-y-4 flex-1">
                  {/* Clickable Citation Chips */}
                  <div>
                    <p className="text-xs text-[#94A3B8] uppercase tracking-tighter font-bold mb-2">
                      Evidence Checklist:
                    </p>

                    {novelty.similarProjects && novelty.similarProjects.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {novelty.similarProjects.map((proj, idx) => (
                          <a
                            key={idx}
                            href={proj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] bg-[#161D2E] border border-white/10 px-3 py-1.5 text-[#FDE047] cursor-pointer hover:bg-[#1C253B] rounded-sm inline-flex items-center gap-1.5 transition-colors"
                            title={`Open ${proj.name} citation`}
                          >
                            <span className="truncate max-w-[170px]">{proj.name}</span>
                            <span className="font-mono text-[9px] px-1 py-0.5 rounded-sm bg-[#090D16] text-[#94A3B8]">
                              {proj.similarity}%
                            </span>
                            <ExternalLink className="w-3 h-3 text-[#FBBF24]/70" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#94A3B8] italic">
                        No direct matching repositories or prior projects identified.
                      </p>
                    )}
                  </div>

                  {/* Differentiation Gap */}
                  <div className="pt-2">
                    <p className="text-xs leading-relaxed italic border-l border-[#FBBF24]/40 pl-3 text-white">
                      "{novelty.differentiationGap}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-xs text-[#94A3B8]">
                  Awaiting proposition submission...
                </div>
              )}
            </div>

            <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#94A3B8] font-mono">
              <span>Jurisdiction: Originality Delta</span>
              <span className="text-[#FBBF24]">Search Grounded</span>
            </div>
          </div>

          {/* Card 2: Feasibility Judge */}
          <div className="bg-[#101522] border border-white/10 border-t-2 border-t-[#C084FC] p-5 rounded-sm shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-sm bg-[#161D2E] border border-[#C084FC]/40 flex items-center justify-center text-[#C084FC]">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif italic text-base text-[#C084FC]">
                      Feasibility Judge
                    </h4>
                    <span className="text-[10px] font-mono text-[#94A3B8]">
                      Compute &amp; Timeline Rigor
                    </span>
                  </div>
                </div>

                {feasibility && !loadingFeasibility ? (
                  getVerdictBadge(feasibility.verdict)
                ) : (
                  <span className="text-[10px] font-mono text-[#94A3B8]">Arbiter #2</span>
                )}
              </div>

              {/* Body */}
              {loadingFeasibility ? (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#C084FC] animate-spin" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-white">Benchmarking...</span>
                    <span className="text-xs text-[#94A3B8] max-w-xs">
                      Evaluating {profile.timelineWeeks} weeks timeline and team skills constraints...
                    </span>
                  </div>
                </div>
              ) : errorFeasibility ? (
                <div className="p-4 rounded-sm bg-[#2B1419] border border-[#F87171]/30 text-[#F87171] text-xs">
                  {errorFeasibility}
                </div>
              ) : feasibility ? (
                <div className="space-y-4 flex-1">
                  {/* Scoped Features */}
                  <div>
                    <p className="text-xs text-[#94A3B8] uppercase tracking-tighter font-bold mb-2">
                      Scoped Features:
                    </p>
                    <ul className="text-xs space-y-2 text-white opacity-85">
                      {feasibility.scopedFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#C084FC] font-bold">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Effort Estimate */}
                  <p className="text-[10px] text-[#FBBF24] mt-4 font-mono uppercase tracking-wider font-semibold">
                    EST. EFFORT: {feasibility.effortEstimate}
                  </p>
                </div>
              ) : (
                <div className="py-10 text-center text-xs text-[#94A3B8]">
                  Awaiting proposition submission...
                </div>
              )}
            </div>

            <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#94A3B8] font-mono">
              <span>Jurisdiction: Sprint Feasibility</span>
              <span className="text-[#C084FC]">{profile.timelineWeeks} Wks Target</span>
            </div>
          </div>

          {/* Card 3: Impact Judge */}
          <div className="bg-[#101522] border border-white/10 border-t-2 border-t-[#38BDF8] p-5 rounded-sm shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-sm bg-[#161D2E] border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif italic text-base text-[#38BDF8]">
                      Impact Judge
                    </h4>
                    <span className="text-[10px] font-mono text-[#94A3B8]">
                      Academic &amp; Societal Defense
                    </span>
                  </div>
                </div>

                {impact && !loadingImpact ? (
                  getVerdictBadge(impact.verdict)
                ) : (
                  <span className="text-[10px] font-mono text-[#94A3B8]">Arbiter #3</span>
                )}
              </div>

              {/* Body */}
              {loadingImpact ? (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#38BDF8] animate-spin" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-white">Deliberating...</span>
                    <span className="text-xs text-[#94A3B8] max-w-xs">
                      Formulating critical cross-examination questions for defense panel...
                    </span>
                  </div>
                </div>
              ) : errorImpact ? (
                <div className="p-4 rounded-sm bg-[#2B1419] border border-[#F87171]/30 text-[#F87171] text-xs">
                  {errorImpact}
                </div>
              ) : impact ? (
                <div className="space-y-4 flex-1">
                  <div>
                    <p className="text-xs text-[#94A3B8] uppercase tracking-tighter font-bold mb-2">
                      Inquiry:
                    </p>
                    <div className="space-y-3">
                      {impact.followUpQuestions.map((q, idx) => (
                        <p key={idx} className="text-xs text-white italic border-l border-[#38BDF8]/40 pl-3 leading-relaxed">
                          "{q}"
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-xs text-[#94A3B8]">
                  Awaiting proposition submission...
                </div>
              )}
            </div>

            <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#94A3B8] font-mono">
              <span>Jurisdiction: Academic Rigor</span>
              <span className="text-[#38BDF8]">Ethics &amp; Metrics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Combined Verdict Banner */}
      <section className="w-full px-4 md:px-8 max-w-7xl mx-auto pt-8">
        {isAnyLoading ? (
          <div className="bg-[#101522] border border-white/10 rounded-sm p-6 shadow-xl flex items-center justify-center gap-3 text-[#94A3B8]">
            <Loader2 className="w-5 h-5 text-[#FBBF24] animate-spin" />
            <span className="text-sm font-mono">
              Awaiting unanimous tribunal quorum... Arbiters are deliberating in parallel.
            </span>
          </div>
        ) : combinedVerdict ? (
          combinedVerdict === 'rebuild' ? (
            <div className="bg-[#2B1419] border-2 border-[#F87171]/40 rounded-sm p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h5 className="text-[10px] uppercase font-bold text-[#F87171] tracking-widest mb-1">
                  Final Adjudication
                </h5>
                <p className="font-serif text-xl sm:text-2xl text-[#F87171] font-bold">
                  The Tribunal orders a complete rebuild — proposition remanded.
                </p>
                <p className="text-xs text-white opacity-80 mt-1 max-w-3xl leading-relaxed">
                  The bench identified substantial duplication against existing open-source baselines or prohibitive timeline infeasibility. Remedial redesign is legally mandated before capstone admission.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="bg-[#F87171] text-[#2B1419] font-bold text-xs uppercase tracking-[0.2em] px-8 py-3.5 border border-[#F87171] hover:bg-transparent hover:text-[#F87171] transition-all cursor-pointer rounded-sm flex-shrink-0"
              >
                Amend Proposition
              </button>
            </div>
          ) : (
            <div className="hackathon-btn-gradient flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:px-10 rounded-sm shadow-2xl gap-4 text-[#0B0F17]">
              <div className="flex-1">
                <h5 className="text-[10px] uppercase font-bold text-[#0B0F17]/70 tracking-widest mb-1">
                  Final Adjudication
                </h5>
                <p className="font-serif text-xl sm:text-2xl text-[#0B0F17] font-bold">
                  {combinedVerdict === 'pass'
                    ? 'The Tribunal grants unanimous approval — proposition admitted.'
                    : 'The Tribunal permits this project to proceed with conditions.'}
                </p>
                <p className="text-xs text-[#0B0F17]/85 mt-1 max-w-3xl leading-relaxed font-medium">
                  {combinedVerdict === 'pass'
                    ? 'The proposition satisfies novelty benchmarks under live search grounding and demonstrates robust empirical feasibility and academic rigor.'
                    : 'The proposition is conditionally admitted. The petitioner must address the differentiation gaps, adopt the scoped deliverables, and prepare answers for defense cross-examination.'}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="hidden sm:block text-[#0B0F17] font-bold text-xs uppercase tracking-widest px-4 py-2 hover:underline"
                >
                  Amend
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/blueprint')}
                  disabled={!allFinished}
                  className="bg-[#0B0F17] text-[#FBBF24] font-bold text-xs uppercase tracking-[0.2em] px-8 py-3.5 border border-[#0B0F17] hover:bg-transparent hover:text-[#0B0F17] transition-all cursor-pointer rounded-sm shadow-md"
                >
                  Continue to Blueprint
                </button>
              </div>
            </div>
          )
        ) : null}
      </section>
    </div>
  );
};
