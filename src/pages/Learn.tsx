import React,{ useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen,Search,Clock,ArrowRight } from 'lucide-react';
import { modules } from '../data/curriculum';
import { useProgressStore } from '../store/progressStore';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export const Learn: React.FC = () => {
  const navigate = useNavigate();
  const { lessonsCompleted } = useProgressStore();
  const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModules = modules.filter((m) => {
    const matchesLevel = filterLevel === 'all' || m.level === filterLevel;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent-blue-light text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Structured Curriculum</span>
          </div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            Curriculum Modules
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Select a module to view lessons, interactive diagrams, code walk-throughs, and quizzes.
          </p>
        </div>

        {/* Search & Level Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Filter modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-surface border border-dark-border rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-purple"
            />
          </div>

          <div className="flex items-center gap-1 bg-dark-surface p-1 rounded-xl border border-dark-border text-xs">
            <button
              onClick={() => setFilterLevel('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                filterLevel === 'all' ? 'bg-accent-purple text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            {[0, 1, 2, 3, 4, 5, 6].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-1 rounded-lg transition-colors font-mono font-medium ${
                  filterLevel === lvl ? 'bg-accent-purple text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                L{lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModules.map((mod) => {
          const completedCount = mod.lessons.filter((l) =>
            lessonsCompleted.includes(l.id)
          ).length;
          const pct = Math.round((completedCount / mod.lessons.length) * 100);
          const isFinished = completedCount === mod.lessons.length && mod.lessons.length > 0;

          return (
            <div
              key={mod.id}
              onClick={() => navigate(`/learn/${mod.id}`)}
              className="card-hover p-5 bg-dark-surface border border-dark-border cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-dark-surface2 border border-dark-border inline-block group-hover:scale-110 transition-transform">
                    {mod.icon}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant={isFinished ? 'green' : 'slate'} size="sm">
                      Level {mod.level}
                    </Badge>
                  </div>
                </div>

                <div className="text-xs font-mono font-bold text-accent-purple-light">
                  Module {mod.order}
                </div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-accent-purple-light transition-colors mt-0.5">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-dark-border/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{mod.estimatedHours}h</span>
                  </span>
                  <span className="font-mono text-slate-300">
                    {completedCount}/{mod.lessons.length} lessons
                  </span>
                </div>
                <ProgressBar progress={pct} heightClass="h-1.5" />

                <div className="flex items-center justify-between mt-3 text-xs font-semibold text-accent-purple-light group-hover:translate-x-1 transition-transform">
                  <span>Explore Module</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
