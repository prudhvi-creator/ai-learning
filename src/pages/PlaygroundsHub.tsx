import React,{ useState } from 'react';
import { Terminal,Sparkles,Cpu,Database,Compass,GitBranch } from 'lucide-react';
import { PromptPlayground } from '../components/playground/PromptPlayground';
import { ToolCallSimulator } from '../components/playground/ToolCallSimulator';
import { RAGVisualizer } from '../components/playground/RAGVisualizer';
import { AgentPlayground } from '../components/playground/AgentPlayground';
import { LangGraphBuilder } from '../components/playground/LangGraphBuilder';

export const PlaygroundsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'tools' | 'rag' | 'agent' | 'langgraph'>('prompt');

  const tabs = [
    { id: 'prompt', label: 'Prompt Studio', icon: Sparkles, color: 'text-purple-400' },
    { id: 'tools', label: 'Tool Simulator', icon: Cpu, color: 'text-green-400' },
    { id: 'rag', label: 'Vector RAG Space', icon: Database, color: 'text-cyan-400' },
    { id: 'agent', label: 'ReAct Agent Loop', icon: Compass, color: 'text-amber-400' },
    { id: 'langgraph', label: 'LangGraph Builder', icon: GitBranch, color: 'text-pink-400' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Terminal className="w-4 h-4" />
          <span>Interactive Simulation Labs</span>
        </div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">
          Agentic AI Playgrounds
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans leading-relaxed">
          Test mental models in real time without API keys. Experiment with prompt parameters, step through tool calling cycles, visualize vector search, and run state graphs.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-dark-surface border border-dark-border">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-dark-surface2 text-slate-100 border border-dark-border/80 shadow-md scale-102'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-dark-surface2/50'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Playground Component */}
      <div className="animate-fade-in">
        {activeTab === 'prompt' && <PromptPlayground />}
        {activeTab === 'tools' && <ToolCallSimulator />}
        {activeTab === 'rag' && <RAGVisualizer />}
        {activeTab === 'agent' && <AgentPlayground />}
        {activeTab === 'langgraph' && <LangGraphBuilder />}
      </div>
    </div>
  );
};
