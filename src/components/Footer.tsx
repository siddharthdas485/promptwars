import React from 'react';
import { Gavel } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 w-full bg-[#0E131F] border-t border-white/10 backdrop-blur-xl mt-16 py-8">
      <div className="w-full px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <Gavel className="w-4 h-4 text-[#FBBF24]" />
          <span>© 2026 ProjectJury Bench Systems. Impartial Academic AI Examination Authority.</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-[#94A3B8]">
          <span className="hover:text-[#FBBF24] cursor-pointer transition-colors">Docket Archives</span>
          <span className="hover:text-[#FBBF24] cursor-pointer transition-colors">Statutory Rubric</span>
          <span className="hover:text-[#FBBF24] cursor-pointer transition-colors">Panel Regulations</span>
          <span className="hover:text-[#FBBF24] cursor-pointer transition-colors">Grounding Verification</span>
        </div>
      </div>
    </footer>
  );
};
