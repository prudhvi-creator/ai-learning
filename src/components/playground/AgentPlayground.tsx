import { useAutoAdvance } from './useAutoAdvance';
import React,{ useState } from 'react';
import { Bot,Play,Pause,RotateCcw,CheckCircle2,Cpu,Wrench,Eye,ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface TraceStep {
  iteration: number;
  thought: string;
  action?: { tool: string; input: string };
  observation?: string;
  finalAnswer?: string;
}

interface Scenario {
  id: string;
  name: string;
  goal: string;
  tools: string[];
  traces: TraceStep[];
}

const AGENT_SCENARIOS: Scenario[] = [
  {
    id: 'market-research',
    name: 'Autonomous Market Research Agent',
    goal: 'Find the latest valuation of Stripe, find Adyen’s annual net revenue, and compare their scale.',
    tools: ['Web Search', 'Financial DB API', 'Calculator'],
    traces: [
      {
        iteration: 1,
        thought: "I need to identify Stripe's most recent confirmed valuation and annual payment volume.",
        action: { tool: 'Web Search', input: 'query="Stripe latest valuation 2024 2025 tender offer"' },
        observation: "Stripe closed a tender offer at a $65 billion valuation, processing over $1 trillion in total volume."
      },
      {
        iteration: 2,
        thought: "Stripe's key European competitor is Adyen. I need to query the financial database for Adyen's latest annual net revenue.",
        action: { tool: 'Financial DB API', input: 'symbol="ADYEN", metric="net_revenue_eur"' },
        observation: "Adyen reported annual net revenue of €1.63 billion (approx $1.76B USD), up 22% YoY."
      },
      {
        iteration: 3,
        thought: "I need to calculate the revenue comparison ratio between Stripe's estimated revenue (~$14B) and Adyen ($1.76B).",
        action: { tool: 'Calculator', input: 'formula="14.0 / 1.76"' },
        observation: "7.95"
      },
      {
        iteration: 4,
        thought: "I have gathered all the facts and executed the comparative calculation. I am ready to return the final structured synthesis.",
        finalAnswer: `### Market Comparison: Stripe vs. Adyen

| Metric | Stripe (Private) | Adyen (Public - AMS:ADYEN) |
|---|---|---|
| **Valuation / Market Cap** | $65.0 Billion (Tender Offer) | ~$42.0 Billion |
| **Annual Volume** | >$1.0 Trillion | >€890 Billion |
| **Net Revenue** | ~$14.0 Billion (est.) | €1.63 Billion ($1.76B) |
| **Growth Rate** | ~25% YoY | ~22% YoY |

**Key Takeaway:** While Adyen maintains exceptionally high EBITDA margins as a public entity, Stripe processes approximately 8x the revenue volume powered by its broader developer platform.`
      }
    ]
  },
  {
    id: 'code-debugger',
    name: 'Self-Healing Code Agent',
    goal: 'Diagnose and fix a ZeroDivisionError in an async batch worker script.',
    tools: ['File Reader', 'Python AST Linter', 'Code Patch Exec'],
    traces: [
      {
        iteration: 1,
        thought: "I need to inspect the traceback in error_logs.txt to locate the exact crashing file and line number.",
        action: { tool: 'File Reader', input: 'path="logs/error_logs.txt"' },
        observation: "ZeroDivisionError: division by zero in worker.py line 48 in `compute_average_latency()`"
      },
      {
        iteration: 2,
        thought: "Let me inspect lines 40-55 of `worker.py` to see why the divisor is zero.",
        action: { tool: 'File Reader', input: 'path="worker.py", lines="40-55"' },
        observation: "return sum(latencies) / len(latencies) # Crashes when empty list [] is passed"
      },
      {
        iteration: 3,
        thought: "The function fails when `latencies` is empty. I will apply a guard clause returning 0.0 if not latencies.",
        action: { tool: 'Code Patch Exec', input: 'file="worker.py", patch="if not latencies: return 0.0"' },
        observation: "Patch applied successfully. 12 automated test cases passed (0 failures)."
      },
      {
        iteration: 4,
        thought: "The fix has been verified with unit tests. Ready to present the solution.",
        finalAnswer: `The root cause was that \`compute_average_latency()\` did not check for an empty list before calculating \`len(latencies)\`. 

I applied a guard clause:
\`\`\`python
def compute_average_latency(latencies: list[float]) -> float:
    if not latencies:
        return 0.0
    return sum(latencies) / len(latencies)
\`\`\`
All unit tests now pass without regression.`
      }
    ]
  }
];

export const AgentPlayground: React.FC = () => {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const memoryMode = 'buffer';

  const scenario = AGENT_SCENARIOS[selectedScenarioIdx];
  const traces = scenario.traces;
  const currentStep = traces[activeStepIdx];

  const handleNext = () => {
    if (activeStepIdx < traces.length - 1) {
      setActiveStepIdx(activeStepIdx + 1);
    } else {
      setIsRunning(false);
    }
  };

  const handlePrev = () => {
    if (activeStepIdx > 0) {
      setActiveStepIdx(activeStepIdx - 1);
    }
  };

  const handleReset = () => {
    setActiveStepIdx(0);
    setIsRunning(false);
  };

  useAutoAdvance(isRunning, activeStepIdx, traces.length - 1, 3000, setActiveStepIdx, setIsRunning);

  const toggleRun = () => {
    if (!isRunning && activeStepIdx === traces.length - 1) setActiveStepIdx(0);
    setIsRunning(!isRunning);
  };

  return (
    <div className="card p-6 bg-dark-surface border-dark-border text-slate-100 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-dark-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Bot className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">Autonomous ReAct Agent Loop Simulator</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Observe the autonomous Think → Act → Observe cycle in real-time as an agent solves multi-step objectives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {AGENT_SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioIdx(idx);
                setActiveStepIdx(0);
                setIsRunning(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedScenarioIdx === idx
                  ? 'bg-amber-500 text-dark-bg font-bold shadow-glow-orange'
                  : 'bg-dark-surface2 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Goal & Agent Specs Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        <div className="p-3 rounded-xl bg-dark-bg border border-dark-border col-span-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            🎯 Agent Assigned Goal:
          </span>
          <p className="text-xs text-slate-200 font-medium">{scenario.goal}</p>
        </div>

        <div className="p-3 rounded-xl bg-dark-bg border border-dark-border flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            🧰 Available Tools:
          </span>
          <div className="flex flex-wrap gap-1">
            {scenario.tools.map((t) => (
              <Badge key={t} variant="purple" size="sm">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Main Execution Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        {/* Step Progress List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            ReAct Iteration Trail
          </div>
          {traces.map((step, idx) => {
            const isCurrent = idx === activeStepIdx;
            const isDone = idx < activeStepIdx;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveStepIdx(idx);
                  setIsRunning(false);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-glow-orange'
                    : isDone
                    ? 'bg-dark-surface2 border-emerald-500/30 text-slate-300'
                    : 'bg-dark-surface/50 border-dark-border text-slate-500'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5 flex-shrink-0 ${
                    isCurrent
                      ? 'bg-amber-500 text-dark-bg'
                      : isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-dark-surface3 text-slate-400'
                  }`}
                >
                  {isDone ? '✓' : step.iteration}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>
                      {step.finalAnswer ? '🏁 Final Answer' : `Iteration #${step.iteration}`}
                    </span>
                    {step.action && (
                      <span className="text-[10px] text-accent-purple-light font-mono">
                        {step.action.tool}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {step.thought}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Trace Detail Panel */}
        <div className="lg:col-span-8 bg-dark-bg border border-dark-border rounded-2xl p-5 flex flex-col justify-between min-h-[360px]">
          <div className="space-y-4">
            {/* Iteration Header */}
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-bold text-sm text-slate-100">
                  Execution State — Iteration {currentStep.iteration} of {traces.length}
                </span>
              </div>
              <Badge variant="orange" size="sm">
                Memory: {memoryMode.toUpperCase()}
              </Badge>
            </div>

            {/* Thought Box */}
            <div className="bg-dark-surface2 p-3.5 rounded-xl border border-dark-border">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>🧠 Agent Thought (Reasoning):</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-mono">
                "{currentStep.thought}"
              </p>
            </div>

            {/* Action & Observation Box (if not final) */}
            {currentStep.action && (
              <div className="bg-dark-surface2 p-3.5 rounded-xl border border-dark-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-purple-light">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>⚡ Dispatched Action:</span>
                  </div>
                  <Badge variant="purple" size="sm">
                    {currentStep.action.tool}
                  </Badge>
                </div>
                <div className="bg-dark-bg p-2 rounded text-[11px] font-mono text-slate-300">
                  {currentStep.action.input}
                </div>

                {currentStep.observation && (
                  <div className="pt-2 border-t border-dark-border/60">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-green-light mb-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>👀 Environment Observation (Feedback):</span>
                    </div>
                    <p className="text-xs text-emerald-300/90 font-mono bg-emerald-950/20 p-2 rounded border border-emerald-900/30">
                      {currentStep.observation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Final Answer Box */}
            {currentStep.finalAnswer && (
              <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Mission Accomplished — Final Deliverable:
                </div>
                <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                  {currentStep.finalAnswer}
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-dark-border">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={activeStepIdx === 0}
                className="px-3 py-1.5 rounded-lg bg-dark-surface border border-dark-border text-xs font-medium text-slate-300 hover:text-white disabled:opacity-40"
              >
                Previous Step
              </button>
              <button
                onClick={handleNext}
                disabled={activeStepIdx === traces.length - 1}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-dark-bg text-xs font-bold hover:bg-amber-400 disabled:opacity-40 shadow-glow-orange flex items-center gap-1"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleRun}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-surface border border-dark-border text-xs font-medium text-slate-200 hover:text-white"
              >
                {isRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                {isRunning ? 'Pause' : 'Auto Play'}
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-dark-surface border border-dark-border text-slate-400 hover:text-white"
                title="Reset Loop"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
