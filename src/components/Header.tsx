import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useCase } from '../context/CaseContext';
import { Scale, Building2, Timer, ChevronRight, User } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, docketId, setIsAuthModalOpen } = useCase();
  const location = useLocation();

  // Courtroom countdown / docket session timer
  const [seconds, setSeconds] = useState(2539);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTimer = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0E131F]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      <div className="h-16 w-full px-4 md:px-10 max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3 min-w-max">
          <div className="w-8 h-8 rounded-sm bg-[#161D2E] border border-[#FBBF24]/40 flex items-center justify-center transform rotate-45 flex-shrink-0 shadow-md">
            <Scale className="w-4 h-4 text-[#FBBF24] transform -rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl tracking-wider text-[#FBBF24] leading-tight">
              LEXIS
            </span>
            <span className="text-[9px] text-[#94A3B8] tracking-widest uppercase font-mono">
              Tribunal Defense System
            </span>
          </div>
        </div>

        {/* Routed Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-widest font-semibold">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `transition-colors pb-1 ${
                isActive
                  ? 'text-[#FBBF24] border-b-2 border-[#FBBF24]'
                  : 'text-[#94A3B8] hover:text-white'
              }`
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="/panel"
            className={({ isActive }) =>
              `transition-colors pb-1 ${
                isActive
                  ? 'text-[#FBBF24] border-b-2 border-[#FBBF24]'
                  : 'text-[#94A3B8] hover:text-white'
              }`
            }
          >
            Panel
          </NavLink>

          <NavLink
            to="/blueprint"
            className={({ isActive }) =>
              `transition-colors pb-1 ${
                isActive
                  ? 'text-[#FBBF24] border-b-2 border-[#FBBF24]'
                  : 'text-[#94A3B8] hover:text-white'
              }`
            }
          >
            Blueprint
          </NavLink>
        </nav>

        {/* Right Status Badges & Profile */}
        <div className="flex items-center space-x-4 min-w-max">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#131A2B] border border-[#FBBF24]/30">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FBBF24] animate-pulse" />
            <span className="font-mono text-[11px] text-[#FBBF24] font-medium tracking-tight">
              Case #{docketId}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[#94A3B8]">
            <Timer className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span className="font-mono text-xs font-medium text-white tracking-wider">
              {formatTimer(seconds)}
            </span>
          </div>

          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

          {/* Petitioner / Clerk Profile Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center space-x-3 p-1 rounded-sm hover:bg-[#161D2E] transition-colors text-left"
            title="Manage Petitioner Session"
          >
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">
                {user ? 'Verified Petitioner' : 'H2S Scholar'}
              </p>
              <p className="text-xs font-bold text-white truncate max-w-[120px]">
                {user?.displayName || 'Alex Vance'}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#131A2B] border border-[#F472B6]/40 flex items-center justify-center text-[#FBBF24] shadow-inner">
              <User className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
