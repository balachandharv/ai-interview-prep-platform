import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from '../components/common/CountUp';
import Confetti from 'react-confetti';
import { LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { getGrade } from '../utils/helpers';

export default function SessionResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { scores = [7.5, 6, 8.5, 5, 7], avgScore = 6.8 } = location.state || {};
  const [showConfetti, setShowConfetti] = useState(false);
  const [expandedQ, setExpandedQ] = useState(null);

  const overallScore = avgScore * 10;
  const grade = getGrade(avgScore);
  const gradeStyle = { A: { bg: '#ECFDF5', text: '#10B981' }, B: { bg: '#EEF2FF', text: '#6366F1' }, C: { bg: '#FFFBEB', text: '#F59E0B' }, D: { bg: '#FEF2F2', text: '#EF4444' } }[grade];

  useEffect(() => {
    if (overallScore >= 80) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3000); }
  }, [overallScore]);

  const trendData = scores.map((s, i) => ({ name: `Q${i + 1}`, score: s }));
  const radarData = [
    { cat: 'Correctness', score: 70 + Math.random() * 30 },
    { cat: 'Completeness', score: 60 + Math.random() * 30 },
    { cat: 'Clarity', score: 65 + Math.random() * 30 },
    { cat: 'Structure', score: 55 + Math.random() * 35 },
    { cat: 'Speed', score: 70 + Math.random() * 25 },
    { cat: 'Depth', score: 50 + Math.random() * 40 },
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      {/* Grade Banner */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
        className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-6">Session Complete! 🎉</h1>
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center justify-center w-32 h-32 rounded-full text-5xl font-extrabold mx-auto"
          style={{ background: gradeStyle.bg, color: gradeStyle.text }}
        >
          <CountUp end={avgScore} duration={2} decimals={1} />
        </motion.div>
        <p className="text-lg font-semibold text-[#475569] mt-4">Grade: {grade} — {gradeStyle.text === '#10B981' ? 'Excellent!' : gradeStyle.text === '#6366F1' ? 'Good job!' : gradeStyle.text === '#F59E0B' ? 'Room to grow' : 'Keep practicing!'}</p>
      </motion.div>

      {/* Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Accuracy', value: 72 + Math.random() * 20, color: '#6366F1' },
          { label: 'Speed', value: 65 + Math.random() * 25, color: '#8B5CF6' },
          { label: 'Completeness', value: 60 + Math.random() * 30, color: '#10B981' },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-flat p-5">
            <p className="text-sm text-[#94A3B8] mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-[#0F172A] mb-2"><CountUp end={Math.round(s.value)} duration={1.5} />%</p>
            <div className="progress-bar">
              <motion.div initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ type: 'spring', duration: 1, delay: 0.3 }}
                className="progress-fill" style={{ background: s.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-flat p-6">
          <h3 className="text-base font-bold text-[#0F172A] mb-4">Score Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2.5} dot={{ fill: '#6366F1', r: 4 }} animationDuration={1500} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-flat p-6">
          <h3 className="text-base font-bold text-[#0F172A] mb-4">Skill Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="cat" tick={{ fontSize: 10, fill: '#475569' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="score" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} animationDuration={1500} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Per Question Details */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-flat p-6 mb-6">
        <h3 className="text-base font-bold text-[#0F172A] mb-4">Question Details</h3>
        <div className="space-y-3">
          {scores.map((score, i) => (
            <div key={i} className={`p-4 rounded-xl border cursor-pointer transition-all ${score < 5 ? 'bg-[#FEF2F2] border-[#EF4444]/20' : 'bg-white border-[#E2E8F0]'}`}
              onClick={() => setExpandedQ(expandedQ === i ? null : i)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="badge badge-primary">Q{i + 1}</span>
                  <span className="text-sm text-[#0F172A] font-medium">Question {i + 1}</span>
                </div>
                <span className={`text-lg font-bold ${score >= 7 ? 'text-[#10B981]' : score >= 5 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                  {score.toFixed(1)}/10
                </span>
              </div>
              {expandedQ === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-3 pt-3 border-t border-[#E2E8F0]">
                  <p className="text-sm text-[#475569]">Detailed feedback for this question would appear here in production.</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-4">
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/mock-interview')} className="btn btn-primary flex-1">
          Practice Weak Areas
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/dashboard')} className="btn btn-outline flex-1">
          Back to Dashboard
        </motion.button>
      </div>
    </div>
  );
}
