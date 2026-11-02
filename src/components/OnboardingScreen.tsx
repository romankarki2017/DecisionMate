import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowRight, CheckCircle2, ShieldAlert, Sliders, Brain } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const ONBOARDING_SLIDES = [
  {
    title: 'Don’t just make a choice.\nUnderstand your choices.',
    subtitle: 'DecisionMate acts as your elite, unbiased personal consultant to unpack hard dilemmas with structured logic.',
    image: '/src/assets/images/decision_mind_clarity_1793603384345.jpg',
    badge: 'Decision Intelligence',
    icon: Brain,
    bullets: [
      'Natural-language dilemma analysis',
      'Follow-up inquiry for complex trade-offs',
      'Fact-checked, unbiased comparisons',
    ],
  },
  {
    title: 'Weighted Scoring &\nDynamic Trade-Offs',
    subtitle: 'Assign custom importance weights to what matters most to you—cost, speed, longevity, or lifestyle—and watch scores recalculate.',
    image: '/src/assets/images/decision_balance_scales_1793603384380.jpg',
    badge: 'Precision Decision Matrix',
    icon: Sliders,
    bullets: [
      'Interactive criteria weight sliders',
      'Side-by-side alternative matrices',
      'Simulate What-If hypothetical changes',
    ],
  },
  {
    title: 'Devil’s Advocate &\nRegret Minimization',
    subtitle: 'Never decide blindly. The AI challenges your favorite choice with counterarguments, hidden frictions, and multi-year regret analysis.',
    image: '/src/assets/images/decisionmate_app_icon_1793603384138.jpg',
    badge: 'Ruthless Stress-Testing',
    icon: ShieldAlert,
    bullets: [
      'Exposes unchecked assumptions',
      'Highlights overlooked blind spots',
      'Forecasts 1-2 year future regret',
    ],
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const slide = ONBOARDING_SLIDES[currentSlide];

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-slate-950 text-slate-100 select-none">
      {/* Top Header Row */}
      <div className="w-full flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold tracking-tight text-indigo-400">DecisionMate</span>
          <span className="text-[10px] text-slate-500">v1.0</span>
        </div>
        <button
          onClick={onComplete}
          className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-md transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Carousel Area */}
      <div className="flex-1 flex flex-col justify-center my-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            {/* Visual Hero Container */}
            <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-6 border border-slate-800 shadow-xl bg-slate-900">
              <img
                src={slide.image}
                alt={slide.badge}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-indigo-200">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-indigo-500/30 font-medium">
                  {slide.badge}
                </span>
              </div>
            </div>

            {/* Typography */}
            <h2 className="text-xl font-bold text-white tracking-tight leading-snug whitespace-pre-line mb-2">
              {slide.title}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {slide.subtitle}
            </p>

            {/* Bullets */}
            <div className="space-y-2 mb-2">
              {slide.bullets.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Actions & Pagination Dots */}
      <div className="w-full space-y-4 pt-2">
        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mb-2">
          {ONBOARDING_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-700'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleNext}
            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>{currentSlide === ONBOARDING_SLIDES.length - 1 ? 'Start Deciding' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {currentSlide === ONBOARDING_SLIDES.length - 1 && (
            <button
              onClick={onComplete}
              className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
            >
              Continue as Guest
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
