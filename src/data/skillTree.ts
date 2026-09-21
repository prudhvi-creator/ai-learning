import type { SkillNode } from '../types/curriculum';

export const skillTreeData: SkillNode[] = [
  // Level 0: Foundations
  {
    id: 'skill-hardware-os',
    label: 'Hardware & OS Basics',
    moduleId: 'foundations',
    prerequisites: [],
    category: 'Foundations',
    icon: 'Cpu',
    color: '#6366f1',
    description: 'Understand CPU, RAM vs Disk, and how code runs on an operating system.'
  },
  {
    id: 'skill-terminal',
    label: 'Terminal & CLI',
    moduleId: 'foundations',
    prerequisites: ['skill-hardware-os'],
    category: 'Foundations',
    icon: 'Terminal',
    color: '#6366f1',
    description: 'Navigate directories, run scripts, and manage processes via command line.'
  },
  {
    id: 'skill-client-server',
    label: 'Client-Server & HTTP',
    moduleId: 'foundations',
    prerequisites: ['skill-terminal'],
    category: 'Foundations',
    icon: 'Globe',
    color: '#6366f1',
    description: 'Understand requests, responses, HTTP methods, headers, status codes, and JSON.'
  },

  // Level 1: Python
  {
    id: 'skill-python-basics',
    label: 'Python Syntax & Types',
    moduleId: 'python-basics',
    prerequisites: ['skill-client-server'],
    category: 'Python',
    icon: 'Code',
    color: '#3b82f6',
    description: 'Master variables, numbers, strings, lists, dicts, and control flow.'
  },
  {
    id: 'skill-functions-types',
    label: 'Functions & Type Hints',
    moduleId: 'python-basics',
    prerequisites: ['skill-python-basics'],
    category: 'Python',
    icon: 'FileCode',
    color: '#3b82f6',
    description: 'Write clean modular functions with strict typing and docstrings.'
  },
  {
    id: 'skill-pydantic-validation',
    label: 'Pydantic & Data Models',
    moduleId: 'python-basics',
    prerequisites: ['skill-functions-types'],
    category: 'Python',
    icon: 'CheckCircle',
    color: '#3b82f6',
    description: 'Define strong schemas and validate structured data for LLM inputs and outputs.'
  },

  // Level 2: LLMs & Prompting
  {
    id: 'skill-tokens-context',
    label: 'Tokens & Context Windows',
    moduleId: 'ai-llm-fundamentals',
    prerequisites: ['skill-functions-types'],
    category: 'LLM Fundamentals',
    icon: 'Brain',
    color: '#8b5cf6',
    description: 'Master tokenization, context limits, sampling temperature, and pricing.'
  },
  {
    id: 'skill-prompt-engineering',
    label: 'System Prompts & Few-Shot',
    moduleId: 'prompt-engineering',
    prerequisites: ['skill-tokens-context'],
    category: 'Prompt Engineering',
    icon: 'Sparkles',
    color: '#8b5cf6',
    description: 'Role prompting, few-shot exemplars, delimiters, and chain-of-thought.'
  },
  {
    id: 'skill-structured-json',
    label: 'Structured JSON Outputs',
    moduleId: 'structured-outputs',
    prerequisites: ['skill-pydantic-validation', 'skill-prompt-engineering'],
    category: 'Prompt Engineering',
    icon: 'Braces',
    color: '#8b5cf6',
    description: 'Enforce strict JSON schemas and parse structured LLM responses without errors.'
  },

  // Level 3: Tools & RAG
  {
    id: 'skill-tool-schemas',
    label: 'Function / Tool Calling',
    moduleId: 'tool-calling',
    prerequisites: ['skill-structured-json'],
    category: 'Tools & Data',
    icon: 'Wrench',
    color: '#10b981',
    description: 'Define function schemas, parse arguments, and execute tool calls in a loop.'
  },
  {
    id: 'skill-vector-embeddings',
    label: 'Vector Embeddings',
    moduleId: 'embeddings-vector-dbs',
    prerequisites: ['skill-tokens-context'],
    category: 'Tools & Data',
    icon: 'Network',
    color: '#10b981',
    description: 'Convert text into dense vectors and measure semantic similarity.'
  },
  {
    id: 'skill-rag-architecture',
    label: 'RAG Pipeline Architecture',
    moduleId: 'rag-systems',
    prerequisites: ['skill-vector-embeddings', 'skill-tool-schemas'],
    category: 'Tools & Data',
    icon: 'Database',
    color: '#10b981',
    description: 'Chunking, indexing, retrieval, re-ranking, and grounded generation.'
  },

  // Level 4: Agents & Loops
  {
    id: 'skill-react-loop',
    label: 'The ReAct Agent Loop',
    moduleId: 'agent-fundamentals',
    prerequisites: ['skill-tool-schemas'],
    category: 'Agent Architecture',
    icon: 'RefreshCw',
    color: '#f59e0b',
    description: 'Implement Thought → Action → Observation loops with exit conditions.'
  },
  {
    id: 'skill-agent-state-memory',
    label: 'Agent State & Memory',
    moduleId: 'agent-fundamentals',
    prerequisites: ['skill-react-loop'],
    category: 'Agent Architecture',
    icon: 'Layers',
    color: '#f59e0b',
    description: 'Short-term buffer, summary compression, and long-term persistent memory.'
  },
  {
    id: 'skill-reflection-patterns',
    label: 'Self-Correction & Reflection',
    moduleId: 'agent-fundamentals',
    prerequisites: ['skill-agent-state-memory'],
    category: 'Agent Architecture',
    icon: 'Compass',
    color: '#f59e0b',
    description: 'Critique and refine steps, error recovery, and plan-and-solve patterns.'
  },

  // Level 5: Frameworks & Protocols
  {
    id: 'skill-langgraph',
    label: 'LangGraph State Machines',
    moduleId: 'langgraph',
    prerequisites: ['skill-agent-state-memory'],
    category: 'Frameworks',
    icon: 'GitFork',
    color: '#ec4899',
    description: 'State graphs, conditional edges, checkpointers, and cyclic control flow.'
  },
  {
    id: 'skill-multi-agent-orchestration',
    label: 'Multi-Agent Orchestration',
    moduleId: 'multi-agent-systems',
    prerequisites: ['skill-langgraph'],
    category: 'Frameworks',
    icon: 'Users',
    color: '#ec4899',
    description: 'Supervisor-worker patterns, hierarchical teams, and handoff protocols.'
  },
  {
    id: 'skill-mcp-protocol',
    label: 'Model Context Protocol (MCP)',
    moduleId: 'mcp',
    prerequisites: ['skill-tool-schemas', 'skill-client-server'],
    category: 'Frameworks',
    icon: 'Server',
    color: '#ec4899',
    description: 'JSON-RPC client-server protocol for universal tools and resource sharing.'
  },

  // Level 6: Production
  {
    id: 'skill-guardrails-safety',
    label: 'Guardrails & Safety',
    moduleId: 'production-evaluation',
    prerequisites: ['skill-multi-agent-orchestration'],
    category: 'Production',
    icon: 'ShieldCheck',
    color: '#ef4444',
    description: 'PII masking, prompt injection defense, hallucination checks, and moderation.'
  },
  {
    id: 'skill-eval-observability',
    label: 'Evaluation & Tracing',
    moduleId: 'production-evaluation',
    prerequisites: ['skill-guardrails-safety'],
    category: 'Production',
    icon: 'Activity',
    color: '#ef4444',
    description: 'LLM-as-a-judge, Ragas metrics, OpenTelemetry, LangSmith traces, and latency/cost tuning.'
  }
];
