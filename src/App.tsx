import React, { useState, useEffect } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { BottomNavBar, NavTab } from './components/BottomNavBar';
import { DecisionCreationModal } from './components/DecisionCreationModal';
import { FollowUpQuestionsModal } from './components/FollowUpQuestionsModal';
import { AnalysisResultsScreen } from './components/AnalysisResultsScreen';
import { AIChatDrawer } from './components/AIChatDrawer';
import { DecisionHistoryScreen } from './components/DecisionHistoryScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { DecisionRecord, DecisionCategory, FollowUpQuestion } from './types/decision';
import {
  getStoredDecisions,
  saveDecision,
  deleteDecision,
  getStoredUserProfile,
  saveUserProfile,
  UserProfile,
} from './services/storage';
import { analyzeDecision } from './services/decisionApi';

export default function App() {
  const [hasCompletedSplash, setHasCompletedSplash] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('decisionmate_onboarded') === 'true';
  });

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [activeDecision, setActiveDecision] = useState<DecisionRecord | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredUserProfile);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [createInitialCategory, setCreateInitialCategory] = useState<DecisionCategory | undefined>(undefined);

  // Follow-up questions state
  const [pendingFollowUp, setPendingFollowUp] = useState<{
    rawTitle: string;
    rawDescription: string;
    rawCategory?: string;
    summary: string;
    questions: FollowUpQuestion[];
  } | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const loaded = getStoredDecisions();
    setDecisions(loaded);
  }, []);

  const handleFinishSplash = () => {
    setHasCompletedSplash(true);
  };

  const handleFinishOnboarding = () => {
    localStorage.setItem('decisionmate_onboarded', 'true');
    setHasCompletedOnboarding(true);
  };

  // Start analysis flow
  const handleStartAnalysis = async (
    description: string,
    category?: DecisionCategory,
    title?: string
  ) => {
    setIsAnalyzing(true);
    try {
      const response = await analyzeDecision({
        title,
        description,
        category,
      });

      // If AI determined that more follow-up information is critical
      if (response.needsMoreInfo && response.followUpQuestions?.length > 0) {
        setPendingFollowUp({
          rawTitle: title || response.decisionTitle,
          rawDescription: description,
          rawCategory: category || response.detectedCategory,
          summary: response.decisionSummary,
          questions: response.followUpQuestions,
        });
        setIsAnalyzing(false);
        return;
      }

      // Complete decision created
      const newDecision: DecisionRecord = {
        id: `dec_${Date.now()}`,
        title: title || response.decisionTitle || 'Decision Analysis',
        description,
        category: (category || response.detectedCategory || 'general') as DecisionCategory,
        status: 'analyzed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isComplex: response.isComplex,
        needsMoreInfo: false,
        followUpQuestions: [],
        criteria: response.criteria,
        alternatives: response.alternatives,
        recommendation: response.recommendation,
        devilsAdvocate: response.devilsAdvocate,
        realityCheck: response.realityCheck,
        blindSpots: response.blindSpots,
        messages: [],
      };

      saveDecision(newDecision);
      setDecisions(getStoredDecisions());
      setActiveDecision(newDecision);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit answers to follow-up questions
  const handleFollowUpAnswers = async (answers: Array<{ question: string; answer: string }>) => {
    if (!pendingFollowUp) return;
    setIsAnalyzing(true);
    try {
      const response = await analyzeDecision({
        title: pendingFollowUp.rawTitle,
        description: pendingFollowUp.rawDescription,
        category: pendingFollowUp.rawCategory,
        userAnswers: answers,
        forceAnalysis: true,
      });

      const newDecision: DecisionRecord = {
        id: `dec_${Date.now()}`,
        title: pendingFollowUp.rawTitle || response.decisionTitle || 'Decision Analysis',
        description: pendingFollowUp.rawDescription,
        category: (pendingFollowUp.rawCategory || response.detectedCategory || 'general') as DecisionCategory,
        status: 'analyzed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isComplex: response.isComplex,
        needsMoreInfo: false,
        followUpQuestions: [],
        criteria: response.criteria,
        alternatives: response.alternatives,
        recommendation: response.recommendation,
        devilsAdvocate: response.devilsAdvocate,
        realityCheck: response.realityCheck,
        blindSpots: response.blindSpots,
        messages: [],
      };

      saveDecision(newDecision);
      setDecisions(getStoredDecisions());
      setActiveDecision(newDecision);
      setPendingFollowUp(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSkipFollowUp = async () => {
    if (!pendingFollowUp) return;
    setIsAnalyzing(true);
    try {
      const response = await analyzeDecision({
        title: pendingFollowUp.rawTitle,
        description: pendingFollowUp.rawDescription,
        category: pendingFollowUp.rawCategory,
        forceAnalysis: true,
      });

      const newDecision: DecisionRecord = {
        id: `dec_${Date.now()}`,
        title: pendingFollowUp.rawTitle || response.decisionTitle || 'Decision Analysis',
        description: pendingFollowUp.rawDescription,
        category: (pendingFollowUp.rawCategory || response.detectedCategory || 'general') as DecisionCategory,
        status: 'analyzed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isComplex: response.isComplex,
        needsMoreInfo: false,
        followUpQuestions: [],
        criteria: response.criteria,
        alternatives: response.alternatives,
        recommendation: response.recommendation,
        devilsAdvocate: response.devilsAdvocate,
        realityCheck: response.realityCheck,
        blindSpots: response.blindSpots,
        messages: [],
      };

      saveDecision(newDecision);
      setDecisions(getStoredDecisions());
      setActiveDecision(newDecision);
      setPendingFollowUp(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Custom modal creation submission
  const handleCustomModalSubmit = async (data: {
    title: string;
    description: string;
    category: DecisionCategory;
    alternatives: string[];
    priorities: Array<{ name: string; weight: number }>;
  }) => {
    setIsCreateModalOpen(false);
    setIsAnalyzing(true);
    try {
      const response = await analyzeDecision({
        title: data.title,
        description: data.description,
        category: data.category,
        existingAlternatives: data.alternatives,
        userPriorities: data.priorities,
        forceAnalysis: true,
      });

      const newDecision: DecisionRecord = {
        id: `dec_${Date.now()}`,
        title: data.title || response.decisionTitle,
        description: data.description,
        category: data.category,
        status: 'analyzed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        needsMoreInfo: false,
        followUpQuestions: [],
        criteria: response.criteria,
        alternatives: response.alternatives,
        recommendation: response.recommendation,
        devilsAdvocate: response.devilsAdvocate,
        realityCheck: response.realityCheck,
        blindSpots: response.blindSpots,
        messages: [],
      };

      saveDecision(newDecision);
      setDecisions(getStoredDecisions());
      setActiveDecision(newDecision);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateDecision = (updated: DecisionRecord) => {
    saveDecision(updated);
    setActiveDecision(updated);
    setDecisions(getStoredDecisions());
  };

  const handleDeleteDecision = (id: string) => {
    deleteDecision(id);
    const updated = getStoredDecisions();
    setDecisions(updated);
    if (activeDecision?.id === id) {
      setActiveDecision(null);
    }
  };

  const handleOpenCategory = (cat: DecisionCategory) => {
    setCreateInitialCategory(cat);
    setIsCreateModalOpen(true);
  };

  const handleOpenQuickTool = (tool: 'devils_advocate' | 'what_if' | 'matrix') => {
    // If a decision exists, open it in that tab
    if (decisions.length > 0) {
      setActiveDecision(decisions[0]);
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const handleUpdateProfile = (partial: Partial<UserProfile>) => {
    const updated = saveUserProfile(partial);
    setUserProfile(updated);
  };

  const handleClearAllData = () => {
    localStorage.removeItem('decisionmate_decisions_v1');
    const resetList = getStoredDecisions();
    setDecisions(resetList);
    setActiveDecision(null);
  };

  return (
    <AndroidFrame
      showFrame={userProfile.showAndroidFrame}
      onToggleFrame={() => handleUpdateProfile({ showAndroidFrame: !userProfile.showAndroidFrame })}
    >
      {/* View 1: Splash Screen */}
      {!hasCompletedSplash ? (
        <SplashScreen onComplete={handleFinishSplash} />
      ) : !hasCompletedOnboarding ? (
        /* View 2: Onboarding Walkthrough */
        <OnboardingScreen onComplete={handleFinishOnboarding} />
      ) : activeDecision ? (
        /* View 3: Active Decision Analysis Screen */
        <AnalysisResultsScreen
          decision={activeDecision}
          onBack={() => setActiveDecision(null)}
          onUpdateDecision={handleUpdateDecision}
          onOpenChat={() => setIsChatDrawerOpen(true)}
        />
      ) : (
        /* View 4: Main Application Shell (with Bottom Tab Bar) */
        <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar">
          <div className="flex-1">
            {activeTab === 'home' && (
              <HomeDashboard
                userName={userProfile.name}
                onStartAnalysis={handleStartAnalysis}
                onOpenCreateModal={() => {
                  setCreateInitialCategory(undefined);
                  setIsCreateModalOpen(true);
                }}
                onSelectDecision={(dec) => setActiveDecision(dec)}
                recentDecisions={decisions}
                onOpenCategory={handleOpenCategory}
                onOpenQuickTool={handleOpenQuickTool}
                isAnalyzing={isAnalyzing}
              />
            )}

            {activeTab === 'history' && (
              <DecisionHistoryScreen
                decisions={decisions}
                onSelectDecision={(dec) => setActiveDecision(dec)}
                onDeleteDecision={handleDeleteDecision}
                onOpenCreate={() => {
                  setCreateInitialCategory(undefined);
                  setIsCreateModalOpen(true);
                }}
              />
            )}

            {activeTab === 'explore' && (
              <ExploreScreen onStartAnalysis={handleStartAnalysis} />
            )}

            {activeTab === 'profile' && (
              <ProfileScreen
                userProfile={userProfile}
                onUpdateProfile={handleUpdateProfile}
                onClearData={handleClearAllData}
                totalDecisionsCount={decisions.length}
                completedDecisionsCount={decisions.filter((d) => d.status === 'decided').length}
              />
            )}
          </div>

          {/* Persistent Bottom Navigation Bar */}
          <BottomNavBar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
        </div>
      )}

      {/* Decision Creation Modal */}
      <DecisionCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCustomModalSubmit}
        isAnalyzing={isAnalyzing}
        initialCategory={createInitialCategory}
      />

      {/* Follow-Up Questions Clarification Modal */}
      {pendingFollowUp && (
        <FollowUpQuestionsModal
          isOpen={Boolean(pendingFollowUp)}
          decisionTitle={pendingFollowUp.rawTitle}
          summary={pendingFollowUp.summary}
          questions={pendingFollowUp.questions}
          onSubmitAnswers={handleFollowUpAnswers}
          onSkipAndAnalyze={handleSkipFollowUp}
          isSubmitting={isAnalyzing}
        />
      )}

      {/* Decision AI Chat Drawer */}
      {activeDecision && (
        <AIChatDrawer
          isOpen={isChatDrawerOpen}
          onClose={() => setIsChatDrawerOpen(false)}
          decision={activeDecision}
          onUpdateDecision={handleUpdateDecision}
        />
      )}
    </AndroidFrame>
  );
}
