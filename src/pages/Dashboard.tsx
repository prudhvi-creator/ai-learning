import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
Sparkles,
ArrowRight,
Flame,
Award,
BookOpen,Terminal,
Boxes,
Compass,
Cpu,
Zap
} from 'lucide-react';
import { useProgressStore } from '../store/progressStore';
import { modules,getTotalLessons,getLesson } from '../data/curriculum';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { streak, xp, level, lessonsCompleted, currentLessonId } = useProgressStore();
  const totalLessons = getTotalLessons();
  const progressPercent = Math.round((lessonsCompleted.length / totalLessons) * 100);

  const currentLessonInfo = currentLessonId ? getLesson(currentLessonId) : undefined;

  const levels = [
    { level: 0, title: 'Foundations', count: '1 Module', desc: 'Hardware, CLI, HTTP, JSON, APIs', color: 'from-cyan-500 to-blue-500' },
    { level: 1, title: 'Python for AI', count: '1 Module', desc: 'Syntax, Type Hints, Pydantic Schemas', color: 'from-blue-500 to-indigo-500' },
    { level: 2, title: 'LLMs & Prompting', count: '3 Modules', desc: 'Tokens, Context, Few-Shot, JSON Outputs', color: 'from-indigo-500 to-purple-500' },
    { level: 3, title: 'Tools & RAG', count: '3 Modules', desc: 'Function Calling, Embeddings, Vector DBs', color: 'from-purple-500 to-emerald-500' },
    { level: 4, title: 'Agent Architecture', count: '2 Modules', desc: 'ReAct Loops, State, Memory, Reflection', color: 'from-emerald-500 to-amber-500' },
    { level: 5, title: 'Frameworks & MCP', count: '3 Modules', desc: 'LangGraph, Multi-Agents, CrewAI, MCP', color: 'from-amber-500 to-pink-500' },
    { level: 6, title: 'Production & Eval', count: '2 Modules', desc: 'Guardrails, LLM-as-a-Judge, Tracing', color: 'from-pink-500 to-rose-500' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-accent-purple/30 p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-accent-purple/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-lg bg-accent-purple/20 text-accent-purple-light">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-accent-purple-light uppercase tracking-widest font-mono">
              The Definitive Interactive Guide
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            Agentic AI <span className="bg-gradient-to-r from-accent-purple-light to-accent-blue-light bg-clip-text text-transparent">Zero to Hero</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
            Start from absolute zero programming knowledge and systematically master autonomous agent loops, tool calling, RAG, LangGraph state machines, multi-agent swarms, and production evaluation.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => navigate(currentLessonId ? `/lesson/${currentLessonId}` : '/roadmap')}
              className="btn-primary py-3 px-6 shadow-glow-purple text-sm"
            >
              <Compass className="w-4 h-4" />
              <span>{currentLessonId ? 'Resume Learning' : 'Start Zero to Hero Journey'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/playground')}
              className="btn-secondary py-3 px-5 text-sm"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Open Interactive Playgrounds</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Progress Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 bg-dark-surface border-dark-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overall Progress</span>
            <BookOpen className="w-4 h-4 text-accent-blue-light" />
          </div>
          <div className="text-2xl font-black text-slate-100">{progressPercent}%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {lessonsCompleted.length} of {totalLessons} lessons finished
          </div>
          <ProgressBar progress={progressPercent} className="mt-3" heightClass="h-1.5" />
        </div>

        <div className="card p-4 bg-dark-surface border-dark-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Daily Streak</span>
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{streak} Days</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Practice daily to solidify mental models
          </div>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <span
                key={d}
                className={`h-1.5 flex-1 rounded-full ${
                  d <= Math.min(streak, 7) ? 'bg-amber-400' : 'bg-dark-surface3'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="card p-4 bg-dark-surface border-dark-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Experience Level</span>
            <Award className="w-4 h-4 text-accent-purple-light" />
          </div>
          <div className="text-2xl font-black text-accent-purple-light">Level {level}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {xp} Total XP earned
          </div>
          <ProgressBar progress={(xp % 200) / 2} className="mt-3" heightClass="h-1.5" colorClass="bg-accent-purple" />
        </div>

        <div className="card p-4 bg-dark-surface border-dark-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Curriculum Breadth</span>
            <Boxes className="w-4 h-4 text-accent-green-light" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{modules.length} Modules</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Zero knowledge through Production
          </div>
          <div className="mt-3 flex gap-1">
            {levels.map((lvl) => (
              <span key={lvl.level} className="h-1.5 flex-1 rounded-full bg-emerald-500/40" />
            ))}
          </div>
        </div>
      </div>

      {/* Up Next / Resume Card */}
      {currentLessonInfo && (
        <div className="card p-5 bg-gradient-to-r from-dark-surface2 to-dark-surface border border-accent-purple/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">
                Up Next: Module {currentLessonInfo.module.order}
              </Badge>
              <span className="text-xs text-slate-400">~{currentLessonInfo.lesson.estimatedMinutes} mins</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {currentLessonInfo.lesson.title}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-1">
              {currentLessonInfo.lesson.content.whatIsIt}
            </p>
          </div>
          <button
            onClick={() => navigate(`/lesson/${currentLessonInfo.lesson.id}`)}
            className="btn-primary flex-shrink-0"
          >
            <span>Continue Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* The 7 Levels Roadmap Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Your Progression: Level 0 to Level 6</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Every level builds directly upon the previous foundation. No random tangents.
            </p>
          </div>
          <button
            onClick={() => navigate('/roadmap')}
            className="text-xs text-accent-purple-light hover:text-white flex items-center gap-1 font-semibold"
          >
            View Full Timeline →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {levels.map((lvl) => (
            <div
              key={lvl.level}
              onClick={() => navigate('/learn')}
              className="card-hover p-4 bg-dark-surface border border-dark-border cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-dark-surface2 text-slate-300 font-bold">
                  LEVEL {lvl.level}
                </span>
                <span className="text-[11px] text-slate-500">{lvl.count}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-accent-purple-light transition-colors">
                {lvl.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {lvl.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launch Interactive Tools */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Interactive Simulation Labs</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Hands-on interactive playgrounds to understand agent internals visually.
            </p>
          </div>
          <button
            onClick={() => navigate('/playground')}
            className="text-xs text-emerald-400 hover:text-white flex items-center gap-1 font-semibold"
          >
            Explore All Labs →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => navigate('/playground')}
            className="card-hover p-4 bg-dark-surface border-dark-border cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-accent-purple/20 text-accent-purple-light flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">Prompt Studio</h3>
            <p className="text-xs text-slate-400 mt-1">Few-shot, Chain-of-Thought, personas, and live streaming.</p>
          </div>

          <div
            onClick={() => navigate('/playground')}
            className="card-hover p-4 bg-dark-surface border-dark-border cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-accent-green/20 text-accent-green-light flex items-center justify-center mb-3">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">Tool Call Simulator</h3>
            <p className="text-xs text-slate-400 mt-1">5-stage animated lifecycle from user query to tool result.</p>
          </div>

          <div
            onClick={() => navigate('/playground')}
            className="card-hover p-4 bg-dark-surface border-dark-border cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">2D Vector Space (RAG)</h3>
            <p className="text-xs text-slate-400 mt-1">Visual semantic distance, chunk retrieval, and augmented prompts.</p>
          </div>

          <div
            onClick={() => navigate('/playground')}
            className="card-hover p-4 bg-dark-surface border-dark-border cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">ReAct Loop Runner</h3>
            <p className="text-xs text-slate-400 mt-1">Watch Thought → Action → Observation cycles in real time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
