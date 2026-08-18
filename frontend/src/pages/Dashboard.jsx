import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from '../components/common/CountUp';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { generateMockDashboardData, formatDate, getGrade, generateStreakGrid } from '../utils/helpers';
import { Flame, VenetianMask, FilePlus2, Sparkles, ChevronRight } from 'lucide-react';
import { RADAR_CATEGORIES, MOTIVATIONAL_QUOTES, GRADE_COLORS } from '../constants/enums';
import EmptyState from '../components/common/EmptyState';
import { userAPI, sessionAPI } from '../services/api';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const cardItem = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [quote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([userAPI.getStats(), sessionAPI.getHistory()]);
        const backendStats = statsRes.data.data;
        const recentSessions = historyRes.data.data.content || [];
        setData({
          ...generateMockDashboardData(),
          ...backendStats,
          recentSessions: recentSessions.length > 0 ? recentSessions : generateMockDashboardData().recentSessions
        });
      } catch (error) {
        setData(generateMockDashboardData());
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="space-y-6">
        {[1,2,3].map(i => <div key={i} className="skeleton h-40 w-full rounded-2xl" />)}
      </div>
    );
  }

  const radarData = RADAR_CATEGORIES.map(cat => ({
    category: cat,
    score: data.radarScores[cat] || 0,
    fullMark: 100,
  }));

  const streakGrid = generateStreakGrid(data.activeDates);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 relative">
        <h1 className="text-3xl font-extrabold text-[#F1F5F9] mb-2 flex items-center gap-3">
          Welcome back! <Sparkles className="text-[#818CF8]" size={24} />
        </h1>
        <p className="text-[#94A3B8] text-lg">Here's your interview prep overview.</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 relative z-10">
        {/* Top Row - Score + Radar + Streak */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Readiness Score */}
          <motion.div variants={cardItem} className="card-flat flex flex-col items-center justify-center p-6 text-center group hover:border-[rgba(129,140,248,0.3)] transition-all">
            <div className="relative w-36 h-36 mb-6">
              <div className="absolute inset-0 bg-[#818CF8] opacity-10 rounded-full filter blur-xl group-hover:opacity-20 transition-opacity" />
              <CircularProgressbar
                value={data.readinessScore}
                text=""
                styles={buildStyles({
                  pathColor: '#818CF8',
                  trailColor: 'rgba(148,163,184,0.1)',
                  pathTransitionDuration: 1.5,
                })}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-[#F1F5F9] leading-none drop-shadow-md">
                  <CountUp end={data.readinessScore} duration={2} />
                </span>
                <span className="text-xs text-[#818CF8] font-bold mt-1">/ 100</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-[#E2E8F0] mb-2">Readiness Score</p>
            <span className={`badge ${data.readinessScore >= 80 ? 'badge-success' : data.readinessScore >= 50 ? 'badge-warning' : 'badge-danger'}`}>
              {data.readinessScore >= 80 ? 'Interview Ready' : data.readinessScore >= 50 ? 'Getting There' : 'Keep Practicing'}
            </span>
          </motion.div>

          {/* Radar Chart */}
          <motion.div variants={cardItem} className="card-flat p-6">
            <h3 className="text-base font-bold text-[#F1F5F9] mb-4">Skill Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="rgba(148,163,184,0.15)" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="score" stroke="#818CF8" strokeWidth={2} fill="url(#colorUv)" fillOpacity={1} animationDuration={1500} />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Streak Tracker */}
          <motion.div variants={cardItem} className="card-flat p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-[#F1F5F9]">Practice Streak</h3>
              <div className="flex items-center gap-2 bg-[rgba(251,113,133,0.1)] px-3 py-1.5 rounded-xl border border-[rgba(251,113,133,0.2)]">
                <Flame className="text-[#FB7185] w-5 h-5" />
                <span className="text-lg font-bold text-[#FB7185]">
                  <CountUp end={data.streak.current} duration={1.5} />
                </span>
                <span className="text-xs text-[#F1F5F9] font-medium">days</span>
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {streakGrid.map((week, wi) =>
                week.map((day, di) => (
                  <motion.div
                    key={`${wi}-${di}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: wi * 0.05 + di * 0.01 }}
                    className={`streak-cell ${day.isActive ? 'active' : ''} ${day.isToday ? 'today' : ''}`}
                    title={day.date}
                  />
                ))
              )}
            </div>
            <div className="flex items-center gap-3 mt-6 text-xs text-[#94A3B8]">
              <span>Less</span>
              <div className="flex gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-[rgba(148,163,184,0.1)]" />
                <div className="w-3.5 h-3.5 rounded bg-[rgba(129,140,248,0.3)]" />
                <div className="w-3.5 h-3.5 rounded bg-[rgba(129,140,248,0.6)]" />
                <div className="w-3.5 h-3.5 rounded bg-[#818CF8] shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
              </div>
              <span>More</span>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            variants={cardItem} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/mock-interview')}
            className="p-6 rounded-2xl cursor-pointer relative overflow-hidden group"
            style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.15), rgba(30,41,59,0.5))', border: '1px solid rgba(129,140,248,0.2)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#818CF8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between gap-4 relative z-10">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-[#F1F5F9] mb-1 truncate group-hover:text-[#818CF8] transition-colors">Start Mock Interview</h3>
                <p className="text-sm text-[#94A3B8] line-clamp-2">Practice with AI-powered questions</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#818CF8] to-[#6366F1] flex items-center justify-center shadow-[0_8px_24px_rgba(129,140,248,0.4)] group-hover:shadow-[0_12px_32px_rgba(129,140,248,0.6)] transition-all">
                <ChevronRight className="text-white" size={28} />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardItem} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/roleplay')}
            className="p-6 rounded-2xl cursor-pointer relative overflow-hidden group"
            style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(30,41,59,0.5))', border: '1px solid rgba(167,139,250,0.2)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#A78BFA]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between gap-4 relative z-10">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-[#F1F5F9] mb-1 truncate group-hover:text-[#A78BFA] transition-colors">Enter Roleplay Mode</h3>
                <p className="text-sm text-[#94A3B8] line-clamp-2">Immersive simulation with AI personas</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#8B5CF6] flex items-center justify-center shadow-[0_8px_24px_rgba(167,139,250,0.4)] group-hover:shadow-[0_12px_32px_rgba(167,139,250,0.6)] transition-all">
                <VenetianMask className="text-white" size={28} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row - Stats + Quote + History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={cardItem} className="card-flat p-6 space-y-4">
            <h3 className="text-base font-bold text-[#F1F5F9]">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Sessions', value: data.totalSessions, color: '#818CF8' },
                { label: 'Avg Score', value: data.averageScore, color: '#A78BFA', decimals: 1 },
                { label: 'Best Streak', value: data.streak.best, color: '#34D399' },
                { label: 'Questions', value: data.questionsAnswered, color: '#FBBF24' },
              ].map(stat => (
                <div key={stat.label} className="text-center p-4 rounded-xl border border-[rgba(148,163,184,0.05)] bg-[rgba(30,41,59,0.3)]">
                  <p className="text-2xl font-bold" style={{ color: stat.color, textShadow: `0 0 16px ${stat.color}40` }}>
                    <CountUp end={stat.value} duration={2} decimals={stat.decimals || 0} />
                  </p>
                  <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={cardItem} className="p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(17,24,39,0.9))', borderLeft: '4px solid #818CF8', borderTop: '1px solid rgba(148,163,184,0.1)', borderRight: '1px solid rgba(148,163,184,0.1)', borderBottom: '1px solid rgba(148,163,184,0.1)' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#818CF8] opacity-5 rounded-full filter blur-2xl -translate-y-1/2 translate-x-1/4" />
            <Sparkles className="text-[#818CF8] mb-4 opacity-50" size={24} />
            <p className="text-[#E2E8F0] italic text-lg leading-relaxed mb-4 relative z-10 font-medium">"{quote.text}"</p>
            <p className="text-[#818CF8] text-sm font-semibold relative z-10">— {quote.author}</p>
          </motion.div>

          <motion.div variants={cardItem} className="card-flat p-6">
            <h3 className="text-base font-bold text-[#F1F5F9] mb-4">Weekly Focus Plan</h3>
            <div className="space-y-4">
              {data.weeklyFocusPlan.priorities.map((p, i) => (
                <div key={p.category} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg" style={{ background: p.color }}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#E2E8F0]">{p.category}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Session History */}
        <motion.div variants={cardItem} className="card-flat p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-[#F1F5F9]">Recent Sessions</h3>
            <button onClick={() => navigate('/analytics')} className="text-sm text-[#818CF8] font-bold hover:text-[#A78BFA] bg-transparent border-none cursor-pointer transition-colors">
              View All →
            </button>
          </div>
          {data.recentSessions.length === 0 ? (
            <div className="mt-4">
              <EmptyState 
                icon={<FilePlus2 className="w-10 h-10 text-[#818CF8]" />}
                title="No recent sessions"
                description="You haven't completed any mock interviews yet. Start one now to build your skills!"
                actionText="Start Mock Interview"
                actionLink="/mock-interview"
              />
            </div>
          ) : (
            <div className="table-container overflow-x-auto overflow-y-hidden">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr>
                    <th className="bg-[rgba(30,41,59,0.3)]">Date</th>
                    <th className="bg-[rgba(30,41,59,0.3)]">Mode</th>
                    <th className="bg-[rgba(30,41,59,0.3)]">Questions</th>
                    <th className="bg-[rgba(30,41,59,0.3)]">Score</th>
                    <th className="bg-[rgba(30,41,59,0.3)]">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentSessions.map((session) => {
                    const grade = getGrade(session.score);
                    const gradeStyle = GRADE_COLORS[grade];
                    return (
                      <tr key={session.id} className="cursor-pointer group hover:bg-[rgba(129,140,248,0.05)] transition-colors" onClick={() => navigate(`/session/${session.id}/results`)}>
                        <td className="font-medium text-[#E2E8F0]">{formatDate(session.date)}</td>
                        <td>
                          <span className={`badge ${session.mode === 'Mock' ? 'badge-primary' : 'badge-secondary'}`}>
                            {session.mode}
                          </span>
                        </td>
                        <td className="text-[#94A3B8] font-medium">{session.questionCount}</td>
                        <td className="font-bold text-[#F1F5F9]">{session.score.toFixed(1)}<span className="text-[#64748B] font-medium">/10</span></td>
                        <td>
                          <span className="badge font-bold" style={{ background: `${gradeStyle.bg}20`, color: gradeStyle.bg, border: `1px solid ${gradeStyle.bg}40` }}>
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
