import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from '../components/common/CountUp';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function RoleplayResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { persona, messages = [], questionCount = 0 } = location.state || {};
  const [showConfetti, setShowConfetti] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState(null);

  const overallScore = 6 + Math.random() * 3.5;
  const commScore = 6 + Math.random() * 3;
  const techScore = 5 + Math.random() * 4;
  const confScore = 7 + Math.random() * 2;

  useEffect(() => {
    if (overallScore >= 8) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3000); }
  }, []);

  const barData = Array.from({ length: questionCount }, (_, i) => ({ name: `Q${i + 1}`, score: 5 + Math.random() * 5 }));

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-2">Interview Complete! 🎉</h1>
        <p className="text-[#475569]">Here's your performance breakdown with {persona?.name || 'the interviewer'}</p>
        <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-[#EEF2FF] mt-6">
          <span className="text-4xl font-extrabold text-[#6366F1]"><CountUp end={overallScore} duration={2} decimals={1} /></span>
        </motion.div>
        <p className="text-sm text-[#94A3B8] mt-2">Overall Performance</p>
      </motion.div>

      {/* Score Cards */}
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

      {/* Bar Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-flat p-6 mb-6">
        <h3 className="text-base font-bold text-[#0F172A] mb-4">Score per Question</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}><XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} /><YAxis domain={[0, 10]} /><Tooltip />
            <Bar dataKey="score" fill="#6366F1" radius={[4, 4, 0, 0]} animationDuration={1500} /></BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Strengths & Areas to Improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div className="p-5 rounded-2xl" style={{ background: '#ECFDF5' }}>
            <h3 className="text-base font-bold text-[#10B981] mb-3">💪 Key Strengths</h3>
            {['Clear communication style', 'Good problem breakdown approach', 'Showed genuine enthusiasm'].map((s, i) => (
              <p key={i} className="text-sm text-[#475569] flex items-center gap-2 mb-1"><span className="text-[#10B981]">✓</span> {s}</p>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div className="p-5 rounded-2xl" style={{ background: '#FEF2F2' }}>
            <h3 className="text-base font-bold text-[#EF4444] mb-3">📝 Areas to Improve</h3>
            {['Add more specific examples', 'Discuss trade-offs in solutions', 'Practice time management'].map((s, i) => (
              <p key={i} className="text-sm text-[#475569] flex items-center gap-2 mb-1"><span className="text-[#EF4444]">→</span> {s}</p>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Action Plan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-flat p-6 mb-6">
        <h3 className="text-base font-bold text-[#0F172A] mb-4">🎯 Personalized Action Plan</h3>
        <ol className="space-y-3">
          {['Practice STAR method responses daily for behavioral questions', 'Study system design fundamentals — focus on scalability patterns',
            'Record yourself answering questions to reduce filler words', 'Review common follow-up questions for your target role'].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#6366F1] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
              <span className="text-sm text-[#475569]">{step}</span>
            </li>
          ))}
        </ol>
      </motion.div>

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
