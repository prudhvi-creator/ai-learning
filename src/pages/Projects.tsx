import React,{ useState } from 'react';
import { FolderGit2,Clock,CheckCircle2,ChevronDown,ChevronRight } from 'lucide-react';
import { projectsData } from '../data/projects';
import { useProgressStore } from '../store/progressStore';
import { Badge } from '../components/ui/Badge';
import { CodeBlock } from '../components/ui/CodeBlock';
import confetti from 'canvas-confetti';

export const Projects: React.FC = () => {
  const { projectsCompleted, completeProject } = useProgressStore();
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(projectsData[0]?.id || null);

  const filteredProjects = projectsData.filter((p) => {
    return filterDifficulty === 'all' || p.difficulty === filterDifficulty;
  });

  const handleToggleProject = (id: string) => {
    if (!projectsCompleted.includes(id)) {
      completeProject(id);
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent-purple-light text-xs font-bold uppercase tracking-wider mb-1">
            <FolderGit2 className="w-4 h-4" />
            <span>Portfolio Projects</span>
          </div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            Hands-on AI Agent Projects
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-world projects to build your portfolio from CLI function callers to enterprise autonomous systems.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dark-surface border border-dark-border text-xs">
          {['all', 'beginner', 'intermediate', 'advanced', 'capstone'].map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors font-medium ${
                filterDifficulty === diff
                  ? 'bg-accent-purple text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((proj) => {
          const isDone = projectsCompleted.includes(proj.id);
          const isExpanded = expandedProjectId === proj.id;

          const difficultyBadgeVariant = {
            beginner: 'blue',
            intermediate: 'purple',
            advanced: 'orange',
            capstone: 'pink'
          }[proj.difficulty] as any;

          return (
            <div
              key={proj.id}
              className="card bg-dark-surface border-dark-border overflow-hidden transition-all duration-200"
            >
              {/* Main Header */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant={difficultyBadgeVariant} size="sm">
                      {proj.difficulty.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> ~{proj.estimatedHours}h
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-100 hover:text-accent-purple-light transition-colors">
                    {proj.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleProject(proj.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isDone
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-dark-surface2 border-dark-border text-slate-300 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isDone ? 'Completed (+150 XP)' : 'Mark Built'}</span>
                  </button>

                  <button
                    onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Guide */}
              {isExpanded && (
                <div className="border-t border-dark-border bg-dark-bg/60 p-5 space-y-6 animate-fade-in">
                  {/* Skills Tagged */}
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Core Skills Applied:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.skills.map((s) => (
                        <Badge key={s} variant="slate" size="sm">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Step-by-Step Implementation */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Implementation Roadmap:
                    </span>
                    {proj.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-dark-surface2 border border-dark-border space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-accent-purple text-white flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          <h4 className="text-xs font-bold text-slate-200">{step.title}</h4>
                        </div>
                        <p className="text-xs text-slate-400 pl-7">{step.description}</p>
                        {step.codeExample && (
                          <div className="pl-7 pt-2">
                            <CodeBlock
                              code={step.codeExample.code}
                              language={step.codeExample.language}
                              expectedOutput={step.codeExample.expectedOutput}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
