import { useAutoAdvance } from './useAutoAdvance';
import React,{ useState } from 'react';
import { GitBranch,Play,RotateCcw,CheckCircle,ShieldAlert,Cpu,Database,UserCheck,ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface GraphScenario {
  id: string;
  title: string;
  description: string;
  initialQuery: string;
  refundAmount?: number;
  expectedPath: string[];
}

const GRAPH_SCENARIOS: GraphScenario[] = [
  {
    id: 'faq-flow',
    title: 'Standard FAQ Knowledge Query',
    description: 'User asks a product question. Router routes to RAG node, then completes.',
    initialQuery: 'What is your enterprise cancellation policy?',
    expectedPath: ['__start__', 'classifier_router', 'rag_faq_node', '__end__']
  },
  {
    id: 'auto-refund',
    title: 'Low-Value Refund (< $500)',
    description: 'User requests a $45 refund. Automatically processed by tool node without human intervention.',
    initialQuery: 'I want a refund for invoice #INV-4921 ($45).',
    refundAmount: 45,
    expectedPath: ['__start__', 'classifier_router', 'auto_refund_node', '__end__']
  },
  {
    id: 'human-approval',
    title: 'High-Value Refund (> $500) Breakpoint',
    description: 'User requests a $1,200 refund. Conditional edge interrupts flow and routes to Human-in-the-loop approval!',
    initialQuery: 'Please refund our annual team license ($1,200).',
    refundAmount: 1200,
    expectedPath: ['__start__', 'classifier_router', 'human_review_node', 'auto_refund_node', '__end__']
  }
];

export const LangGraphBuilder: React.FC = () => {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const scenario = GRAPH_SCENARIOS[activeScenarioIdx];
  const activePath = scenario.expectedPath;
  const currentNode = activePath[currentStepIdx];

  // Dynamic State representation
  const graphState = {
    user_id: 'usr_88291',
    query: scenario.initialQuery,
    intent: currentStepIdx >= 1 ? (scenario.refundAmount ? 'REFUND' : 'FAQ') : 'PENDING',
    refund_amount: scenario.refundAmount || 0,
    human_approved: currentStepIdx >= 3 && scenario.refundAmount && scenario.refundAmount > 500 ? true : false,
    status: currentStepIdx === activePath.length - 1 ? 'COMPLETED' : 'IN_PROGRESS'
  };

  const handleNext = () => {
    if (currentStepIdx < activePath.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      setIsSimulating(false);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsSimulating(false);
  };

  useAutoAdvance(isSimulating, currentStepIdx, activePath.length - 1, 1500, setCurrentStepIdx, setIsSimulating);

  const handleRunAll = () => {
    setCurrentStepIdx(0);
    setIsSimulating(true);
  };

  const nodes = [
    { id: '__start__', label: 'START', type: 'system', icon: Play, desc: 'Entry point' },
    { id: 'classifier_router', label: 'Intent Router', type: 'agent', icon: Cpu, desc: 'Classifies Query Intent' },
    { id: 'rag_faq_node', label: 'RAG Knowledge Node', type: 'rag', icon: Database, desc: 'Vector Search & FAQ' },
    { id: 'human_review_node', label: 'Human-in-the-Loop', type: 'human', icon: UserCheck, desc: 'Manager Breakpoint' },
    { id: 'auto_refund_node', label: 'Refund Tool Exec', type: 'tool', icon: ShieldAlert, desc: 'Dispatches Stripe API' },
    { id: '__end__', label: 'END', type: 'system', icon: CheckCircle, desc: 'Workflow Completion' }
  ];

  return (
    <div className="card p-6 bg-dark-surface border-dark-border text-slate-100 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-dark-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
              <GitBranch className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">LangGraph Stateful Workflow Builder</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            See how cyclic state machines, conditional edges, and human-in-the-loop checkpoints work.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {GRAPH_SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => {
                setActiveScenarioIdx(idx);
                setCurrentStepIdx(0);
                setIsSimulating(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeScenarioIdx === idx
                  ? 'bg-pink-500 text-white shadow-glow-pink'
                  : 'bg-dark-surface2 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>
      </div>

      <div className="my-3 p-3 bg-dark-bg border border-dark-border rounded-xl text-xs flex items-center justify-between">
        <div>
          <span className="text-slate-400">Scenario Goal: </span>
          <span className="text-slate-200 font-medium">{scenario.description}</span>
        </div>
        <Badge variant={scenario.refundAmount && scenario.refundAmount > 500 ? 'orange' : 'purple'} size="sm">
          {scenario.refundAmount && scenario.refundAmount > 500 ? 'Requires Human Checkpoint' : 'Fully Autonomous'}
        </Badge>
      </div>

      {/* Main Visualizer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        {/* Visual Graph Canvas */}
        <div className="lg:col-span-7 bg-dark-bg border border-dark-border rounded-2xl p-5 relative min-h-[380px] flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            StateGraph Topology & Active Node
          </div>

          {/* Graph Nodes Visual Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto">
            {nodes.map((node) => {
              const isActive = currentNode === node.id;
              const isPassed = activePath.indexOf(node.id) !== -1 && activePath.indexOf(node.id) < currentStepIdx;
              const isRelevant = activePath.includes(node.id);

              return (
                <div
                  key={node.id}
                  className={`p-3 rounded-xl border transition-all relative ${
                    isActive
                      ? 'bg-pink-500/20 border-pink-400 shadow-glow-purple scale-105 z-10'
                      : isPassed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                      : isRelevant
                      ? 'bg-dark-surface2 border-dark-border text-slate-400'
                      : 'bg-dark-surface/40 border-dark-border/40 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`p-1 rounded-md ${isActive ? 'bg-pink-500 text-white' : 'bg-dark-surface3 text-slate-400'}`}>
                      {React.createElement(node.icon, { className: 'w-3.5 h-3.5' })}
                    </span>
                    {isActive && (
                      <span className="text-[10px] bg-pink-500/30 text-pink-300 px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-200">{node.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{node.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-dark-border/60">
            <div className="flex items-center gap-2">
              <button
                onClick={handleNext}
                disabled={currentStepIdx === activePath.length - 1}
                className="px-3 py-1.5 rounded-lg bg-pink-600 text-white text-xs font-medium hover:bg-pink-500 disabled:opacity-40 flex items-center gap-1 shadow-glow-pink"
              >
                Step Forward <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRunAll}
                disabled={isSimulating}
                className="px-3 py-1.5 rounded-lg bg-dark-surface border border-dark-border text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" /> Run All
              </button>
            </div>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-dark-surface border border-dark-border text-slate-400 hover:text-white"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Graph State Inspector */}
        <div className="lg:col-span-5 bg-dark-bg border border-dark-border rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-dark-border">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                LangGraph State Schema (TypedDict)
              </span>
              <Badge variant="blue" size="sm">
                Step {currentStepIdx + 1} of {activePath.length}
              </Badge>
            </div>

            <div className="bg-dark-bg rounded-xl p-3 border border-dark-border text-xs font-mono">
              <pre className="text-pink-300">
{JSON.stringify(graphState, null, 2)}
              </pre>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-slate-200">Current Node Action:</div>
              {currentNode === '__start__' && (
                <p className="text-slate-400">Workflow initialized. Passing input user query to router.</p>
              )}
              {currentNode === 'classifier_router' && (
                <p className="text-slate-400">Model classified intent as <strong className="text-pink-400">{graphState.intent}</strong>. Evaluating conditional edges...</p>
              )}
              {currentNode === 'rag_faq_node' && (
                <p className="text-slate-400">Querying vector store knowledge base and generating grounded policy response.</p>
              )}
              {currentNode === 'human_review_node' && (
                <p className="text-amber-300 bg-amber-950/20 p-2 rounded border border-amber-900/40">
                  ⚠️ <strong>Human Interrupt Triggered:</strong> Refund amount ($1,200) exceeds $500 safety threshold. State persisted to MemorySaver waiting for manager approval token.
                </p>
              )}
              {currentNode === 'auto_refund_node' && (
                <p className="text-emerald-300 bg-emerald-950/20 p-2 rounded border border-emerald-900/40">
                  ✓ Refund executed via Stripe API tool for user {graphState.user_id}.
                </p>
              )}
              {currentNode === '__end__' && (
                <p className="text-emerald-400 font-semibold">Workflow execution reached terminal state (__end__). Result saved to thread history.</p>
              )}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-dark-surface2 border border-dark-border text-[11px] text-slate-400 mt-4">
            💡 <strong>Why LangGraph over Chains:</strong> In LangGraph, state is persistent and can be interrupted, approved by humans, or looped until validation criteria are met.
          </div>
        </div>
      </div>
    </div>
  );
};
