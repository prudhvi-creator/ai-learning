import React,{ useState } from 'react';
import { Database,Search,Layers,Sliders,CheckCircle,FileText } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface DocumentChunk {
  id: string;
  title: string;
  category: 'Agents' | 'Python' | 'Databases' | 'Security' | 'Embeddings';
  color: string;
  x: number; // 0 to 100 on 2D semantic plane
  y: number;
  text: string;
}

const DOCUMENT_CHUNKS: DocumentChunk[] = [
  {
    id: 'chunk-1',
    title: 'LangGraph State Reducers',
    category: 'Agents',
    color: '#a855f7',
    x: 75,
    y: 78,
    text: 'In LangGraph, state channels use reducers (like operator.add) to append messages without overwriting earlier conversation history.'
  },
  {
    id: 'chunk-2',
    title: 'ReAct Agent Cycles & Stop Conditions',
    category: 'Agents',
    color: '#a855f7',
    x: 82,
    y: 72,
    text: 'To prevent runaway costs and infinite loops, always configure max_iterations and an explicit exit condition when an agent reaches its goal.'
  },
  {
    id: 'chunk-3',
    title: 'Multi-Agent Handoff Protocols',
    category: 'Agents',
    color: '#a855f7',
    x: 88,
    y: 80,
    text: 'Handoffs occur when an agent invokes a routing function that returns another agent persona, transferring active conversation state.'
  },
  {
    id: 'chunk-4',
    title: 'Cosine Similarity Formula',
    category: 'Embeddings',
    color: '#06b6d4',
    x: 30,
    y: 85,
    text: 'Cosine similarity computes the dot product of two normalized vectors, measuring the cosine of the angle between them regardless of magnitude.'
  },
  {
    id: 'chunk-5',
    title: 'Vector Indexing: HNSW vs Flat',
    category: 'Embeddings',
    color: '#06b6d4',
    x: 38,
    y: 75,
    text: 'Hierarchical Navigable Small World (HNSW) graphs allow approximate nearest neighbor (ANN) search in logarithmic time across millions of vectors.'
  },
  {
    id: 'chunk-6',
    title: 'SQL Read-Only Injection Guardrails',
    category: 'Security',
    color: '#ef4444',
    x: 25,
    y: 28,
    text: 'Before executing LLM-generated SQL, parse the AST to ensure only SELECT operations are allowed and bind parameters to prevent injection.'
  },
  {
    id: 'chunk-7',
    title: 'Indirect Prompt Injection Defense',
    category: 'Security',
    color: '#ef4444',
    x: 35,
    y: 20,
    text: 'Never trust external web page content directly. Wrap untrusted text in strict XML delimiters and instruct the model to ignore instructions found inside.'
  },
  {
    id: 'chunk-8',
    title: 'Python Asyncio and Tool Concurrency',
    category: 'Python',
    color: '#3b82f6',
    x: 65,
    y: 25,
    text: 'Use asyncio.gather to dispatch multiple independent LLM tool calls (e.g. searching 3 URLs simultaneously) in parallel.'
  },
  {
    id: 'chunk-9',
    title: 'Pydantic V2 Schema Validation',
    category: 'Python',
    color: '#3b82f6',
    x: 72,
    y: 35,
    text: 'Pydantic V2 core is written in Rust, validating JSON responses and coercing types 20x faster than pure Python dataclasses.'
  }
];

const PRESET_QUERIES = [
  {
    query: 'How do agents avoid infinite loops and manage state?',
    targetX: 80,
    targetY: 75
  },
  {
    query: 'What math is used to compare semantic embeddings?',
    targetX: 32,
    targetY: 82
  },
  {
    query: 'How do we prevent malicious prompts from hacking our tools?',
    targetX: 30,
    targetY: 22
  },
  {
    query: 'How to run Python tools in parallel for fast execution?',
    targetX: 68,
    targetY: 28
  }
];

export const RAGVisualizer: React.FC = () => {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [topK, setTopK] = useState(2);
  const [showAugmentedPrompt, setShowAugmentedPrompt] = useState(false);

  const activePreset = PRESET_QUERIES[selectedPresetIdx];

  // Compute Euclidean-based distance score on 2D projection
  const rankedChunks = DOCUMENT_CHUNKS.map((chunk) => {
    const dx = chunk.x - activePreset.targetX;
    const dy = chunk.y - activePreset.targetY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // Convert distance to a simulated cosine similarity score between 0.40 and 0.98
    const similarity = Math.max(0.4, (1 - distance / 120)).toFixed(3);
    return { ...chunk, similarity: parseFloat(similarity) };
  }).sort((a, b) => b.similarity - a.similarity);

  const retrievedChunks = rankedChunks.slice(0, topK);

  return (
    <div className="card p-6 bg-dark-surface border-dark-border text-slate-100 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-dark-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">Interactive 2D Vector Space & RAG Visualizer</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Watch how semantic queries find nearest neighbor chunks in vector space and ground the prompt.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Sliders className="w-3.5 h-3.5" />
            <span>Top-K Chunks: {topK}</span>
            <input
              type="range"
              min="1"
              max="4"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="w-20 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Preset Query Buttons */}
      <div className="my-4">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Select User Query:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {PRESET_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPresetIdx(idx)}
              className={`p-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between border ${
                selectedPresetIdx === idx
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-glow-blue'
                  : 'bg-dark-surface2 border-dark-border text-slate-300 hover:bg-dark-border'
              }`}
            >
              <span className="line-clamp-1 italic">"{preset.query}"</span>
              <Search className="w-3.5 h-3.5 flex-shrink-0 ml-2 opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        {/* Vector Space 2D Canvas (SVG) */}
        <div className="lg:col-span-7 bg-dark-bg border border-dark-border rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between aspect-square max-h-[420px]">
          {/* Coordinates Grid lines */}
          <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />

          {/* SVG Vector Plot */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Connection rays from query to top-k chunks */}
            {retrievedChunks.map((chunk) => (
              <line
                key={`line-${chunk.id}`}
                x1={activePreset.targetX}
                y1={activePreset.targetY}
                x2={chunk.x}
                y2={chunk.y}
                stroke={chunk.color}
                strokeWidth="0.8"
                strokeDasharray="2,2"
                className="animate-pulse"
              />
            ))}

            {/* Document chunks */}
            {DOCUMENT_CHUNKS.map((chunk) => {
              const isRetrieved = retrievedChunks.some((r) => r.id === chunk.id);
              return (
                <g key={chunk.id} className="cursor-pointer transition-transform duration-300">
                  {isRetrieved && (
                    <circle
                      cx={chunk.x}
                      cy={chunk.y}
                      r="7"
                      fill={chunk.color}
                      opacity="0.25"
                      className="animate-ping"
                    />
                  )}
                  <circle
                    cx={chunk.x}
                    cy={chunk.y}
                    r={isRetrieved ? '3.5' : '2.5'}
                    fill={chunk.color}
                    stroke="#ffffff"
                    strokeWidth={isRetrieved ? '0.8' : '0.3'}
                  />
                  <text
                    x={chunk.x + 4}
                    y={chunk.y + 1}
                    fill={isRetrieved ? '#ffffff' : '#94a3b8'}
                    fontSize="2.8"
                    fontWeight={isRetrieved ? 'bold' : 'normal'}
                  >
                    {chunk.title.slice(0, 18)}...
                  </text>
                </g>
              );
            })}

            {/* Query Vector Point */}
            <g>
              <circle
                cx={activePreset.targetX}
                cy={activePreset.targetY}
                r="6"
                fill="#38bdf8"
                opacity="0.3"
                className="animate-pulse"
              />
              <circle
                cx={activePreset.targetX}
                cy={activePreset.targetY}
                r="3.5"
                fill="#0284c7"
                stroke="#ffffff"
                strokeWidth="1"
              />
              <text
                x={activePreset.targetX - 10}
                y={activePreset.targetY - 5}
                fill="#38bdf8"
                fontSize="3.2"
                fontWeight="bold"
              >
                ★ Query Vector
              </text>
            </g>
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 z-10 pt-2 border-t border-dark-border/60">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Agents</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Embeddings</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Security</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Python</span>
          </div>
        </div>

        {/* Right Side: Retrieved Chunks & Augmented Prompt */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-dark-border">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                Retrieved Chunks (Top {topK})
              </span>
              <button
                onClick={() => setShowAugmentedPrompt(!showAugmentedPrompt)}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline"
              >
                <FileText className="w-3 h-3" />
                {showAugmentedPrompt ? 'View Chunks' : 'View Augmented Prompt'}
              </button>
            </div>

            {!showAugmentedPrompt ? (
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {retrievedChunks.map((chunk, rank) => (
                  <div
                    key={chunk.id}
                    className="p-3 rounded-xl bg-dark-surface2 border border-dark-border hover:border-cyan-500/50 transition-colors text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">
                        #{rank + 1} {chunk.title}
                      </span>
                      <Badge variant="blue" size="sm">
                        Score: {chunk.similarity}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3">
                      "{chunk.text}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-dark-bg border border-cyan-500/30 rounded-xl p-3 text-xs font-mono max-h-[340px] overflow-y-auto">
                <div className="text-cyan-400 font-semibold mb-2">// Complete prompt injected with context:</div>
                <div className="text-slate-400 mb-2">
                  System: You are an expert agent. Answer strictly using only the provided context. If the answer is not present, reply with "I do not have sufficient information."
                </div>
                <div className="text-amber-300/90 mb-2 p-2 bg-amber-950/20 rounded border border-amber-900/40 whitespace-pre-wrap">
                  &lt;context&gt;{'\n'}
                  {retrievedChunks.map((c, i) => `[Source ${i+1}: ${c.title}]\n${c.text}\n`).join('\n')}
                  &lt;/context&gt;
                </div>
                <div className="text-emerald-400 font-semibold">
                  User: {activePreset.query}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs text-cyan-200 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Why RAG Works:</strong> Notice how the query point is closest to documents with matching semantic meaning, even if exact keywords differ!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
