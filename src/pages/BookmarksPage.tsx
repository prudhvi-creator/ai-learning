import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookMarked,FileEdit,Trash2,ArrowRight } from 'lucide-react';
import { useBookmarkStore } from '../store/bookmarkStore';
import { getLesson } from '../data/curriculum';

export const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookmarks, notes, removeBookmark, deleteNote } = useBookmarkStore();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
          <BookMarked className="w-4 h-4" />
          <span>Personal Library</span>
        </div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">
          Saved Lessons & Notes
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review bookmarked curriculum lessons and personal notes taken while studying.
        </p>
      </div>

      {/* Bookmarks Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-accent-purple-light" />
          Bookmarked Lessons ({bookmarks.length})
        </h2>

        {bookmarks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-dark-surface border border-dark-border text-center text-xs text-slate-500">
            No lessons bookmarked yet. Click the "Save" icon on any lesson to keep it here for quick reference!
          </div>
        ) : (
          <div className="space-y-2.5">
            {bookmarks.map((b) => {
              const data = getLesson(b.lessonId);
              if (!data) return null;
              const { lesson, module } = data;

              return (
                <div
                  key={b.lessonId}
                  className="p-4 rounded-2xl bg-dark-surface border border-dark-border flex items-center justify-between gap-4"
                >
                  <div
                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                    className="cursor-pointer group flex-1"
                  >
                    <span className="text-[11px] text-accent-purple-light font-mono font-semibold">
                      Module {module.order}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-accent-purple-light transition-colors">
                      {lesson.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-dark-surface2 text-xs text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeBookmark(b.lessonId)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="space-y-4 pt-4 border-t border-dark-border">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <FileEdit className="w-4 h-4 text-accent-green-light" />
          My Saved Notes ({notes.length})
        </h2>

        {notes.length === 0 ? (
          <div className="p-8 rounded-2xl bg-dark-surface border border-dark-border text-center text-xs text-slate-500">
            No lesson notes recorded yet. Open the "My Notes" tab on any lesson to record insights!
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((n) => {
              const data = getLesson(n.lessonId);
              return (
                <div
                  key={n.lessonId}
                  className="p-5 rounded-2xl bg-dark-surface border border-dark-border space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-accent-green-light">
                      {data ? data.lesson.title : n.lessonId}
                    </span>
                    <button
                      onClick={() => deleteNote(n.lessonId)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-dark-bg/60 p-3 rounded-xl border border-white/5">
                    {n.content}
                  </pre>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
