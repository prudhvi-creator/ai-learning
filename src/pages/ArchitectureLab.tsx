import React,{ useState } from 'react';
import {
Boxes,
ShieldCheck,
Cpu,
Database,
UserCheck,
CheckCircle2,
AlertTriangle,Sparkles,
Layers,Plus,
Trash2
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import confetti from 'canvas-confetti';
import { useProgressStore } from '../store/progressStore';

interface ComponentOption {
  id: string;
  name: string;
  category: 'Security' | 'Routing' | 'Data' | 'Execution' | 'Safety';
  icon: any;
  color: string;
  description: string;
}

const AVAILABLE_COMPONENTS: ComponentOption[] = [
  {
    id: 'input-guardrail',
    name: 'Input Guardrail & PII Redactor',
    category: 'Security',
    icon: ShieldCheck,
    color: '#ef4444',
    description: 'Masks credit cards/SSNs and scans for prompt injections before reaching LLM.'
  },
  {
    id: 'intent-router',
    name: 'Intent Classifier / Router',
    category: 'Routing',
    icon: Cpu,
    color: '#a855f7',
    description: 'Evaluates user query to route between FAQ, Account Management, or Billing.'
  },
  {
    id: 'rag-retriever',
    name: 'RAG Knowledge Retriever',
    category: 'Data',
    icon: Database,
    color: '#06b6d4',
    description: 'Fetches company policy chunks to ground the agent with verified facts.'
  },
  {
    id: 'execution-agent',
    name: 'Autonomous Tool-Calling Agent',
    category: 'Execution',
    icon: Boxes,
    color: '#f59e0b',
    description: 'Decides actions, invokes APIs, and handles step-by-step logic.'
  },
  {
    id: 'human-review',
    name: 'Human-in-the-Loop Breakpoint',
    category: 'Safety',
    icon: UserCheck,
    color: '#10b981',
    description: 'Pauses execution and requests manager approval for destructive or high-value actions.'
  },
  {
    id: 'output-guardrail',
    name: 'Output Verifier & Hallucination Filter',
    category: 'Security',
    icon: ShieldCheck,
    color: '#ef4444',
    description: 'Validates final LLM response against grounded sources before sending to customer.'
  }
];

export const ArchitectureLab: React.FC = () => {
  const { recordQuizScore } = useProgressStore();
  const [pipeline, setPipeline] = useState<string[]>([
    'input-guardrail',
    'intent-router',
    'rag-retriever',
    'execution-agent'
  ]);
  const [validationResult, setValidationResult] = useState<{
    score: number;
    critique: string[];
    passed: boolean;
  } | null>(null);

  const addComponent = (id: string) => {
    if (!pipeline.includes(id)) {
      setPipeline([...pipeline, id]);
      setValidationResult(null);
    }
  };

  const removeComponent = (id: string) => {
    setPipeline(pipeline.filter((item) => item !== id));
    setValidationResult(null);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...pipeline];
    const temp = next[idx - 1];
    next[idx - 1] = next[idx];
    next[idx] = temp;
    setPipeline(next);
    setValidationResult(null);
  };

  const handleValidate = () => {
    const critiques: string[] = [];
    let score = 100;

    // Check 1: Input guardrail placed first
    const inputGuardrailIdx = pipeline.indexOf('input-guardrail');
    if (inputGuardrailIdx === -1) {
      score -= 25;
      critiques.push('⚠️ Missing Input Guardrail: System is vulnerable to prompt injections and PII leakage.');
    } else if (inputGuardrailIdx !== 0) {
      score -= 15;
      critiques.push('⚠️ Input Guardrail should be at Step 1 to sanitize prompts before routing or model ingestion.');
    } else {
      critiques.push('✓ Input Guardrail correctly placed at front boundary.');
    }

    // Check 2: Router before Execution
    const routerIdx = pipeline.indexOf('intent-router');
    const agentIdx = pipeline.indexOf('execution-agent');
    if (agentIdx !== -1 && routerIdx !== -1 && routerIdx > agentIdx) {
      score -= 15;
      critiques.push('⚠️ Intent Router is placed after Execution Agent. Router must classify intent first.');
    } else if (routerIdx !== -1) {
      critiques.push('✓ Intent Router properly separates inquiry traffic.');
    }

    // Check 3: Human-in-the-loop check
    if (!pipeline.includes('human-review')) {
      score -= 15;
      critiques.push('💡 Recommendation: Add Human-in-the-Loop breakpoint to safeguard refunds and mutations.');
    } else {
      critiques.push('✓ Human-in-the-Loop breakpoint safeguards high-risk actions.');
    }

    // Check 4: Output guardrail
    if (!pipeline.includes('output-guardrail')) {
      score -= 10;
      critiques.push('💡 Recommendation: Add Output Guardrail to catch hallucinated claims before customer delivery.');
    } else if (pipeline.indexOf('output-guardrail') === pipeline.length - 1) {
      critiques.push('✓ Output Guardrail positioned as final quality gate.');
    }

    const passed = score >= 80;
    setValidationResult({ score, critique: critiques, passed });
    recordQuizScore('architecture-lab-eval', score);

    if (passed) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Boxes className="w-4 h-4" />
          <span>System Design Challenge</span>
        </div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">
          Architecture Design Lab
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans leading-relaxed">
          Design a secure, enterprise-grade agent pipeline. Assemble modular building blocks and validate your system against industry security, latency, and safety benchmarks.
        </p>
      </div>

      {/* Challenge Scenario Banner */}
      <div className="card p-5 bg-gradient-to-r from-dark-surface2 to-dark-surface border border-pink-500/30 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
            Active Mission: Customer Operations AI
          </span>
          <Badge variant="pink" size="sm">Difficulty: Production</Badge>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          "Build an enterprise customer support agent pipeline capable of answering policy questions, processing refunds, blocking malicious prompt injections, and alerting human supervisors for payments exceeding $500."
        </p>
      </div>

      {/* Two Column Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Component Palette */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Available Building Blocks
            </span>
            <span className="text-[11px] text-slate-500">Click + to add</span>
          </div>

          <div className="space-y-2">
            {AVAILABLE_COMPONENTS.map((comp) => {
              const isAdded = pipeline.includes(comp.id);
              return (
                <div
                  key={comp.id}
                  className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isAdded
                      ? 'bg-dark-surface/50 border-dark-border/40 opacity-50'
                      : 'bg-dark-surface border-dark-border hover:border-accent-purple/50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="p-1.5 rounded-lg text-white mt-0.5"
                      style={{ backgroundColor: comp.color }}
                    >
                      {React.createElement(comp.icon, { className: 'w-3.5 h-3.5' })}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-100">{comp.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {comp.description}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => addComponent(comp.id)}
                    disabled={isAdded}
                    className="p-1.5 rounded-lg bg-dark-surface2 text-slate-300 hover:text-white hover:bg-dark-surface3 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Add to pipeline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Your Active Architecture Pipeline */}
        <div className="lg:col-span-7 bg-dark-surface border border-dark-border rounded-2xl p-5 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent-purple-light" />
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  Your Configured Pipeline ({pipeline.length} Nodes)
                </span>
              </div>
              <button
                onClick={() => {
                  setPipeline([]);
                  setValidationResult(null);
                }}
                className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Pipeline Stage Sequence */}
            <div className="my-4 space-y-2">
              {pipeline.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500 border border-dashed border-dark-border rounded-xl">
                  No components in pipeline. Click "+" on the left to add building blocks.
                </div>
              ) : (
                pipeline.map((id, idx) => {
                  const comp = AVAILABLE_COMPONENTS.find((c) => c.id === id);
                  if (!comp) return null;

                  return (
                    <div
                      key={id}
                      className="p-3 rounded-xl bg-dark-surface2 border border-dark-border flex items-center justify-between gap-3 animate-fade-in"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-dark-surface3 border border-dark-border text-slate-400 flex items-center justify-center text-[10px] font-mono font-bold">
                          {idx + 1}
                        </span>
                        <span
                          className="p-1 rounded-md text-white"
                          style={{ backgroundColor: comp.color }}
                        >
                          {React.createElement(comp.icon, { className: 'w-3 h-3' })}
                        </span>
                        <span className="text-xs font-bold text-slate-200">{comp.name}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {idx > 0 && (
                          <button
                            onClick={() => moveUp(idx)}
                            className="text-[10px] px-2 py-0.5 rounded bg-dark-surface text-slate-400 hover:text-white"
                            title="Move up"
                          >
                            ↑
                          </button>
                        )}
                        <button
                          onClick={() => removeComponent(id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors ml-1"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Validate Button */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleValidate}
                disabled={pipeline.length === 0}
                className="btn-primary flex-1 justify-center py-2.5 text-xs shadow-glow-purple"
              >
                <Sparkles className="w-4 h-4" />
                <span>Validate Architecture & Score</span>
              </button>
              <button
                onClick={() => {
                  setPipeline([
                    'input-guardrail',
                    'intent-router',
                    'rag-retriever',
                    'human-review',
                    'execution-agent',
                    'output-guardrail'
                  ]);
                  setValidationResult(null);
                }}
                className="btn-secondary text-xs"
                title="Load recommended golden architecture"
              >
                Load Solution
              </button>
            </div>
          </div>

          {/* Validation Result Box */}
          {validationResult && (
            <div
              className={`p-4 rounded-xl border animate-slide-up ${
                validationResult.passed
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-rose-950/20 border-rose-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {validationResult.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                  <span className={validationResult.passed ? 'text-emerald-300' : 'text-rose-300'}>
                    {validationResult.passed ? 'Architecture Approved!' : 'Architecture Needs Revision'}
                  </span>
                </div>
                <span className="text-base font-black font-mono">
                  Score: {validationResult.score}/100
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                {validationResult.critique.map((c, i) => (
                  <div key={i}>{c}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
