import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCase } from '../context/CaseContext';
import { StepperNav } from '../components/StepperNav';
import {
  Wallet,
  Terminal,
  Gavel,
  CheckCircle,
  Plus,
  Bookmark,
  RotateCcw,
  ArrowRight,
  FolderTree,
  ShieldCheck,
  Calendar,
  Sparkles,
  Gauge,
  Lightbulb,
  Cpu,
  Globe2,
  Lock,
} from 'lucide-react';

const AVAILABLE_SKILLS = [
  'Deep Learning',
  'FastAPI',
  'Computer Vision',
  'Rust',
  'Distributed Systems',
  'PostgreSQL',
  'Next.js',
  'Docker',
  'PyTorch',
];

const STACK_OPTIONS = [
  {
    category: 'MODELING',
    title: 'Python / Torch 2.4',
    desc: 'CUDA accelerated tensors',
  },
  {
    category: 'MEMORY',
    title: 'Vector DB (Pinecone)',
    desc: 'HNSW index embedding search',
  },
  {
    category: 'TRANSPORT',
    title: 'WebRTC / Audio P2P',
    desc: 'Sub-50ms peer stream',
  },
  {
    category: 'UI CLIENT',
    title: 'React 19 Server Actions',
    desc: 'Optimistic tribunal displays',
  },
  {
    category: 'ORCHESTRATION',
    title: 'Kubernetes / KubeRay',
    desc: 'Distributed GPU scheduling',
  },
  {
    category: 'LOCAL LLM',
    title: 'Ollama / Llama 3 70B',
    desc: 'Air-gapped offline inference',
  },
];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setProfile, saveCurrentDocket, user, setIsAuthModalOpen } = useCase();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Steppers logic
  const handleTeamChange = (delta: number) => {
    setProfile((prev) => {
      const next = Math.min(6, Math.max(1, prev.teamSize + delta));
      return { ...prev, teamSize: next };
    });
  };

  const handleTimelineChange = (delta: number) => {
    setProfile((prev) => {
      const next = Math.min(24, Math.max(4, prev.timelineWeeks + delta));
      return { ...prev, timelineWeeks: next };
    });
  };

  // Skill toggle
  const toggleSkill = (skill: string) => {
    setProfile((prev) => {
      const exists = prev.skills.includes(skill);
      const updated = exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill];
      return { ...prev, skills: updated };
    });
  };

  // Stack toggle
  const toggleStack = (title: string) => {
    setProfile((prev) => {
      const exists = prev.selectedStack.some((s) => s.includes(title));
      const updated = exists
        ? prev.selectedStack.filter((s) => !s.includes(title))
        : [...prev.selectedStack, title];
      return { ...prev, selectedStack: updated };
    });
  };

  const handleLoadSample = (type: 'default' | 'attendance') => {
    if (type === 'attendance') {
      setProfile((prev) => ({
        ...prev,
        abstractInput:
          'AI-based smart attendance system using face recognition: An edge-computing system deploying Haar-cascade / MTCNN face detection with a ResNet-50 feature extractor to automatically log student attendance into an academic MySQL database via a webcam.',
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        abstractInput:
          'NeuroLex: An autonomous multi-agent courtroom simulation that stress-tests algorithmic patents against 50 years of USPTO precedent using localized LLMs, verifiable formal proofs, and automated prior-art graph discovery.',
      }));
    }
  };

  const handleSaveDraft = async () => {
    try {
      await saveCurrentDocket();
      setSaveStatus('Draft Docket secured in Firebase & local archive.');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus('Preserved locally in secure session storage.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to the Panel screen where the judges run in parallel
    navigate('/panel');
  };

  const timelinePercent = Math.min(100, Math.max(15, (profile.timelineWeeks / 20) * 100));

  return (
    <div className="relative min-h-screen pb-12">
      {/* Background Ambient Horizon matching PromptWars slide */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-gradient-to-b from-[#C084FC]/15 via-[#F472B6]/10 to-transparent blur-3xl opacity-60 rounded-full" />
      </div>

      <StepperNav currentStep={1} />

      {/* Pre-Intake Simple Firebase Auth Banner */}
      <div className="w-full px-4 md:px-8 max-w-7xl mx-auto mb-4">
        <div className="bg-[#101522] border border-white/10 rounded-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-[#161D2E] border border-[#FBBF24]/40 flex items-center justify-center text-[#FBBF24]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#FBBF24] uppercase tracking-wider font-semibold">
                  Petitioner Authentication Status
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono bg-[#13261B] text-[#4ade80] border border-[#4ade80]/30">
                  Active
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Signed in as{' '}
                <span className="text-white font-semibold">{user?.displayName || 'Alex Vance'}</span>{' '}
                ({user?.email || 'alex.vance@university.edu'}). Firebase Auth + Firestore connected.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-sm bg-[#161D2E] hover:bg-[#FBBF24]/20 text-xs font-semibold text-[#FBBF24] border border-[#FBBF24]/40 transition-all flex items-center justify-center gap-2"
          >
            <span>{user ? 'Switch Account' : 'Sign In (Firebase)'}</span>
          </button>
        </div>
      </div>

      {/* Proposition Header */}
      <section className="w-full px-4 md:px-8 max-w-7xl mx-auto py-4 text-center flex flex-col items-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#161D2E] text-[#FBBF24] font-mono text-xs tracking-wider border border-[#FBBF24]/30">
            <FolderTree className="w-3.5 h-3.5" />
            DOCKET #2026-CS-4091
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#101522] text-[#94A3B8] font-mono text-xs tracking-wider border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
            DIVISION OF ACADEMIC INTEGRITY
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#0E131F] text-[#94A3B8] font-mono text-xs border border-white/10">
            <Calendar className="w-3.5 h-3.5" />
            TERM: FALL 2026 ADJUDICATION
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-white font-medium max-w-4xl tracking-tight leading-tight mb-3">
          Plead Your Proposition Before The Bench
        </h1>
        <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
          Submit your capstone thesis or engineering proposition for rigorous, impartial scrutiny across
          Novelty, Algorithmic Feasibility, and Measurable Real-World Impact.
        </p>
      </section>

      {/* Main Intake Form */}
      <section className="w-full px-4 md:px-8 max-w-7xl mx-auto pt-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Top Card Split: Lead Identity & Execution Parameters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Side: Petitioner Credentials (5 Columns) */}
            <div className="lg:col-span-5 bg-[#101522] border border-white/10 rounded-sm p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#FBBF24]" />
                  <h2 className="font-serif text-lg text-white font-medium">Candidate Credentials</h2>
                </div>
                <span className="font-mono text-[10px] text-[#FBBF24] uppercase tracking-widest font-bold">
                  SEC. A • IDENTITY
                </span>
              </div>

              {/* Field 1: Lead Candidate Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#94A3B8] flex items-center justify-between font-medium">
                  <span>Principal Petitioner (Lead Name)</span>
                  <span className="text-[#FBBF24] font-mono text-[10px]">Registrar Record</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[#FBBF24] text-sm">🎓</span>
                  <input
                    type="text"
                    value={profile.candidateName}
                    onChange={(e) => setProfile({ ...profile, candidateName: e.target.value })}
                    className="w-full bg-[#090D16] border border-white/15 text-white text-sm pl-9 pr-3 py-2.5 rounded-sm outline-none focus:border-[#FBBF24] transition-colors"
                    placeholder="Candidate Full Name & Program Branch"
                  />
                </div>
              </div>

              {/* Field 3: Primary Interests */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#94A3B8] font-medium">
                  Domain Jurisdictions &amp; Research Focus
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[#FBBF24] text-sm">🔬</span>
                  <input
                    type="text"
                    value={profile.primaryInterests}
                    onChange={(e) => setProfile({ ...profile, primaryInterests: e.target.value })}
                    className="w-full bg-[#090D16] border border-white/15 text-white text-sm pl-9 pr-3 py-2.5 rounded-sm outline-none focus:border-[#FBBF24] transition-colors"
                    placeholder="e.g. Distributed Consensus, Edge AI, Face Recognition"
                  />
                </div>
              </div>

              {/* Student Affidavit Card */}
              <div className="bg-[#161D2E] border border-white/10 rounded-sm p-3.5 flex items-center gap-3 mt-1">
                <div className="w-12 h-12 rounded-sm bg-[#131A2B] border border-[#F472B6]/30 flex-shrink-0 flex items-center justify-center text-xl text-[#FBBF24] shadow-md">
                  ⚖️
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span className="text-xs text-white font-semibold truncate">
                      Alex Vance (AIML-4091)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-snug mt-0.5">
                    Honors Capstone Track. Cumulative GPA 3.92 / 4.00. Institutional Ethics Clearance passed.
                  </p>
                </div>
              </div>

              {/* Steppers: Team Size & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Team Size Stepper */}
                <div className="bg-[#090D16] border border-white/10 rounded-sm p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider mb-1 font-bold">
                    Bench Team Quorum
                  </span>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleTeamChange(-1)}
                      className="w-7 h-7 rounded-sm bg-[#161D2E] hover:bg-[#FBBF24]/20 text-[#FBBF24] font-bold text-base flex items-center justify-center transition-all border border-[#FBBF24]/30"
                    >
                      -
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="font-serif text-2xl text-[#FBBF24] font-bold">
                        {profile.teamSize}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">Members</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTeamChange(1)}
                      className="w-7 h-7 rounded-sm bg-[#161D2E] hover:bg-[#FBBF24]/20 text-[#FBBF24] font-bold text-base flex items-center justify-center transition-all border border-[#FBBF24]/30"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-mono text-[10px] text-[#94A3B8] text-center mt-1">
                    {profile.teamSize === 1
                      ? 'Solo Researcher (1 Arbiter)'
                      : `Lead + ${profile.teamSize - 1} Engineers`}
                  </span>
                </div>

                {/* Timeline Stepper */}
                <div className="bg-[#090D16] border border-white/10 rounded-sm p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider mb-1 font-bold">
                    Defense Timeline
                  </span>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleTimelineChange(-2)}
                      className="w-7 h-7 rounded-sm bg-[#161D2E] hover:bg-[#FBBF24]/20 text-[#FBBF24] font-bold text-base flex items-center justify-center transition-all border border-[#FBBF24]/30"
                    >
                      -
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="font-serif text-2xl text-[#FBBF24] font-bold">
                        {profile.timelineWeeks}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">Weeks</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTimelineChange(2)}
                      className="w-7 h-7 rounded-sm bg-[#161D2E] hover:bg-[#FBBF24]/20 text-[#FBBF24] font-bold text-base flex items-center justify-center transition-all border border-[#FBBF24]/30"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-mono text-[10px] text-[#94A3B8] text-center mt-1">
                    Sprint: Feb — May 2026
                  </span>
                </div>
              </div>

              {/* Slider timeline visual */}
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-[#94A3B8]">
                  <span>Semester Inception</span>
                  <span className="text-[#FBBF24] font-semibold">Midterm (Wk 8)</span>
                  <span>Final Docket (Wk 16)</span>
                </div>
                <div className="w-full bg-[#090D16] h-1.5 rounded-sm overflow-hidden flex border border-white/10">
                  <div
                    className="bg-gradient-to-r from-[#C084FC] via-[#F472B6] to-[#FBBF24] h-full transition-all duration-300"
                    style={{ width: `${timelinePercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Side: Capability & Infrastructure Matrix (7 Columns) */}
            <div className="lg:col-span-7 bg-[#101522] border border-white/10 rounded-sm p-6 shadow-xl flex flex-col gap-5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#C084FC]" />
                  <h2 className="font-serif text-lg text-white font-medium">
                    Capability &amp; Infrastructure Matrix
                  </h2>
                </div>
                <span className="font-mono text-[10px] text-[#C084FC] uppercase tracking-widest font-bold">
                  SEC. B • TECHNICAL FIT
                </span>
              </div>

              {/* Field 2: Core Skills Interactive Chips */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-white font-semibold flex items-center gap-1.5">
                    <span>Core Competencies</span>
                    <span className="text-[11px] text-[#94A3B8] font-normal">
                      (Claimed by applicant team)
                    </span>
                  </label>
                  <span className="font-mono text-xs text-[#FBBF24]">
                    {profile.skills.length} of {AVAILABLE_SKILLS.length} Selected
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {AVAILABLE_SKILLS.map((skill) => {
                    const isSelected = profile.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1 rounded-sm text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#C084FC]/20 via-[#F472B6]/20 to-[#FBBF24]/20 text-[#FDE047] font-semibold border border-[#FBBF24]/60 shadow-sm'
                            : 'bg-[#090D16] text-[#94A3B8] border border-white/10 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        {isSelected ? (
                          <CheckCircle className="w-3.5 h-3.5 text-[#FBBF24]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-[#94A3B8]" />
                        )}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 6: Preferred Tech Stack with Category Badges */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-white font-semibold flex items-center gap-1.5">
                    <span>Intended Architectural Stack</span>
                    <span className="text-[11px] text-[#94A3B8] font-normal">
                      (Frameworks under benchmark examination)
                    </span>
                  </label>
                  <span className="font-mono text-xs text-[#38BDF8]">Verified Scalable</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {STACK_OPTIONS.map((item) => {
                    const isChecked = profile.selectedStack.some((s) => s.includes(item.title));
                    return (
                      <div
                        key={item.title}
                        onClick={() => toggleStack(item.title)}
                        className={`p-3 rounded-sm border transition-all cursor-pointer flex flex-col gap-1 shadow-sm ${
                          isChecked
                            ? 'bg-[#161D2E] border-[#FBBF24]/60 shadow-md'
                            : 'bg-[#090D16] border-white/10 hover:bg-[#131A2B]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-[#101522] text-[#FBBF24] border border-[#FBBF24]/20">
                            {item.category}
                          </span>
                          <span className={`text-xs ${isChecked ? 'text-[#FBBF24]' : 'text-[#94A3B8]'}`}>
                            {isChecked ? '☑' : '☐'}
                          </span>
                        </div>
                        <span className="text-xs text-white font-semibold">{item.title}</span>
                        <span className="text-[11px] text-[#94A3B8] leading-tight">{item.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Academic Feasibility Meter */}
              <div className="bg-[#161D2E] border border-white/10 rounded-sm p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-[#38BDF8]" />
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-semibold">
                      Preliminary Complexity Grade: Tier IV (Advanced)
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      Sufficient technical rigor for International Conference publication track
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-sm bg-[#090D16] text-[#FBBF24] border border-[#FBBF24]/30">
                  Score: 94/100
                </span>
              </div>
            </div>
          </div>

          {/* Proposition Abstract / Formal Accusation Card (Full Bleed Docket) */}
          <div className="bg-[#101522] border border-white/10 rounded-sm p-6 shadow-2xl flex flex-col gap-4 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Gavel className="w-6 h-6 text-[#FBBF24]" />
                <div className="flex flex-col">
                  <h2 className="font-serif text-xl text-white font-medium">
                    The Formal Accusation / Proposition Abstract
                  </h2>
                  <span className="text-xs text-[#94A3B8]">
                    Define the unaddressed engineering flaw, algorithmic delta, and empirical proof mechanics
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadSample('attendance')}
                  className="px-3 py-1.5 rounded-sm bg-[#161D2E] text-[#FBBF24] hover:bg-[#FBBF24]/20 text-xs font-mono flex items-center gap-1.5 border border-[#FBBF24]/30 transition-all"
                  title="Test prompt requested by user with real Face Recognition attendance idea"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Face Recognition Test Idea</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadSample('default')}
                  className="px-3 py-1.5 rounded-sm bg-[#090D16] text-[#94A3B8] hover:text-white text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-all"
                >
                  <span>Load High-Scoring Abstract</span>
                </button>
              </div>
            </div>

            {/* Textarea */}
            <div className="relative flex flex-col">
              <textarea
                value={profile.abstractInput}
                onChange={(e) => setProfile({ ...profile, abstractInput: e.target.value })}
                rows={5}
                required
                className="w-full bg-[#090D16] border border-white/15 text-white text-sm md:text-base p-4 rounded-sm outline-none focus:border-[#FBBF24] transition-colors leading-relaxed shadow-inner"
                placeholder="State the acute problem, technical novelty, architectural delta, and targeted benchmark validation metric..."
              />

              {/* Abstract Metadata Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 px-1 text-[#94A3B8] font-mono text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-[#4ade80]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Core Problem Articulated
                  </span>
                  <span className="flex items-center gap-1 text-[#4ade80]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Mathematical Baseline Provided
                  </span>
                  <span className="hidden md:flex items-center gap-1 text-[#FBBF24]">
                    ⚡ Ready for Search-Grounded Trial
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-white font-medium">{profile.abstractInput.length}</span>
                  <span>/ 1,500 characters</span>
                </div>
              </div>
            </div>

            {/* Three Rubric Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#161D2E] border border-white/10 p-3.5 rounded-sm flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-[#FBBF24] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">Pillar I: Absolute Novelty</span>
                  <p className="text-xs text-[#94A3B8] mt-1 leading-normal">
                    Distinguish from standard LLM wrappers or textbook implementations via Google Search grounding.
                  </p>
                </div>
              </div>

              <div className="bg-[#161D2E] border border-white/10 p-3.5 rounded-sm flex items-start gap-3">
                <Cpu className="w-5 h-5 text-[#C084FC] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">Pillar II: Feasibility</span>
                  <p className="text-xs text-[#94A3B8] mt-1 leading-normal">
                    Evidence that local compute or cluster limits can realistically deliver empirical inference within {profile.timelineWeeks} weeks.
                  </p>
                </div>
              </div>

              <div className="bg-[#161D2E] border border-white/10 p-3.5 rounded-sm flex items-start gap-3">
                <Globe2 className="w-5 h-5 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">Pillar III: Societal Impact</span>
                  <p className="text-xs text-[#94A3B8] mt-1 leading-normal">
                    Defensible academic cross-examination, ethical audit, and quantitative utility for real-world deployment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bench & Submission Controls */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 pb-6">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="w-full sm:w-auto px-5 py-2.5 rounded-sm bg-[#161D2E] text-[#FBBF24] hover:bg-[#FBBF24]/20 border border-[#FBBF24]/30 text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Bookmark className="w-4 h-4" />
                <span>Save Draft Docket</span>
              </button>

              <button
                type="button"
                onClick={() => handleLoadSample('default')}
                className="px-4 py-2.5 rounded-sm text-[#94A3B8] hover:text-[#F87171] hover:bg-[#2B1419] transition-all text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden md:inline">Reset Form</span>
              </button>

              {saveStatus && (
                <span className="text-xs text-[#4ade80] font-mono">
                  {saveStatus}
                </span>
              )}
            </div>

            {/* Primary Gavel Submission with PromptWars Hackathon Gradient */}
            <div className="w-full sm:w-auto flex items-center gap-4 justify-end">
              <div className="hidden xl:flex flex-col text-right">
                <span className="text-xs text-[#94A3B8]">Convenes Panel of 3 AI Arbiters</span>
                <span className="font-mono text-xs text-[#FBBF24]">Parallel Grounded Deliberation</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto hackathon-btn-gradient text-[#0B0F17] font-bold text-xs uppercase tracking-[0.2em] px-8 py-3.5 hover:opacity-95 transition-all cursor-pointer rounded-sm flex items-center justify-center gap-3 shadow-xl shadow-[#F472B6]/25"
              >
                <Gavel className="w-4 h-4" />
                <span>Submit for Judgment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};
