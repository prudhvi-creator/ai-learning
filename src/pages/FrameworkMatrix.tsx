import React,{ useState } from 'react';
import { Scale,Check,X } from 'lucide-react';
import { frameworksComparison,type FrameworkComparison } from '../data/frameworks';
import { Badge } from '../components/ui/Badge';
import { CodeBlock } from '../components/ui/CodeBlock';

export const FrameworkMatrix: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState<FrameworkComparison>(frameworksComparison[0]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-accent-purple-light text-xs font-bold uppercase tracking-wider mb-1">
          <Scale className="w-4 h-4" />
          <span>Ecosystem Comparison</span>
        </div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">
          Agent Framework Comparison Matrix
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans leading-relaxed">
          Cut through framework marketing noise. Understand the exact trade-offs, state representations, and architectural sweet spots of today's agent frameworks.
        </p>
      </div>

      {/* Framework Selector Pills */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-dark-surface border border-dark-border">
        {frameworksComparison.map((fw) => (
          <button
            key={fw.id}
            onClick={() => setSelectedFramework(fw)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFramework.id === fw.id
                ? 'bg-accent-purple text-white shadow-glow-purple scale-102'
                : 'text-slate-400 hover:text-white hover:bg-dark-surface2'
            }`}
          >
            {fw.name}
          </button>
        ))}
      </div>

      {/* In-Depth Card for Selected Framework */}
      <div className="card p-6 bg-dark-surface border-dark-border rounded-3xl space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-black text-slate-100">{selectedFramework.name}</h2>
              <span className="text-xs text-slate-400">by {selectedFramework.creator}</span>
            </div>
            <p className="text-xs text-accent-purple-light font-medium">
              Architecture: {selectedFramework.architectureStyle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={
                selectedFramework.productionReadiness === 'Production-Ready'
                  ? 'green'
                  : 'blue'
              }
              size="sm"
            >
              {selectedFramework.productionReadiness}
            </Badge>
            <Badge variant="purple" size="sm">
              Learning Curve: {selectedFramework.learningCurve}
            </Badge>
          </div>
        </div>

        {/* Core Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-dark-surface2 border border-dark-border">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Primary Abstraction
            </span>
            <p className="text-xs text-slate-200 font-medium">{selectedFramework.primaryAbstraction}</p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-surface2 border border-dark-border">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              State Management
            </span>
            <p className="text-xs text-slate-200 font-medium">{selectedFramework.stateManagement}</p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-surface2 border border-dark-border">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Multi-Agent Orchestration
            </span>
            <p className="text-xs text-slate-200 font-medium">{selectedFramework.multiAgentSupport}</p>
          </div>
        </div>

        {/* Best For Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-accent-purple/10 to-accent-blue/10 border border-accent-purple/30">
          <span className="text-xs font-bold text-accent-purple-light uppercase tracking-wider block mb-1">
            🎯 Best For:
          </span>
          <p className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed">
            {selectedFramework.bestFor}
          </p>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Key Strengths:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {selectedFramework.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
              Trade-offs & Considerations:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {selectedFramework.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Code Snippet */}
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Canonical Code Example:
          </span>
          <CodeBlock
            code={selectedFramework.sampleSnippet}
            language="python"
            title={`${selectedFramework.name} Pattern`}
          />
        </div>
      </div>
    </div>
  );
};
