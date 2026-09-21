import React,{ useState } from 'react';
import { Sparkles,Search,Lightbulb } from 'lucide-react';
import { glossaryTerms } from '../data/glossary';
import { Badge } from '../components/ui/Badge';

export const GlossaryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const allTags = Array.from(new Set(glossaryTerms.flatMap((g) => g.tags || [])));

  const filteredTerms = glossaryTerms.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.fullDefinition.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = selectedTag === 'all' || (term.tags && term.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent-purple-light text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Encyclopedia</span>
          </div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            Agentic AI Glossary
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Over 50+ industry terms explained with plain-English definitions, analogies, and related concepts.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search terms, concepts, or analogies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-surface border border-dark-border rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-purple"
          />
        </div>
      </div>

      {/* Filter Tag Pills */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedTag === 'all'
                ? 'bg-accent-purple text-white shadow-glow-purple'
                : 'bg-dark-surface text-slate-400 border border-dark-border hover:text-slate-200'
            }`}
          >
            All Terms ({glossaryTerms.length})
          </button>
          {allTags.slice(0, 10).map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                selectedTag === tag
                  ? 'bg-accent-purple text-white shadow-glow-purple'
                  : 'bg-dark-surface text-slate-400 border border-dark-border hover:text-slate-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map((t) => (
          <div
            key={t.id}
            className="card p-5 bg-dark-surface border-dark-border rounded-2xl flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-base font-bold text-slate-100">{t.term}</h3>
                {t.tags && t.tags[0] && (
                  <Badge variant="purple" size="sm">
                    {t.tags[0]}
                  </Badge>
                )}
              </div>
              <p className="text-xs font-semibold text-accent-purple-light mb-2">
                {t.shortDefinition}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {t.fullDefinition}
              </p>
            </div>

            {t.analogy && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 font-sans leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-0.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Mental Analogy:</span>
                </div>
                {t.analogy}
              </div>
            )}

            {t.relatedTerms && t.relatedTerms.length > 0 && (
              <div className="pt-2 border-t border-dark-border/60 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Related:</span>
                {t.relatedTerms.map((rt) => (
                  <span
                    key={rt}
                    onClick={() => setSearchQuery(rt)}
                    className="text-[10px] font-mono text-slate-400 hover:text-accent-purple-light cursor-pointer underline"
                  >
                    {rt}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
