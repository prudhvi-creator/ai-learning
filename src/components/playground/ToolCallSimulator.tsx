import { useAutoAdvance } from './useAutoAdvance';
import React,{ useState } from 'react';
import { Wrench,ArrowRight,ArrowLeft,Play,Pause,RotateCcw,CheckCircle2,Bot,User,Code2,Server,Cpu } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface Scenario {
  title: string;
  userQuery: string;
  toolName: string;
  toolSchema: object;
  toolArgs: object;
  toolResult: object;
  finalAnswer: string;
}

const SCENARIOS: Scenario[] = [
  {
    title: 'Weather Query & Unit Conversion',
    userQuery: 'What is the current temperature in Tokyo, and what would that be in Fahrenheit?',
    toolName: 'get_current_weather',
    toolSchema: {
      name: 'get_current_weather',
      description: 'Get real-time weather conditions for a city',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string', description: 'City name e.g. Tokyo' },
          unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }
        },
        required: ['location']
      }
    },
    toolArgs: { location: 'Tokyo', unit: 'celsius' },
    toolResult: { temperature: 21, condition: 'Partly Cloudy', humidity: '52%', wind_kmh: 14 },
    finalAnswer: 'The current temperature in Tokyo is 21°C (which is approximately 69.8°F) with partly cloudy skies and 52% humidity.'
  },
  {
    title: 'Database SQL Query',
    userQuery: 'How many enterprise customers signed up in the last 30 days?',
    toolName: 'query_customer_db',
    toolSchema: {
      name: 'query_customer_db',
      description: 'Execute a read-only SQL query against the customer analytics database',
      parameters: {
        type: 'object',
        properties: {
          sql: { type: 'string', description: 'Valid SELECT query' }
        },
        required: ['sql']
      }
    },
    toolArgs: { sql: "SELECT COUNT(*) as count FROM customers WHERE plan = 'enterprise' AND created_at >= date('now', '-30 days');" },
    toolResult: { row_count: 1, rows: [{ count: 37 }] },
    finalAnswer: 'According to the customer database, 37 enterprise customers signed up in the last 30 days.'
  },
  {
    title: 'Mathematical Computation',
    userQuery: 'Calculate the compound interest on $10,000 at 7% annual rate compounded monthly for 5 years.',
    toolName: 'calculate_compound_interest',
    toolSchema: {
      name: 'calculate_compound_interest',
      description: 'Accurately computes compound interest without LLM arithmetic hallucination',
      parameters: {
        type: 'object',
        properties: {
          principal: { type: 'number' },
          annual_rate: { type: 'number' },
          compounds_per_year: { type: 'number' },
          years: { type: 'number' }
        },
        required: ['principal', 'annual_rate', 'compounds_per_year', 'years']
      }
    },
    toolArgs: { principal: 10000, annual_rate: 0.07, compounds_per_year: 12, years: 5 },
    toolResult: { final_amount: 14176.25, total_interest: 4176.25, formula: "A = P(1 + r/n)^(nt)" },
    finalAnswer: 'With $10,000 invested at 7% compounded monthly for 5 years, your final balance will be $14,176.25 (earning $4,176.25 in total interest).'
  }
];

export const ToolCallSimulator: React.FC = () => {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenario = SCENARIOS[activeScenarioIdx];

  const steps = [
    {
      stepNumber: 1,
      name: 'User Input',
      actor: 'User',
      icon: User,
      color: 'blue',
      badge: 'Step 1 of 5',
      summary: 'User submits a natural language question requiring external data or calculations.',
      details: (
        <div className="bg-dark-bg p-4 rounded-xl border border-dark-border">
          <span className="text-xs text-slate-400 block mb-1">User Query:</span>
          <p className="text-sm font-medium text-slate-100 italic">"{scenario.userQuery}"</p>
        </div>
      )
    },
    {
      stepNumber: 2,
      name: 'LLM Evaluates Tool Schemas',
      actor: 'LLM Reasoning',
      icon: Cpu,
      color: 'purple',
      badge: 'Step 2 of 5',
      summary: 'The model analyzes the prompt against provided JSON schemas and determines that it cannot answer accurately without a tool.',
      details: (
        <div className="space-y-3">
          <div className="text-xs text-slate-300">
            Available tool detected in system registry: <code className="text-accent-purple-light font-mono font-semibold">{scenario.toolName}()</code>
          </div>
          <div className="bg-dark-bg p-3 rounded-lg border border-dark-border text-xs font-mono overflow-x-auto">
            <div className="text-slate-500 mb-1">// Tool Schema passed to LLM in API request:</div>
            <pre className="text-accent-purple-light">{JSON.stringify(scenario.toolSchema, null, 2)}</pre>
          </div>
        </div>
      )
    },
    {
      stepNumber: 3,
      name: 'LLM Emits Structured Tool Call',
      actor: 'LLM Output',
      icon: Code2,
      color: 'orange',
      badge: 'Step 3 of 5 (Crucial)',
      summary: 'IMPORTANT: The LLM does NOT execute code! It halts generation and outputs a structured JSON object containing tool name and parameter values.',
      details: (
        <div className="space-y-2">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-200">
            💡 <strong>Key Takeaway:</strong> The LLM is just a text model. It cannot make HTTP calls or run Python directly. It emits this JSON and tells your backend: "Please call this function for me."
          </div>
          <div className="bg-dark-bg p-3 rounded-lg border border-dark-border text-xs font-mono overflow-x-auto">
            <span className="text-slate-400">// Assistant Message Response with tool_calls:</span>
            <pre className="text-amber-300">
{JSON.stringify(
  {
    role: "assistant",
    content: null,
    tool_calls: [
      {
        id: "call_abc123xyz",
        type: "function",
        function: {
          name: scenario.toolName,
          arguments: JSON.stringify(scenario.toolArgs)
        }
      }
    ]
  },
  null,
  2
)}
            </pre>
          </div>
        </div>
      )
    },
    {
      stepNumber: 4,
      name: 'Application Runtime Executes Tool',
      actor: 'Your Backend / Runtime',
      icon: Server,
      color: 'green',
      badge: 'Step 4 of 5',
      summary: 'Your application code intercepts the tool_call, runs the actual Python/API function with the verified parameters, and gets the real result.',
      details: (
        <div className="space-y-2">
          <div className="text-xs text-slate-300">
            Backend dispatches to verified function: <code className="text-accent-green-light font-mono font-semibold">{scenario.toolName}({JSON.stringify(scenario.toolArgs)})</code>
          </div>
          <div className="bg-dark-bg p-3 rounded-lg border border-dark-border text-xs font-mono overflow-x-auto">
            <span className="text-slate-400">// Injected back into LLM context as role: "tool"</span>
            <pre className="text-emerald-300">
{JSON.stringify(
  {
    role: "tool",
    tool_call_id: "call_abc123xyz",
    name: scenario.toolName,
    content: JSON.stringify(scenario.toolResult)
  },
  null,
  2
)}
            </pre>
          </div>
        </div>
      )
    },
    {
      stepNumber: 5,
      name: 'Final Synthesis',
      actor: 'LLM Final Response',
      icon: Bot,
      color: 'purple',
      badge: 'Step 5 of 5',
      summary: 'The LLM receives the tool response in its message history and synthesizes a polished, accurate answer for the user.',
      details: (
        <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Grounded & Verified Final Answer:
          </div>
          <p className="text-sm text-slate-100 font-sans leading-relaxed">
            {scenario.finalAnswer}
          </p>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useAutoAdvance(isPlaying, currentStep, steps.length - 1, 2500, setCurrentStep, setIsPlaying);

  const togglePlay = () => {
    if (!isPlaying && currentStep === steps.length - 1) setCurrentStep(0);
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="card p-6 bg-dark-surface border-dark-border text-slate-100 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-dark-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-accent-green/20 text-accent-green-light">
              <Wrench className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">Interactive Tool Calling Simulator</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Step through the exact 5-stage lifecycle of how LLMs invoke functions and observe data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {SCENARIOS.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveScenarioIdx(idx);
                setCurrentStep(0);
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeScenarioIdx === idx
                  ? 'bg-accent-green text-white shadow-glow-green'
                  : 'bg-dark-surface2 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Step Timeline Indicator */}
      <div className="grid grid-cols-5 gap-2 my-6">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isPassed = idx < currentStep;
          return (
            <button
              key={idx}
              onClick={() => {
                setCurrentStep(idx);
                setIsPlaying(false);
              }}
              className={`flex flex-col items-center text-center p-2.5 rounded-xl border transition-all ${
                isActive
                  ? 'bg-dark-surface2 border-accent-purple shadow-glow-purple scale-105'
                  : isPassed
                  ? 'bg-dark-surface/80 border-emerald-500/40 text-slate-300'
                  : 'bg-dark-surface/40 border-dark-border text-slate-500 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                  isActive
                    ? 'bg-accent-purple text-white'
                    : isPassed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-dark-surface3 text-slate-400'
                }`}
              >
                {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <span className="text-[11px] font-semibold leading-tight line-clamp-1">{step.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Step Card */}
      <div className="bg-dark-surface2 border border-dark-border rounded-xl p-5 shadow-lg min-h-[300px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-dark-border">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-accent-purple/20 text-accent-purple-light">
                {React.createElement(steps[currentStep].icon, { className: 'w-4 h-4' })}
              </span>
              <span className="font-bold text-sm text-slate-100">
                {steps[currentStep].actor} — {steps[currentStep].name}
              </span>
            </div>
            <Badge variant="purple" size="sm">
              {steps[currentStep].badge}
            </Badge>
          </div>

          <p className="text-xs text-slate-300 mb-4 font-sans">
            {steps[currentStep].summary}
          </p>

          <div>{steps[currentStep].details}</div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-dark-border">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-3 py-1.5 rounded-lg bg-dark-surface border border-dark-border text-xs font-medium text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="px-3 py-1.5 rounded-lg bg-accent-purple text-white text-xs font-medium hover:bg-accent-purple/90 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 shadow-glow-purple"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-surface border border-dark-border text-xs font-medium text-slate-200 hover:text-white"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              {isPlaying ? 'Pause' : 'Auto Play'}
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-dark-surface border border-dark-border text-slate-400 hover:text-white"
              title="Reset to Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
