import { motion } from 'framer-motion';
import CountUp from '../components/common/CountUp';
import { BADGE_DEFINITIONS } from '../constants/enums';

const earnedBadges = ['First Steps', 'Practice Makes Perfect', 'Streak Master', 'Roleplay Rookie', 'Score Hunter'];

export default function Profile() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Cover + Avatar */}
      <div className="rounded-2xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)' }}>
        <div className="h-32" />
        <div className="px-4 sm:px-6 pb-6 -mt-12 flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="relative">
            <div className="avatar avatar-xl border-4 border-white shadow-lg" style={{ background: '#6366F1', color: 'white', fontSize: '2rem' }}>B</div>
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white" />
          </div>
          <div className="mb-2 w-full sm:w-auto">
            <h1 className="text-2xl font-bold text-[#0F172A]">Balachandhar V</h1>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-1">
              <span className="badge badge-primary">Full Stack Engineer</span>
              <span className="badge badge-secondary">Mid (2-5 yrs)</span>
            </div>
          </div>
          <div className="mt-2 sm:mt-0 sm:ml-auto sm:mb-2">
            <motion.button whileTap={{ scale: 0.97 }} className="btn btn-outline btn-sm w-full sm:w-auto">✏️ Edit Profile</motion.button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Sessions', value: 24, color: '#6366F1' },
          { label: 'Average Score', value: 7.2, color: '#8B5CF6', decimals: 1 },
          { label: 'Best Streak', value: 14, color: '#10B981' },
          { label: 'Questions Answered', value: 156, color: '#F59E0B' },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-flat p-5 text-center">
            <p className="text-3xl font-extrabold" style={{ color: s.color }}>
              <CountUp end={s.value} duration={2} decimals={s.decimals || 0} />
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-flat p-6 mb-8">
        <h3 className="text-lg font-bold text-[#0F172A] mb-4">🏅 Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {BADGE_DEFINITIONS.map(badge => {
            const earned = earnedBadges.includes(badge.name);
            return (
              <motion.div key={badge.name} whileHover={earned ? { scale: 1.05 } : {}}
                className={`text-center p-4 rounded-xl border transition-all ${
                  earned ? 'border-[#6366F1]/20 bg-white' : 'border-[#E2E8F0] bg-[#F8FAFC] opacity-50'
                }`}>
                <span className={`text-3xl block mb-2 ${earned ? '' : 'grayscale'}`}>{earned ? badge.icon : '🔒'}</span>
                <p className="text-xs font-semibold text-[#0F172A]">{badge.name}</p>
                <p className="text-[10px] text-[#94A3B8] mt-1">{badge.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Sessions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-flat p-6">
        <h3 className="text-base font-bold text-[#0F172A] mb-4">📋 Recent Activity</h3>
        <div className="space-y-3">
          {[
            { date: 'Today', mode: 'Mock', score: 7.8 },
            { date: 'Yesterday', mode: 'Roleplay', score: 8.5 },
            { date: '2 days ago', mode: 'Mock', score: 6.2 },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <span className={`badge ${s.mode === 'Mock' ? 'badge-primary' : 'badge-secondary'}`}>{s.mode}</span>
                <span className="text-sm text-[#475569]">{s.date}</span>
              </div>
              <span className="font-bold text-[#6366F1]">{s.score}/10</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
