import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLesson, getNextLesson } from '../data/curriculum';
import { useProgressStore } from '../store/progressStore';
import { useBookmarkStore } from '../store/bookmarkStore';
import { useSettingsStore } from '../store/settingsStore';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  FileEdit,
  Clock,
  Lightbulb,
  AlertTriangle,
  Check,
  X,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Badge } from '../components/ui/Badge';
import { CodeBlock } from '../components/ui/CodeBlock';
import { PromptPlayground } from '../components/playground/PromptPlayground';
import { ToolCallSimulator } from '../components/playground/ToolCallSimulator';
import { RAGVisualizer } from '../components/playground/RAGVisualizer';
import { AgentPlayground } from '../components/playground/AgentPlayground';
import { LangGraphBuilder } from '../components/playground/LangGraphBuilder';

export const LessonReader: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  return <LessonContent key={lessonId} />;
};

const LessonContent: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const { lessonsCompleted, completeLesson, setCurrentLesson, addTimeSpent, recordQuizScore } = useProgressStore();
  const { isBookmarked, addBookmark, removeBookmark, getNote, saveNote } = useBookmarkStore();
  const { beginnerMode } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<'learn' | 'code' | 'interactive' | 'notes'>('learn');
  const [noteContent, setNoteContent] = useState(() => getNote(lessonId ?? ''));
  const [showNoteSaved, setShowNoteSaved] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const lessonData = lessonId ? getLesson(lessonId) : undefined;
  const moduleId = lessonData?.module.id;

  // Track current lesson and scroll to top
  useEffect(() => {
    if (lessonId && moduleId) {
      setCurrentLesson(lessonId, moduleId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [lessonId, moduleId, setCurrentLesson]);

  // Keep notes synchronized with active lesson
  useEffect(() => {
    if (lessonId) {
      setNoteContent(getNote(lessonId));
    }
  }, [lessonId, getNote]);

  // Track active time spent reading (1 minute increment per 60s)
  useEffect(() => {
    const timer = setInterval(() => {
      addTimeSpent(1);
    }, 60000);
    return () => clearInterval(timer);
  }, [addTimeSpent]);

  if (!lessonData || !lessonId) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Lesson Not Found</h2>
        <p className="text-xs text-slate-400">The lesson ID could not be located in our curriculum.</p>
        <button onClick={() => navigate('/learn')} className="btn-primary">
          Back to Curriculum
        </button>
      </div>
    );
  }

  const { lesson, module } = lessonData;
  const isCompleted = lessonsCompleted.includes(lesson.id);
  const bookmarked = isBookmarked(lesson.id);
  const nextLesson = getNextLesson(lesson.id);
  const question = lesson.quiz?.questions[0];

  const handleToggleComplete = () => {
    if (!isCompleted) {
      completeLesson(lesson.id, module.id);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleToggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(lesson.id);
    } else {
      addBookmark(lesson.id);
    }
  };

  const handleSaveNote = () => {
    saveNote(lesson.id, noteContent);
    setShowNoteSaved(true);
    setTimeout(() => setShowNoteSaved(false), 2000);
  };

  const handleQuizSubmit = (optIdx: number) => {
    setQuizAnswer(optIdx);
    setQuizSubmitted(true);
    if (question && optIdx === question.correctAnswer) {
      recordQuizScore(`lesson-quiz-${lesson.id}`, 100);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-dark-border">
        <button
          onClick={() => navigate(`/learn/${module.id}`)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Module {module.order}: {module.title}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
              bookmarked
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-dark-surface border-dark-border text-slate-400 hover:text-white'
            }`}
            title={bookmarked ? 'Remove Bookmark' : 'Bookmark this Lesson'}
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
          </button>

          {/* Mark Complete Button */}
          <button
            onClick={handleToggleComplete}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isCompleted
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-glow-green'
                : 'bg-accent-purple text-white border-accent-purple hover:bg-accent-purple/90 shadow-glow-purple'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Completed (+50 XP)' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>

      {/* Lesson Header Card */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="purple" size="sm">
            Level {module.level}
          </Badge>
          <Badge variant="blue" size="sm">
            {lesson.type.toUpperCase()}
          </Badge>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> ~{lesson.estimatedMinutes} mins
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 tracking-tight leading-tight">
          {lesson.title}
        </h1>

        {lesson.tags && lesson.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {lesson.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-dark-surface2 text-slate-400 border border-dark-border"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-dark-border gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('learn')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'learn'
              ? 'border-accent-purple text-accent-purple-light'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Lesson Content</span>
        </button>

        {lesson.content.codeExample && (
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-accent-purple text-accent-purple-light'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Code Walkthrough</span>
          </button>
        )}

        {lesson.content.interactiveType && (
          <button
            onClick={() => setActiveTab('interactive')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'interactive'
                ? 'border-accent-purple text-accent-purple-light'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'notes'
              ? 'border-accent-purple text-accent-purple-light'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>My Notes</span>
        </button>
      </div>

      {/* TAB 1: MAIN LESSON CONTENT */}
      {activeTab === 'learn' && (
        <div className="space-y-6 leading-relaxed text-slate-300 animate-fade-in text-xs sm:text-sm">
          {/* 1. What is it? */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-purple" />
              What is it?
            </h2>
            <p className="text-slate-300 leading-relaxed font-sans">{lesson.content.whatIsIt}</p>
          </section>

          {/* 2. Mental Analogy */}
          {lesson.content.analogy && (
            <section className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>Real-World Mental Analogy:</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed italic font-sans">
                "{lesson.content.analogy}"
              </p>
            </section>
          )}

          {/* 3. Beginner Friendly Tip (Optional) */}
          {beginnerMode && (
            <section className="p-4 rounded-2xl bg-accent-green/10 border border-accent-green/30 space-y-1">
              <div className="flex items-center gap-2 text-accent-green-light font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Beginner Mode Active:</span>
              </div>
              <p className="text-xs text-slate-300">
                Focus on high-level mental models first before memorizing exact syntax. Real-world agents are built by connecting simple components step by step.
              </p>
            </section>
          )}

          {/* 4. Why Does it Exist in Agentic AI? */}
          {lesson.content.whyItExists && (
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-blue" />
                Why Does it Matter for Agents?
              </h2>
              <p className="text-slate-300 leading-relaxed font-sans">{lesson.content.whyItExists}</p>
            </section>
          )}

          {/* 5. Step-by-Step Breakdown */}
          {lesson.content.howItWorks && (
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-green" />
                How It Works Step-by-Step
              </h2>
              <div className="p-4 rounded-xl bg-dark-surface border border-dark-border text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                {lesson.content.howItWorks}
              </div>
            </section>
          )}

          {/* 6. Code Block (if available) */}
          {lesson.content.codeExample && (
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Working Code Implementation
              </h2>
              <CodeBlock
                code={lesson.content.codeExample.code}
                language={lesson.content.codeExample.language}
                expectedOutput={lesson.content.codeExample.expectedOutput}
                lineExplanations={lesson.content.codeExample.lineExplanations}
              />
            </section>
          )}

          {/* 7. When to Use vs When NOT to Use */}
          {((lesson.content.whenToUse && lesson.content.whenToUse.length > 0) ||
            (lesson.content.whenNotToUse && lesson.content.whenNotToUse.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {lesson.content.whenToUse && lesson.content.whenToUse.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <Check className="w-4 h-4" />
                    <span>When to Use:</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {lesson.content.whenToUse.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lesson.content.whenNotToUse && lesson.content.whenNotToUse.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider">
                    <X className="w-4 h-4" />
                    <span>When NOT to Use:</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {lesson.content.whenNotToUse.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 8. Common Mistakes to Avoid */}
          {lesson.content.commonMistakes && lesson.content.commonMistakes.length > 0 && (
            <section className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Common Beginner Mistakes to Avoid:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-200/90">
                {lesson.content.commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 9. Key Summary */}
          <section className="p-5 rounded-2xl bg-dark-surface2 border border-dark-border space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Key Takeaway Summary:
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {lesson.content.summary}
            </p>
          </section>

          {/* 10. Quick Knowledge Check Mini-Quiz */}
          {question?.options && (
            <div className="card p-5 bg-dark-surface border border-accent-purple/40 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-accent-purple-light font-bold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Quick Knowledge Check:</span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-100">
                {question.question}
              </p>

              <div className="space-y-2 text-xs">
                {question.options
                  .map((text, id) => ({ id, text, correct: id === question.correctAnswer }))
                  .map((opt) => (
                    <button
                      key={opt.id}
                      disabled={quizSubmitted}
                      onClick={() => handleQuizSubmit(opt.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                        quizSubmitted && opt.correct
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                          : quizSubmitted && quizAnswer === opt.id && !opt.correct
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                          : quizAnswer === opt.id
                          ? 'bg-dark-surface3 border-accent-purple text-slate-100'
                          : 'bg-dark-surface2 border-dark-border text-slate-300 hover:bg-dark-surface3'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {quizSubmitted && opt.correct && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  ))}
              </div>

              {quizSubmitted && (
                <div className="p-3 rounded-xl bg-dark-surface2 border border-dark-border text-xs text-slate-300">
                  <span className={quizAnswer === question.correctAnswer ? 'text-emerald-400' : 'text-amber-400'}>
                    {question.explanation}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CODE WALKTHROUGH */}
      {activeTab === 'code' && lesson.content.codeExample && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-dark-surface2 border border-dark-border text-xs text-slate-300">
            <h3 className="font-bold text-slate-100 mb-1">Code Pattern Breakdown</h3>
            <p>
              Inspect the syntax below, copy it into your local development environment, or click "View Output" to see the simulated execution result.
            </p>
          </div>
          <CodeBlock
            code={lesson.content.codeExample.code}
            language={lesson.content.codeExample.language}
            expectedOutput={lesson.content.codeExample.expectedOutput}
            lineExplanations={lesson.content.codeExample.lineExplanations}
          />
        </div>
      )}

      {/* TAB 3: INTERACTIVE SIMULATOR */}
      {activeTab === 'interactive' && lesson.content.interactiveType && (
        <div className="animate-fade-in">
          {lesson.content.interactiveType === 'prompt-playground' && <PromptPlayground />}
          {lesson.content.interactiveType === 'tool-simulator' && <ToolCallSimulator />}
          {lesson.content.interactiveType === 'rag-visualizer' && <RAGVisualizer />}
          {lesson.content.interactiveType === 'agent-playground' && <AgentPlayground />}
          {(lesson.content.interactiveType === 'langgraph-builder' ||
            lesson.content.interactiveType === 'state-visualizer') && <LangGraphBuilder />}
        </div>
      )}

      {/* TAB 4: MY NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4 animate-fade-in card p-6 bg-dark-surface border-dark-border rounded-2xl">
          <div>
            <h3 className="text-base font-bold text-slate-100">Personal Lesson Notes</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Write down your own thoughts, code snippets, or key insights. Notes are auto-synced across cloud and local storage.
            </p>
          </div>

          <textarea
            rows={8}
            value={noteContent}
            onChange={(e) => {
              const val = e.target.value;
              setNoteContent(val);
              saveNote(lesson.id, val);
            }}
            onBlur={() => {
              saveNote(lesson.id, noteContent);
            }}
            placeholder="e.g., Important insight: Agent tool calls only output JSON, my backend runtime executes the code..."
            className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-accent-purple transition-colors resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <button onClick={handleSaveNote} className="btn-primary py-2 px-4 text-xs">
              Save Notes
            </button>
            {showNoteSaved && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Note Saved!
              </span>
            )}
          </div>
        </div>
      )}

      {/* Bottom Lesson Navigation (Next / Previous) */}
      <div className="pt-8 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => navigate(`/learn/${module.id}`)}
          className="btn-secondary text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Module Index</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleComplete}
            className={`btn-secondary text-xs ${isCompleted ? 'text-emerald-400 border-emerald-500/40' : ''}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Lesson Completed ✓' : 'Mark Lesson Complete'}</span>
          </button>

          {nextLesson && (
            <button
              onClick={() => navigate(`/lesson/${nextLesson.id}`)}
              className="btn-primary text-xs"
            >
              <span>Next: {nextLesson.title.slice(0, 22)}...</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
