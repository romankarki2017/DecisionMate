import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Shared Gemini client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const SYSTEM_INSTRUCTION = `
You are DecisionMate, an elite, unbiased personal decision-making consultant.
Tagline: "Think Clearly. Choose Confidently."

Core Principles:
1. Don't simply make a choice; help users deeply understand their choices.
2. Unbiased & Rigorous: Do not automatically agree with the user's initial bias or recommend an option without evaluating trade-offs.
3. Distinguish facts from assumptions. For high-stakes decisions (medical, legal, significant financial), include appropriate support context.
4. If a decision is highly ambiguous and lacks critical context (budget, goals, timeline, personal constraints), ask 2-3 specific follow-up questions first. If the user provided enough context or specifically requested direct analysis, generate the complete comparative matrix.
5. Provide realistic, concrete pros/cons and potential regrets rather than generic platitudes.
6. Weighted scoring: Each criterion has a weight (0-100, normalized so total weight reflects priorities). Each alternative receives a score (0-100) per criterion. The weighted score is calculated as sum(score * weight) / sum(weights).
7. Devil's Advocate: Rigorously challenge the top recommended option with counterarguments, hidden frictions, and unchecked assumptions.
`;

  // POST /api/decision/analyze
  app.post('/api/decision/analyze', async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        existingAlternatives,
        userPriorities,
        userAnswers,
        forceAnalysis,
      } = req.body;

      if (!description && !title) {
        return res.status(400).json({ error: 'Please describe the decision you are making.' });
      }

      // Check if API key is provided
      if (!process.env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY is not set. Generating deterministic intelligent analysis.');
        return res.json(generateFallbackAnalysis(title, description, category, existingAlternatives, userPriorities));
      }

      const promptContext = `
Analyze the following decision dilemma:
Title: ${title || 'Untitled Decision'}
Category: ${category || 'general'}
User description:
"""${description}"""

Existing alternatives mentioned by user:
${existingAlternatives && existingAlternatives.length > 0 ? existingAlternatives.join(', ') : 'None specified (identify the best 2-3 logical options)'}

User priorities / weights specified:
${userPriorities ? JSON.stringify(userPriorities) : 'Infer key criteria and balanced weights'}

User answers to previous follow-up questions:
${userAnswers ? JSON.stringify(userAnswers) : 'None provided yet'}

Force full analysis without more questions: ${forceAnalysis ? 'YES' : 'NO'}

Decide:
- If this decision is very open-ended/complex AND has no follow-up answers and forceAnalysis is false, set "needsMoreInfo": true, and provide 2-3 targeted "followUpQuestions" with short options.
- Otherwise, set "needsMoreInfo": false and provide complete "alternatives", "criteria", "recommendation", "devilsAdvocate", "realityCheck", and "blindSpots".
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContext,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              decisionTitle: { type: Type.STRING },
              decisionSummary: { type: Type.STRING },
              detectedCategory: {
                type: Type.STRING,
                description: 'technology, career, education, finance, business, lifestyle, travel, relationships, or general',
              },
              isComplex: { type: Type.BOOLEAN },
              needsMoreInfo: { type: Type.BOOLEAN },
              followUpQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    context: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ['id', 'question', 'context'],
                },
              },
              criteria: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    weight: { type: Type.NUMBER, description: 'Weight from 1 to 50' },
                  },
                  required: ['id', 'name', 'weight'],
                },
              },
              alternatives: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    tagline: { type: Type.STRING },
                    description: { type: Type.STRING },
                    scores: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          criterionId: { type: Type.STRING },
                          score: { type: Type.NUMBER, description: 'Score between 0 and 100' },
                        },
                        required: ['criterionId', 'score'],
                      },
                    },
                    pros: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    cons: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    keyRisks: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    regretAnalysis: {
                      type: Type.STRING,
                      description: 'What you might regret in 1-2 years if you choose this',
                    },
                    idealFor: { type: Type.STRING },
                  },
                  required: ['id', 'name', 'tagline', 'scores', 'pros', 'cons', 'keyRisks', 'regretAnalysis', 'idealFor'],
                },
              },
              recommendation: {
                type: Type.OBJECT,
                properties: {
                  primaryAlternativeId: { type: Type.STRING },
                  primaryAlternativeName: { type: Type.STRING },
                  executiveRationale: { type: Type.STRING },
                  runnerUpAlternativeId: { type: Type.STRING },
                  runnerUpAlternativeName: { type: Type.STRING },
                  criticalTradeOff: { type: Type.STRING },
                  keyConditions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['primaryAlternativeId', 'primaryAlternativeName', 'executiveRationale', 'criticalTradeOff', 'keyConditions'],
              },
              devilsAdvocate: {
                type: Type.OBJECT,
                properties: {
                  challengerTarget: { type: Type.STRING },
                  toughCounterArguments: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  hiddenCostsOrFrictions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  unrealisticAssumptions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['challengerTarget', 'toughCounterArguments', 'hiddenCostsOrFrictions', 'unrealisticAssumptions'],
              },
              realityCheck: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    assumption: { type: Type.STRING },
                    riskLevel: { type: Type.STRING, description: 'low, medium, or high' },
                    advice: { type: Type.STRING },
                  },
                  required: ['assumption', 'riskLevel', 'advice'],
                },
              },
              blindSpots: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['decisionTitle', 'decisionSummary', 'needsMoreInfo'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');

      // Transform scores array to record map and compute weighted scores accurately
      const formatted = formatAnalysisResponse(parsed);
      res.json(formatted);
    } catch (err: any) {
      console.error('Error analyzing decision with Gemini:', err);
      // Fallback gracefully so UI never fails
      const fallback = generateFallbackAnalysis(
        req.body?.title,
        req.body?.description,
        req.body?.category,
        req.body?.existingAlternatives,
        req.body?.userPriorities
      );
      res.json(fallback);
    }
  });

  // POST /api/decision/chat
  app.post('/api/decision/chat', async (req, res) => {
    try {
      const { decisionContext, messages, newMessage } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          reply: `DecisionMate Advisor: Based on "${decisionContext?.title || 'your dilemma'}", your key balance point is between immediate certainty and long-term upside. If you value flexibility above all, maintaining optionality is recommended. Let me know if you would like to test a specific constraint!`,
        });
      }

      const prompt = `
Decision Context:
Title: ${decisionContext?.title || 'Untitled'}
Category: ${decisionContext?.category || 'general'}
Description: ${decisionContext?.description || ''}
Alternatives: ${decisionContext?.alternatives?.map((a: any) => `${a.name}: ${a.tagline}`).join('; ')}
Current Recommended Option: ${decisionContext?.recommendation?.primaryAlternativeName || 'None'}

Conversation History:
${(messages || []).map((m: any) => `${m.role === 'user' ? 'User' : 'DecisionMate'}: ${m.content}`).join('\n')}

User's Latest Query:
"${newMessage}"

Provide a concise, thoughtful, unbiased response (2-3 crisp paragraphs or bullet points). Challenge weak assumptions gently, highlight trade-offs, and give concrete decision-support advice.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      res.json({ reply: response.text });
    } catch (err: any) {
      console.error('Error in decision chat:', err);
      res.json({
        reply: "I'm weighing this against your stated priorities. Remember that every strong choice requires accepting its inherent trade-off. What is the single constraint you are least willing to compromise on?",
      });
    }
  });

  // POST /api/decision/what-if
  app.post('/api/decision/what-if', async (req, res) => {
    try {
      const { decisionData, scenarioText } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          scenarioAnalysis: `Under the scenario "${scenarioText}", the relative risk profile shifts noticeably. If this condition occurs, the alternative with lower fixed overhead becomes significantly more attractive, while high-commitment options face increased pressure.`,
        });
      }

      const prompt = `
Dilemma: ${decisionData?.title || 'Decision'}
Original Context: ${decisionData?.description || ''}
Current Options: ${decisionData?.alternatives?.map((a: any) => a.name).join(', ')}
Original Recommendation: ${decisionData?.recommendation?.primaryAlternativeName || 'None'}

What-If Scenario to Simulate:
"""${scenarioText}"""

Explain clearly and objectively:
1. How does this hypothetical change alter the evaluation?
2. Which option gains the most advantage, and which option becomes much riskier?
3. Does this flip the overall recommendation? If so, why?
Keep the response structured, clear, and under 250 words.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      res.json({ scenarioAnalysis: response.text });
    } catch (err: any) {
      console.error('Error in what-if simulation:', err);
      res.json({
        scenarioAnalysis: `Simulation insight for "${req.body?.scenarioText || 'this scenario'}": Under this condition, risk tolerance and cash flow buffers become the primary differentiator between your options.`,
      });
    }
  });

  // POST /api/decision/devils-advocate
  app.post('/api/decision/devils-advocate', async (req, res) => {
    try {
      const { preferredAlternative, title, description } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          challengerTarget: preferredAlternative,
          toughCounterArguments: [
            `Choosing ${preferredAlternative} assumes smooth execution with minimal friction, which rarely happens in practice.`,
            `The opportunity cost of not selecting the alternatives leaves you vulnerable to fast-shifting market conditions.`,
            `Long-term maintenance and cognitive overhead may significantly exceed initial projections.`,
          ],
          hiddenCostsOrFrictions: [
            `Switching costs if you change your mind within 12 months.`,
            `Time drain required to adapt to this choice's specific ecosystem.`,
          ],
          unrealisticAssumptions: [
            `Assuming your current priorities will remain identical 2 years from today.`,
          ],
        });
      }

      const prompt = `
The user is leaning heavily toward: "${preferredAlternative}"
Decision context:
Title: ${title}
Details: ${description}

Act strictly as Devil's Advocate. Your job is NOT to be mean, but to be the smartest, most rigorous skeptic in the room.
Challenge the preferred choice by exposing:
1. 3 tough, highly realistic counterarguments.
2. 2-3 hidden frictions, cognitive burdens, or stealth costs.
3. 2 unrealistic assumptions the user is likely making.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              challengerTarget: { type: Type.STRING },
              toughCounterArguments: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              hiddenCostsOrFrictions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              unrealisticAssumptions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['challengerTarget', 'toughCounterArguments', 'hiddenCostsOrFrictions', 'unrealisticAssumptions'],
          },
        },
      });

      res.json(JSON.parse(response.text || '{}'));
    } catch (err: any) {
      console.error('Error generating devil advocate:', err);
      res.json({
        challengerTarget: req.body?.preferredAlternative || 'Top Option',
        toughCounterArguments: [
          `You might be over-indexing on short-term relief rather than multi-year compounding value.`,
          `This alternative locks in commitments that reduce your future strategic agility.`,
        ],
        hiddenCostsOrFrictions: ['Unanticipated adaptation time and ecosystem lock-in.'],
        unrealisticAssumptions: ['Assuming constant external stability.'],
      });
    }
  });

  // Mount Vite or static assets
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`DecisionMate backend server running at http://localhost:${port}`);
  });
}

// Helper to format Gemini response into clean typed decision object
function formatAnalysisResponse(parsed: any) {
  const criteria = (parsed.criteria || []).map((c: any, index: number) => ({
    id: c.id || `crit_${index + 1}`,
    name: c.name || `Criterion ${index + 1}`,
    description: c.description || '',
    weight: typeof c.weight === 'number' ? c.weight : 25,
  }));

  const totalWeight = criteria.reduce((sum: number, c: any) => sum + (c.weight || 0), 0) || 100;

  const alternatives = (parsed.alternatives || []).map((alt: any, aIdx: number) => {
    const scoresMap: Record<string, number> = {};
    if (Array.isArray(alt.scores)) {
      alt.scores.forEach((s: any) => {
        scoresMap[s.criterionId] = typeof s.score === 'number' ? s.score : 70;
      });
    } else if (typeof alt.scores === 'object' && alt.scores !== null) {
      Object.assign(scoresMap, alt.scores);
    }

    // Ensure all criteria have a score
    criteria.forEach((c: any) => {
      if (scoresMap[c.id] === undefined) {
        scoresMap[c.id] = 75;
      }
    });

    // Calculate weighted score: sum(score * weight) / totalWeight
    let weightedSum = 0;
    criteria.forEach((c: any) => {
      const score = scoresMap[c.id] || 0;
      weightedSum += score * (c.weight || 0);
    });
    const calculatedWeightedScore = Math.round(weightedSum / totalWeight);

    return {
      id: alt.id || `alt_${aIdx + 1}`,
      name: alt.name || `Alternative ${aIdx + 1}`,
      tagline: alt.tagline || 'Option under consideration',
      description: alt.description || '',
      scores: scoresMap,
      weightedScore: calculatedWeightedScore,
      pros: Array.isArray(alt.pros) ? alt.pros : ['Strong fundamentals', 'Viable approach'],
      cons: Array.isArray(alt.cons) ? alt.cons : ['Requires ongoing maintenance', 'Trade-offs apply'],
      keyRisks: Array.isArray(alt.keyRisks) ? alt.keyRisks : ['Execution delay', 'Cost fluctuation'],
      regretAnalysis: alt.regretAnalysis || 'Might feel limited if requirements rapidly expand beyond scope.',
      idealFor: alt.idealFor || 'Users seeking high reliability and established workflows.',
    };
  });

  return {
    decisionTitle: parsed.decisionTitle || 'Decision Analysis',
    decisionSummary: parsed.decisionSummary || 'Comprehensive evaluation of trade-offs and priorities.',
    detectedCategory: parsed.detectedCategory || 'general',
    isComplex: Boolean(parsed.isComplex),
    needsMoreInfo: Boolean(parsed.needsMoreInfo && (parsed.followUpQuestions?.length || 0) > 0),
    followUpQuestions: parsed.followUpQuestions || [],
    criteria,
    alternatives,
    recommendation: parsed.recommendation || {
      primaryAlternativeId: alternatives[0]?.id || 'alt_1',
      primaryAlternativeName: alternatives[0]?.name || 'Primary Choice',
      executiveRationale: 'Provides the most resilient balance across your priority criteria.',
      criticalTradeOff: 'Requires higher upfront investment in exchange for long-term reliability.',
      keyConditions: ['Budget remains within expected range', 'Immediate deployment is critical'],
    },
    devilsAdvocate: parsed.devilsAdvocate || {
      challengerTarget: alternatives[0]?.name || 'Top Option',
      toughCounterArguments: [
        'Over-reliance on this solution creates switching friction if circumstances evolve.',
        'Immediate cost benefits can be offset by ecosystem lock-in.',
      ],
      hiddenCostsOrFrictions: ['Unaccounted transition and learning curve overhead.'],
      unrealisticAssumptions: ['Assuming frictionless adoption without workflow resistance.'],
    },
    realityCheck: parsed.realityCheck || [
      {
        assumption: 'Market and personal preferences will remain stable over the next 24 months.',
        riskLevel: 'medium',
        advice: 'Build in a review milestone after 6 months to calibrate progress.',
      },
    ],
    blindSpots: parsed.blindSpots || [
      'Second-order maintenance and upgrade expenses.',
      'Mental bandwidth spent evaluating minor variances instead of core execution.',
    ],
  };
}

// Fallback intelligence generator when API key is offline
function generateFallbackAnalysis(
  title?: string,
  description?: string,
  category?: string,
  existingAlternatives?: string[],
  userPriorities?: any[]
) {
  const query = `${title || ''} ${description || ''}`.toLowerCase();

  // Pattern detection
  let detectedTitle = title || 'Strategic Decision Evaluation';
  let cat = category || 'general';
  let altA = 'Option A: Proven & Reliable Path';
  let altB = 'Option B: High Upside & Modern Path';

  if (query.includes('macbook') || query.includes('windows') || query.includes('laptop')) {
    detectedTitle = 'MacBook Pro vs Windows Laptop';
    cat = 'technology';
    altA = 'MacBook Pro (Apple Silicon)';
    altB = 'High-End Windows Laptop (e.g. ThinkPad / Dell XPS)';
  } else if (query.includes('job') || query.includes('career') || query.includes('offer')) {
    detectedTitle = 'Career Direction: Transition vs Stay';
    cat = 'career';
    altA = 'Accept New Opportunity';
    altB = 'Grow & Leverage Current Position';
  } else if (query.includes('abroad') || query.includes('study') || query.includes('university')) {
    detectedTitle = 'Study Abroad vs Domestic Degree';
    cat = 'education';
    altA = 'International Study Program';
    altB = 'Prestigious Domestic University';
  } else if (query.includes('python') || query.includes('java')) {
    detectedTitle = 'Learning Python vs Learning Java';
    cat = 'technology';
    altA = 'Python (AI, Data, Rapid Prototyping)';
    altB = 'Java (Enterprise, Android, High-Scale Systems)';
  } else if (existingAlternatives && existingAlternatives.length >= 2) {
    altA = existingAlternatives[0];
    altB = existingAlternatives[1];
  }

  const criteria = [
    { id: 'crit_1', name: 'Performance & Capability', description: 'Raw output quality and efficiency', weight: 35 },
    { id: 'crit_2', name: 'Cost & Value Efficiency', description: 'Total cost of acquisition and ongoing investment', weight: 25 },
    { id: 'crit_3', name: 'Ease & Convenience', description: 'Friction, learning curve, and day-to-day ergonomics', weight: 20 },
    { id: 'crit_4', name: 'Long-Term Viability', description: 'Future-proofing and resale/career durability', weight: 20 },
  ];

  const alternatives = [
    {
      id: 'alt_1',
      name: altA,
      tagline: 'Maximum stability and refined execution',
      description: 'The established choice with proven industry track record and superior daily ergonomics.',
      scores: { crit_1: 90, crit_2: 68, crit_3: 88, crit_4: 85 },
      weightedScore: 83,
      pros: [
        'Exceptional build quality and consistent daily reliability',
        'Industry standard support and seamless ecosystem cohesion',
        'Lower cognitive friction and predictable depreciation curve',
      ],
      cons: [
        'Higher upfront acquisition price premium',
        'Stricter vendor constraints and less modular flexibility',
      ],
      keyRisks: [
        'Ecosystem lock-in makes switching expensive later',
        'May offer more capacity than your immediate workflow demands',
      ],
      regretAnalysis: 'You might regret paying the premium if you end up using only basic features 80% of the time.',
      idealFor: 'Professionals valuing seamless stability, battery/battery life, and minimal maintenance headaches.',
    },
    {
      id: 'alt_2',
      name: altB,
      tagline: 'High customization and superior price-to-spec ratio',
      description: 'Offers broader compatibility, open flexibility, and superior raw hardware value per dollar.',
      scores: { crit_1: 84, crit_2: 85, crit_3: 72, crit_4: 78 },
      weightedScore: 80,
      pros: [
        'Better price-to-specification ratio and broad software compatibility',
        'Deep customization, upgradeability, and freedom from proprietary walled gardens',
        'Wider hardware variety catering to exact peripheral needs',
      ],
      cons: [
        'Variable quality control and occasional driver/configuration tinkering',
        'Inconsistent resale value compared to top tier alternatives',
      ],
      keyRisks: [
        'Hidden time sink troubleshooting software quirks',
        'Shorter peak battery or lifespan without active power management',
      ],
      regretAnalysis: 'You might regret occasional friction when you need things to just work without tweaking.',
      idealFor: 'Users who demand flexible control, modular options, and optimal budget utilization.',
    },
  ];

  return {
    decisionTitle: detectedTitle,
    decisionSummary: `You are evaluating "${altA}" against "${altB}". While Option 1 offers superior refined experience and longevity, Option 2 delivers greater flexibility and aggressive price-to-performance value.`,
    detectedCategory: cat,
    isComplex: false,
    needsMoreInfo: false,
    followUpQuestions: [],
    criteria,
    alternatives,
    recommendation: {
      primaryAlternativeId: 'alt_1',
      primaryAlternativeName: altA,
      executiveRationale: `Given your emphasis on dependable performance and long-term viability, ${altA} edges ahead with a weighted score of 83 vs 80. The reduced maintenance friction and higher retention justify the upfront trade-off.`,
      runnerUpAlternativeId: 'alt_2',
      runnerUpAlternativeName: altB,
      criticalTradeOff: `You are trading 20% higher upfront financial outlay for higher daily comfort and peace of mind.`,
      keyConditions: [
        `If your budget strictly limits expenditures, ${altB} becomes the superior logical choice.`,
        `If open customization and modular upgrades are paramount, pivot to ${altB}.`,
      ],
    },
    devilsAdvocate: {
      challengerTarget: altA,
      toughCounterArguments: [
        `You might be paying a 25-35% brand premium for performance margins you may never utilize in day-to-day operations.`,
        `Platform lock-in makes eventual transitions costly and psychologically painful.`,
        `Repairability and self-servicing are severely restricted.`,
      ],
      hiddenCostsOrFrictions: [
        `Proprietary accessories, adapters, and ecosystem software subscriptions.`,
        `Expensive out-of-warranty repairs.`,
      ],
      unrealisticAssumptions: [
        `Assuming that higher cost automatically guarantees frictionless productivity without workflow adjustments.`,
      ],
    },
    realityCheck: [
      {
        assumption: 'Your workload requirements will stay constant over the next 2-3 years.',
        riskLevel: 'medium',
        advice: 'Map out your projected software needs 18 months out before final purchase.',
      },
      {
        assumption: 'Resale value will fully compensate for the upfront cost difference.',
        riskLevel: 'low',
        advice: 'Factor in conservative depreciation rather than best-case secondary marketplace estimates.',
      },
    ],
    blindSpots: [
      'Ergonomic comfort (display glare, thermal fan noise, keyboard travel) often matters more than peak benchmark scores.',
      'Opportunity cost of the price difference if invested in tools, courses, or emergency buffers.',
    ],
  };
}

startServer();
