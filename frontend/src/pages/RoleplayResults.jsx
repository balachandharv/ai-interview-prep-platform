import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from '../components/common/CountUp';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';
import { Loader, AlertTriangle } from 'lucide-react';
import { roleplayAPI } from '../services/api';

export default function RoleplayResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { persona, messages = [], questionCount = 0, sessionId } = location.state || {};

  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(!!sessionId);
  const [results, setResults] = useState(null);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      // No sessionId means we can't fetch results — show what we have from state
      setIsLoading(false);
      return;
    }

    if (sessionId === 'demo-session-id') {
      // Generate realistic scores based on user's answers for DEMO mode
      const userMessages = messages.filter(m => m.role !== 'ai');
      
      let totalWords = 0;
      userMessages.forEach(m => {
        totalWords += (m.text || '').trim().split(/\s+/).length;
      });
      
      const avgWordsPerAnswer = userMessages.length > 0 ? totalWords / userMessages.length : 0;
      
      // Calculate a dynamic score based on answer length and effort
      let baseScore = 4.0; 
      if (userMessages.length === 0) {
        baseScore = 0; // No answers provided
      } else {
        if (avgWordsPerAnswer > 5) baseScore += 1.5;
        if (avgWordsPerAnswer > 15) baseScore += 1.5;
        if (avgWordsPerAnswer > 30) baseScore += 1.5;
        if (avgWordsPerAnswer > 50) baseScore += 1.0;
        
        // Add up to 0.5 random variance for realism
        baseScore += (Math.random() * 0.5);
      }
      
      const overall = Math.min(9.8, Number(baseScore.toFixed(1)));
      
      const mockResults = {
        overallScore: overall,
        communicationScore: Math.min(10, overall + (Math.random() * 1.0 - 0.5)),
        technicalDepthScore: Math.min(10, overall + (Math.random() * 1.5 - 0.7)),
        confidenceScore: Math.min(10, overall + (Math.random() * 1.0 - 0.2)),
        strengths: [
          'Maintained active participation in the interview',
          avgWordsPerAnswer > 20 ? 'Provided detailed context in answers' : 'Answered questions directly and concisely'
        ],
        improvements: [
          avgWordsPerAnswer < 20 
            ? 'Try using the STAR method (Situation, Task, Action, Result) to provide more detail' 
            : 'Ensure you balance detail with conciseness so responses do not drag on',
          'Practice structuring technical explanations more clearly'
        ],
        actionPlan: 'Focus on structuring your answers. When asked about past experience, rely on the STAR framework to provide comprehensive but focused responses.',
        conversationHistory: messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }))
      };

      setTimeout(() => {
        setResults(mockResults);
        if (overall >= 8) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
        setIsLoading(false);
      }, 1500); // Simulate network delay
      
      return;
    }

    roleplayAPI.getResults(sessionId)
      .then((res) => {
        setResults(res.data);
        if (res.data.overallScore >= 8) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch roleplay results:', err);
        setFetchError(true);
      })
      .finally(() => setIsLoading(false));
  }, [sessionId, messages]);

  // Use real scores from API, or zeros if fetch failed/no session
  const overallScore = results?.overallScore ?? 0;
  const commScore = results?.communicationScore ?? 0;
  const techScore = results?.technicalDepthScore ?? 0;
  const confScore = results?.confidenceScore ?? 0;
  const strengths = results?.strengths ?? [];
  const improvements = results?.improvements ?? [];
  const actionPlan = results?.actionPlan ?? '';
  const transcript = results?.conversationHistory ?? messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="text-center">
          <Loader size={48} className="animate-spin text-[var(--aqua-500)] mx-auto mb-4" />
          <p className="text-[var(--text-primary)] font-semibold text-lg">Analyzing your performance...</p>
          <p className="text-[var(--text-secondary)] text-sm mt-1">This takes just a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">Interview Complete!</h1>
        <p className="text-[var(--text-secondary)]">Here's your performance breakdown with {persona?.name || 'the interviewer'}</p>

        {fetchError && (
          <p className="text-sm text-[var(--amber-500)] mt-2 px-4 py-2 bg-[#FEF3C7] rounded-lg inline-block">
            <AlertTriangle size={16} className="inline mr-1" /> Could not load scores from server — scores shown are unavailable. Your transcript is preserved below.
          </p>
        )}

        <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-[#EEF2FF] mt-6">
          <span className="text-4xl font-extrabold text-[var(--aqua-500)]">
            {fetchError ? '—' : <CountUp end={overallScore} duration={2} decimals={1} />}
          </span>
        </motion.div>
        <p className="text-sm text-[var(--text-secondary)] mt-2">Overall Performance</p>
      </motion.div>

      {/* Score Cards */}
      {!fetchError && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Communication', value: commScore, color: 'var(--aqua-500)', icon: 'comm' },
            { label: 'Technical Depth', value: techScore, color: 'var(--blue-500)', icon: 'tech' },
            { label: 'Confidence', value: confScore, color: 'var(--emerald-500)', icon: 'conf' },
          ].map(s => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-flat p-5 text-center">
              <span className="text-3xl mb-2 block">{s.icon}</span>
              <p className="text-2xl font-bold" style={{ color: s.color }}><CountUp end={s.value} duration={1.5} decimals={1} />/10</p>
              <p className="text-sm text-[var(--text-secondary)]">{s.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Strengths & Areas to Improve — from API if available */}
      {(strengths.length > 0 || improvements.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(16,185,129,0.10)' }}>
              <h3 className="text-base font-bold text-[var(--emerald-500)] mb-3">Key Strengths</h3>
              {(strengths.length > 0 ? strengths : ['Good effort — keep practicing!']).map((s, i) => (
                <p key={i} className="text-sm text-[var(--text-secondary)] flex items-center gap-2 mb-1"><span className="text-[var(--emerald-500)]">✓</span> {s}</p>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(239,68,68,0.10)' }}>
              <h3 className="text-base font-bold text-[var(--danger-500)] mb-3">Areas to Improve</h3>
              {(improvements.length > 0 ? improvements : ['Keep working on your responses!']).map((s, i) => (
                <p key={i} className="text-sm text-[var(--text-secondary)] flex items-center gap-2 mb-1"><span className="text-[var(--danger-500)]">→</span> {s}</p>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Action Plan — from API if available */}
      {actionPlan && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-flat p-6 mb-6">
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">Personalized Action Plan</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{actionPlan}</p>
        </motion.div>
      )}

      {/* Transcript */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card-flat p-6 mb-6">
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">Full Transcript</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`p-3 rounded-xl text-sm ${msg.role === 'ai' ? 'bg-[#EEF2FF]' : 'bg-[#F5F3FF]'}`}>
              <p className="font-semibold text-xs text-[var(--text-secondary)] mb-1">{msg.role === 'ai' ? persona?.name || 'Interviewer' : 'You'}</p>
              <p className="text-[var(--text-secondary)]">{msg.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-4">
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/roleplay-session', { state: { persona } })}
          className="btn flex-1" style={{ background: 'var(--blue-500)', color: 'white', border: '2px solid var(--blue-500)' }}>
          Try Again with {persona?.name?.split(' ')[0] || 'Same Interviewer'}
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/roleplay')}
          className="btn btn-primary flex-1">Try Different Interviewer</motion.button>
      </div>
    </div>
  );
}


