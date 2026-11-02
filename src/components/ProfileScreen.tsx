import React, { useState } from 'react';
import {
  User,
  Moon,
  Sun,
  Smartphone,
  Download,
  Trash2,
  Shield,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, saveUserProfile, getStoredDecisions } from '../services/storage';

interface ProfileScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onClearData: () => void;
  totalDecisionsCount: number;
  completedDecisionsCount: number;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  onUpdateProfile,
  onClearData,
  totalDecisionsCount,
  completedDecisionsCount,
}) => {
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleToggleTheme = () => {
    const nextTheme = userProfile.theme === 'dark' ? 'light' : 'dark';
    onUpdateProfile({ theme: nextTheme });
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateProfile({ name: nameInput.trim() });
      setIsEditingName(false);
    }
  };

  const handleExportData = () => {
    const decisions = getStoredDecisions();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(decisions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `decisionmate_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const clarityScore = totalDecisionsCount > 0 ? Math.min(96, 70 + completedDecisionsCount * 8) : 75;

  return (
    <div className="flex-1 flex flex-col p-4 space-y-5 pb-20 bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="pt-1">
        <h1 className="text-xl font-bold text-white tracking-tight">Account & Settings</h1>
        <p className="text-xs text-slate-400">Personalize DecisionMate preferences</p>
      </div>

      {/* User Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/50 border border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-2 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate">{userProfile.name}</h3>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-[10px] text-indigo-400 hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
            <p className="text-[11px] text-slate-400">{userProfile.email}</p>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-medium border border-slate-700/60">
              {userProfile.isGuest ? 'Local Session (Guest)' : 'Standard Account'}
            </span>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
          <div className="p-2 rounded-xl bg-slate-950/60">
            <span className="text-sm font-bold text-white tabular-nums">{totalDecisionsCount}</span>
            <span className="text-[10px] text-slate-400 block">Total Analyzed</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60">
            <span className="text-sm font-bold text-emerald-400 tabular-nums">{completedDecisionsCount}</span>
            <span className="text-[10px] text-slate-400 block">Finalized</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60">
            <span className="text-sm font-bold text-indigo-400 tabular-nums">{clarityScore}%</span>
            <span className="text-[10px] text-slate-400 block">Clarity Score</span>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Application Preferences
        </h2>

        <div className="space-y-2">
          {/* Theme Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {userProfile.theme === 'dark' ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
              <div>
                <span className="text-xs font-semibold text-white block">Theme Mode</span>
                <span className="text-[10px] text-slate-400">Current: {userProfile.theme === 'dark' ? 'Dark First' : 'Light Theme'}</span>
              </div>
            </div>
            <button
              onClick={handleToggleTheme}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700/60 font-medium transition-colors"
            >
              Switch to {userProfile.theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>

          {/* Android Frame Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Android Device Frame</span>
                <span className="text-[10px] text-slate-400">Show Google Pixel shell preview</span>
              </div>
            </div>
            <button
              onClick={() => onUpdateProfile({ showAndroidFrame: !userProfile.showAndroidFrame })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                userProfile.showAndroidFrame ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  userProfile.showAndroidFrame ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data & Export */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Data Management
        </h2>

        <div className="space-y-2">
          <button
            onClick={handleExportData}
            className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="font-semibold text-white block">Export All Decisions</span>
                <span className="text-[10px] text-slate-400">Download JSON backup of your records</span>
              </div>
            </div>
            <span className="text-[11px] text-indigo-400 font-medium">Export</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/40 flex items-center justify-between text-xs text-left transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <div>
                <span className="font-semibold text-slate-200 group-hover:text-rose-300 block">Clear Decision Storage</span>
                <span className="text-[10px] text-slate-500">Reset local decision cache</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 group-hover:text-rose-400">Clear</span>
          </button>
        </div>
      </div>

      {/* About */}
      <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          <span>About DecisionMate</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          DecisionMate uses Google Gemini 3.8 Flash intelligence to provide structured, unbiased decision analysis, weighted criteria scoring, Devil's Advocate challenges, and regret minimization.
        </p>
        <span className="text-[10px] text-slate-500 block pt-1">
          Tagline: "Think Clearly. Choose Confidently." · v1.0
        </span>
      </div>

      {/* Clear Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xs w-full text-center space-y-3">
            <h3 className="text-sm font-bold text-white">Reset All Decisions?</h3>
            <p className="text-xs text-slate-400">
              This will clear all saved decision records and reset to standard starter dilemmas.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearData();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 shadow-md shadow-rose-600/30"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
