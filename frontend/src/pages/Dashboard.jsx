import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from '../components/common/CountUp';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { generateMockDashboardData, formatDate, getGrade, generateStreakGrid } from '../utils/helpers';
import { RADAR_CATEGORIES, MOTIVATIONAL_QUOTES, GRADE_COLORS } from '../constants/enums';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const cardItem = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [quote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

  useEffect(() => {
    // In production, fetch from API. Using mock data for demo.
    setData(generateMockDashboardData());
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
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-1">Welcome back! 👋</h1>
        <p className="text-[#475569]">Here's your interview prep overview</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Top Row - Score + Radar + Streak */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Readiness Score */}
          <motion.div variants={cardItem} className="card-flat flex flex-col items-center justify-center p-6">
            <div className="w-36 h-36 mb-4">
              <CircularProgressbar
                value={data.readinessScore}
                text=""
                styles={buildStyles({
                  pathColor: '#6366F1',
                  trailColor: '#E2E8F0',
                  pathTransitionDuration: 1.5,
                })}
              />
              <div className="relative -mt-[104px] flex items-center justify-center">
                <span className="text-4xl font-extrabold text-[#0F172A]">
                  <CountUp end={data.readinessScore} duration={2} />
                </span>
              </div>
            </div>
            <p className="text-sm font-semibold text-[#475569] mt-8">Your Readiness Score</p>
            <span className="badge badge-primary mt-2">
              {data.readinessScore >= 80 ? 'Interview Ready' : data.readinessScore >= 50 ? 'Getting There' : 'Keep Practicing'}
            </span>
          </motion.div>

          {/* Radar Chart */}
          <motion.div variants={cardItem} className="card-flat p-6">
            <h3 className="text-base font-bold text-[#0F172A] mb-4">Skill Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.3}
                  animationDuration={1500}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Streak Tracker */}
          <motion.div variants={cardItem} className="card-flat p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#0F172A]">Practice Streak</h3>
              <div className="flex items-center gap-1">
                <span className="text-2xl">🔥</span>
                <span className="text-xl font-bold text-[#6366F1]">
                  <CountUp end={data.streak.current} duration={1.5} />
                </span>
                <span className="text-sm text-[#94A3B8]">days</span>
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              {streakGrid.map((week, wi) =>
                week.map((day, di) => (
                  <motion.div
                    key={`${wi}-${di}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: wi * 0.05 + di * 0.01 }}
                    className={`streak-cell ${day.isActive ? 'active' : ''} ${day.isToday ? 'today' : ''}`}
                    title={day.date}
                  />
                ))
              )}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-[#94A3B8]">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-[#E2E8F0]" />
                <div className="w-3 h-3 rounded-sm bg-[#6366F1]/30" />
                <div className="w-3 h-3 rounded-sm bg-[#6366F1]/60" />
                <div className="w-3 h-3 rounded-sm bg-[#6366F1]" />
              </div>
              <span>More</span>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            variants={cardItem}
            whileHover={{ y: -4 }}
            onClick={() => navigate('/mock-interview')}
            className="p-6 rounded-2xl cursor-pointer transition-shadow hover:shadow-lg"
            style={{ background: '#EEF2FF', border: '1px solid rgba(99,102,241,0.15)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-1">Start Mock Interview</h3>
                <p className="text-sm text-[#475569]">Practice with AI-powered questions</p>
              </div>
              <motion.div whileHover={{ x: 4 }} className="w-12 h-12 rounded-xl bg-[#6366F1] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={cardItem}
            whileHover={{ y: -4 }}
            onClick={() => navigate('/roleplay')}
            className="p-6 rounded-2xl cursor-pointer transition-shadow hover:shadow-lg"
            style={{ background: '#F5F3FF', border: '1px solid rgba(139,92,246,0.15)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-1">Enter Roleplay Mode</h3>
                <p className="text-sm text-[#475569]">Practice with AI interviewers from top companies</p>
              </div>
              <motion.div whileHover={{ x: 4 }} className="w-12 h-12 rounded-xl bg-[#8B5CF6] flex items-center justify-center">
                <span className="text-white text-xl">🎭</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row - Stats + Quote + History */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <motion.div variants={cardItem} className="card-flat p-6 space-y-4">
            <h3 className="text-base font-bold text-[#0F172A]">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Sessions', value: data.totalSessions, color: '#6366F1' },
                { label: 'Avg Score', value: data.averageScore, color: '#8B5CF6', decimals: 1 },
                { label: 'Best Streak', value: data.streak.best, color: '#10B981' },
                { label: 'Questions', value: data.questionsAnswered, color: '#F59E0B' },
              ].map(stat => (
                <div key={stat.label} className="text-center p-3 rounded-xl" style={{ background: `${stat.color}08` }}>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>
                    <CountUp end={stat.value} duration={2} decimals={stat.decimals || 0} />
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Motivational Quote */}
          <motion.div
            variants={cardItem}
            className="p-6 rounded-2xl flex flex-col justify-center"
            style={{ background: '#F1F5F9', borderLeft: '4px solid #6366F1' }}
          >
            <p className="text-[#475569] italic text-lg leading-relaxed mb-3">"{quote.text}"</p>
            <p className="text-[#94A3B8] text-sm">— {quote.author}</p>
          </motion.div>

          {/* Weekly Focus Plan */}
          <motion.div variants={cardItem} className="card-flat p-6">
            <h3 className="text-base font-bold text-[#0F172A] mb-4">🎯 Weekly Focus Plan</h3>
            <div className="space-y-3">
              {data.weeklyFocusPlan.priorities.map((p, i) => (
                <div key={p.category} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: p.color }}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{p.category}</p>
                    <p className="text-xs text-[#94A3B8]">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Session History */}
        <motion.div variants={cardItem} className="card-flat p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#0F172A]">Recent Sessions</h3>
            <button onClick={() => navigate('/analytics')} className="text-sm text-[#6366F1] font-semibold hover:text-[#4F46E5] bg-transparent border-none cursor-pointer">
              View All →
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Mode</th>
                  <th>Questions</th>
                  <th>Score</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {data.recentSessions.map((session) => {
                  const grade = getGrade(session.score);
                  const gradeStyle = GRADE_COLORS[grade];
                  return (
                    <tr key={session.id} className="cursor-pointer" onClick={() => navigate(`/session/${session.id}/results`)}>
                      <td className="font-medium">{formatDate(session.date)}</td>
                      <td>
                        <span className={`badge ${session.mode === 'Mock' ? 'badge-primary' : 'badge-secondary'}`}>
                          {session.mode}
                        </span>
                      </td>
                      <td>{session.questionCount}</td>
                      <td className="font-semibold">{session.score.toFixed(1)}/10</td>
                      <td>
                        <span className="badge" style={{ background: gradeStyle.bg, color: gradeStyle.text }}>
                          {grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
