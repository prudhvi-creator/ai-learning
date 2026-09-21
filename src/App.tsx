import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { Roadmap } from './pages/Roadmap';
import { Learn } from './pages/Learn';
import { ModuleView } from './pages/ModuleView';
import { LessonReader } from './pages/LessonReader';
import { PlaygroundsHub } from './pages/PlaygroundsHub';
import { ArchitectureLab } from './pages/ArchitectureLab';
import { Projects } from './pages/Projects';
import { FrameworkMatrix } from './pages/FrameworkMatrix';
import { QuizHub } from './pages/QuizHub';
import { SkillTreePage } from './pages/SkillTreePage';
import { ProgressAnalytics } from './pages/ProgressAnalytics';
import { GlossaryPage } from './pages/GlossaryPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { SettingsPage } from './pages/SettingsPage';
import { useProgressStore } from './store/progressStore';
import { useSettingsStore } from './store/settingsStore';
import { useFirestoreSync } from './hooks/useFirestoreSync';
import './App.css';

export function App() {
  const { isLoading, isAuthenticated } = useFirestoreSync();
  const { checkStreak } = useProgressStore();
  const { theme } = useSettingsStore();

  useEffect(() => {
    if (isAuthenticated) {
      checkStreak();
    }
  }, [isAuthenticated, checkStreak]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [theme]);

  // Loading Screen while Firebase Auth resolves
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0f] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-black text-2xl shadow-[0_0_30px_rgba(147,51,234,0.4)] animate-pulse">
            Ω
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span>Connecting to Agentic AI...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated -> show LoginPage
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Authenticated -> render full application
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:moduleId" element={<ModuleView />} />
          <Route path="/lesson/:lessonId" element={<LessonReader />} />
          <Route path="/playground" element={<PlaygroundsHub />} />
          <Route path="/architecture" element={<ArchitectureLab />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/frameworks" element={<FrameworkMatrix />} />
          <Route path="/quiz" element={<QuizHub />} />
          <Route path="/skill-tree" element={<SkillTreePage />} />
          <Route path="/progress" element={<ProgressAnalytics />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
