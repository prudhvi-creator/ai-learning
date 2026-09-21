import React,{ useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
CheckCircle2,ChevronDown,
ChevronRight,ArrowRight,Clock,
Compass
} from 'lucide-react';
import { modules } from '../data/curriculum';
import { useProgressStore } from '../store/progressStore';
import { Badge } from '../components/ui/Badge';

export const Roadmap: React.FC = () => {
  const navigate = useNavigate();
  const { lessonsCompleted } = useProgressStore();
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(modules[0]?.id || null);

  const levels = [
    {
      level: 0,
      title: 'Level 0: Foundations (Absolute Zero Knowledge)',
      description: 'Understanding how computers run code, hardware memory, command line terminal, and web APIs.',
      color: 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
    },
    {
      level: 1,
      title: 'Level 1: Python Essentials for AI Agents',
      description: 'The lingua franca of AI: syntax, functions, typing, data structures, and Pydantic schemas.',
      color: 'border-blue-500 text-blue-400 bg-blue-500/10'
    },
    {
      level: 2,
      title: 'Level 2: AI Models, Tokens & Prompting',
      description: 'Token mechanics, context limits, greedy vs creative sampling, few-shot prompts, and JSON output.',
      color: 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
    },
    {
      level: 3,
      title: 'Level 3: Tools, Embeddings & RAG Systems',
      description: 'Giving models hands and memory: function schemas, vector embeddings, similarity search, and RAG.',
      color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
    },
    {
      level: 4,
      title: 'Level 4: Agent Fundamentals & Loops',
      description: 'The autonomous ReAct loop, short & long-term memory, error recovery, and reflection.',
      color: 'border-amber-500 text-amber-400 bg-amber-500/10'
    },
    {
      level: 5,
      title: 'Level 5: Frameworks, LangGraph & MCP',
      description: 'Stateful graph machines, multi-agent swarms, CrewAI, OpenAI Agents SDK, and Anthropic MCP.',
      color: 'border-pink-500 text-pink-400 bg-pink-500/10'
    },
    {
      level: 6,
      title: 'Level 6: Production Engineering & Evaluation',
      description: 'Input/output guardrails, prompt injection defenses, LLM-as-a-judge, and telemetry tracing.',
      color: 'border-rose-500 text-rose-400 bg-rose-500/10'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-accent-purple-light text-xs font-bold uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          <span>Curriculum Pathway</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
          Visual Zero to Hero Learning Roadmap
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl font-sans leading-relaxed">
          A meticulously structured progression from zero programming background to building production-grade autonomous agent systems.
        </p>
      </div>

      {/* Connected Timeline */}
      <div className="relative border-l-2 border-dark-border ml-4 sm:ml-6 space-y-12 pb-12">
        {levels.map((lvl) => {
          const levelModules = modules.filter((m) => m.level === lvl.level);
          const totalLessonsInLevel = levelModules.reduce((acc, m) => acc + m.lessons.length, 0);
          const completedInLevel = levelModules.reduce(
            (acc, m) => acc + m.lessons.filter((l) => lessonsCompleted.includes(l.id)).length,
            0
          );
          const isLevelComplete = completedInLevel === totalLessonsInLevel && totalLessonsInLevel > 0;

          return (
            <div key={lvl.level} className="relative pl-6 sm:pl-10">
              {/* Level Timeline Marker */}
              <div
                className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs bg-dark-bg transition-all ${
                  isLevelComplete
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/40 shadow-glow-green'
                    : 'border-accent-purple text-accent-purple-light shadow-glow-purple'
                }`}
              >
                {isLevelComplete ? <CheckCircle2 className="w-4 h-4" /> : lvl.level}
              </div>

              {/* Level Heading Card */}
              <div className="mb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-bold text-slate-100">{lvl.title}</h2>
                  <Badge variant={isLevelComplete ? 'green' : 'slate'} size="sm">
                    {completedInLevel}/{totalLessonsInLevel} Lessons Done
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-1">{lvl.description}</p>
              </div>

              {/* Modules within this level */}
              <div className="space-y-4">
                {levelModules.map((mod) => {
                  const isExpanded = expandedModuleId === mod.id;
                  const modCompletedCount = mod.lessons.filter((l) =>
                    lessonsCompleted.includes(l.id)
                  ).length;


                  return (
                    <div
                      key={mod.id}
                      className="card bg-dark-surface border-dark-border overflow-hidden transition-all duration-200"
                    >
                      {/* Module Title Bar */}
                      <button
                        onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-dark-surface2 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-2 rounded-xl bg-dark-bg border border-dark-border">
                            {mod.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-accent-purple-light">
                                Module {mod.order}
                              </span>
                              <span className="text-xs text-slate-500">•</span>
                              <span className="text-xs text-slate-400">{mod.subtitle}</span>
                            </div>
                            <h3 className="text-base font-bold text-slate-100 mt-0.5">
                              {mod.title}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <span className="text-xs text-slate-400 block font-mono">
                              {modCompletedCount}/{mod.lessons.length}
                            </span>
                            <span className="text-[10px] text-slate-500">lessons</span>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Lessons List */}
                      {isExpanded && (
                        <div className="border-t border-dark-border bg-dark-bg/60 p-4 sm:p-5 space-y-2 animate-fade-in">
                          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                            {mod.description}
                          </p>

                          <div className="space-y-1.5">
                            {mod.lessons.map((lesson, idx) => {
                              const isCompleted = lessonsCompleted.includes(lesson.id);
                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => navigate(`/lesson/${lesson.id}`)}
                                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                    isCompleted
                                      ? 'bg-emerald-950/10 border-emerald-500/30 text-slate-300 hover:border-emerald-500/60'
                                      : 'bg-dark-surface2 border-dark-border text-slate-200 hover:border-accent-purple/50 hover:bg-dark-surface3'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                                        isCompleted
                                          ? 'bg-emerald-500 text-white'
                                          : 'bg-dark-surface border border-dark-border text-slate-400'
                                      }`}
                                    >
                                      {isCompleted ? '✓' : idx + 1}
                                    </div>
                                    <div className="truncate">
                                      <div className="text-xs font-semibold truncate">
                                        {lesson.title}
                                      </div>
                                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" />
                                        <span>~{lesson.estimatedMinutes} mins</span>
                                        <span>•</span>
                                        <span className="capitalize font-mono">{lesson.type}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-accent-purple-light font-medium flex items-center gap-1">
                                      {isCompleted ? 'Review' : 'Start'}
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
