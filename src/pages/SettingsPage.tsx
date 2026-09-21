import React,{ useState } from 'react';
import { Settings,Sparkles,Moon,Sun,RotateCcw,Download,CheckCircle2 } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { useProgressStore } from '../store/progressStore';

export const SettingsPage: React.FC = () => {
  const { beginnerMode, toggleBeginnerMode, theme, toggleTheme } = useSettingsStore();
  const { resetProgress, lessonsCompleted, xp } = useProgressStore();

  const [resetConfirm, setResetConfirm] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportData = () => {
    const data = {
      progress: localStorage.getItem('agentic-ai-progress'),
      bookmarks: localStorage.getItem('agentic-ai-bookmarks'),
      settings: localStorage.getItem('agentic-ai-settings'),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agentic-ai-progress-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  };

  const handleReset = () => {
    resetProgress();
    setResetConfirm(false);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-accent-purple-light text-xs font-bold uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>Preferences & Data</span>
        </div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure learning mode, theme, and manage your local offline progress.
        </p>
      </div>

      {/* Settings Options */}
      <div className="space-y-4">
        {/* Beginner Mode */}
        <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-green-light" />
              <h3 className="text-sm font-bold text-slate-100">Beginner Friendly Mode</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Expands mental analogies, avoids advanced jargon, and includes additional real-world metaphors.
            </p>
          </div>

          <button
            onClick={toggleBeginnerMode}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              beginnerMode ? 'bg-accent-green' : 'bg-dark-surface3'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                beginnerMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Theme Mode */}
        <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-accent-purple-light" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
              <h3 className="text-sm font-bold text-slate-100">Appearance Theme</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dark mode is optimized for code readability and syntax highlighting contrast.
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="btn-secondary text-xs px-4 py-2 capitalize flex items-center gap-1.5"
          >
            {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span>{theme} Theme</span>
          </button>
        </div>

        {/* Data Backup & Export */}
        <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-accent-blue-light" />
              <h3 className="text-sm font-bold text-slate-100">Export Progress Backup</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download your current XP ({xp} XP), completed lessons ({lessonsCompleted.length}), and bookmarks as a JSON backup.
            </p>
          </div>

          <button
            onClick={handleExportData}
            className="btn-secondary text-xs px-4 py-2 flex items-center gap-1.5 flex-shrink-0"
          >
            {exportSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </>
            )}
          </button>
        </div>

        {/* Danger Zone: Reset Progress */}
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-rose-300">Reset All Learning Data</h3>
            </div>
            <p className="text-xs text-rose-200/80 leading-relaxed">
              Clears all completed lessons, quiz scores, and streak history from this browser.
            </p>
          </div>

          {!resetConfirm ? (
            <button
              onClick={() => setResetConfirm(true)}
              className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold flex-shrink-0 transition-colors"
            >
              Reset Data
            </button>
          ) : (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-dark-surface2 text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
