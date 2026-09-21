export interface FrameworkComparison {
  id: string;
  name: string;
  creator: string;
  primaryAbstraction: string;
  stateManagement: string;
  multiAgentSupport: string;
  bestFor: string;
  learningCurve: 'Low' | 'Moderate' | 'Steep';
  productionReadiness: 'Experimental' | 'Good' | 'Production-Ready';
  strengths: string[];
  weaknesses: string[];
  architectureStyle: string;
  sampleSnippet: string;
}

export const frameworksComparison: FrameworkComparison[] = [
  {
    id: 'langgraph',
    name: 'LangGraph',
    creator: 'LangChain Inc.',
    primaryAbstraction: 'Stateful Directed Cyclic Graphs (Nodes & Edges)',
    stateManagement: 'Explicit State Schema with Reducers and Checkpointing',
    multiAgentSupport: 'Native (Subgraphs, Multi-agent Router, Supervisor pattern)',
    bestFor: 'Complex, cyclic, production-grade agent workflows with human-in-the-loop and time-travel persistence',
    learningCurve: 'Steep',
    productionReadiness: 'Production-Ready',
    strengths: [
      'Built-in persistence & state time-travel',
      'Granular control over branching & cycle loops',
      'Human-in-the-loop approval breakpoints',
      'First-class LangSmith tracing integration'
    ],
    weaknesses: [
      'Steeper learning curve than linear chaining',
      'Requires explicit state schema management'
    ],
    architectureStyle: 'Graph / State Machine',
    sampleSnippet: `from langgraph.graph import StateGraph, START, END

workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_node)
workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", should_continue)
workflow.add_edge("tools", "agent")
app = workflow.compile(checkpointer=MemorySaver())`
  },
  {
    id: 'langchain',
    name: 'LangChain (Core/Classic)',
    creator: 'LangChain Inc.',
    primaryAbstraction: 'Chains (LCEL - LangChain Expression Language) & Agents',
    stateManagement: 'ConversationBufferMemory / RunnableWithMessageHistory',
    multiAgentSupport: 'Basic (Sequential chaining, legacy agent executors)',
    bestFor: 'Prototyping, document loaders, standard RAG pipelines, quick integrations',
    learningCurve: 'Moderate',
    productionReadiness: 'Good',
    strengths: [
      'Huge ecosystem of 700+ integrations',
      'Easy to connect vector stores, models, and embeddings',
      'LCEL pipe operator (|) for quick pipelines'
    ],
    weaknesses: [
      'Over-abstraction can obscure underlying prompts',
      'Frequent API refactoring in earlier versions'
    ],
    architectureStyle: 'Pipeline / Linear Chains',
    sampleSnippet: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

chain = prompt | model | StrOutputParser()
result = chain.invoke({"input": "Summarize RAG"})`
  },
  {
    id: 'crewai',
    name: 'CrewAI',
    creator: 'João Moura',
    primaryAbstraction: 'Crews, Agents, Tasks, and Tools',
    stateManagement: 'Implicit Task Context & Shared Memory',
    multiAgentSupport: 'Excellent (Role-playing collaborative multi-agent teams)',
    bestFor: 'Collaborative role-based multi-agent teams (e.g. Researcher + Writer + Editor)',
    learningCurve: 'Low',
    productionReadiness: 'Good',
    strengths: [
      'Intuitive mental model (Crews, Agents, Tasks)',
      'Built-in delegation and peer review between agents',
      'Fast setup for multi-agent brainstorming & content creation'
    ],
    weaknesses: [
      'Can quickly consume tokens through inter-agent chatter',
      'Less deterministic than explicit state graphs'
    ],
    architectureStyle: 'Role-Playing Multi-Agent Squad',
    sampleSnippet: `researcher = Agent(role="Senior Researcher", goal="Uncover latest AI trends", memory=True)
writer = Agent(role="Tech Writer", goal="Write engaging blog post")
crew = Crew(agents=[researcher, writer], tasks=[task1, task2], process=Process.sequential)
result = crew.kickoff()`
  },
  {
    id: 'openai-agents-sdk',
    name: 'OpenAI Agents SDK / Swarm',
    creator: 'OpenAI',
    primaryAbstraction: 'Agents and Handoffs (Functions returning Agents)',
    stateManagement: 'Context Variables (Lightweight Dictionary)',
    multiAgentSupport: 'Exceptional for explicit agent handoffs & routing',
    bestFor: 'Clean, ergonomic multi-agent routing with minimal boilerplate and maximum transparency',
    learningCurve: 'Low',
    productionReadiness: 'Good',
    strengths: [
      'Zero bloated dependencies; ultra-lightweight',
      'Explicit agent-to-agent handoffs via function calls',
      'Transparent execution model without magic abstractions'
    ],
    weaknesses: [
      'Tailored primarily around OpenAI function calling schemas',
      'Lacks out-of-the-box long-term vector store abstractions'
    ],
    architectureStyle: 'Handoff Network',
    sampleSnippet: `from swarm import Swarm, Agent

def transfer_to_billing():
    return billing_agent

triage_agent = Agent(name="Triage", functions=[transfer_to_billing])
response = client.run(agent=triage_agent, messages=[...])`
  },
  {
    id: 'mcp',
    name: 'Model Context Protocol (MCP)',
    creator: 'Anthropic',
    primaryAbstraction: 'Standardized Client-Server Protocol (JSON-RPC 2.0)',
    stateManagement: 'Protocol Sessions, Resources, and Tool Subscriptions',
    multiAgentSupport: 'Universal (Any agent client can connect to any MCP server)',
    bestFor: 'Interoperable tooling and context integration across local and remote systems',
    learningCurve: 'Moderate',
    productionReadiness: 'Production-Ready',
    strengths: [
      'Open industry standard supported by Claude Desktop, Cursor, IDEs',
      'Separation of agent intelligence from tool host infrastructure',
      'Standardized security, resource providers, and prompt templates'
    ],
    weaknesses: [
      'Requires running local or remote MCP server processes'
    ],
    architectureStyle: 'Client-Server JSON-RPC Architecture',
    sampleSnippet: `@mcp.tool()
def query_database(sql: str) -> str:
    """Execute read-only SQL query against local SQLite."""
    return db.execute(sql).fetchall()`
  },
  {
    id: 'llamaindex',
    name: 'LlamaIndex (Workflows)',
    creator: 'LlamaIndex Inc.',
    primaryAbstraction: 'Event-Driven Workflows & Data Indices',
    stateManagement: 'Context State via Event Passing',
    bestFor: 'Complex data retrieval, multi-modal search, advanced RAG with re-ranking & document synthesis',
    learningCurve: 'Moderate',
    productionReadiness: 'Production-Ready',
    strengths: [
      'Unmatched depth in document ingestion, chunking, and semantic indexing',
      'Event-driven async workflows for step-by-step agent loops',
      'Broad vector database connectors'
    ],
    multiAgentSupport: 'Good (Multi-agent event orchestration)',
    weaknesses: [
      'Can feel specialized around search and retrieval data ingestion'
    ],
    architectureStyle: 'Event-Driven / Data-Centric',
    sampleSnippet: `class FinancialAgent(Workflow):
    @step
    async def ingest(self, ctx: Context, ev: StartEvent) -> RetrievalEvent:
        ...`
  }
];
