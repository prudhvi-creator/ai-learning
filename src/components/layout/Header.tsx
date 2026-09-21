import React, { useEffect, useState } from 'react';
import { Menu, Search, Sparkles, BookOpen, Flame, Moon, Sun, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/progressStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { Modal } from '../ui/Modal';
import { modules } from '../../data/curriculum';
import { glossaryTerms } from '../../data/glossary';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const navigate = useNavigate();
  const { streak, currentLessonId } = useProgressStore();
  const { beginnerMode, toggleBeginnerMode, theme, toggleTheme } = useSettingsStore();
  const { user, signOut } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedQuery = searchQuery.trim().toLowerCase();

  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', openSearch);
    return () => window.removeEventListener('keydown', openSearch);
  }, []);

  // Search logic across modules, lessons, and glossary
  const filteredLessons = searchQuery.trim()
    ? modules
        .flatMap((m) => m.lessons.map((l) => ({ ...l, moduleTitle: m.title })))
        .filter(
          (l) =>
            l.title.toLowerCase().includes(normalizedQuery) ||
            l.content.whatIsIt.toLowerCase().includes(normalizedQuery)
        )
        .slice(0, 5)
    : [];

  const filteredGlossary = searchQuery.trim()
    ? glossaryTerms
        .filter(
          (g) =>
            g.term.toLowerCase().includes(normalizedQuery) ||
            g.shortDefinition.toLowerCase().includes(normalizedQuery)
        )
        .slice(0, 4)
    : [];

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border px-4 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-surface2 lg:hidden"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Continue Button */}
          {currentLessonId && (
            <button
              onClick={() => navigate(`/lesson/${currentLessonId}`)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-surface2 border border-dark-border text-xs text-slate-300 hover:border-accent-purple/60 hover:text-white transition-all group"
            >
              <BookOpen className="w-3.5 h-3.5 text-accent-purple-light group-hover:scale-110 transition-transform" />
              <span>Continue Current Lesson</span>
            </button>
          )}
        </div>

        {/* Center: Quick Search Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-surface border border-dark-border text-xs text-slate-400 hover:text-slate-200 hover:border-dark-border/80 transition-all w-48 sm:w-64 justify-between"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">Quick search...</span>
          </span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-dark-surface2 border border-dark-border text-[10px] text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Right: Beginner Mode, Theme Toggle, Streak, User & Logout */}
        <div className="flex items-center gap-2.5">
          {/* Beginner Mode Toggle */}
          <button
            onClick={toggleBeginnerMode}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              beginnerMode
                ? 'bg-accent-green/20 text-accent-green-light border-accent-green/40 shadow-glow-green'
                : 'bg-dark-surface2 text-slate-400 border-dark-border hover:text-slate-200'
            }`}
            title="Toggles simpler explanations and mental analogies"
          >
            <Sparkles className="w-3 h-3" />
            <span>Beginner Mode: {beginnerMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-dark-surface2 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Streak Indicator */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{streak}d</span>
          </div>

          {/* User Profile & Sign Out */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-dark-border">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-7 h-7 rounded-full border border-dark-border object-cover"
                  title={user.displayName || user.email || 'User'}
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-accent-purple/20 text-accent-purple-light border border-accent-purple/30 flex items-center justify-center text-xs font-bold">
                  {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                </div>
              )}
              <button
                onClick={() => signOut()}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Global Search Modal */}
      <Modal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} title="Search Knowledge Base">
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search concepts, lessons, tools, RAG, agents, or glossary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-purple"
            />
          </div>

          {searchQuery.trim() === '' ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              Type anything to search {modules.length} modules, {modules.reduce((sum, module) => sum + module.lessons.length, 0)} lessons, and {glossaryTerms.length} glossary terms.
            </div>
          ) : (
            <div className="space-y-4 max-h-[50vh] overflow-y-auto">
              {filteredLessons.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Lessons
                  </div>
                  <div className="space-y-1.5">
                    {filteredLessons.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate(`/lesson/${l.id}`);
                        }}
                        className="w-full text-left p-2.5 rounded-lg bg-dark-surface2 hover:bg-dark-surface3 border border-dark-border transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{l.title}</div>
                          <div className="text-[10px] text-slate-400">{l.moduleTitle}</div>
                        </div>
                        <span className="text-[10px] text-accent-purple-light font-mono">Open →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredGlossary.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Glossary Terms
                  </div>
                  <div className="space-y-1.5">
                    {filteredGlossary.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate(`/glossary`);
                        }}
                        className="w-full text-left p-2.5 rounded-lg bg-dark-surface2 hover:bg-dark-surface3 border border-dark-border transition-colors"
                      >
                        <div className="text-xs font-bold text-accent-purple-light">{g.term}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{g.shortDefinition}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredLessons.length === 0 && filteredGlossary.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No matching lessons or terms found for "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
