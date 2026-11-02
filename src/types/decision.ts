export type DecisionCategory =
  | 'technology'
  | 'career'
  | 'education'
  | 'finance'
  | 'business'
  | 'lifestyle'
  | 'travel'
  | 'relationships'
  | 'general';

export type DecisionStatus = 'in_progress' | 'analyzed' | 'decided' | 'archived';

export interface Criterion {
  id: string;
  name: string;
  description?: string;
  weight: number; // 0 - 100, relative weight
}

export interface Alternative {
  id: string;
  name: string;
  tagline: string;
  description?: string;
  scores: Record<string, number>; // criterionId -> 0-100 rating
  weightedScore: number; // 0-100 overall score
  pros: string[];
  cons: string[];
  keyRisks: string[];
  regretAnalysis: string; // Potential regret in 1-2 years and mitigation
  idealFor: string;
}

export interface Recommendation {
  primaryAlternativeId: string;
  primaryAlternativeName: string;
  executiveRationale: string;
  runnerUpAlternativeId?: string;
  runnerUpAlternativeName?: string;
  criticalTradeOff: string;
  keyConditions: string[];
}

export interface DevilsAdvocate {
  challengerTarget: string;
  toughCounterArguments: string[];
  hiddenCostsOrFrictions: string[];
  unrealisticAssumptions: string[];
}

export interface RealityCheckItem {
  assumption: string;
  riskLevel: 'low' | 'medium' | 'high';
  advice: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  context: string;
  options?: string[];
  answer?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface WhatIfScenario {
  id: string;
  scenarioText: string;
  aiResponse: string;
  timestamp: number;
}

export interface DecisionRecord {
  id: string;
  title: string;
  description: string;
  category: DecisionCategory;
  status: DecisionStatus;
  createdAt: number;
  updatedAt: number;
  selectedAlternativeId?: string;
  confidenceRating?: number; // 1 - 10
  userNotes?: string;
  isComplex?: boolean;
  needsMoreInfo: boolean;
  followUpQuestions: FollowUpQuestion[];
  alternatives: Alternative[];
  criteria: Criterion[];
  recommendation?: Recommendation;
  devilsAdvocate?: DevilsAdvocate;
  realityCheck?: RealityCheckItem[];
  blindSpots?: string[];
  messages: ChatMessage[];
  whatIfScenarios?: WhatIfScenario[];
}

export interface CategoryInfo {
  id: DecisionCategory;
  label: string;
  description: string;
  iconName: string;
  gradient: string;
}
