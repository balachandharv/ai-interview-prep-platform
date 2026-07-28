import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechRecognition } from '../hooks';

export default function RoleplaySession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { persona, companyMode } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const messagesEndRef = useRef(null);
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();
  const maxQuestions = 8;

  useEffect(() => {
    if (persona) {
      const greeting = {
        role: 'ai',
        text: `Hello! I'm ${persona.name}, ${persona.role} at ${persona.company}. Thank you for joining us today. I'll be conducting this ${persona.style.toLowerCase()} interview. Let's get started.\n\nCan you please start by telling me a little about yourself and your background?`,
        timestamp: new Date().toISOString(),
      };
      setMessages([greeting]);
      setQuestionCount(1);
    }
  }, [persona]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (transcript) setInput(prev => prev + ' ' + transcript);
  }, [transcript]);

  const handleSend = async () => {
    if (!input.trim() || isAIThinking) return;

    const userMsg = { role: 'user', text: input.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsAIThinking(true);
    if (isListening) stopListening();

    // Simulate AI response (in production, this calls the backend via WebSocket)
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1500));

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    let aiResponse;
    if (newCount >= maxQuestions) {
      aiResponse = `That's a great answer. Thank you for taking the time to speak with me today. I've enjoyed our conversation and I think you've given some very thoughtful responses. We'll be reviewing all candidates and you should hear back from us within the next week. Best of luck!`;
    } else {
      const followups = [
        "That's an interesting perspective. Can you tell me about a time when you had to solve a complex technical problem under pressure?",
        "I see. How would you approach designing a system that needs to handle millions of concurrent users?",
        "Good point. Can you walk me through your experience with distributed systems and how you'd handle data consistency?",
        "Interesting approach. Tell me about a time you disagreed with your manager or team lead. How did you handle it?",
        "I appreciate that detail. How do you prioritize your tasks when you have multiple deadlines approaching?",
        "That's a solid answer. Can you explain the trade-offs between different database solutions for a high-traffic application?",
        "Excellent. How do you stay current with new technologies and best practices in your field?",
      ];
      const ack = ['That\'s a thoughtful answer. ', 'I see, interesting. ', 'Good, I appreciate that detail. ', 'That makes sense. ', 'Alright, thank you. '];
      aiResponse = ack[Math.floor(Math.random() * ack.length)] + followups[Math.floor(Math.random() * followups.length)];
    }

    const aiMsg = { role: 'ai', text: aiResponse, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, aiMsg]);
    setIsAIThinking(false);

    if (newCount >= maxQuestions) {
      setTimeout(() => navigate('/roleplay-results', { state: { persona, messages: [...messages, userMsg, aiMsg], questionCount: newCount } }), 2000);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  if (!persona) return <div className="text-center py-20"><p className="text-[#94A3B8]">No persona selected. <a href="/roleplay" className="text-[#6366F1]">Go back</a></p></div>;

  return (
    <div className="fixed inset-0 flex" style={{ fontFamily: 'Inter, sans-serif', background: '#F8FAFC' }}>
      {/* Left Panel - AI Interviewer */}
      <div className="w-[40%] hidden lg:flex flex-col border-r border-[#E2E8F0] bg-white p-6">
        <div className={`rounded-2xl p-6 ${isAIThinking ? 'ai-thinking-border' : ''}`} style={{ background: 'white', border: '1px solid #E2E8F0' }}>
          <div className="text-5xl mb-4">{persona.avatar}</div>
          <h2 className="text-xl font-bold text-[#0F172A]">{persona.name}</h2>
          <p className="text-sm text-[#475569]">{persona.role} at {persona.company}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-xs text-[#10B981] font-medium">Online</span>
          </div>
          {companyMode && <span className="badge badge-secondary mt-3">Round 1: Technical</span>}
        </div>

        <div className="mt-6 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#94A3B8]">Progress</span>
            <span className="text-sm font-semibold text-[#6366F1]">{questionCount}/{maxQuestions}</span>
          </div>
          <div className="progress-bar mt-2">
            <motion.div animate={{ width: `${(questionCount / maxQuestions) * 100}%` }} className="progress-fill" style={{ background: '#6366F1' }} />
          </div>
        </div>

        {isAIThinking && (
          <div className="mt-4 p-3 rounded-xl bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              <span className="text-xs text-[#94A3B8] ml-1">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 bg-white border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="text-2xl">{persona.avatar}</span>
            <div>
              <p className="text-sm font-bold text-[#0F172A]">{persona.name}</p>
              <p className="text-xs text-[#94A3B8]">{persona.company}</p>
            </div>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#94A3B8]">Q{questionCount}/{maxQuestions}</span>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowEndConfirm(true)}
              className="btn btn-sm"
              style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #EF4444' }}
            >
              End Interview
            </motion.button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={msg.role === 'user' ? 'msg-user' : 'msg-ai'}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isAIThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="msg-ai flex items-center gap-2">
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-[#E2E8F0]">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                className="input" rows={2} style={{ resize: 'none', minHeight: '48px' }}
                placeholder="Type your response..."
                disabled={isAIThinking || questionCount >= maxQuestions}
              />
              <span className="absolute bottom-2 right-3 text-xs text-[#94A3B8]">{input.length} chars</span>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={isListening ? stopListening : startListening}
              className="w-10 h-10 rounded-full flex items-center justify-center border-none cursor-pointer relative"
              style={{ background: isListening ? '#EF4444' : '#F1F5F9' }}>
              {isListening && <div className="pulse-ring w-10 h-10" style={{ borderColor: '#EF4444' }} />}
              <span>{isListening ? '⏹️' : '🎤'}</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSend} disabled={!input.trim() || isAIThinking}
              className="btn btn-primary btn-icon disabled:opacity-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="m22 2-11 11"/></svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* End Confirm Dialog */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="modal-content">
              <h3 className="text-lg font-bold text-[#0F172A] mb-3">End Interview?</h3>
              <p className="text-[#475569] text-sm mb-6">Are you sure you want to end this interview? You've answered {questionCount} out of {maxQuestions} questions.</p>
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowEndConfirm(false)} className="btn btn-ghost flex-1">Cancel</motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/roleplay-results', { state: { persona, messages, questionCount } })}
                  className="btn btn-danger flex-1">End Interview</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
