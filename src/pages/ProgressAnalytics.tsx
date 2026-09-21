import React from 'react';
import { BarChart3,Award,Flame,BookOpen,HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { modules,getTotalLessons } from '../data/curriculum';
import { ProgressBar } from '../components/ui/ProgressBar';

export const ProgressAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { streak, xp, level, lessonsCompleted, quizScores } = useProgressStore();
  const totalLessons = getTotalLessons();

  const quizzesTaken = Object.keys(quizScores).length;

  const quizScoreValues = Object.values(quizScores);
  const avgQuizScore =
    quizScoreValues.length > 0
      ? Math.round(quizScoreValues.reduce((a, b) => a + b, 0) / quizScoreValues.length)
      : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-accent-blue-light text-xs font-bold uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Learner Analytics</span>
        </div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">
          Learning Progress & Metrics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Track your journey from zero knowledge to production mastery with detailed completion telemetry.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-dark-surface border-dark-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Level & XP</span>
            <Award className="w-4 h-4 text-accent-purple-light" />
          </div>
          <div className="text-2xl font-black text-accent-purple-light">Level {level}</div>
          <p className="text-[11px] text-slate-400 mt-1">{xp} XP accumulated</p>
          <ProgressBar progress={(xp % 200) / 2} className="mt-3" heightClass="h-1.5" />
        </div>

        <div className="card p-5 bg-dark-surface border-dark-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Lessons Done</span>
            <BookOpen className="w-4 h-4 text-accent-blue-light" />
          </div>
          <div className="text-2xl font-black text-slate-100">{lessonsCompleted.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">out of {totalLessons} lessons</p>
          <ProgressBar
            progress={Math.round((lessonsCompleted.length / totalLessons) * 100)}
            className="mt-3"
            heightClass="h-1.5"
            colorClass="bg-accent-blue"
          />
        </div>

        <div className="card p-5 bg-dark-surface border-dark-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Daily Streak</span>
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{streak} Days</div>
          <p className="text-[11px] text-slate-400 mt-1">Consistency score</p>
        </div>

        <div className="card p-5 bg-dark-surface border-dark-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Quiz Score</span>
            <HelpCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {quizzesTaken > 0 ? `${avgQuizScore}%` : 'N/A'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across {quizzesTaken} assessments</p>
        </div>
      </div>

      {/* Module by Module Completion Progress */}
      <div className="card p-6 bg-dark-surface border-dark-border rounded-3xl space-y-4">
        <h2 className="text-base font-bold text-slate-100">
          Module Completion Breakdown
        </h2>

        <div className="space-y-3">
          {modules.map((mod) => {
            const completedCount = mod.lessons.filter((l) =>
              lessonsCompleted.includes(l.id)
            ).length;
            const pct = Math.round((completedCount / mod.lessons.length) * 100);

            return (
              <div
                key={mod.id}
                onClick={() => navigate(`/learn/${mod.id}`)}
                className="p-3.5 rounded-2xl bg-dark-surface2 border border-dark-border hover:border-accent-purple/40 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl p-1.5 rounded-xl bg-dark-bg border border-dark-border">
                    {mod.icon}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-100">
                      Module {mod.order}: {mod.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Level {mod.level} • {completedCount} of {mod.lessons.length} finished
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-44 flex items-center gap-3">
                  <ProgressBar progress={pct} heightClass="h-2" />
                  <span className="text-xs font-mono font-bold text-slate-300 w-10 text-right">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
