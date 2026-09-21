export type LessonType = 'concept' | 'interactive' | 'code' | 'quiz' | 'project';
export type DifficultyLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type QuizQuestionType = 'multiple-choice' | 'true-false' | 'fill-blank' | 'code-output' | 'architecture' | 'what-next';

export interface CodeBlock {
  language: string;
  code: string;
  expectedOutput?: string;
  lineExplanations?: Record<number, string>;
}

export interface DiagramNode {
  id: string;
  label: string;
  type: 'start' | 'end' | 'process' | 'decision' | 'tool' | 'data';
  description?: string;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  condition?: string;
}

export interface DiagramSpec {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  description: string;
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hint?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export interface LessonContent {
  whatIsIt: string;
  whyItExists: string;
  analogy: string;
  visualExplanation?: DiagramSpec;
  simpleExample: string;
  codeExample?: CodeBlock;
  howItWorks: string;
  whenToUse: string[];
  whenNotToUse: string[];
  commonMistakes: string[];
  summary: string;
  interactiveType?: 'prompt-playground' | 'tool-simulator' | 'rag-visualizer' | 'agent-playground' | 'langgraph-builder' | 'state-visualizer' | 'code-playground';
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  type: LessonType;
  estimatedMinutes: number;
  content: LessonContent;
  quiz?: Quiz;
  tags: string[];
}

export interface Module {
  id: string;
  level: DifficultyLevel;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  estimatedHours: number;
  prerequisites: string[];
  lessons: Lesson[];
  levelAssessment?: Quiz;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'capstone';
  estimatedHours: number;
  moduleIds: string[];
  skills: string[];
  architecture?: DiagramSpec;
  steps: ProjectStep[];
}

export interface ProjectStep {
  title: string;
  description: string;
  codeExample?: CodeBlock;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  shortDefinition: string;
  fullDefinition: string;
  analogy?: string;
  relatedTerms: string[];
  moduleId?: string;
  tags: string[];
}

export interface SkillNode {
  id: string;
  label: string;
  moduleId?: string;
  lessonId?: string;
  prerequisites: string[];
  category: string;
  icon: string;
  color: string;
  description: string;
}
