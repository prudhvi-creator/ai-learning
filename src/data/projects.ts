import type { Project } from '../types/curriculum';

export const projectsData: Project[] = [
  {
    id: 'proj-1',
    title: 'CLI Function-Calling Calculator Agent',
    description: 'Build a command-line agent from scratch that parses natural language math queries, executes Python math functions, and returns a verified result.',
    difficulty: 'beginner',
    estimatedHours: 2,
    moduleIds: ['foundations', 'python-basics', 'tool-calling'],
    skills: ['Python Basics', 'Function Definitions', 'JSON Schema', 'Tool Calling Loop'],
    architecture: {
      nodes: [
        { id: '1', label: 'User Input', type: 'start', description: 'e.g. "What is 42 * 18 plus the square root of 144?"' },
        { id: '2', label: 'LLM Parser', type: 'process', description: 'Selects calculate(op, a, b) function' },
        { id: '3', label: 'Math Function', type: 'tool', description: 'Executes verified python arithmetic' },
        { id: '4', label: 'Final Synthesis', type: 'end', description: 'Returns verified answer: "768"' },
      ],
      edges: [
        { from: '1', to: '2' },
        { from: '2', to: '3', label: 'tool call' },
        { from: '3', to: '4', label: 'result' },
      ],
      description: 'Single-turn function calling cycle without external frameworks.'
    },
    steps: [
      {
        title: 'Step 1: Define Mathematical Tool Schemas',
        description: 'Define Python functions for add, subtract, multiply, divide, and power, along with JSON schema descriptions for the LLM.',
        codeExample: {
          language: 'python',
          code: `tools = [
  {
    "type": "function",
    "function": {
      "name": "multiply",
      "description": "Multiplies two numbers",
      "parameters": {
        "type": "object",
        "properties": {
          "a": {"type": "number"},
          "b": {"type": "number"}
        },
        "required": ["a", "b"]
      }
    }
  }
]`
        }
      },
      {
        title: 'Step 2: Dispatch and Execution Loop',
        description: 'Map the function name returned in the LLM response to your Python callable, execute it safely, and feed the output back.',
        codeExample: {
          language: 'python',
          code: `def dispatch_tool(tool_call):
    name = tool_call["name"]
    args = tool_call["arguments"]
    if name == "multiply":
        return args["a"] * args["b"]
    raise ValueError(f"Unknown tool: {name}")`
        }
      },
      {
        title: 'Step 3: Verification and Output Formatting',
        description: 'Ensure the final LLM response uses the exact calculation result and explains the reasoning step.'
      }
    ]
  },
  {
    id: 'proj-2',
    title: 'Structured Resume & Job Matcher with Pydantic',
    description: 'Create an extraction pipeline that ingests raw resume text and job descriptions, validates structured outputs with Pydantic, and computes match scores.',
    difficulty: 'beginner',
    estimatedHours: 3,
    moduleIds: ['structured-outputs', 'prompt-engineering', 'python-basics'],
    skills: ['Pydantic', 'Structured Outputs', 'JSON Schema Validation', 'Prompt Engineering'],
    architecture: {
      nodes: [
        { id: '1', label: 'Raw Resume Text', type: 'data' },
        { id: '2', label: 'LLM Extraction', type: 'process' },
        { id: '3', label: 'Pydantic Validator', type: 'process' },
        { id: '4', label: 'Match Scoring Engine', type: 'end' }
      ],
      edges: [
        { from: '1', to: '2' },
        { from: '2', to: '3', label: 'JSON string' },
        { from: '3', to: '4', label: 'Valid ResumeProfile object' }
      ],
      description: 'Guaranteed schema adherence pipeline using Instructor / OpenAI Structured Outputs.'
    },
    steps: [
      {
        title: 'Step 1: Define the Resume Schema',
        description: 'Create strongly-typed Pydantic classes for skills, experience, education, and candidate summary.',
        codeExample: {
          language: 'python',
          code: `from pydantic import BaseModel, Field
from typing import List

class WorkExperience(BaseModel):
    company: str
    role: str
    years: float
    technologies: List[str]

class ResumeProfile(BaseModel):
    name: str
    seniority: str = Field(description="junior, mid, senior, lead")
    skills: List[str]
    experiences: List[WorkExperience]`
        }
      },
      {
        title: 'Step 2: Strict JSON Output Prompting',
        description: 'Request structured output adhering strictly to the schema with zero markdown noise.'
      },
      {
        title: 'Step 3: Calculate Skill Overlap Ratio',
        description: 'Compare extracted candidate skills against required job posting skills using set operations.'
      }
    ]
  },
  {
    id: 'proj-3',
    title: 'In-Memory Semantic Search & Q&A Engine',
    description: 'Implement vector embeddings from scratch: convert documents into numerical vectors, compute cosine similarity, and retrieve relevant passages.',
    difficulty: 'beginner',
    estimatedHours: 3,
    moduleIds: ['embeddings-vector-dbs', 'rag-systems'],
    skills: ['Cosine Similarity', 'Vector Embeddings', 'Chunking Strategies', 'Prompt Augmentation'],
    steps: [
      {
        title: 'Step 1: Document Chunking',
        description: 'Split text documents into 200-word chunks with 30-word overlaps to preserve semantic context.'
      },
      {
        title: 'Step 2: Cosine Similarity Function',
        description: 'Write a pure Python / numpy cosine similarity formula to rank chunk embeddings against the query vector.',
        codeExample: {
          language: 'python',
          code: `import numpy as np

def cosine_similarity(vec_a, vec_b):
    dot_product = np.dot(vec_a, vec_b)
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    return dot_product / (norm_a * norm_b)`
        }
      },
      {
        title: 'Step 3: Grounded Answer Generation',
        description: 'Inject top-3 nearest neighbor passages into the system prompt and instruct the LLM to refuse answering if not grounded in the source.'
      }
    ]
  },
  {
    id: 'proj-4',
    title: 'Autonomous Research Assistant with Web Tools',
    description: 'Build an agent that conducts research on a complex topic, searches the web, summarizes pages, synthesizes notes, and generates an executive report.',
    difficulty: 'intermediate',
    estimatedHours: 4,
    moduleIds: ['agent-fundamentals', 'agent-loops', 'tool-calling'],
    skills: ['ReAct Pattern', 'Tool Calling', 'Loop Termination', 'Context Management'],
    steps: [
      {
        title: 'Step 1: Equip Agent with Search and Scrape Tools',
        description: 'Provide tools for searching web queries and scraping readable page text.'
      },
      {
        title: 'Step 2: Implement the ReAct Thought Loop',
        description: 'Enable the agent to reason about what information is still missing before drafting the final response.'
      },
      {
        title: 'Step 3: Citation & Source Tracking',
        description: 'Maintain a source registry in agent state to cite URLs for every factual claim made.'
      }
    ]
  },
  {
    id: 'proj-5',
    title: 'Self-Correcting SQL Database Agent',
    description: 'Build an agent that inspects database tables, writes SQL queries, executes them, and automatically catches and fixes syntax errors before presenting findings.',
    difficulty: 'intermediate',
    estimatedHours: 5,
    moduleIds: ['agent-design-patterns', 'tool-calling', 'agent-loops'],
    skills: ['Reflection Pattern', 'Error Recovery', 'SQL Generation', 'Database Tooling'],
    steps: [
      {
        title: 'Step 1: Schema Introspection Tool',
        description: 'Allow agent to inspect SQLite database tables, column names, and sample rows.'
      },
      {
        title: 'Step 2: Execution and Error Feedback Loop',
        description: 'If SQLite throws an OperationalError, feed the exact error string back to the agent with a reflection instruction.'
      },
      {
        title: 'Step 3: Read-Only Safety Guardrail',
        description: 'Implement query validation to strictly block DROP, DELETE, INSERT, and ALTER commands.'
      }
    ]
  },
  {
    id: 'proj-6',
    title: 'LangGraph Stateful Customer Support Agent',
    description: 'Construct a stateful graph with customer state, sentiment detection, policy retrieval, automated refund handling, and human escalation nodes.',
    difficulty: 'intermediate',
    estimatedHours: 6,
    moduleIds: ['langgraph', 'state-memory', 'workflows-vs-agents'],
    skills: ['LangGraph', 'State Graphs', 'Conditional Edges', 'Human-in-the-loop'],
    steps: [
      {
        title: 'Step 1: Define the Graph State Schema',
        description: 'Create a TypedDict holding messages, customer_id, sentiment, refund_amount, and escalated_flag.'
      },
      {
        title: 'Step 2: Connect Decision Nodes & Router',
        description: 'Route users to either FAQ RAG node, Refund tool node, or Escalation node based on LLM intent classification.'
      },
      {
        title: 'Step 3: Add Checkpointer for Session Resumption',
        description: 'Use MemorySaver to persist agent state across multiple chat sessions and thread IDs.'
      }
    ]
  },
  {
    id: 'proj-7',
    title: 'Multi-Agent Software Engineering Squad (CrewAI/LangGraph)',
    description: 'Orchestrate a team of 4 specialized AI agents: Product Manager (spec), Architect (design), Coder (implementation), and QA Engineer (testing and critique).',
    difficulty: 'advanced',
    estimatedHours: 8,
    moduleIds: ['multi-agent-systems', 'crewai', 'langgraph'],
    skills: ['Multi-Agent Architecture', 'Role Prompting', 'Handoff Protocols', 'Hierarchical Orchestration'],
    steps: [
      {
        title: 'Step 1: Define Distinct Agent Personas & Goals',
        description: 'Configure each agent with exclusive tools and precise boundary definitions to prevent role confusion.'
      },
      {
        title: 'Step 2: Implement the Review & Revision Cycle',
        description: 'Have the QA agent write test cases. If code fails tests, hand back to Coder agent with diff suggestions.'
      },
      {
        title: 'Step 3: Final Deliverable Synthesis',
        description: 'Produce a complete README, architecture markdown diagram, and tested code files.'
      }
    ]
  },
  {
    id: 'proj-8',
    title: 'Model Context Protocol (MCP) Server & Client System',
    description: 'Build a standard MCP server in Python exposing local files, Git repository history, and system metrics over JSON-RPC to any MCP-compliant agent.',
    difficulty: 'advanced',
    estimatedHours: 7,
    moduleIds: ['mcp', 'tool-calling', 'production-evaluation'],
    skills: ['Model Context Protocol', 'JSON-RPC 2.0', 'Stdio Transport', 'Resource Providers'],
    steps: [
      {
        title: 'Step 1: Implement MCP Tools and Resources',
        description: 'Expose functions for reading file paths and executing git diffs according to MCP specification.'
      },
      {
        title: 'Step 2: Implement Stdio Transport Server',
        description: 'Handle initialization handshake, tools/list, and tools/call requests over standard input/output.'
      },
      {
        title: 'Step 3: Connect to Claude Desktop or Custom Agent Client',
        description: 'Test end-to-end integration by having an agent query your local git repository state.'
      }
    ]
  },
  {
    id: 'proj-9',
    title: 'CAPSTONE: Enterprise Autonomous Operations Agent',
    description: 'The ultimate production project: Build an enterprise-grade agent featuring RAG with re-ranking, external API integrations, state persistence, guardrail validation, automated LLM-as-a-judge evaluation, and OpenTelemetry tracing.',
    difficulty: 'capstone',
    estimatedHours: 12,
    moduleIds: [
      'rag-systems',
      'agent-design-patterns',
      'langgraph',
      'guardrails-safety',
      'production-evaluation',
      'observability-debugging'
    ],
    skills: [
      'Full-Stack Agent Architecture',
      'State Persistence',
      'Input/Output Guardrails',
      'RAG Triad Evaluation',
      'Latency & Token Optimization',
      'Production Deployment'
    ],
    steps: [
      {
        title: 'Step 1: Production Knowledge Base & Hybrid Search',
        description: 'Combine BM25 keyword search and dense vector embeddings with reciprocal rank fusion.'
      },
      {
        title: 'Step 2: Guardrail Layer & Jailbreak Defense',
        description: 'Add PII redaction, prompt injection detection, and output toxicity filtering before LLM generation.'
      },
      {
        title: 'Step 3: Stateful Execution Graph with Human-in-the-Loop',
        description: 'Build approval breakpoints for sensitive operations (e.g., transfers over $500, data modifications).'
      },
      {
        title: 'Step 4: Automated Evaluation Suite (Ragas / DeepEval)',
        description: 'Evaluate Context Precision, Faithfulness, and Answer Relevance against a gold standard test dataset.'
      },
      {
        title: 'Step 5: Telemetry, Latency Tracing & Observability',
        description: 'Instrument every LLM call and tool invocation with span tags for tokens, duration, cost, and errors.'
      }
    ]
  }
];
