import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  BookOpen,
  Terminal,
  Boxes,
  FolderGit2,
  HelpCircle,
  Network,
  BarChart3,
  BookMarked,
  Settings,
  Scale,
  Sparkles,
  Flame,
  Award,
  User as UserIcon,
} from 'lucide-react';
import { useProgressStore } from '../../store/progressStore';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/roadmap', label: 'Zero to Hero Path', icon: Map, badge: 'Curriculum' },
  { path: '/learn', label: 'All Modules', icon: BookOpen },
  { path: '/playground', label: 'Playgrounds', icon: Terminal, badge: 'Interactive' },
  { path: '/architecture', label: 'Architecture Lab', icon: Boxes },
  { path: '/projects', label: 'Hands-on Projects', icon: FolderGit2, count: '9' },
  { path: '/frameworks', label: 'Framework Matrix', icon: Scale },
  { path: '/quiz', label: 'Quiz Center', icon: HelpCircle },
  { path: '/skill-tree', label: 'Skill Tree', icon: Network },
  { path: '/progress', label: 'My Analytics', icon: BarChart3 },
  { path: '/glossary', label: 'AI Glossary', icon: Sparkles, count: '50+' },
  { path: '/bookmarks', label: 'Saved Notes', icon: BookMarked },
  { path: '/settings', label: 'Preferences', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { xp, level, streak, lessonsCompleted } = useProgressStore();
  const { user } = useAuthStore();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-dark-surface border-r border-dark-border flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-5 border-b border-dark-border flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-3 group" onClick={onClose}>
              <div className="w-10 h-10 rounded-xl bg-gradient-purple flex items-center justify-center text-white font-black text-xl shadow-glow-purple group-hover:scale-105 transition-transform">
                Ω
              </div>
              <div>
                <h1 className="font-extrabold text-sm text-slate-100 tracking-tight group-hover:text-accent-purple-light transition-colors">
                  Agentic AI
                </h1>
                <span className="text-[11px] font-mono text-accent-purple-light uppercase tracking-widest font-semibold block">
                  Zero to Hero
                </span>
              </div>
            </NavLink>
          </div>

          {/* Quick Learner Stats Pill */}
          <div className="p-3 mx-3 my-3 rounded-xl bg-dark-surface2 border border-dark-border/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold" title="Current Daily Streak">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{streak} Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-accent-purple-light font-semibold" title="Level & XP">
              <Award className="w-4 h-4" />
              <span>Lvl {level} ({xp} XP)</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] custom-scrollbar">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-accent-purple text-white shadow-glow-purple font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-dark-surface2'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-white font-bold">
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-dark-border text-slate-400 font-mono">
                    {item.count}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Profile Footer */}
        <div className="p-4 border-t border-dark-border bg-dark-surface/50">
          {user && (
            <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-dark-border/50">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full border border-dark-border object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-accent-purple/20 text-accent-purple-light flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {user.displayName || 'Learner'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user.email}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Progress:</span>
            <span className="font-mono text-slate-200 font-bold">
              {lessonsCompleted.length} Lessons
            </span>
          </div>
          <div className="w-full bg-dark-surface3 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gradient-purple h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min((lessonsCompleted.length / 50) * 100, 100)}%` }}
            />
          </div>
        </div>
      </aside>
    </>
  );
};
