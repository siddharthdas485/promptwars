import React from 'react';
import { NavLink } from 'react-router-dom';
import { Scale, ArrowRight } from 'lucide-react';

interface StepperNavProps {
  currentStep: 1 | 2 | 3;
}

export const StepperNav: React.FC<StepperNavProps> = ({ currentStep }) => {
  return (
    <div className="w-full px-4 md:px-8 max-w-7xl mx-auto pt-6 pb-2">
      <div className="bg-[#101522] border border-white/10 rounded-sm p-3 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Indicator */}
        <div className="flex items-center gap-2 text-[#94A3B8]">
          <Scale className="w-4 h-4 text-[#FBBF24]" />
          <span className="font-mono uppercase tracking-[0.2em] text-[#FBBF24] text-xs font-bold">
            Tribunal Proceeding Order
          </span>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto justify-center overflow-x-auto py-1">
          {/* Step 1 */}
          <NavLink
            to="/profile"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm transition-all text-xs ${
              currentStep === 1
                ? 'hackathon-pill text-white font-semibold shadow-sm'
                : 'text-[#94A3B8] hover:text-white opacity-80'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-sm flex items-center justify-center font-mono text-[11px] font-bold ${
                currentStep === 1
                  ? 'bg-gradient-to-tr from-[#C084FC] to-[#FBBF24] text-[#0B0F17]'
                  : 'bg-[#161D2E] text-[#94A3B8]'
              }`}
            >
              1
            </span>
            <span>Profile &amp; Intake</span>
            {currentStep === 1 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse" />
            )}
          </NavLink>

          <ArrowRight className="w-3.5 h-3.5 text-white/20" />

          {/* Step 2 */}
          <NavLink
            to="/panel"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm transition-all text-xs ${
              currentStep === 2
                ? 'hackathon-pill text-white font-semibold shadow-sm'
                : 'text-[#94A3B8] hover:text-white opacity-80'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-sm flex items-center justify-center font-mono text-[11px] font-bold ${
                currentStep === 2
                  ? 'bg-gradient-to-tr from-[#C084FC] to-[#FBBF24] text-[#0B0F17]'
                  : 'bg-[#161D2E] text-[#94A3B8]'
              }`}
            >
              2
            </span>
            <span>The Panel &amp; Scrutiny</span>
            {currentStep === 2 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse" />
            )}
          </NavLink>

          <ArrowRight className="w-3.5 h-3.5 text-white/20" />

          {/* Step 3 */}
          <NavLink
            to="/blueprint"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm transition-all text-xs ${
              currentStep === 3
                ? 'hackathon-pill text-white font-semibold shadow-sm'
                : 'text-[#94A3B8] hover:text-white opacity-80'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-sm flex items-center justify-center font-mono text-[11px] font-bold ${
                currentStep === 3
                  ? 'bg-gradient-to-tr from-[#C084FC] to-[#FBBF24] text-[#0B0F17]'
                  : 'bg-[#161D2E] text-[#94A3B8]'
              }`}
            >
              3
            </span>
            <span>Architectural Blueprint</span>
            {currentStep === 3 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse" />
            )}
          </NavLink>
        </div>

        {/* Right Status */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-[#94A3B8]">
          <span className="h-2 w-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <span>Jury Quorum: 3 Arbiters Online</span>
        </div>
      </div>
    </div>
  );
};
