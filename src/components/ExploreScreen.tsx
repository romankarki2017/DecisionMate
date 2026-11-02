import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  Sparkles,
  ArrowRight,
  Brain,
  Clock,
  ShieldCheck,
  Layers,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { DecisionCategory } from '../types/decision';

interface ExploreScreenProps {
  onStartAnalysis: (description: string, category?: DecisionCategory, title?: string) => void;
}

const FRAMEWORKS = [
  {
    id: '10_10_10',
    title: 'The 10-10-10 Rule',
    author: 'Suzy Welch',
    description: 'Evaluate emotional impulses across 3 time horizons to detach from immediate panic or FOMO.',
    questions: [
      'How will I feel about this choice in 10 minutes?',
      'How will I feel about this choice in 10 months?',
      'How will I feel about this choice in 10 years?',
    ],
    idealFor: 'Impulsive decisions, arguments, major career shifts, relationship boundaries',
  },
  {
    id: 'regret_min',
    title: 'Regret Minimization Framework',
    author: 'Jeff Bezos (Amazon Founding)',
    description: 'Project yourself forward to age 80. Look back at your life. Will you regret attempting this and failing, or will you regret never trying at all?',
    questions: [
      'At age 80, will I regret not participating in this upside?',
      'If this fails completely, will I be proud that I tried?',
      'Is the downside survivable, and is the upside asymmetric?',
    ],
    idealFor: 'Starting a company, making a daring career leap, relocating abroad',
  },
  {
    id: 'first_principles',
    title: 'First Principles Thinking',
    author: 'Aristotle / Elon Musk',
    description: 'Boil things down to their most fundamental truths and reason up from there, rather than reasoning by analogy or copying others.',
    questions: [
      'What are the non-negotiable physical or financial constraints?',
      'What parts of this choice are mere social convention or habit?',
      'If I started from a blank canvas today, what would I build?',
    ],
    idealFor: 'Technology purchases, engineering architecture, startup pricing',
  },
  {
    id: 'eisenhower',
    title: 'Urgent vs Important Matrix',
    author: 'Dwight D. Eisenhower',
    description: 'Separate fake urgency from genuine long-term value compounding.',
    questions: [
      'Is this decision actually important, or merely noisy and loud?',
      'What happens if I delay making this decision for 72 hours?',
      'Does this decision move my primary 1-year needle?',
    ],
    idealFor: 'Daily task prioritization, time management, accepting meetings',
  },
];

const CURATED_TEMPLATES = [
  {
    title: 'Rent vs Buy a Home in 2026',
    category: 'finance' as DecisionCategory,
    prompt: 'Should I buy a 2-bedroom home with current interest rates and property taxes, or continue renting and invest the down payment difference into index funds?',
  },
  {
    title: 'Relocate to a Major Tech Hub vs Low-Cost City',
    category: 'lifestyle' as DecisionCategory,
    prompt: 'Should I move to San Francisco/New York for career serendipity and networking, or stay in a low-cost city with higher savings rate and calm quality of life?',
  },
  {
    title: 'Bootstrap vs Raise Venture Capital for SaaS',
    category: 'business' as DecisionCategory,
    prompt: 'Should I bootstrap my B2B software business to retain 100% ownership and immediate profitability, or raise $1.5M seed funding to hire quickly and capture market share?',
  },
  {
    title: 'Buy vs Lease a New Vehicle',
    category: 'finance' as DecisionCategory,
    prompt: 'Should I lease an electric vehicle for lower monthly payments and battery obsolescence protection, or buy and keep it for 8 years?',
  },
];

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ onStartAnalysis }) => {
  const [selectedFramework, setSelectedFramework] = useState(FRAMEWORKS[0]);
  const [testInput, setTestInput] = useState('');

  return (
    <div className="flex-1 flex flex-col p-4 space-y-5 pb-20 bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="pt-1">
        <h1 className="text-xl font-bold text-white tracking-tight">Decision Models & Templates</h1>
        <p className="text-xs text-slate-400">Master proven mental frameworks to think with clarity</p>
      </div>

      {/* Mental Frameworks Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Mental Frameworks
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {FRAMEWORKS.map((fw) => {
            const isSelected = selectedFramework.id === fw.id;
            return (
              <button
                key={fw.id}
                onClick={() => setSelectedFramework(fw)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500/60 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span className="text-xs font-bold text-white block truncate">{fw.title}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{fw.author}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Framework Deep Dive Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h3 className="text-sm font-bold text-white">{selectedFramework.title}</h3>
              <span className="text-[10px] text-indigo-400 font-medium">Formulated by {selectedFramework.author}</span>
            </div>
            <Lightbulb className="w-4 h-4 text-amber-400" />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedFramework.description}
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-200 block">Core Inquiry Prompts:</span>
            {selectedFramework.questions.map((q, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                <span className="text-indigo-400 font-bold shrink-0">{idx + 1}.</span>
                <span>{q}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400">
            <strong className="text-slate-300 font-medium">Best Applied For: </strong>
            {selectedFramework.idealFor}
          </p>
        </div>
      </div>

      {/* Curated Real-World Decision Templates */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Curated Decision Blueprints
          </h2>
          <span className="text-[11px] text-slate-500">Ready to analyze</span>
        </div>

        <div className="space-y-2">
          {CURATED_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              onClick={() => onStartAnalysis(tmpl.prompt, tmpl.category, tmpl.title)}
              className="w-full p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left transition-all flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 text-[10px]">
                  <span className="text-indigo-400 font-bold uppercase">{tmpl.category}</span>
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                  {tmpl.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {tmpl.prompt}
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
