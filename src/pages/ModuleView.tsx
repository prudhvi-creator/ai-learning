import React from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { getModule } from '../data/curriculum';
import { useProgressStore } from '../store/progressStore';
import { Clock,ArrowRight,ArrowLeft,CheckCircle2,BookOpen,HelpCircle } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export const ModuleView: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { lessonsCompleted } = useProgressStore();

  const currentModule = moduleId ? getModule(moduleId) : undefined;

  if (!currentModule) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Module Not Found</h2>
        <p className="text-xs text-slate-400">The requested curriculum module does not exist.</p>
        <button onClick={() => navigate('/learn')} className="btn-primary">
          Back to All Modules
        </button>
      </div>
    );
  }

  const completedCount = currentModule.lessons.filter((l) =>
    lessonsCompleted.includes(l.id)
  ).length;
  const pct = Math.round((completedCount / currentModule.lessons.length) * 100);

  const nextUncompletedLesson = currentModule.lessons.find(
    (l) => !lessonsCompleted.includes(l.id)
  ) || currentModule.lessons[0];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/learn')}
        className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Curriculum
      </button>

      {/* Module Banner */}
      <div className="card p-6 sm:p-8 bg-dark-surface border-dark-border rounded-3xl relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl p-3.5 rounded-2xl bg-dark-surface2 border border-dark-border">
              {currentModule.icon}
            </span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="purple" size="sm">
                  Module {currentModule.order}
                </Badge>
                <Badge variant="blue" size="sm">
                  Level {currentModule.level}
                </Badge>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> ~{currentModule.estimatedHours}h
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
                {currentModule.title}
              </h1>
              <p className="text-xs text-accent-purple-light font-medium mt-0.5">
                {currentModule.subtitle}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-48 bg-dark-bg p-3.5 rounded-2xl border border-dark-border">
            <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold">
              <span>Progress</span>
              <span className="text-slate-200">{pct}%</span>
            </div>
            <ProgressBar progress={pct} heightClass="h-2" />
            <span className="text-[10px] text-slate-500 block mt-1 text-right">
              {completedCount} of {currentModule.lessons.length} done
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-6 leading-relaxed border-t border-dark-border pt-4">
          {currentModule.description}
        </p>

        {/* Start / Continue Button */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/lesson/${nextUncompletedLesson.id}`)}
            className="btn-primary"
          >
            <span>{completedCount > 0 ? 'Continue Next Lesson' : 'Start First Lesson'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/quiz')}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-accent-purple-light" />
            <span>Practice Quizzes</span>
          </button>
        </div>
      </div>

      {/* Lesson List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-dark-border">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent-purple-light" />
            Lessons in this Module ({currentModule.lessons.length})
          </h2>
          <span className="text-xs text-slate-400">Step-by-step masterclass</span>
        </div>

        <div className="space-y-2.5">
          {currentModule.lessons.map((lesson, idx) => {
            const isCompleted = lessonsCompleted.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isCompleted
                    ? 'bg-emerald-950/10 border-emerald-500/30 text-slate-200 hover:border-emerald-500/60'
                    : 'bg-dark-surface border-dark-border text-slate-200 hover:border-accent-purple/50 hover:bg-dark-surface2'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-dark-surface2 border border-dark-border text-slate-400 group-hover:border-accent-purple group-hover:text-white'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div className="truncate">
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-accent-purple-light transition-colors truncate">
                      {lesson.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>~{lesson.estimatedMinutes} mins</span>
                      </span>
                      <span>•</span>
                      <span className="capitalize font-mono text-slate-500">{lesson.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {lesson.content.interactiveType && (
                    <Badge variant="purple" size="sm" className="hidden sm:inline-flex">
                      Interactive Simulator
                    </Badge>
                  )}
                  <span className="text-xs font-semibold text-accent-purple-light group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    {isCompleted ? 'Review' : 'Open'}
                    <ArrowRight className="w-3.5 h-3.5" />
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
