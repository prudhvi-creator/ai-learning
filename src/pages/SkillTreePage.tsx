import React,{ useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network,CheckCircle2,ArrowRight,BookOpen } from 'lucide-react';
import { skillTreeData } from '../data/skillTree';
import { Badge } from '../components/ui/Badge';

export const SkillTreePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSkillId, setSelectedSkillId] = useState<string>(skillTreeData[0]?.id || '');

  const categories = Array.from(new Set(skillTreeData.map((s) => s.category)));
  const activeSkill = skillTreeData.find((s) => s.id === selectedSkillId) || skillTreeData[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-accent-purple-light text-xs font-bold uppercase tracking-wider mb-1">
          <Network className="w-4 h-4" />
          <span>Competency Map</span>
        </div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">
          Agentic AI Skill Tree
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans leading-relaxed">
          Master prerequisites step-by-step. Each competency builds on prior foundations so you never feel lost.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Visual Skill Tree Columns by Category */}
        <div className="lg:col-span-8 space-y-6">
          {categories.map((category) => {
            const categorySkills = skillTreeData.filter((s) => s.category === category);

            return (
              <div
                key={category}
                className="p-5 rounded-3xl bg-dark-surface border border-dark-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {category} Track
                  </h2>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {categorySkills.length} Skills
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {categorySkills.map((skill) => {
                    const isSelected = skill.id === activeSkill.id;

                    return (
                      <button
                        key={skill.id}
                        onClick={() => setSelectedSkillId(skill.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-accent-purple/20 border-accent-purple shadow-glow-purple scale-102'
                            : 'bg-dark-surface2 border-dark-border hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: skill.color }}
                          />
                          <span className="text-[10px] text-slate-400 font-mono">
                            {skill.prerequisites.length > 0 ? `${skill.prerequisites.length} prereq` : 'Base'}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-100 line-clamp-1">
                          {skill.label}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {skill.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 4 Cols: Selected Skill Deep-Dive Inspector */}
        <div className="lg:col-span-4">
          <div className="sticky top-20 card p-6 bg-dark-surface border-dark-border rounded-3xl space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <Badge variant="purple" size="sm">
                {activeSkill.category}
              </Badge>
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activeSkill.color }}
              />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-100">{activeSkill.label}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {activeSkill.description}
              </p>
            </div>

            {/* Prerequisites list */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Required Prerequisites:
              </span>
              {activeSkill.prerequisites.length === 0 ? (
                <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Foundational Skill — No prerequisites required!</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {activeSkill.prerequisites.map((pId) => {
                    const prereq = skillTreeData.find((s) => s.id === pId);
                    return (
                      <div
                        key={pId}
                        onClick={() => setSelectedSkillId(pId)}
                        className="p-2 rounded-xl bg-dark-surface2 border border-dark-border text-xs text-slate-300 hover:border-accent-purple/50 cursor-pointer flex items-center justify-between"
                      >
                        <span className="truncate">{prereq?.label || pId}</span>
                        <span className="text-[10px] text-accent-purple-light">Inspect →</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Jump to Associated Module/Lesson */}
            {activeSkill.moduleId && (
              <button
                onClick={() => navigate(`/learn/${activeSkill.moduleId}`)}
                className="btn-primary w-full justify-center text-xs shadow-glow-purple"
              >
                <BookOpen className="w-4 h-4" />
                <span>Go to Associated Module</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
