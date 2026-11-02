import React, { useState } from 'react';
import { HelpCircle, ArrowRight, FastForward, CheckCircle2 } from 'lucide-react';
import { FollowUpQuestion } from '../types/decision';

interface FollowUpQuestionsModalProps {
  isOpen: boolean;
  decisionTitle: string;
  summary: string;
  questions: FollowUpQuestion[];
  onSubmitAnswers: (answers: Array<{ question: string; answer: string }>) => void;
  onSkipAndAnalyze: () => void;
  isSubmitting: boolean;
}

export const FollowUpQuestionsModal: React.FC<FollowUpQuestionsModalProps> = ({
  isOpen,
  decisionTitle,
  summary,
  questions,
  onSubmitAnswers,
  onSkipAndAnalyze,
  isSubmitting,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSelectOption = (qId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleTextAnswer = (qId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: text }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = questions.map((q) => ({
      question: q.question,
      answer: answers[q.id] || 'Not specified',
    }));
    onSubmitAnswers(formatted);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-lg max-h-[92vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Need A Few Details</h2>
              <p className="text-[10px] text-slate-400">Personalizing trade-offs for high accuracy</p>
            </div>
          </div>
          <button
            onClick={onSkipAndAnalyze}
            className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
          >
            <span>Skip</span>
            <FastForward className="w-3 h-3" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Situation Context */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 leading-relaxed text-[11px]">
            <span className="font-semibold text-indigo-300 block mb-0.5">Understanding your dilemma:</span>
            {summary}
          </div>

          {/* Follow-up Questions */}
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id || idx} className="space-y-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                <span className="font-semibold text-white block">
                  {idx + 1}. {q.question}
                </span>
                {q.context && (
                  <p className="text-[10px] text-slate-400 italic mb-2">{q.context}</p>
                )}

                {/* Option buttons if provided */}
                {q.options && q.options.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1.5 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[q.id] === opt;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-[11px] flex items-center justify-between border transition-all ${
                            isSelected
                              ? 'bg-indigo-600/20 border-indigo-500 text-white font-medium'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={answers[q.id] || ''}
                    onChange={(e) => handleTextAnswer(q.id, e.target.value)}
                    placeholder="Type your response..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing responses...</span>
                </>
              ) : (
                <>
                  <span>Submit & Finalize Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onSkipAndAnalyze}
              className="text-center text-[11px] text-slate-500 hover:text-slate-300 py-1"
            >
              Skip questions and generate direct analysis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
