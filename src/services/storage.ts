import { DecisionRecord, DecisionCategory, CategoryInfo } from '../types/decision';

export const DECISION_CATEGORIES: CategoryInfo[] = [
  {
    id: 'technology',
    label: 'Technology & Gadgets',
    description: 'Hardware, laptops, smartphones, tech stacks, and digital tools',
    iconName: 'Laptop',
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    id: 'career',
    label: 'Career & Professional',
    description: 'Job offers, role promotions, transitions, and salary negotiations',
    iconName: 'Briefcase',
    gradient: 'from-violet-600 to-indigo-500',
  },
  {
    id: 'education',
    label: 'Education & Learning',
    description: 'Degrees, bootcamps, study abroad, certifications, and skills',
    iconName: 'GraduationCap',
    gradient: 'from-emerald-600 to-teal-500',
  },
  {
    id: 'finance',
    label: 'Finance & Purchasing',
    description: 'Major purchases, investing approaches, mortgages vs rent',
    iconName: 'DollarSign',
    gradient: 'from-amber-600 to-yellow-500',
  },
  {
    id: 'business',
    label: 'Business & Startup',
    description: 'Founding ventures, go-to-market strategies, and investments',
    iconName: 'TrendingUp',
    gradient: 'from-rose-600 to-pink-500',
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle & Habits',
    description: 'Relocation, fitness routines, productivity, and work-life balance',
    iconName: 'Compass',
    gradient: 'from-sky-600 to-blue-500',
  },
  {
    id: 'travel',
    label: 'Travel & Experiences',
    description: 'Destinations, itineraries, sabbatical planning, and accommodation',
    iconName: 'Plane',
    gradient: 'from-teal-600 to-emerald-500',
  },
  {
    id: 'relationships',
    label: 'Relationships & Social',
    description: 'Communication, partnerships, family commitments, and boundaries',
    iconName: 'Users',
    gradient: 'from-fuchsia-600 to-purple-500',
  },
  {
    id: 'general',
    label: 'Other & Custom',
    description: 'Any personal dilemma or multi-option decision',
    iconName: 'HelpCircle',
    gradient: 'from-slate-600 to-slate-500',
  },
];

const INITIAL_DECISIONS: DecisionRecord[] = [
  {
    id: 'dec_laptop_2026',
    title: 'MacBook Pro 16" (M4 Pro) vs Lenovo ThinkPad X1 Carbon Gen 12',
    description: 'Choosing my primary daily driver for software engineering, full-stack web development, and occasional media editing over the next 4 years. Budget is around $2,500.',
    category: 'technology',
    status: 'analyzed',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000,
    selectedAlternativeId: 'alt_mbp',
    confidenceRating: 8,
    isComplex: false,
    needsMoreInfo: false,
    followUpQuestions: [],
    criteria: [
      { id: 'crit_battery', name: 'Battery Life & Portability', description: 'Real-world un-plugged stamina and quiet thermals', weight: 35 },
      { id: 'crit_perf', name: 'Raw Performance & Display', description: 'Compilation speed, screen brightness, and color fidelity', weight: 30 },
      { id: 'crit_keyboard', name: 'Keyboard & Input Ergonomics', description: 'Typing comfort and trackpad accuracy for long coding sessions', weight: 20 },
      { id: 'crit_os', name: 'Ecosystem & OS Flexibility', description: 'UNIX terminal synergy and cross-device continuity', weight: 15 },
    ],
    alternatives: [
      {
        id: 'alt_mbp',
        name: 'Apple MacBook Pro 16" M4 Pro',
        tagline: 'Best-in-class power efficiency and display',
        description: 'Apple Silicon powerhouse delivering unprecedented 18+ hour battery endurance and silent operation.',
        scores: {
          crit_battery: 98,
          crit_perf: 94,
          crit_keyboard: 82,
          crit_os: 92,
        },
        weightedScore: 92,
        pros: [
          'Phenomenal battery life allows working all day without carrying a power brick',
          'Mini-LED Liquid Retina XDR screen with 1600 nits peak HDR brightness',
          'Native UNIX environment with high-efficiency compiler optimizations',
          'Exceptional resale value retained over 3-4 years',
        ],
        cons: [
          'Significantly heavier at 4.7 lbs compared to ultralight alternatives',
          'Zero internal hardware upgradeability post-purchase',
          'High repair costs outside of AppleCare warranty',
        ],
        keyRisks: [
          'Certain specialized x86 legacy virtualization tools require translation layers',
          'Heavier chassis in daily commute backpack',
        ],
        regretAnalysis: 'You might regret the physical weight on long trips, but you will appreciate never stressing about battery outlets.',
        idealFor: 'Engineers wanting maximum display quality, silent fans, and uninterrupted mobile battery.',
      },
      {
        id: 'alt_thinkpad',
        name: 'Lenovo ThinkPad X1 Carbon Gen 12',
        tagline: 'Ultralight business portability with legendary keyboard',
        description: 'Flagship featherweight Windows/Linux laptop weighing just 2.4 lbs with the industry-standard keyboard.',
        scores: {
          crit_battery: 76,
          crit_perf: 80,
          crit_keyboard: 96,
          crit_os: 84,
        },
        weightedScore: 82,
        pros: [
          'Featherlight 2.42 lbs body makes travel effortless',
          'Class-leading keyboard tactility with 1.5mm key travel',
          'Matte anti-reflective screen options and robust port selection (HDMI, USB-A, USB-C)',
          'First-class official Linux kernel certification and driver support',
        ],
        cons: [
          'Real-world battery under heavy development loads is 7-9 hours, needing midday charging',
          'Integrated graphics cannot match Apple Silicon M4 Pro GPU throughput',
          'Fan acoustics spin up noticeably under sustained compilation tasks',
        ],
        keyRisks: [
          'Thermal throttling under heavy docker compose multi-service stacks',
          'Depreciates faster than Apple hardware on secondary market',
        ],
        regretAnalysis: 'You might regret the battery degradation after 2 years and hearing the fans during Zoom calls while compiling.',
        idealFor: 'Frequent flyers, Linux enthusiasts, and typists who prioritize minimal shoulder strain.',
      },
    ],
    recommendation: {
      primaryAlternativeId: 'alt_mbp',
      primaryAlternativeName: 'Apple MacBook Pro 16" M4 Pro',
      executiveRationale: 'While the ThinkPad wins decisively on weight and typing travel, the MacBook Pro’s overwhelming superiority in sustained un-plugged battery life (98 vs 76) and display quality makes it the more dependable multi-year companion for software engineering.',
      runnerUpAlternativeId: 'alt_thinkpad',
      runnerUpAlternativeName: 'Lenovo ThinkPad X1 Carbon Gen 12',
      criticalTradeOff: 'Trading 2.3 lbs of extra backpack weight for nearly double the real-world battery endurance.',
      keyConditions: [
        'If you commute on foot/transit daily for >1 hour, the 2.4 lb ThinkPad becomes noticeably more comfortable.',
        'If your core work relies on native Linux desktop distribution rather than macOS.',
      ],
    },
    devilsAdvocate: {
      challengerTarget: 'Apple MacBook Pro 16" M4 Pro',
      toughCounterArguments: [
        'You are paying over $2,400 for a machine that is glued shut—if one NAND chip or RAM channel fails post-warranty, the entire logic board is bricked.',
        'The 16-inch footprint does not fit comfortably on standard airplane economy tray tables.',
        'macOS window management and external dual-monitor display scaling quirks still frustrate multi-monitor desktop setups without third-party utilities.',
      ],
      hiddenCostsOrFrictions: [
        'Mandatory dongles for legacy USB-A peripherals',
        'Expensive AppleCare+ subscription ($279) to mitigate financial risk of accidental screen impact',
      ],
      unrealisticAssumptions: [
        'Assuming you will actually need M4 Pro peak rendering power more than 5% of your routine week.',
      ],
    },
    realityCheck: [
      {
        assumption: 'You will work frequently from coffee shops and parks without power outlets.',
        riskLevel: 'medium',
        advice: 'Check your actual past 3 months: if you worked 90% at a fixed desk with AC power, battery advantage is partly theoretical.',
      },
      {
        assumption: 'Resale value after 4 years will recover $800-1,000.',
        riskLevel: 'low',
        advice: 'Historical data supports strong Apple Silicon resale, but keep physical chassis scratch-free.',
      },
    ],
    blindSpots: [
      'Keyboard replacement on Mac requires full top case swap; ThinkPad keyboard can be replaced in 10 minutes.',
      'Software licenses: Some Windows-only enterprise or CAD tools do not have ARM parity.',
    ],
    messages: [
      {
        id: 'msg_1',
        role: 'user',
        content: 'I travel twice a month. Is the 16-inch Mac too bulky?',
        timestamp: Date.now() - 86000000,
      },
      {
        id: 'msg_2',
        role: 'assistant',
        content: 'If your flights are regional with compact seats, the 16-inch can be tight when the passenger ahead reclines. However, in airport lounges and hotels, the extra screen real estate means you won\'t need an external monitor. If extreme travel agility is your top priority, you should also consider the 14-inch MacBook Pro as the sweet spot.',
        timestamp: Date.now() - 85900000,
      },
    ],
    whatIfScenarios: [
      {
        id: 'wi_1',
        scenarioText: 'What if I am forced to run dedicated Linux distributions bare-metal?',
        aiResponse: 'If bare-metal Linux is a non-negotiable requirement, the ThinkPad X1 Carbon immediately jumps to #1. While Asahi Linux on Apple Silicon has made huge progress, ThinkPads have enterprise-grade upstream Linux kernel support, guaranteed sleep/wake states, and zero firmware driver headaches.',
        timestamp: Date.now() - 85000000,
      },
    ],
  },
  {
    id: 'dec_career_transition',
    title: 'Senior Tech Lead at Enterprise vs Co-Founder at Seed-Stage Startup',
    description: 'Deciding whether to stay in a comfortable, high-paying Tech Lead role ($210k base + bonus) or leave to co-found a B2B SaaS startup with 6 months of runway and 35% equity.',
    category: 'career',
    status: 'in_progress',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 2,
    confidenceRating: 6,
    isComplex: true,
    needsMoreInfo: false,
    followUpQuestions: [],
    criteria: [
      { id: 'crit_upside', name: 'Long-Term Financial & Career Upside', description: 'Equity compounding and career acceleration', weight: 35 },
      { id: 'crit_stability', name: 'Financial Stability & Risk Buffer', description: 'Predictable income, family security, and benefits', weight: 30 },
      { id: 'crit_autonomy', name: 'Creative Autonomy & Ownership', description: 'Freedom to build, decide architecture, and shape culture', weight: 20 },
      { id: 'crit_stress', name: 'Work-Life Balance & Health', description: 'Mental wellness, sustainable hours, and predictability', weight: 15 },
    ],
    alternatives: [
      {
        id: 'alt_startup',
        name: 'Co-Found B2B AI Startup',
        tagline: 'Maximum autonomy, unlimited potential equity upside',
        description: 'Take 35% founding equity, raise seed round, and build product from 0 to 1 with full technical control.',
        scores: { crit_upside: 92, crit_stability: 35, crit_autonomy: 98, crit_stress: 40 },
        weightedScore: 68,
        pros: [
          'Accelerated personal growth: learn fundraising, hiring, sales, and architecture simultaneously',
          'Complete creative and technical autonomy with zero corporate bureaucracy',
          'Life-changing wealth potential if company achieves product-market fit and exit',
        ],
        cons: [
          'Extremely high failure rate (>80% of seed startups fold or return zero capital)',
          'Requires accepting 60-70% pay cut during initial bootstrapping phase',
          'Chronic stress and ambiguous boundaries between personal life and work',
        ],
        keyRisks: [
          'Co-founder conflict over direction or equity vesting',
          'Running out of personal cash reserves before raising the next funding round',
        ],
        regretAnalysis: 'If the company fails, you will regret lost savings and high stress, but you will almost never regret the exponential growth and connections made.',
        idealFor: 'Builders with at least 12-18 months of personal cash runway and strong risk tolerance.',
      },
      {
        id: 'alt_enterprise',
        name: 'Remain Senior Tech Lead at Enterprise',
        tagline: 'High predictable compensation, steady career compounding',
        description: 'Stay in the senior leadership track, collect steady $220k+ cash compensation, 401k match, and 40-hour workweeks.',
        scores: { crit_upside: 70, crit_stability: 95, crit_autonomy: 60, crit_stress: 85 },
        weightedScore: 78,
        pros: [
          'Rock-solid financial predictability and excellent comprehensive health coverage',
          'Work stays confined to reasonable hours, leaving energy for hobbies, family, or side projects',
          'Brand pedigree of leading large-scale distributed systems on your resume',
        ],
        cons: [
          'Slower promotions due to organizational politics and review cycles',
          'Constant meetings, compliance friction, and legacy code maintenance',
          'Risk of career stagnation and golden handcuffs complacency',
        ],
        keyRisks: [
          'Tech re-orgs or corporate downsizings outside your individual control',
          'FOMO watching former peers build transformative venture-backed products',
        ],
        regretAnalysis: 'In 3 years, you might regret taking the safe road and wondering "what if" while doing routine roadmap sprint reviews.',
        idealFor: 'Professionals with significant dependents, mortgages, or prioritizing peace of mind.',
      },
    ],
    recommendation: {
      primaryAlternativeId: 'alt_enterprise',
      primaryAlternativeName: 'Remain Senior Tech Lead at Enterprise',
      executiveRationale: 'Purely on risk-adjusted weighted scoring (78 vs 68), staying provides vital financial safety. However, if your emergency fund covers 18+ months and your personal life permits high volatility, the startup provides irreplaceable autonomy.',
      runnerUpAlternativeId: 'alt_startup',
      runnerUpAlternativeName: 'Co-Found B2B AI Startup',
      criticalTradeOff: 'Trading financial peace of mind and family predictability for high-risk creative freedom.',
      keyConditions: [
        'If you have less than 12 months personal runway, do NOT join the startup yet.',
        'If the founding team has already closed committed investor term sheets, startup score rises to 82.',
      ],
    },
    devilsAdvocate: {
      challengerTarget: 'Remain Senior Tech Lead at Enterprise',
      toughCounterArguments: [
        'The "safe" corporate job is an illusion in modern tech; single-quarter restructurings can eliminate entire divisions overnight.',
        'By postponing entrepreneurial risk until you are older, personal obligations (family, lifestyle inflation) will only make the leap harder.',
        'Your skills risk becoming overly specialized in proprietary corporate tooling that does not transfer to high-velocity modern stacks.',
      ],
      hiddenCostsOrFrictions: [
        'Cognitive fatigue from political alignment meetings rather than hands-on building.',
        'Loss of entrepreneurial momentum and speed-to-market advantage.',
      ],
      unrealisticAssumptions: [
        'Assuming the startup opportunity will wait for you when the timing feels "100% comfortable".',
      ],
    },
    realityCheck: [
      {
        assumption: 'The startup can secure Series A within 12 months in the current venture climate.',
        riskLevel: 'high',
        advice: 'Fundraising timelines have doubled; model 18-24 months of runway minimum before revenue.',
      },
      {
        assumption: 'You can easily return to a high-paying Tech Lead role if the startup fails in 18 months.',
        riskLevel: 'low',
        advice: 'Tech recruiters heavily value founder experience; returning to big tech is generally achievable.',
      },
    ],
    blindSpots: [
      'Have you stress-tested the co-founder relationship under extreme financial pressure or disagreement?',
      'Health insurance: Private family health insurance out-of-pocket costs can exceed $1,500/month.',
    ],
    messages: [],
  },
];

const STORAGE_KEY = 'decisionmate_decisions_v1';
const USER_PROFILE_KEY = 'decisionmate_profile_v1';

export function getStoredDecisions(): DecisionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DECISIONS));
      return INITIAL_DECISIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load decisions from localStorage:', err);
    return INITIAL_DECISIONS;
  }
}

export function saveDecision(decision: DecisionRecord): void {
  const decisions = getStoredDecisions();
  const existingIdx = decisions.findIndex((d) => d.id === decision.id);
  if (existingIdx >= 0) {
    decisions[existingIdx] = { ...decision, updatedAt: Date.now() };
  } else {
    decisions.unshift({ ...decision, createdAt: Date.now(), updatedAt: Date.now() });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
}

export function deleteDecision(decisionId: string): void {
  const decisions = getStoredDecisions().filter((d) => d.id !== decisionId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
}

export interface UserProfile {
  name: string;
  email: string;
  isGuest: boolean;
  theme: 'dark' | 'light' | 'system';
  clarityGoal: string;
  showAndroidFrame: boolean;
  hapticFeedback: boolean;
}

export function getStoredUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (!raw) {
      const defaultProfile: UserProfile = {
        name: 'Alex Rivera',
        email: 'alex@decisionmate.app',
        isGuest: true,
        theme: 'dark',
        clarityGoal: 'Make objective, risk-aware life choices',
        showAndroidFrame: true,
        hapticFeedback: true,
      };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(defaultProfile));
      return defaultProfile;
    }
    return JSON.parse(raw);
  } catch {
    return {
      name: 'Alex Rivera',
      email: 'alex@decisionmate.app',
      isGuest: true,
      theme: 'dark',
      clarityGoal: 'Make objective, risk-aware life choices',
      showAndroidFrame: true,
      hapticFeedback: true,
    };
  }
}

export function saveUserProfile(profile: Partial<UserProfile>): UserProfile {
  const current = getStoredUserProfile();
  const updated = { ...current, ...profile };
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
  return updated;
}
