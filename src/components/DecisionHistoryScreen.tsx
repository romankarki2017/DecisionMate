import React, { useState } from 'react';
import {
  Search,
  FolderKanban,
  Trash2,
  ChevronRight,
  Clock,
  CheckCircle2,
  Filter,
  Plus,
  Scale,
} from 'lucide-react';
import { DecisionRecord, DecisionCategory, DecisionStatus } from '../types/decision';
import { DECISION_CATEGORIES } from '../services/storage';

interface DecisionHistoryScreenProps {
  decisions: DecisionRecord[];
  onSelectDecision: (decision: DecisionRecord) => void;
  onDeleteDecision: (decisionId: string) => void;
  onOpenCreate: () => void;
}

export const DecisionHistoryScreen: React.FC<DecisionHistoryScreenProps> = ({
  decisions,
  onSelectDecision,
  onDeleteDecision,
  onOpenCreate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'decided' | 'analyzed'>('all');
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  const filteredDecisions = decisions.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || d.category === selectedCategory;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'decided' && d.status === 'decided') ||
      (statusFilter === 'analyzed' && d.status !== 'decided');
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-20 bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">My Decisions</h1>
          <p className="text-xs text-slate-400">Revisit, update, and manage your choices</p>
        </div>
        <button
          onClick={onOpenCreate}
          className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors shadow-lg shadow-indigo-600/30"
          title="Create New Decision"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search saved decisions..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
        {[
          { id: 'all' as const, label: `All (${decisions.length})` },
          { id: 'analyzed' as const, label: `In Review (${decisions.filter((d) => d.status !== 'decided').length})` },
          { id: 'decided' as const, label: `Decided (${decisions.filter((d) => d.status === 'decided').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-colors ${
              statusFilter === tab.id
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Pills Scroller */}
      <div className="overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-200 text-slate-900'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {DECISION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-200 text-slate-900'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label.split('&')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Decision List */}
      <div className="space-y-2.5 flex-1">
        {filteredDecisions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 text-center space-y-2 my-6">
            <Scale className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-xs font-semibold text-slate-300">No decisions match criteria</h3>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Try adjusting your search query or create a new decision above.
            </p>
          </div>
        ) : (
          filteredDecisions.map((dec) => {
            const topAlt = dec.alternatives?.[0];
            const isDecided = dec.status === 'decided';
            return (
              <div
                key={dec.id}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    onClick={() => onSelectDecision(dec)}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1 text-[10px] text-slate-500">
                      <span className="capitalize text-indigo-400 font-semibold">{dec.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(dec.createdAt).toLocaleDateString()}
                      </span>
                      {isDecided && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            Decided
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {dec.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                      {dec.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {topAlt && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-900/60 text-indigo-300 font-bold text-xs tabular-nums">
                        {topAlt.weightedScore} pts
                      </span>
                    )}

                    <button
                      onClick={() => setDeleteCandidateId(dec.id)}
                      className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                      title="Delete Decision"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Footer preview */}
                <div
                  onClick={() => onSelectDecision(dec)}
                  className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] cursor-pointer"
                >
                  <span className="text-slate-400 truncate">
                    {dec.recommendation ? (
                      <>
                        Recommendation:{' '}
                        <span className="text-white font-medium">
                          {dec.recommendation.primaryAlternativeName}
                        </span>
                      </>
                    ) : (
                      'In evaluation'
                    )}
                  </span>
                  <span className="text-indigo-400 font-semibold flex items-center gap-0.5 shrink-0">
                    View Matrix
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteCandidateId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xs w-full text-center space-y-3">
            <h3 className="text-sm font-bold text-white">Delete Decision?</h3>
            <p className="text-xs text-slate-400">
              This will permanently remove this decision analysis and conversation history.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteCandidateId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteDecision(deleteCandidateId);
                  setDeleteCandidateId(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 shadow-md shadow-rose-600/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
