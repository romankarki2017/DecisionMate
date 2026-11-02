import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sliders,
  ShieldAlert,
  Compass,
  Sparkles,
  HelpCircle,
  MessageSquare,
  Bookmark,
  Share2,
  RotateCcw,
  Send,
  Eye,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
} from 'lucide-react';
import { DecisionRecord, Alternative, Criterion } from '../types/decision';
import { runWhatIfSimulation, challengeWithDevilsAdvocate } from '../services/decisionApi';

interface AnalysisResultsScreenProps {
  decision: DecisionRecord;
  onBack: () => void;
  onUpdateDecision: (updated: DecisionRecord) => void;
  onOpenChat: () => void;
}

type TabType = 'overview' | 'scoring' | 'pros_cons' | 'devils_advocate' | 'what_if' | 'reality_check';

export const AnalysisResultsScreen: React.FC<AnalysisResultsScreenProps> = ({
  decision,
  onBack,
  onUpdateDecision,
  onOpenChat,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [confidence, setConfidence] = useState<number>(decision.confidenceRating || 7);
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string>(
    decision.selectedAlternativeId || decision.recommendation?.primaryAlternativeId || decision.alternatives[0]?.id || ''
  );

  // Criteria weight editing state for dynamic recalculation
  const [criteria, setCriteria] = useState<Criterion[]>(decision.criteria || []);
  const [alternatives, setAlternatives] = useState<Alternative[]>(decision.alternatives || []);

  // What-If Simulator state
  const [whatIfInput, setWhatIfInput] = useState('');
  const [isSimulatingWhatIf, setIsSimulatingWhatIf] = useState(false);
  const [whatIfResults, setWhatIfResults] = useState(decision.whatIfScenarios || []);

  // Devil's Advocate custom challenge state
  const [isChallenging, setIsChallenging] = useState(false);
  const [devilsAdvocateData, setDevilsAdvocateData] = useState(decision.devilsAdvocate);

  // Re-calculate weighted scores dynamically whenever criteria weights change
  const handleWeightChange = (critId: string, newWeight: number) => {
    const updatedCriteria = criteria.map((c) =>
      c.id === critId ? { ...c, weight: newWeight } : c
    );
    setCriteria(updatedCriteria);

    const totalWeight = updatedCriteria.reduce((sum, c) => sum + c.weight, 0) || 1;

    const updatedAlternatives = alternatives.map((alt) => {
      let weightedSum = 0;
      updatedCriteria.forEach((c) => {
        const score = alt.scores[c.id] || 70;
        weightedSum += score * c.weight;
      });
      const newWeightedScore = Math.round(weightedSum / totalWeight);
      return { ...alt, weightedScore: newWeightedScore };
    });

    // Sort alternatives by weighted score descending
    updatedAlternatives.sort((a, b) => b.weightedScore - a.weightedScore);
    setAlternatives(updatedAlternatives);

    // Persist updated decision
    onUpdateDecision({
      ...decision,
      criteria: updatedCriteria,
      alternatives: updatedAlternatives,
      recommendation: decision.recommendation
        ? {
            ...decision.recommendation,
            primaryAlternativeId: updatedAlternatives[0]?.id || decision.recommendation.primaryAlternativeId,
            primaryAlternativeName: updatedAlternatives[0]?.name || decision.recommendation.primaryAlternativeName,
          }
        : undefined,
    });
  };

  const handleMarkAsDecided = (altId: string) => {
    setSelectedAlternativeId(altId);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onUpdateDecision({
      ...decision,
      status: 'decided',
      selectedAlternativeId: altId,
      confidenceRating: confidence,
    });
  };

  const handleConfidenceChange = (val: number) => {
    setConfidence(val);
    onUpdateDecision({
      ...decision,
      confidenceRating: val,
    });
  };

  const handleRunWhatIf = async (scenario: string) => {
    const prompt = scenario.trim();
    if (!prompt || isSimulatingWhatIf) return;
    setIsSimulatingWhatIf(true);
    try {
      const res = await runWhatIfSimulation({
        decisionData: { ...decision, alternatives, criteria },
        scenarioText: prompt,
      });

      const newScenario = {
        id: `wi_${Date.now()}`,
        scenarioText: prompt,
        aiResponse: res.scenarioAnalysis,
        timestamp: Date.now(),
      };

      const updatedScenarios = [newScenario, ...whatIfResults];
      setWhatIfResults(updatedScenarios);
      onUpdateDecision({
        ...decision,
        whatIfScenarios: updatedScenarios,
      });
      setWhatIfInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulatingWhatIf(false);
    }
  };

  const handleChallengeAlternative = async (altName: string) => {
    if (isChallenging) return;
    setIsChallenging(true);
    try {
      const res = await challengeWithDevilsAdvocate({
        preferredAlternative: altName,
        title: decision.title,
        description: decision.description,
      });
      setDevilsAdvocateData(res);
      onUpdateDecision({
        ...decision,
        devilsAdvocate: res,
      });
      setActiveTab('devils_advocate');
    } catch (err) {
      console.error(err);
    } finally {
      setIsChallenging(false);
    }
  };

  const topAlternative = alternatives[0];
  const selectedAlt = alternatives.find((a) => a.id === selectedAlternativeId) || topAlternative;

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 pb-20">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Decisions</span>
        </button>

        <div className="text-center min-w-0 max-w-[200px] px-2">
          <span className="text-xs font-bold text-white block truncate">
            {decision.title}
          </span>
          <span className="text-[10px] text-slate-400 capitalize">
            {decision.category}
          </span>
        </div>

        <button
          onClick={onOpenChat}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-medium transition-colors"
          title="Ask DecisionMate AI"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>
      </div>

      {/* Segmented Sub-navigation Tabs */}
      <div className="px-3 pt-2 pb-1 border-b border-slate-800/80 bg-slate-950/60 sticky top-10 z-20 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'overview' as TabType, label: 'Overview' },
            { id: 'scoring' as TabType, label: 'Scoring Matrix' },
            { id: 'pros_cons' as TabType, label: 'Pros & Cons' },
            { id: 'devils_advocate' as TabType, label: 'Devil’s Advocate' },
            { id: 'what_if' as TabType, label: 'What-If Sim' },
            { id: 'reality_check' as TabType, label: 'Reality Check' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-4 space-y-5">
        {/* TAB 1: OVERVIEW & RECOMMENDATION */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Situation Context */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-indigo-300 block mb-1">Dilemma Summary:</span>
              <p className="text-slate-300">{decision.description}</p>
            </div>

            {/* Leading Recommendation Card */}
            {decision.recommendation && topAlternative && (
              <div className="relative rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/40 p-4 shadow-xl shadow-indigo-950/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                      AI Recommended Path
                    </span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tabular-nums">
                    <span>{topAlternative.weightedScore}</span>
                    <span className="text-[10px] opacity-70">/100</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">
                  {topAlternative.name}
                </h3>
                <p className="text-xs text-indigo-200/90 font-medium mb-3">
                  {topAlternative.tagline}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {decision.recommendation.executiveRationale}
                </p>

                {/* Critical Trade-Off */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-900/50 mb-3 space-y-1">
                  <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    The Hard Trade-Off
                  </span>
                  <p className="text-xs text-slate-300 leading-snug">
                    {decision.recommendation.criticalTradeOff}
                  </p>
                </div>

                {/* Key Conditions to Pivot */}
                {decision.recommendation.keyConditions?.length > 0 && (
                  <div className="space-y-1.5 text-[11px] text-slate-400 mb-4">
                    <span className="font-semibold text-slate-300 block">When to choose the alternative instead:</span>
                    {decision.recommendation.keyConditions.map((cond, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-1.5 text-slate-300">
                        <span className="text-indigo-400 font-bold shrink-0">·</span>
                        <span>{cond}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Choose this option CTA */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleMarkAsDecided(topAlternative.id)}
                    className={`flex-1 h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      decision.selectedAlternativeId === topAlternative.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {decision.selectedAlternativeId === topAlternative.id
                        ? 'Confirmed as Final Choice'
                        : `Choose ${topAlternative.name.split(' ')[0]}`}
                    </span>
                  </button>

                  <button
                    onClick={() => handleChallengeAlternative(topAlternative.name)}
                    className="h-10 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-medium border border-rose-900/40 flex items-center gap-1.5 transition-colors shrink-0"
                    title="Challenge this choice with Devil's Advocate"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>Challenge</span>
                  </button>
                </div>
              </div>
            )}

            {/* Alternatives Quick Comparison Cards */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                All Alternatives Under Evaluation
              </h4>
              <div className="space-y-2.5">
                {alternatives.map((alt, aIdx) => {
                  const isTop = aIdx === 0;
                  const isChosen = decision.selectedAlternativeId === alt.id;
                  return (
                    <div
                      key={alt.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isChosen
                          ? 'bg-emerald-950/30 border-emerald-500/50'
                          : isTop
                          ? 'bg-slate-900/90 border-indigo-500/30'
                          : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white truncate">
                              {alt.name}
                            </span>
                            {isChosen && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                Chosen
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 block truncate">
                            {alt.tagline}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-indigo-400 tabular-nums">
                            {alt.weightedScore}
                          </span>
                          <span className="text-[10px] text-slate-500 block">Score</span>
                        </div>
                      </div>

                      {/* Score Bar */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isTop ? 'bg-indigo-500' : 'bg-slate-500'
                          }`}
                          style={{ width: `${alt.weightedScore}%` }}
                        />
                      </div>

                      {/* Ideal for summary */}
                      <p className="text-[11px] text-slate-400 leading-snug mb-2.5">
                        <strong className="text-slate-300 font-medium">Ideal for: </strong>
                        {alt.idealFor}
                      </p>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-xs">
                        <button
                          onClick={() => handleChallengeAlternative(alt.name)}
                          className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
                        >
                          <ShieldAlert className="w-3 h-3" />
                          <span>Stress-Test Option</span>
                        </button>

                        <button
                          onClick={() => handleMarkAsDecided(alt.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold"
                        >
                          {isChosen ? 'Selected' : 'Pick this'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decision Confidence Meter */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">How confident do you feel?</h4>
                  <p className="text-[10px] text-slate-400">
                    {confidence >= 8
                      ? 'High clarity. Ready to commit.'
                      : confidence >= 5
                      ? 'Leaning, but weighing trade-offs.'
                      : 'Still confused. Continue consultation.'}
                  </p>
                </div>
                <span className="text-sm font-bold text-indigo-400 tabular-nums">
                  {confidence} / 10
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="10"
                value={confidence}
                onChange={(e) => handleConfidenceChange(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />

              {confidence < 7 && (
                <button
                  onClick={onOpenChat}
                  className="w-full py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>I'm Still Confused — Consult AI Advisor</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: WEIGHTED DECISION SCORING */}
        {activeTab === 'scoring' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 text-xs text-indigo-200 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Dynamic Weighted Decision Model</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Adjust criteria weights below to see how changes to your priorities shift the winning option in real time.
                <span className="block mt-1 text-[10px] text-slate-400 italic">
                  Note: Weighted scores are decision-support estimates: $\sum(score \times weight) / \sum(weight)$.
                </span>
              </p>
            </div>

            {/* Criteria Sliders */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Adjust Your Priorities (% Weight)
              </h4>

              {criteria.map((crit) => (
                <div
                  key={crit.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white block">{crit.name}</span>
                      {crit.description && (
                        <span className="text-[10px] text-slate-400">{crit.description}</span>
                      )}
                    </div>
                    <span className="text-indigo-400 font-bold tabular-nums px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-900/40">
                      {crit.weight}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={crit.weight}
                    onChange={(e) => handleWeightChange(crit.id, Number(e.target.value))}
                    className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Criteria Breakdown Table */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Detailed Evaluation Matrix
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium text-[11px]">
                      <th className="p-2.5">Criterion</th>
                      <th className="p-2.5 text-center">Weight</th>
                      {alternatives.map((alt) => (
                        <th key={alt.id} className="p-2.5 text-center truncate max-w-[120px]">
                          {alt.name.split(' ')[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {criteria.map((crit) => (
                      <tr key={crit.id} className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-medium text-slate-300">{crit.name}</td>
                        <td className="p-2.5 text-center text-slate-400 tabular-nums">{crit.weight}%</td>
                        {alternatives.map((alt) => {
                          const score = alt.scores[crit.id] || 70;
                          return (
                            <td key={alt.id} className="p-2.5 text-center">
                              <span
                                className={`font-bold tabular-nums ${
                                  score >= 85
                                    ? 'text-emerald-400'
                                    : score >= 70
                                    ? 'text-indigo-300'
                                    : 'text-amber-400'
                                }`}
                              >
                                {score}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr className="bg-slate-950/80 font-bold border-t-2 border-indigo-500/40">
                      <td className="p-2.5 text-white">Overall Weighted Score</td>
                      <td className="p-2.5 text-center text-slate-400">100%</td>
                      {alternatives.map((alt, idx) => (
                        <td key={alt.id} className="p-2.5 text-center text-sm tabular-nums">
                          <span className={idx === 0 ? 'text-indigo-400' : 'text-slate-300'}>
                            {alt.weightedScore}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROS & CONS / REGRET ANALYSIS */}
        {activeTab === 'pros_cons' && (
          <div className="space-y-4">
            {alternatives.map((alt) => (
              <div
                key={alt.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">{alt.name}</h3>
                    <p className="text-[11px] text-slate-400">{alt.tagline}</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-400 tabular-nums">
                    {alt.weightedScore} pts
                  </span>
                </div>

                {/* Pros */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Key Advantages (Pros)
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {alt.pros.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    Key Disadvantages (Cons)
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {alt.cons.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">✗</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Regret Analysis */}
                {alt.regretAnalysis && (
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs space-y-1 pt-2">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      1-2 Year Regret Forecast
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {alt.regretAnalysis}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: DEVIL'S ADVOCATE MODE */}
        {activeTab === 'devils_advocate' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-950 border border-rose-900/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-sm">Devil's Advocate Mode</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-bold">
                  Skeptic Mode Active
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                DecisionMate refuses to be a "yes-man". Here are the toughest arguments and hidden traps regarding{' '}
                <strong className="text-white font-bold">{devilsAdvocateData?.challengerTarget || topAlternative?.name}</strong>.
              </p>
            </div>

            {/* Tough Counter-arguments */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Tough Counterarguments
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                {devilsAdvocateData?.toughCounterArguments.map((arg, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2">
                    <span className="text-rose-400 font-bold text-xs shrink-0">{idx + 1}.</span>
                    <span className="leading-relaxed">{arg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden Frictions & Stealth Costs */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Hidden Frictions & Stealth Costs
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                {devilsAdvocateData?.hiddenCostsOrFrictions.map((fric, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2">
                    <span className="text-amber-400 font-bold text-xs shrink-0">·</span>
                    <span className="leading-relaxed">{fric}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unrealistic Assumptions */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                Unrealistic Assumptions You May Be Making
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                {devilsAdvocateData?.unrealisticAssumptions.map((assump, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2">
                    <span className="text-indigo-400 font-bold text-xs shrink-0">?</span>
                    <span className="leading-relaxed">{assump}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Switch target to challenge */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-1.5">Challenge another alternative instead:</span>
              <div className="flex flex-wrap gap-2">
                {alternatives.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => handleChallengeAlternative(alt.name)}
                    disabled={isChallenging}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs text-slate-200 border border-slate-700/60 font-medium transition-colors"
                  >
                    Challenge {alt.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WHAT-IF SCENARIO SIMULATOR */}
        {activeTab === 'what_if' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-900/50 text-xs text-cyan-200 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>What-If Scenario Simulator</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Explore how unforeseen events, budget cuts, relocation, or timeline delays would flip your decision.
              </p>
            </div>

            {/* Quick preset scenarios */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5">Test Quick Hypotheses:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'What if budget is cut by 25%?',
                  'What if I must relocate within 12 months?',
                  'What if market growth slows down drastically?',
                  'What if I work 60 hours per week?',
                ].map((scen, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRunWhatIf(scen)}
                    disabled={isSimulatingWhatIf}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800 transition-colors"
                  >
                    {scen}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Scenario Form */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={whatIfInput}
                  onChange={(e) => setWhatIfInput(e.target.value)}
                  placeholder="e.g. What if I want to resell or change jobs after 18 months?"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleRunWhatIf(whatIfInput);
                    }
                  }}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleRunWhatIf(whatIfInput)}
                  disabled={!whatIfInput.trim() || isSimulatingWhatIf}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 shrink-0 transition-all"
                >
                  {isSimulatingWhatIf ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Simulate</span>
                  )}
                </button>
              </div>
            </div>

            {/* Past What-If Simulations */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Simulated Scenarios ({whatIfResults.length})
              </h4>

              {whatIfResults.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/30 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                  Select a hypothesis above or enter your own to simulate outcomes.
                </div>
              ) : (
                whatIfResults.map((sim) => (
                  <div
                    key={sim.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-cyan-400 font-semibold border-b border-slate-800/80 pb-1.5">
                      <span>Scenario: "{sim.scenarioText}"</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(sim.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {sim.aiResponse}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: REALITY CHECK & BLINDSPOTS */}
        {activeTab === 'reality_check' && (
          <div className="space-y-4">
            {/* Reality Check Assumptions */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Assumption Audit
                </h4>
              </div>
              <p className="text-[11px] text-slate-400">
                Major assumptions you are making that could break if untested:
              </p>

              <div className="space-y-2">
                {decision.realityCheck?.map((item, idx) => {
                  const riskColor =
                    item.riskLevel === 'high'
                      ? 'text-rose-400 bg-rose-950/40 border-rose-800/50'
                      : item.riskLevel === 'medium'
                      ? 'text-amber-400 bg-amber-950/40 border-amber-800/50'
                      : 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50';

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{item.assumption}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${riskColor}`}>
                          {item.riskLevel} Risk
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        <strong className="text-slate-300 font-medium">Verification Advice: </strong>
                        {item.advice}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Blindspots ("What Am I Missing?") */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  What Am I Missing? (Blind Spots)
                </h4>
              </div>
              <p className="text-[11px] text-slate-400">
                Factors commonly overlooked in this class of decision:
              </p>

              <div className="space-y-2">
                {decision.blindSpots?.map((spot, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-950/80 border border-indigo-800/50 text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{spot}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Quick Consultation CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-between gap-3 z-40 max-w-sm sm:max-w-md mx-auto">
        <button
          onClick={onOpenChat}
          className="flex-1 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
        >
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>Ask DecisionMate AI</span>
        </button>

        <button
          onClick={() => handleMarkAsDecided(selectedAlternativeId)}
          className="h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirm Decision</span>
        </button>
      </div>
    </div>
  );
};
