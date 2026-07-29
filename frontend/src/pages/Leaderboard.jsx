import { useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from '../components/common/CountUp';
import { generateMockLeaderboard, getInitials } from '../utils/helpers';
import EmptyState from '../components/common/EmptyState';
import { Trophy } from 'lucide-react';

export default function Leaderboard() {
  const [tab, setTab] = useState('weekly');
  const leaderboard = generateMockLeaderboard();
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  const medals = ['🥇', '🥈', '🥉'];
  const borderColors = ['#F59E0B', '#94A3B8', '#D97706'];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-1">Leaderboard</h1>
        <p className="text-[#475569] mb-6">See how you stack up against other candidates</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {['weekly', 'monthly', 'all-time'].map(t => (
          <motion.button key={t} whileTap={{ scale: 0.97 }}
            onClick={() => setTab(t)}
            className={`chip ${tab === t ? 'chip-active' : ''}`}>
            {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
          </motion.button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-2 sm:gap-4 mb-10">
        {[1, 0, 2].map((idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: idx * 0.15 }}
            className={`text-center p-5 rounded-2xl border-2 bg-white ${idx === 0 ? 'w-36 -mt-6' : 'w-28'}`}
            style={{ borderColor: borderColors[idx] }}
          >
            <span className="text-3xl">{medals[idx]}</span>
            <div className="w-14 h-14 rounded-full mx-auto mt-2 mb-2 flex items-center justify-center font-bold text-lg"
              style={{ background: '#EEF2FF', color: '#6366F1' }}>
              {getInitials(top3[idx]?.name || '?')}
            </div>
            <p className="text-sm font-bold text-[#0F172A]">{top3[idx]?.name}</p>
            <p className="text-lg font-extrabold text-[#6366F1]"><CountUp end={parseFloat(top3[idx]?.averageScore || 0)} duration={1.5} decimals={1} /></p>
            <p className="text-xs text-[#94A3B8]">avg score</p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-flat p-6">
        {leaderboard.length === 0 ? (
          <EmptyState
            icon={<Trophy className="w-8 h-8" />}
            title="Leaderboard is empty"
            description="Take your first mock interview to claim the top spot on the leaderboard!"
            actionText="Start Mock Interview"
            actionLink="/mock-interview"
          />
        ) : (
          <div className="table-container overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr><th>Rank</th><th>User</th><th>Sessions</th><th>Avg Score</th><th>Best Streak</th><th>Badges</th><th>Change</th></tr>
              </thead>
              <tbody>
                {rest.map((user) => (
                  <tr key={user.rank} className={user.rank === 5 ? 'bg-[#EEF2FF]' : ''}>
                    <td className="font-bold text-[#0F172A]">#{user.rank}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem', background: '#EEF2FF', color: '#6366F1' }}>
                          {getInitials(user.name)}
                        </div>
                        <span className="font-medium text-[#0F172A]">{user.name}</span>
                      </div>
                    </td>
                    <td>{user.totalSessions}</td>
                    <td className="font-semibold text-[#6366F1]">{user.averageScore}</td>
                    <td>{user.bestStreak}</td>
                    <td>{user.badges} 🏅</td>
                    <td>
                      <span className={`text-sm font-semibold ${user.change > 0 ? 'text-[#10B981]' : user.change < 0 ? 'text-[#EF4444]' : 'text-[#94A3B8]'}`}>
                        {user.change > 0 ? '▲' : user.change < 0 ? '▼' : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
