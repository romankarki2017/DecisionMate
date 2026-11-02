import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { DecisionCategory } from '../types/decision';
import { DECISION_CATEGORIES } from '../services/storage';

interface DecisionCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    category: DecisionCategory;
    alternatives: string[];
    priorities: Array<{ name: string; weight: number }>;
  }) => void;
  isAnalyzing: boolean;
  initialCategory?: DecisionCategory;
}

export const DecisionCreationModal: React.FC<DecisionCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isAnalyzing,
  initialCategory,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DecisionCategory>(initialCategory || 'technology');
  const [alternatives, setAlternatives] = useState<string[]>(['', '']);
  const [priorities, setPriorities] = useState<Array<{ name: string; weight: number }>>([
    { name: 'Cost & Value', weight: 30 },
    { name: 'Performance & Quality', weight: 35 },
    { name: 'Convenience & Friction', weight: 20 },
    { name: 'Long-Term Impact', weight: 15 },
  ]);
  const [newAltInput, setNewAltInput] = useState('');

  if (!isOpen) return null;

  const handleAddAlternative = () => {
    if (newAltInput.trim()) {
      setAlternatives([...alternatives.filter((a) => a.trim().length > 0), newAltInput.trim()]);
      setNewAltInput('');
    }
  };

  const handleRemoveAlternative = (index: number) => {
    const updated = alternatives.filter((_, i) => i !== index);
    setAlternatives(updated.length ? updated : ['']);
  };

  const handleAlternativeChange = (index: number, val: string) => {
    const updated = [...alternatives];
    updated[index] = val;
    setAlternatives(updated);
  };

  const handlePriorityWeightChange = (index: number, weight: number) => {
    const updated = [...priorities];
    updated[index].weight = weight;
    setPriorities(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() && !title.trim()) return;

    const validAlts = alternatives.filter((a) => a.trim().length > 0);
    onSubmit({
      title: title.trim() || 'Custom Decision Evaluation',
      description: description.trim(),
      category,
      alternatives: validAlts,
      priorities,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-lg max-h-[90vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Create Decision</h2>
            <p className="text-[11px] text-slate-400">Specify situation, alternatives, and priorities</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Decision Title (Optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. MacBook Pro M4 vs ThinkPad X1 Gen 12"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Situation / Dilemma Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Describe Your Situation & Dilemma <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you struggling between? Mention constraints, budget, timelines, and worries..."
              rows={3}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {DECISION_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    category === cat.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label.split('&')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Alternatives */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-semibold">
                Alternatives Under Consideration
              </label>
              <span className="text-[10px] text-slate-500">Leave blank for AI to suggest</span>
            </div>

            <div className="space-y-2">
              {alternatives.map((alt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 text-center text-[11px] font-bold text-slate-500">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={alt}
                    onChange={(e) => handleAlternativeChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1} (e.g. ${idx === 0 ? 'MacBook Pro' : 'ThinkPad'})`}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  {alternatives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAlternative(idx)}
                      className="text-slate-600 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newAltInput}
                  onChange={(e) => setNewAltInput(e.target.value)}
                  placeholder="Add another alternative..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAlternative();
                    }
                  }}
                  className="flex-1 bg-slate-950/60 border border-slate-800/80 rounded-lg px-3 py-1.5 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddAlternative}
                  disabled={!newAltInput.trim()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Initial Priority Criteria Weights */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Priority Weights (% Importance)</span>
              </label>
              <span className="text-[10px] text-slate-500">Fine-tune in analysis</span>
            </div>

            <div className="space-y-2 bg-slate-950/60 border border-slate-800/70 p-3 rounded-xl">
              {priorities.map((crit, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{crit.name}</span>
                    <span className="text-indigo-400 font-bold tabular-nums">{crit.weight}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={crit.weight}
                    onChange={(e) => handlePriorityWeightChange(idx, Number(e.target.value))}
                    className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!description.trim() && !title.trim() || isAnalyzing}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.99]"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Consulting Decision Intelligence...</span>
                </>
              ) : (
                <>
                  <span>Run Decision Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
