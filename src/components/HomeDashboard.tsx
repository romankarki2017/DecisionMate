import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Plus,
  Scale,
  ShieldAlert,
  Sliders,
  ChevronRight,
  TrendingUp,
  Laptop,
  Briefcase,
  GraduationCap,
  DollarSign,
  Compass,
  Plane,
  Users,
  HelpCircle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { DecisionRecord, DecisionCategory } from '../types/decision';
import { DECISION_CATEGORIES } from '../services/storage';

interface HomeDashboardProps {
  userName: string;
  onStartAnalysis: (description: string, category?: DecisionCategory, title?: string) => void;
  onOpenCreateModal: () => void;
  onSelectDecision: (decision: DecisionRecord) => void;
  recentDecisions: DecisionRecord[];
  onOpenCategory: (cat: DecisionCategory) => void;
  onOpenQuickTool: (tool: 'devils_advocate' | 'what_if' | 'matrix') => void;
  isAnalyzing: boolean;
}

const QUICK_STARTERS = [
  {
    title: 'MacBook Pro M4 vs Windows Laptop',
    category: 'technology' as DecisionCategory,
    prompt: 'I need to choose between a 16-inch MacBook Pro (M4) and a high-end Windows laptop like Dell XPS or ThinkPad for coding, daily productivity, and travel over the next 4 years. Budget is $2,200.',
  },
  {
    title: 'Accept Startup Role vs Stay at Enterprise',
    category: 'career' as DecisionCategory,
    prompt: 'Should I leave my stable $200k Tech Lead role to join an early-stage B2B AI startup as co-founder with 30% equity and 8 months of personal cash runway?',
  },
  {
    title: 'Study Master’s Abroad vs Online Degree',
    category: 'education' as DecisionCategory,
    prompt: 'Should I invest $70,000 to study a full-time Master’s in Europe for international exposure and visa pathways, or keep working full-time and do an online degree at 1/4th the price?',
  },
  {
    title: 'Learn Python vs Java in 2026',
    category: 'technology' as DecisionCategory,
    prompt: 'As a software engineer looking to maximize marketability over the next 5 years, should I focus deeply on mastering Python (AI/ML & Data) or modern Java (Enterprise & High-throughput systems)?',
  },
];

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userName,
  onStartAnalysis,
  onOpenCreateModal,
  onSelectDecision,
  recentDecisions,
  onOpenCategory,
  onOpenQuickTool,
  isAnalyzing,
}) => {
  const [dilemmaText, setDilemmaText] = useState('');
  const [selectedCat, setSelectedCat] = useState<DecisionCategory | 'all'>('all');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dilemmaText.trim() || isAnalyzing) return;
    onStartAnalysis(dilemmaText.trim(), selectedCat === 'all' ? undefined : selectedCat);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return Laptop;
      case 'Briefcase': return Briefcase;
      case 'GraduationCap': return GraduationCap;
      case 'DollarSign': return DollarSign;
      case 'TrendingUp': return TrendingUp;
      case 'Compass': return Compass;
      case 'Plane': return Plane;
      case 'Users': return Users;
      default: return HelpCircle;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-6 pb-20">
      {/* Top Greeting Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-medium text-indigo-400 tracking-wide uppercase">
            {getGreeting()}, {userName || 'Decision Maker'}
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight">
            DecisionMate
          </h1>
          <p className="text-xs text-slate-400">Think Clearly. Choose Confidently.</p>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-transform"
          title="Create New Decision"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Prominent Input Hero Card: "What are we deciding today?" */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 p-4 shadow-xl shadow-slate-950/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white tracking-tight">
              What are we deciding today?
            </span>
          </div>
          <span className="text-[11px] text-slate-500">Natural Language</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={dilemmaText}
            onChange={(e) => setDilemmaText(e.target.value)}
            placeholder="Describe your situation, options, budget, and trade-offs... e.g. Buy a MacBook or Windows laptop? Or accept a new job offer with longer commute?"
            rows={3}
            className="w-full bg-slate-950/70 border border-slate-700/60 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="text-[11px] text-slate-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
            >
              Advanced Mode (Add custom criteria)
            </button>

            <button
              type="submit"
              disabled={!dilemmaText.trim() || isAnalyzing}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 active:scale-[0.98] transition-all shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze My Decision</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Access Feature Cards */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Decision Toolkit
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onOpenQuickTool('devils_advocate')}
            className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex flex-col items-start gap-1.5 text-left transition-colors group"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">Devil's Advocate</span>
            <span className="text-[10px] text-slate-400 leading-tight">Challenge preferred option</span>
          </button>

          <button
            onClick={() => onOpenQuickTool('what_if')}
            className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex flex-col items-start gap-1.5 text-left transition-colors group"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">What-If Sim</span>
            <span className="text-[10px] text-slate-400 leading-tight">Test shifting conditions</span>
          </button>

          <button
            onClick={() => onOpenQuickTool('matrix')}
            className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex flex-col items-start gap-1.5 text-left transition-colors group"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">Weight Matrix</span>
            <span className="text-[10px] text-slate-400 leading-tight">Custom criteria weights</span>
          </button>
        </div>
      </div>

      {/* Quick Dilemma Starters */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Popular Dilemma Starters
          </h2>
          <span className="text-[11px] text-slate-500">Tap to test</span>
        </div>
        <div className="space-y-2">
          {QUICK_STARTERS.map((starter, idx) => (
            <button
              key={idx}
              onClick={() => onStartAnalysis(starter.prompt, starter.category, starter.title)}
              className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 flex items-center justify-between gap-3 text-left transition-all group"
            >
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors block truncate">
                  {starter.title}
                </span>
                <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {starter.prompt}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Decision Categories */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Categories
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {DECISION_CATEGORIES.slice(0, 6).map((cat) => {
            const IconComponent = getCategoryIcon(cat.iconName);
            const count = recentDecisions.filter((d) => d.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => onOpenCategory(cat.id)}
                className="p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800/80 flex items-center gap-2.5 text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-slate-200 block truncate">
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {count} {count === 1 ? 'decision' : 'decisions'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Decisions Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Recent Decisions
          </h2>
          <span className="text-[11px] text-indigo-400">
            {recentDecisions.length} saved
          </span>
        </div>

        {recentDecisions.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 text-center">
            <Scale className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-300">No decisions saved yet</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Type your dilemma above to generate your first analysis.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentDecisions.slice(0, 4).map((dec) => {
              const topAlt = dec.alternatives?.[0];
              const score = topAlt?.weightedScore || 0;
              return (
                <button
                  key={dec.id}
                  onClick={() => onSelectDecision(dec)}
                  className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between gap-3 text-left transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5 text-[10px] text-slate-500">
                      <span className="capitalize">{dec.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(dec.createdAt).toLocaleDateString()}
                      </span>
                      {dec.status === 'decided' && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-400 font-medium">Decided</span>
                        </>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-200 block truncate">
                      {dec.title}
                    </span>
                    {dec.recommendation && (
                      <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                        Leading: <span className="text-indigo-300">{dec.recommendation.primaryAlternativeName}</span>
                      </span>
                    )}
                  </div>

                  {score > 0 && (
                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span className="text-xs font-bold text-indigo-400 tabular-nums">
                        {score} pts
                      </span>
                      <span className="text-[10px] text-slate-500">Score</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
