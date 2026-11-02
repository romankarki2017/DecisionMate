import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, Bot, CornerDownLeft } from 'lucide-react';
import { DecisionRecord, ChatMessage } from '../types/decision';
import { sendDecisionChatMessage } from '../services/decisionApi';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  decision: DecisionRecord;
  onUpdateDecision: (updated: DecisionRecord) => void;
}

const QUICK_PROMPTS = [
  'Explain the critical trade-off in simple words',
  'Why shouldn’t I just pick the second option?',
  'What if I regret this decision in 18 months?',
  'What question should I be asking myself right now?',
];

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  decision,
  onUpdateDecision,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(decision.messages || []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendDecisionChatMessage({
        decisionContext: decision,
        messages: newMessages,
        newMessage: text,
      });

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: response.reply,
        timestamp: Date.now(),
      };

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      onUpdateDecision({
        ...decision,
        messages: finalMessages,
      });
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content:
          'When evaluating this dilemma, keep in mind your primary non-negotiable requirement. Would accepting the alternate option cause irreversible friction, or is it merely unfamiliar? Tell me what single factor worries you most.',
        timestamp: Date.now(),
      };
      const finalMessages = [...newMessages, fallbackMsg];
      setMessages(finalMessages);
      onUpdateDecision({ ...decision, messages: finalMessages });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-lg h-[85vh] sm:h-[650px] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-tight">DecisionMate AI Advisor</h3>
              <p className="text-[10px] text-slate-400 truncate max-w-[220px]">
                {decision.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-1">Consult with DecisionMate</h4>
                <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                  Ask me anything about your options, challenge my analysis, or test a new constraint.
                </p>
              </div>

              {/* Quick suggestions */}
              <div className="w-full space-y-1.5 pt-2">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="w-full text-left p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-[11px] text-slate-300 transition-colors"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span className="block text-[9px] opacity-60 text-right mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 rounded-tl-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Quick prompt strip if messages exist */}
        {messages.length > 0 && (
          <div className="px-3 py-1.5 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 min-w-max">
              {QUICK_PROMPTS.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={isTyping}
                  className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 hover:text-white transition-colors whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message input */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask DecisionMate a question..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
