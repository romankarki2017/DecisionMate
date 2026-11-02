import { DecisionRecord, Alternative, Criterion, Recommendation, DevilsAdvocate, RealityCheckItem } from '../types/decision';

export async function analyzeDecision(payload: {
  title?: string;
  description: string;
  category?: string;
  existingAlternatives?: string[];
  userPriorities?: Array<{ name: string; weight: number }>;
  userAnswers?: Array<{ question: string; answer: string }>;
  forceAnalysis?: boolean;
}) {
  const response = await fetch('/api/decision/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to analyze decision');
  }

  return response.json();
}

export async function sendDecisionChatMessage(payload: {
  decisionContext: Partial<DecisionRecord>;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  newMessage: string;
}) {
  const response = await fetch('/api/decision/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to send message to DecisionMate');
  }

  return response.json();
}

export async function runWhatIfSimulation(payload: {
  decisionData: Partial<DecisionRecord>;
  scenarioText: string;
}) {
  const response = await fetch('/api/decision/what-if', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to run what-if simulation');
  }

  return response.json();
}

export async function challengeWithDevilsAdvocate(payload: {
  preferredAlternative: string;
  title: string;
  description: string;
}) {
  const response = await fetch('/api/decision/devils-advocate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to generate Devil’s Advocate challenge');
  }

  return response.json();
}
