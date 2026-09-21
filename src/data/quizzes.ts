import type { Quiz } from '../types/curriculum';

export const quizzesData: Quiz[] = [
  {
    id: 'quiz-foundations',
    title: 'Computer & Programming Foundations Assessment',
    description: 'Test your understanding of how software runs, memory works, and how web clients talk to servers.',
    passingScore: 70,
    questions: [
      {
        id: 'q-f1',
        type: 'multiple-choice',
        question: 'What is the primary difference between RAM and persistent disk storage?',
        options: [
          'RAM is non-volatile and retains data when power is turned off',
          'RAM is ultra-fast, temporary working memory that clears when power is off',
          'RAM only stores text files, while disk stores images',
          'RAM executes machine code instructions directly without the CPU'
        ],
        correctAnswer: 1,
        explanation: 'RAM (Random Access Memory) provides ultra-fast temporary memory for active programs and data. When the computer restarts, RAM clears, unlike SSD/HDD disk storage.',
        hint: 'Think about what happens to open browser tabs if your computer suddenly unplugs.'
      },
      {
        id: 'q-f2',
        type: 'multiple-choice',
        question: 'In a client-server API exchange, what does HTTP status code 401 represent?',
        options: [
          'Success: The requested data is returned',
          'Server Error: The backend crashed',
          'Unauthorized: Authentication credentials (e.g. API key) are missing or invalid',
          'Not Found: The requested endpoint does not exist'
        ],
        correctAnswer: 2,
        explanation: 'HTTP 401 Unauthorized indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.',
        hint: 'What error do you get if you forget your OpenAI API key?'
      },
      {
        id: 'q-f3',
        type: 'multiple-choice',
        question: 'Why is JSON the standard data format for modern LLM tool calls and APIs?',
        options: [
          'It can only be parsed by Python',
          'It is language-agnostic, lightweight, and easily parsed by both humans and machines',
          'It encrypts data automatically during transmission',
          'It allows running executable code directly inside the JSON text'
        ],
        correctAnswer: 1,
        explanation: 'JSON (JavaScript Object Notation) is a universal, human-readable text standard easily serialized and deserialized across all programming languages and LLMs.'
      }
    ]
  },
  {
    id: 'quiz-llm-fundamentals',
    title: 'AI & LLM Mechanics Assessment',
    description: 'Verify your mastery over tokens, context windows, temperature, and hallucinations.',
    passingScore: 75,
    questions: [
      {
        id: 'q-llm1',
        type: 'multiple-choice',
        question: 'At their mathematical core, how do autoregressive Large Language Models generate text?',
        options: [
          'By querying a hidden Google search index for matching answers',
          'By predicting the probability distribution of the next token given preceding tokens',
          'By executing predefined if-else decision trees',
          'By compiling Python code internally'
        ],
        correctAnswer: 1,
        explanation: 'LLMs are probabilistic next-token predictors. Based on training data weights and previous tokens in context, they calculate the probability distribution for the next token.',
        hint: 'Think of supercharged autocomplete.'
      },
      {
        id: 'q-llm2',
        type: 'multiple-choice',
        question: 'What happens when an LLM context window is exceeded?',
        options: [
          'The model speeds up significantly',
          'The API returns an error or silently truncates older tokens, causing memory loss',
          'The temperature automatically drops to 0',
          'The model gains permanent training knowledge'
        ],
        correctAnswer: 1,
        explanation: 'Once the token count exceeds the context window capacity (e.g. 128k tokens), the API will either throw an error or older messages must be truncated, leading to context loss.',
        hint: 'A bucket can only hold so much water.'
      },
      {
        id: 'q-llm3',
        type: 'multiple-choice',
        question: 'Setting LLM temperature to 0.0 has what primary effect?',
        options: [
          'Makes the output completely random and chaotic',
          'Maximizes greedy sampling, producing the most deterministic, reproducible outputs',
          'Increases model hallucination rate',
          'Disables safety guardrails'
        ],
        correctAnswer: 1,
        explanation: 'Temperature 0 chooses the highest probability token at each step (greedy sampling), making outputs as deterministic, focused, and consistent as possible.'
      }
    ]
  },
  {
    id: 'quiz-tool-calling',
    title: 'Tool Calling & Function Invocation Quiz',
    description: 'Test your understanding of tool schemas, arguments parsing, execution loops, and error handling.',
    passingScore: 75,
    questions: [
      {
        id: 'q-tc1',
        type: 'multiple-choice',
        question: 'Does an LLM execute the Python function or API call itself directly inside the model?',
        options: [
          'Yes, the model has an internal Python runtime and runs code inside its neural network',
          'No. The LLM outputs a structured request (tool name + JSON arguments); YOUR backend application code executes the tool and sends back results',
          'Yes, but only if the temperature is 0',
          'Only when running locally on an NVIDIA GPU'
        ],
        correctAnswer: 1,
        explanation: 'Crucial concept: The LLM NEVER runs external code itself. The model only generates the function name and argument parameters in JSON. Your application runtime executes the function and provides the output back to the LLM.',
        hint: 'The LLM is the brain that decides what to call, your application code is the hands that execute.'
      },
      {
        id: 'q-tc2',
        type: 'multiple-choice',
        question: 'In a tool calling loop, what message role is typically used to feed the tool output back into the conversation?',
        options: [
          'system',
          'assistant',
          'tool (or function)',
          'administrator'
        ],
        correctAnswer: 2,
        explanation: 'Standard chat completion APIs (OpenAI, Anthropic, Gemini) use the `tool` (or `function`) message role, linking the output to the specific `tool_call_id`.',
        hint: 'Matches the name of what was executed.'
      },
      {
        id: 'q-tc3',
        type: 'multiple-choice',
        question: 'What is the best practice if a tool execution returns an error (e.g., database connection timeout)?',
        options: [
          'Crash the entire application immediately',
          'Hide the error from the LLM and make up a fake answer',
          'Return the error message as the tool result so the LLM can reflect and try an alternative approach',
          'Change the system prompt to ignore tools'
        ],
        correctAnswer: 2,
        explanation: 'Returning the error description as the tool result enables the agent to observe the failure, analyze why it failed, and either retry with different arguments or use an alternative tool.',
        hint: 'Autonomous agents need feedback to self-correct.'
      }
    ]
  },
  {
    id: 'quiz-rag-systems',
    title: 'RAG & Vector Retrieval Assessment',
    description: 'Assess chunking, embeddings, vector databases, cosine distance, and hallucination reduction.',
    passingScore: 75,
    questions: [
      {
        id: 'q-rag1',
        type: 'multiple-choice',
        question: 'What is the primary objective of Retrieval-Augmented Generation (RAG)?',
        options: [
          'To retrain the neural network weights on new documents every night',
          'To retrieve relevant context from an external knowledge base and ground the LLM prompt with verified facts',
          'To replace the LLM with a SQL database',
          'To compress video files into text'
        ],
        correctAnswer: 1,
        explanation: 'RAG grounds the LLM by retrieving factual, up-to-date passages relevant to the user question and inserting them into the prompt before generation, drastically reducing hallucinations.',
        hint: 'Open-book exam vs closed-book exam.'
      },
      {
        id: 'q-rag2',
        type: 'multiple-choice',
        question: 'What is an "embedding" in vector search?',
        options: [
          'A cryptographic hash like SHA-256',
          'An array of floating-point numbers (dense vector) capturing semantic meaning in high-dimensional space',
          'An HTML iframe tag',
          'A zipped archive of text files'
        ],
        correctAnswer: 1,
        explanation: 'An embedding is a dense vector representation where texts with similar semantic meanings are positioned close to each other in vector space.',
        hint: 'High-dimensional coordinates of concepts.'
      },
      {
        id: 'q-rag3',
        type: 'multiple-choice',
        question: 'Why is chunk overlap (e.g. 50 tokens) recommended when chunking documents?',
        options: [
          'It makes the vector database 100 times smaller',
          'It prevents key context and sentence meanings from being abruptly cut off at chunk boundaries',
          'It converts English into French',
          'It prevents the model from generating whitespace'
        ],
        correctAnswer: 1,
        explanation: 'Chunk overlap ensures that thoughts, sentences, or concepts spanning the split boundary are not severed, preserving contextual integrity for semantic search.'
      }
    ]
  },
  {
    id: 'quiz-agent-fundamentals',
    title: 'Agent Architecture & ReAct Patterns',
    description: 'Evaluate loops, memory, state machines, reflection, and multi-agent coordination.',
    passingScore: 80,
    questions: [
      {
        id: 'q-ag1',
        type: 'multiple-choice',
        question: 'What defines an AI "Agent" compared to a simple single-turn prompt or linear workflow?',
        options: [
          'Agents use faster computer chips',
          'Agents possess an autonomous loop: they perceive environment state, reason, select actions/tools dynamically, observe feedback, and iterate toward a goal',
          'Agents never make mistakes',
          'Agents do not require large language models'
        ],
        correctAnswer: 1,
        explanation: 'The hallmark of an agent is autonomy and dynamic decision-making in a loop: Reason → Act → Observe → Repeat until the objective is satisfied.',
        hint: 'Think of a thermostat or autopilot vs a light switch.'
      },
      {
        id: 'q-ag2',
        type: 'multiple-choice',
        question: 'In the ReAct pattern, what do the core steps stand for?',
        options: [
          'React, Redux, Router',
          'Reasoning (Thought), Acting (Action/Tool), and Observation (Environment feedback)',
          'Reading, Editing, Archiving',
          'Rest, Execute, Accelerate'
        ],
        correctAnswer: 1,
        explanation: 'ReAct combines Reasoning (generating thoughts to decompose the problem) with Acting (executing tools to retrieve information), followed by Observing the tool response.',
        hint: 'Synergizing Reasoning and Acting in language models.'
      },
      {
        id: 'q-ag3',
        type: 'multiple-choice',
        question: 'In LangGraph or stateful agent workflows, why is an explicit State schema (like TypedDict or Pydantic) vital?',
        options: [
          'To allow unlimited infinite loops without stopping',
          'To provide a deterministic, inspectable single-source-of-truth passed and updated between graph nodes',
          'To replace Python with C++',
          'To avoid using API keys'
        ],
        correctAnswer: 1,
        explanation: 'Explicit State schemas define exactly what data flows through the system, enabling deterministic handoffs, human checkpoints, time-travel debugging, and safe state transitions.'
      }
    ]
  }
];
