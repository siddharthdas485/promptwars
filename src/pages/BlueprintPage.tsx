import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCase } from '../context/CaseContext';
import { StepperNav } from '../components/StepperNav';
import { generateBlueprint } from '../lib/api';
import {
  FileText,
  Target,
  Layers,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowLeft,
  Bookmark,
  Share2,
  Loader2,
  Cpu,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const BlueprintPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    profile,
    novelty,
    feasibility,
    impact,
    blueprint,
    setBlueprint,
    combinedVerdict,
    docketId,
    saveCurrentDocket,
  } = useCase();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Generate blueprint if we have all arbiters but no blueprint yet
    if (!blueprint && novelty && feasibility && impact) {
      setLoading(true);
      generateBlueprint(profile.abstractInput, novelty, feasibility, impact, profile)
        .then((res) => {
          setBlueprint(res);
        })
        .catch((err) => {
          console.error('Failed to generate blueprint:', err);
          setError(err.message || 'Blueprint synthesis failed');
        })
        .finally(() => setLoading(false));
    }
  }, [blueprint, novelty, feasibility, impact]);

  const handleSaveDocket = async () => {
    await saveCurrentDocket();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative min-h-screen pb-16">
      <StepperNav currentStep={3} />

      {/* Blueprint Header */}
      <section className="w-full px-4 md:px-8 max-w-7xl mx-auto py-3">
        <div className="bg-[#101522] border border-white/10 rounded-sm p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-sm bg-[#161D2E] border border-[#FBBF24]/40 flex items-center justify-center text-[#FBBF24] shadow-md">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#FBBF24] font-semibold uppercase tracking-wider">
                  Case Blueprint Enactment
                </span>
                <span className="text-xs text-white/30">•</span>
                <span className="font-mono text-xs text-[#94A3B8]">Docket #{docketId}</span>
                {combinedVerdict && (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase ${
                      combinedVerdict === 'rebuild'
                        ? 'bg-[#2B1419] text-[#F87171] border border-[#F87171]/30'
                        : combinedVerdict === 'pass'
                        ? 'bg-[#13261B] text-[#4ade80] border border-[#4ade80]/30'
                        : 'bg-[#2E2413] text-[#FBBF24] border border-[#FBBF24]/30'
                    }`}
                  >
                    Verdict: {combinedVerdict.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-white font-medium mt-0.5">
                Architectural Blueprint &amp; Execution Specification
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={handleSaveDocket}
              className="px-4 py-2.5 rounded-sm bg-[#161D2E] hover:bg-[#FBBF24]/20 text-xs font-semibold text-[#FBBF24] border border-[#FBBF24]/30 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>{saveSuccess ? 'Docket Archived!' : 'Save to Firestore'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-sm hackathon-btn-gradient text-[#0B0F17] hover:opacity-95 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-[#F472B6]/20"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Export Brief</span>
            </button>
          </div>
        </div>
      </section>

      {/* Loading state */}
      {loading && (
        <section className="w-full px-4 md:px-8 max-w-7xl mx-auto py-16 flex flex-col items-center justify-center text-center gap-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-[#FBBF24] animate-spin" />
            <Sparkles className="w-5 h-5 text-[#C084FC] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div>
            <h3 className="font-serif text-lg text-white font-medium">
              Synthesizing Formal Blueprint...
            </h3>
            <p className="text-xs text-[#94A3B8] max-w-md mt-1">
              Collating Novelty search citations, Feasibility sprint boundaries, and Impact inquiries into an IEEE-grade execution docket.
            </p>
          </div>
        </section>
      )}

      {/* Error state */}
      {error && (
        <section className="w-full px-4 md:px-8 max-w-7xl mx-auto py-6">
          <div className="p-4 rounded-sm bg-[#2B1419] border border-[#F87171]/40 text-[#F87171] text-xs">
            {error}
          </div>
        </section>
      )}

      {/* Blueprint Content */}
      {blueprint && !loading && (
        <section className="w-full px-4 md:px-8 max-w-7xl mx-auto pt-4 flex flex-col gap-6">
          {/* Top 3 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Problem Formulation */}
            <div className="bg-[#101522] border border-white/10 rounded-sm p-5 shadow-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#FBBF24] pb-2 border-b border-white/10">
                <FileText className="w-4 h-4" />
                <h3 className="font-serif text-xs font-semibold uppercase tracking-wider text-[#FBBF24]">
                  Problem Formulation
                </h3>
              </div>
              <p className="text-xs text-white leading-relaxed">
                {blueprint.problem}
              </p>
            </div>

            {/* Objectives */}
            <div className="bg-[#101522] border border-white/10 rounded-sm p-5 shadow-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#C084FC] pb-2 border-b border-white/10">
                <Target className="w-4 h-4" />
                <h3 className="font-serif text-xs font-semibold uppercase tracking-wider text-[#C084FC]">
                  Target Objectives &amp; Metrics
                </h3>
              </div>
              <p className="text-xs text-white leading-relaxed">
                {blueprint.objectives}
              </p>
            </div>

            {/* MVP Scope */}
            <div className="bg-[#101522] border border-white/10 rounded-sm p-5 shadow-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#38BDF8] pb-2 border-b border-white/10">
                <Layers className="w-4 h-4" />
                <h3 className="font-serif text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
                  Midterm Trial MVP Scope
                </h3>
              </div>
              <p className="text-xs text-white leading-relaxed">
                {blueprint.mvp}
              </p>
            </div>
          </div>

          {/* Architecture and Features Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Features (5 columns) */}
            <div className="lg:col-span-5 bg-[#101522] border border-white/10 rounded-sm p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#C084FC]" />
                  <h3 className="font-serif text-base text-white font-medium">
                    Scoped Technical Features
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#FBBF24]">
                  {blueprint.features.length} Deliverables
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {blueprint.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-sm bg-[#090D16] border border-white/10 text-xs text-white leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-sm bg-[#161D2E] text-[#FBBF24] border border-[#FBBF24]/30 font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture (7 columns) */}
            <div className="lg:col-span-7 bg-[#101522] border border-white/10 rounded-sm p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                  <h3 className="font-serif text-base text-white font-medium">
                    System Architecture Specification
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#94A3B8]">IEEE Compliant</span>
              </div>

              <div className="p-4 rounded-sm bg-[#090D16] border border-white/10 text-xs text-white leading-relaxed font-sans">
                {blueprint.architecture}
              </div>

              {/* Stack Echo */}
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="text-[10px] font-mono uppercase text-[#94A3B8] font-bold">
                  Verified Architectural Stack
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.selectedStack.map((st, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-sm bg-[#161D2E] border border-white/10 text-[11px] font-mono text-[#FDE047]"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phased Timeline Component from the Design */}
          <div className="bg-[#101522] border border-white/10 rounded-sm p-6 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-[#FBBF24]" />
                <h3 className="font-serif text-lg text-white font-medium">
                  Sprint Milestone Roadmap ({profile.timelineWeeks} Weeks Defense Path)
                </h3>
              </div>
              <span className="font-mono text-xs text-[#FBBF24]">
                Phased Deliverable Timeline
              </span>
            </div>

            {/* Timeline Nodes */}
            <div className="relative pl-6 border-l-2 border-[#FBBF24]/40 flex flex-col gap-6 my-2">
              {blueprint.milestones.map((milestone, idx) => {
                const weekRange = `Weeks ${(idx * (profile.timelineWeeks / 4) + 1).toFixed(0)} - ${((idx + 1) * (profile.timelineWeeks / 4)).toFixed(0)}`;
                return (
                  <div key={idx} className="relative group">
                    {/* Node Dot */}
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-sm bg-[#101522] border-2 border-[#FBBF24] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-sm bg-[#FBBF24]" />
                    </div>

                    <div className="bg-[#090D16] border border-white/10 group-hover:border-[#FBBF24]/50 rounded-sm p-4 transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-xs text-[#FBBF24] font-bold">
                          PHASE {idx + 1} • {weekRange}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#94A3B8] bg-[#161D2E] px-2 py-0.5 rounded-sm border border-white/10">
                          <CheckCircle2 className="w-3 h-3 text-[#4ade80]" />
                          Target Milestone
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-white leading-relaxed">
                        {milestone}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate('/panel')}
              className="px-5 py-2.5 rounded-sm bg-[#161D2E] hover:bg-white/10 text-xs font-semibold text-[#94A3B8] hover:text-white border border-white/10 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Arbiter Panel</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="hackathon-btn-gradient text-[#0B0F17] font-bold text-xs uppercase tracking-[0.2em] px-6 py-2.5 hover:opacity-95 transition-all cursor-pointer rounded-sm flex items-center gap-2 shadow-xl shadow-[#F472B6]/25"
            >
              <span>Submit New Proposition</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
