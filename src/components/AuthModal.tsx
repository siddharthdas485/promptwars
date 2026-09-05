import React, { useState } from 'react';
import { loginWithEmail, registerWithEmail, logoutUser } from '../lib/firebase';
import { useCase } from '../context/CaseContext';
import { Lock, Mail, UserCheck, ShieldCheck, X, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { user, isAuthModalOpen, setIsAuthModalOpen } = useCase();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('alex.vance@university.edu');
  const [password, setPassword] = useState('defense2026');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isRegister) {
        await registerWithEmail(email, password);
        setSuccessMsg('Academic credential enrolled successfully in Tribunal Registry.');
      } else {
        await loginWithEmail(email, password);
        setSuccessMsg('Identity verified. Petitioner admitted to the Bench.');
      }
      setTimeout(() => {
        setIsAuthModalOpen(false);
      }, 700);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Authentication verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#101522] border border-white/10 rounded-sm shadow-2xl p-6 overflow-hidden">
        {/* Top Hackathon Ambient Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-[#C084FC]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#FBBF24]" />
            <div>
              <h3 className="font-serif text-lg font-medium text-white">
                Tribunal Registry Authentication
              </h3>
              <p className="text-xs text-[#94A3B8] font-mono">Firebase Auth • Docket Access Gate</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-sm text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {user ? (
          <div className="py-6 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-sm bg-[#161D2E] border border-[#FBBF24]/40 flex items-center justify-center text-[#FBBF24]">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">{user.displayName || 'Petitioner'}</h4>
              <p className="text-xs text-[#94A3B8] font-mono">{user.email}</p>
              <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-sm bg-[#13261B] text-[#4ade80] border border-[#4ade80]/30 text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Bench Session</span>
              </div>
            </div>

            <div className="w-full flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="flex-1 py-2.5 rounded-sm bg-[#161D2E] hover:bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/30 text-sm font-semibold transition-colors"
              >
                Return to Docket
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-[#2B1419] hover:bg-[#3D1E1E] text-[#F87171] border border-[#F87171]/30 text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 flex flex-col gap-4">
            <p className="text-xs text-[#94A3B8]">
              Sign in with institutional credentials to enroll your capstone proposition. Configured with Firebase Auth placeholder variables.
            </p>

            {errorMsg && (
              <div className="p-3 rounded-sm bg-[#2B1419] border border-[#F87171]/40 text-[#F87171] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-sm bg-[#13261B] border border-[#4ade80]/30 text-[#4ade80] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#94A3B8] uppercase font-bold">Institutional Email</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3 text-[#FBBF24]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@university.edu"
                  className="w-full bg-[#090D16] border border-white/10 focus:border-[#FBBF24] text-sm text-white rounded-sm pl-9 pr-3 py-2.5 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#94A3B8] uppercase font-bold">Passcode / PIN</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3 text-[#FBBF24]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#090D16] border border-white/10 focus:border-[#FBBF24] text-sm text-white rounded-sm pl-9 pr-3 py-2.5 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 hackathon-btn-gradient text-[#0B0F17] font-bold text-xs uppercase tracking-[0.2em] py-3 rounded-sm hover:opacity-95 transition-all cursor-pointer shadow-lg shadow-[#F472B6]/25"
            >
              {loading ? 'Verifying Credentials...' : isRegister ? 'Register Credentials' : 'Sign In to Proceed'}
            </button>

            <div className="flex items-center justify-between text-xs text-[#94A3B8] pt-2">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="hover:text-[#FBBF24] underline underline-offset-4"
              >
                {isRegister ? 'Already registered? Sign In' : 'New Petitioner? Register'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('alex.vance@university.edu');
                  setPassword('defense2026');
                }}
                className="text-[#FBBF24] hover:underline"
              >
                Load Default Scholar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
