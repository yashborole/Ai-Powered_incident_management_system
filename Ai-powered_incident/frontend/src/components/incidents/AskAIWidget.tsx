import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, FileText } from 'lucide-react';
import { aiApi, AIQuestionResponse } from '../../api/aiApi';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  confidence?: number;
  sources?: string[];
  time: string;
}

export const AskAIWidget: React.FC<{ incidentId: string }> = ({ incidentId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I have analyzed the telemetry and logs for this incident. You can ask me anything about the database behavior, deployment commit diffs, or recommended fixes.',
      time: '14:35',
    },
  ]);
  const [input, setInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const sampleQuestions = [
    'Why do you think the database is involved?',
    'What did deployment v1.4.2 change?',
    'What is the recommended fix?',
  ];

  const handleSend = async (questionText: string) => {
    if (!questionText.trim() || isAsking) return;

    const userMsg: Message = {
      sender: 'user',
      text: questionText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsAsking(true);

    try {
      const res: AIQuestionResponse = await aiApi.askQuestion(incidentId, questionText);
      const aiMsg: Message = {
        sender: 'ai',
        text: res.answer,
        confidence: res.confidence,
        sources: res.sources,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Encountered an issue querying telemetry context. Please retry.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-[480px]">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Ask AI about this incident</h4>
          <p className="text-[11px] text-slate-400">Telemetry-grounded conversational assistant</p>
        </div>
      </div>

      {/* Message Chat List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3" />
              </div>
            )}
            <div
              className={`max-w-[82%] p-3 rounded-xl ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-400" />
                    Sources:
                  </span>
                  {m.sources.map((s, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-indigo-300 border border-slate-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <span className="block text-[9px] text-slate-400 mt-1 text-right">{m.time}</span>
            </div>
            {m.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <User className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}
        {isAsking && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs py-2">
            <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 flex items-center justify-center text-indigo-400 animate-spin">
              <Sparkles className="w-3 h-3" />
            </div>
            <span>Analyzing correlated telemetry and log patterns...</span>
          </div>
        )}
      </div>

      {/* Suggested chips */}
      <div className="py-2 flex flex-wrap gap-1.5">
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 transition-colors truncate max-w-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-2 pt-2 border-t border-slate-800"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this incident..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isAsking}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition-colors shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
