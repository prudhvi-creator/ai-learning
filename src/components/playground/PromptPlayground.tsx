import React, { useEffect, useRef, useState } from 'react';
import { Sparkles,Play,RotateCcw,Copy,Check,Sliders,Info,Zap } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface PromptPreset {
  name: string;
  technique: string;
  system: string;
  user: string;
  expectedBehavior: string;
}

const PRESETS: PromptPreset[] = [
  {
    name: 'Zero-Shot with Role Persona',
    technique: 'Role Prompting',
    system: 'You are a Principal AI Architect at a Fortune 500 company. Provide clear, direct, senior-level architectural advice without marketing buzzwords.',
    user: 'Should our company use an autonomous multi-agent system or a deterministic workflow for processing invoice approvals?',
    expectedBehavior: 'Direct recommendation favoring deterministic workflows for financial approvals, explaining reliability and auditability trade-offs.'
  },
  {
    name: 'Few-Shot Classification',
    technique: 'Few-Shot Learning',
    system: 'Classify user intent into one of: [BILLING, TECHNICAL, ESCALATION, GENERAL]. Follow the format strictly.',
    user: `Input: "My credit card was charged twice yesterday"
Intent: BILLING

Input: "The API endpoint returns a 504 gateway timeout after 30 seconds"
Intent: TECHNICAL

Input: "I have been waiting 4 days and demand to speak to your manager right now"
Intent: ESCALATION

Input: "Do you offer SOC 2 Type II compliance reports?"
Intent:`,
    expectedBehavior: 'Predicts "GENERAL" or "SECURITY" immediately following the pattern without filler words.'
  },
  {
    name: 'Chain-of-Thought (CoT)',
    technique: 'Chain of Thought',
    system: 'You are a logical problem solver. Always think through the problem step-by-step inside <thinking> tags before providing your final concise answer.',
    user: 'A company has 3 AI agents. Agent A takes 4 seconds per task. Agent B takes 6 seconds. Agent C takes 12 seconds. If they work simultaneously on 12 independent tasks evenly distributed (4 tasks each), how long until all tasks are finished?',
    expectedBehavior: 'Breaks down 4*4s=16s, 4*6s=24s, 4*12s=48s. Total completion time is bounded by the slowest agent (48 seconds).'
  },
  {
    name: 'Structured JSON Enforcement',
    technique: 'JSON Schema Prompting',
    system: 'You are a data extraction engine. Return ONLY a valid JSON object matching this schema: {"name": string, "age": number, "skills": string[]}. No markdown, no backticks, no other text.',
    user: 'Alice Smith is a 29-year-old lead data scientist skilled in Python, PyTorch, and LangGraph.',
    expectedBehavior: '{"name": "Alice Smith", "age": 29, "skills": ["Python", "PyTorch", "LangGraph"]}'
  }
];

export const PromptPlayground: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<PromptPreset>(PRESETS[0]);
  const [systemPrompt, setSystemPrompt] = useState(PRESETS[0].system);
  const [userPrompt, setUserPrompt] = useState(PRESETS[0].user);
  const [temperature, setTemperature] = useState(0.2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const streamTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => () => clearInterval(streamTimer.current), []);

  const stopStream = () => {
    clearInterval(streamTimer.current);
    setIsGenerating(false);
  };

  const applyPreset = (preset: PromptPreset) => {
    stopStream();
    setSelectedPreset(preset);
    setSystemPrompt(preset.system);
    setUserPrompt(preset.user);
    setOutput(null);
  };

  const handleSimulateRun = () => {
    stopStream();
    setIsGenerating(true);
    setOutput('');

    // Estimate response based on preset or custom
    let simulatedText = '';
    if (selectedPreset.name.includes('Zero-Shot')) {
      simulatedText = `For financial invoice approvals, you should implement a DETERMINISTIC WORKFLOW (or state machine like LangGraph with strict checkpoints), NOT an autonomous agent.

Here is why:
1. Auditability: Financial transactions require deterministic, repeatable rules and tamper-proof approval logs.
2. Hallucination Risk: Autonomous agents can make unpredictable tool calls or fail under ambiguous inputs.
3. Cost & Latency: Simple rule-based approval matrices run in 5ms for $0, whereas LLM multi-agent reasoning costs $0.05 and takes 4 seconds.

Use LLM agents only for extracting line items from messy scanned PDF invoices, then pass structured data into deterministic code.`;
    } else if (selectedPreset.name.includes('Few-Shot')) {
      simulatedText = `GENERAL`;
    } else if (selectedPreset.name.includes('Chain-of-Thought')) {
      simulatedText = `<thinking>
1. The tasks are distributed evenly: 12 total tasks / 3 agents = 4 tasks per agent.
2. The agents work concurrently/in parallel.
3. Agent A time: 4 tasks * 4 seconds = 16 seconds.
4. Agent B time: 4 tasks * 6 seconds = 24 seconds.
5. Agent C time: 4 tasks * 12 seconds = 48 seconds.
6. Since they work simultaneously, the total time required for all tasks to be finished is the time taken by the slowest agent.
7. max(16, 24, 48) = 48 seconds.
</thinking>

All tasks will be completely finished in **48 seconds** (when Agent C finishes its 4th task).`;
    } else if (selectedPreset.name.includes('Structured JSON')) {
      simulatedText = `{"name": "Alice Smith", "age": 29, "skills": ["Python", "PyTorch", "LangGraph"]}`;
    } else {
      simulatedText = `[Simulated LLM response at temperature ${temperature}]\n\nBased on your prompt, the agent synthesized this output considering both the system instructions and user input. The response maintains persona constraints and respects formatting guidelines.`;
    }

    // Streaming text animation
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < simulatedText.length) {
        setOutput(simulatedText.slice(0, currentIdx + 4));
        currentIdx += 4;
      } else {
        setOutput(simulatedText);
        setIsGenerating(false);
        clearInterval(interval);
      }
    }, 20);
    streamTimer.current = interval;
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Rough token estimation (1 token ≈ 4 chars)
  const totalTokens = Math.ceil((systemPrompt.length + userPrompt.length + (output?.length || 0)) / 4);

  return (
    <div className="card p-6 bg-dark-surface border-dark-border text-slate-100 rounded-2xl shadow-xl">
      {/* Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-dark-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-accent-purple/20 text-accent-purple-light">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">Interactive Prompt Studio & Simulator</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Experiment with prompt techniques, personas, and temperature without paying for an API key.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="purple" size="sm">
            <Zap className="w-3 h-3" /> Est. Tokens: ~{totalTokens}
          </Badge>
          <Badge variant="blue" size="sm">
            Temp: {temperature}
          </Badge>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="my-4">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Select Technique Preset:
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPreset.name === preset.name
                  ? 'bg-accent-purple text-white shadow-glow-purple'
                  : 'bg-dark-surface2 text-slate-300 hover:bg-dark-border'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
        <div className="mt-2 text-xs text-slate-400 italic flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-accent-purple-light" />
          <span>Technique: <strong className="text-slate-200">{selectedPreset.technique}</strong> — {selectedPreset.expectedBehavior}</span>
        </div>
      </div>

      {/* Input Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Left Column: Prompts */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                System Prompt (Persona & Instructions)
              </label>
              <span className="text-[11px] text-slate-500">{systemPrompt.length} chars</span>
            </div>
            <textarea
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-accent-purple transition-colors resize-none"
              placeholder="e.g. You are a helpful assistant..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                User Prompt (Input)
              </label>
              <span className="text-[11px] text-slate-500">{userPrompt.length} chars</span>
            </div>
            <textarea
              rows={5}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-accent-purple transition-colors resize-none"
              placeholder="Enter your prompt here..."
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-dark-surface2 border border-dark-border">
            <div className="flex items-center gap-3">
              <Sliders className="w-4 h-4 text-slate-400" />
              <div className="text-xs">
                <span className="text-slate-300 font-medium">Temperature: {temperature}</span>
                <span className="text-slate-500 block text-[10px]">
                  {temperature === 0 ? 'Deterministic / Greedy' : temperature < 0.5 ? 'Focused & Factual' : 'Creative & Diverse'}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-28 accent-accent-purple cursor-pointer"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSimulateRun}
              disabled={isGenerating}
              className="flex-1 btn-primary py-2.5 justify-center"
            >
              <Play className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Simulating Generation...' : 'Run Simulation'}
            </button>
            <button
              onClick={() => {
                stopStream();
                setOutput(null);
                setSystemPrompt(selectedPreset.system);
                setUserPrompt(selectedPreset.user);
              }}
              className="px-3 py-2.5 rounded-lg bg-dark-surface2 text-slate-400 hover:text-white border border-dark-border transition-colors"
              title="Reset prompt"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Output Panel */}
        <div className="flex flex-col h-full bg-dark-bg border border-dark-border rounded-xl overflow-hidden min-h-[300px]">
          <div className="flex items-center justify-between px-4 py-2.5 bg-dark-surface border-b border-dark-border">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Simulated LLM Output
            </span>
            {output && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs px-2 py-1 rounded bg-dark-surface2 text-slate-300 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          <div className="p-4 flex-1 overflow-y-auto text-xs font-mono leading-relaxed">
            {output !== null ? (
              <div className="text-slate-200 whitespace-pre-wrap">
                {output}
                {isGenerating && <span className="inline-block w-2 h-4 bg-accent-purple ml-1 animate-pulse" />}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6 space-y-2">
                <Play className="w-8 h-8 opacity-40 text-accent-purple" />
                <p className="text-xs">Click <strong>"Run Simulation"</strong> to see how the model reasons and formats the response.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
