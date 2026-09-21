import React,{ useState } from 'react';
import { HelpCircle,CheckCircle2,XCircle,RotateCcw,Award,Lightbulb,ArrowRight } from 'lucide-react';
import { quizzesData } from '../data/quizzes';
import { useProgressStore } from '../store/progressStore';
import { Badge } from '../components/ui/Badge';
import confetti from 'canvas-confetti';

export const QuizHub: React.FC = () => {
  const { quizScores, recordQuizScore } = useProgressStore();
  const [selectedQuizId, setSelectedQuizId] = useState<string>(quizzesData[0]?.id || '');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const activeQuiz = quizzesData.find((q) => q.id === selectedQuizId) || quizzesData[0];
  const question = activeQuiz.questions[currentQuestionIdx];

  const handleSelectOption = (optIdx: number) => {
    if (!submitted) {
      setSelectedAnswers({
        ...selectedAnswers,
        [question.id]: optIdx
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < activeQuiz.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setShowHint(false);
    } else {
      // Calculate final score
      let correctCount = 0;
      activeQuiz.questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });
      const scorePct = Math.round((correctCount / activeQuiz.questions.length) * 100);
      recordQuizScore(activeQuiz.id, scorePct);
      setSubmitted(true);

      if (scorePct >= activeQuiz.passingScore) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setSubmitted(false);
    setShowHint(false);
  };

  const attemptScore = Math.round(activeQuiz.questions.filter((q) => selectedAnswers[q.id] === q.correctAnswer).length / activeQuiz.questions.length * 100);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-accent-green-light text-xs font-bold uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Knowledge Assessments</span>
        </div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">
          Quiz & Assessment Center
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Test your conceptual mastery across programming, LLMs, tool schemas, RAG, and agent loops.
        </p>
      </div>

      {/* Quiz Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {quizzesData.map((q) => {
          const score = quizScores[q.id];
          const isSelected = q.id === activeQuiz.id;

          return (
            <button
              key={q.id}
              onClick={() => {
                setSelectedQuizId(q.id);
                handleResetQuiz();
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-accent-purple/15 border-accent-purple shadow-glow-purple'
                  : 'bg-dark-surface border-dark-border hover:bg-dark-surface2'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-400">
                  {q.questions.length} Questions
                </span>
                {score !== undefined && (
                  <Badge variant={score >= q.passingScore ? 'green' : 'orange'} size="sm">
                    {score}% Best
                  </Badge>
                )}
              </div>
              <h3 className="text-xs font-bold text-slate-100 line-clamp-1">{q.title}</h3>
            </button>
          );
        })}
      </div>

      {/* Active Quiz Card */}
      <div className="card p-6 sm:p-8 bg-dark-surface border-dark-border rounded-3xl shadow-xl space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-dark-border">
          <div>
            <h2 className="text-xl font-bold text-slate-100">{activeQuiz.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{activeQuiz.description}</p>
          </div>
          <Badge variant="purple" size="sm">
            Pass Mark: {activeQuiz.passingScore}%
          </Badge>
        </div>

        {!submitted ? (
          /* Active Question */
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-accent-purple-light">
                Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
              </span>
              {question.hint && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
                </button>
              )}
            </div>

            {/* Hint Box */}
            {showHint && question.hint && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                💡 <strong>Hint:</strong> {question.hint}
              </div>
            )}

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              {question.question}
            </h3>

            {/* Options */}
            <div className="space-y-2.5">
              {question.options?.map((opt, optIdx) => {
                const isSelected = selectedAnswers[question.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-accent-purple text-white border-accent-purple shadow-glow-purple font-semibold'
                        : 'bg-dark-surface2 border-dark-border text-slate-200 hover:bg-dark-surface3'
                    }`}
                  >
                    <span>{opt}</span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-mono ${
                        isSelected ? 'border-white bg-white/20' : 'border-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-dark-border">
              <button
                onClick={() => currentQuestionIdx > 0 && setCurrentQuestionIdx(currentQuestionIdx - 1)}
                disabled={currentQuestionIdx === 0}
                className="btn-secondary text-xs disabled:opacity-40"
              >
                Previous Question
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[question.id] === undefined}
                className="btn-primary text-xs shadow-glow-purple disabled:opacity-40"
              >
                <span>
                  {currentQuestionIdx === activeQuiz.questions.length - 1
                    ? 'Submit Assessment'
                    : 'Next Question'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="space-y-6 text-center py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-accent-purple/20 text-accent-purple-light flex items-center justify-center mx-auto shadow-glow-purple">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-100">
                Assessment Completed!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Here is how you performed on {activeQuiz.title}.
              </p>
            </div>

            <div className="inline-block p-4 rounded-2xl bg-dark-surface2 border border-dark-border font-mono text-2xl font-black text-accent-purple-light">
              Score: {attemptScore}%
            </div>

            {/* Question Breakdown with Explanations */}
            <div className="space-y-4 text-left pt-4 max-w-2xl mx-auto">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Detailed Question Explanations:
              </h4>

              {activeQuiz.questions.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border ${
                      isCorrect
                        ? 'bg-emerald-950/15 border-emerald-500/30'
                        : 'bg-rose-950/15 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5 font-bold text-xs">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      <span className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                        Question {idx + 1}: {isCorrect ? 'Correct' : 'Needs Review'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 mb-2">{q.question}</p>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed bg-dark-bg/60 p-2.5 rounded-xl border border-white/5">
                      💡 {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>

            <button onClick={handleResetQuiz} className="btn-secondary text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Assessment</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
