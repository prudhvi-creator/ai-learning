import React from 'react';
import { Sparkles, Terminal, Boxes, ShieldCheck, Zap, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const LoginPage: React.FC = () => {
  const { signInWithGoogle, loading, error, clearError } = useAuthStore();

  const handleGoogleSignIn = async () => {
    clearError();
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Brand Nav */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(147,51,234,0.4)]">
            Ω
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block">
              Agentic AI
            </span>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-semibold block">
              Zero to Hero Platform
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Cloud Sync Ready</span>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Master Autonomous & Multi-Agent Systems</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15] text-white">
              The Comprehensive Curriculum for{' '}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Agentic AI
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
              From LLM reasoning loops and tool calling to multi-agent swarm architectures and real-world production deployment. Track your XP, streaks, and progress seamlessly in the cloud.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Interactive Playgrounds</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Test reasoning traces, tool orchestration & prompt loops.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
                  <Boxes className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Architecture Lab</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Explore LangGraph, CrewAI, AutoGen, and custom patterns.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Skill Tree & Quizzes</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Level up with XP, daily streaks, and skill evaluations.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Cloud Persistence</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">All progress, bookmarks, and notes synced to Firebase.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-purple-950/20">
              <div className="text-center space-y-2 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white">Welcome Learner</h3>
                <p className="text-xs text-slate-400">
                  Sign in with your Google Account to access your personalized learning journey and cloud saved progress.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-semibold block">Authentication Error</span>
                    <span className="text-[11px] text-rose-300/90">{error}</span>
                  </div>
                </div>
              )}

              {/* Google Sign-In Button */}
              <div className="space-y-4">
                <button
                  type="button"
                  id="google-signin-button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3.5 px-5 py-3.5 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                  )}
                  <span>{loading ? 'Connecting to Google...' : 'Continue with Google'}</span>
                  {!loading && (
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>

                <div className="text-center pt-2">
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    By continuing, you agree to store your learning progress and notes in your Firebase account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-xs text-slate-600 border-t border-slate-900 z-10">
        <p>Agentic AI Zero to Hero &bull; Powered by Firebase Firestore & Google Auth</p>
      </footer>
    </div>
  );
};
