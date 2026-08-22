import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from '../components/common/CountUp';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
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
  }, [sessionId]);

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
          <Loader size={48} className="animate-spin text-[#6366F1] mx-auto mb-4" />
          <p className="text-[#0F172A] font-semibold text-lg">Analyzing your performance...</p>
          <p className="text-[#94A3B8] text-sm mt-1">This takes just a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-2">Interview Complete! 🎉</h1>
        <p className="text-[#475569]">Here's your performance breakdown with {persona?.name || 'the interviewer'}</p>

        {fetchError && (
          <p className="text-sm text-[#F59E0B] mt-2 px-4 py-2 bg-[#FEF3C7] rounded-lg inline-block">
            ⚠️ Could not load scores from server — scores shown are unavailable. Your transcript is preserved below.
          </p>
        )}

        <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-[#EEF2FF] mt-6">
          <span className="text-4xl font-extrabold text-[#6366F1]">
            {fetchError ? '—' : <CountUp end={overallScore} duration={2} decimals={1} />}
          </span>
        </motion.div>
        <p className="text-sm text-[#94A3B8] mt-2">Overall Performance</p>
      </motion.div>

      {/* Score Cards */}
      {!fetchError && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Communication', value: commScore, color: '#6366F1', icon: '💬' },
            { label: 'Technical Depth', value: techScore, color: '#8B5CF6', icon: '🧠' },
            { label: 'Confidence', value: confScore, color: '#10B981', icon: '💪' },
          ].map(s => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-flat p-5 text-center">
              <span className="text-3xl mb-2 block">{s.icon}</span>
              <p className="text-2xl font-bold" style={{ color: s.color }}><CountUp end={s.value} duration={1.5} decimals={1} />/10</p>
              <p className="text-sm text-[#94A3B8]">{s.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Strengths & Areas to Improve — from API if available */}
      {(strengths.length > 0 || improvements.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <div className="p-5 rounded-2xl" style={{ background: '#ECFDF5' }}>
              <h3 className="text-base font-bold text-[#10B981] mb-3">💪 Key Strengths</h3>
              {(strengths.length > 0 ? strengths : ['Good effort — keep practicing!']).map((s, i) => (
                <p key={i} className="text-sm text-[#475569] flex items-center gap-2 mb-1"><span className="text-[#10B981]">✓</span> {s}</p>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <div className="p-5 rounded-2xl" style={{ background: '#FEF2F2' }}>
              <h3 className="text-base font-bold text-[#EF4444] mb-3">📝 Areas to Improve</h3>
              {(improvements.length > 0 ? improvements : ['Keep working on your responses!']).map((s, i) => (
                <p key={i} className="text-sm text-[#475569] flex items-center gap-2 mb-1"><span className="text-[#EF4444]">→</span> {s}</p>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Action Plan — from API if available */}
      {actionPlan && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-flat p-6 mb-6">
          <h3 className="text-base font-bold text-[#0F172A] mb-4">🎯 Personalized Action Plan</h3>
          <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-wrap">{actionPlan}</p>
        </motion.div>
      )}

      {/* Transcript */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card-flat p-6 mb-6">
        <h3 className="text-base font-bold text-[#0F172A] mb-4">📜 Full Transcript</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`p-3 rounded-xl text-sm ${msg.role === 'ai' ? 'bg-[#EEF2FF]' : 'bg-[#F5F3FF]'}`}>
              <p className="font-semibold text-xs text-[#94A3B8] mb-1">{msg.role === 'ai' ? persona?.name || 'Interviewer' : 'You'}</p>
              <p className="text-[#475569]">{msg.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-4">
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/roleplay-session', { state: { persona } })}
          className="btn flex-1" style={{ background: '#8B5CF6', color: 'white', border: '2px solid #8B5CF6' }}>
          Try Again with {persona?.name?.split(' ')[0] || 'Same Interviewer'}
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/roleplay')}
          className="btn btn-primary flex-1">Try Different Interviewer</motion.button>
      </div>
    </div>
  );
}


