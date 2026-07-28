import { motion } from 'framer-motion';
import CountUp from '../components/common/CountUp';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RADAR_CATEGORIES } from '../constants/enums';

const trendData = Array.from({ length: 15 }, (_, i) => ({ day: `Day ${i + 1}`, score: 5 + Math.random() * 4 }));
const catData = [{ name: 'Technical', count: 45 }, { name: 'Behavioral', count: 32 }, { name: 'System Design', count: 18 }, { name: 'DSA', count: 28 }, { name: 'HR', count: 15 }];
const pieData = [{ name: 'Mock', value: 60 }, { name: 'Roleplay', value: 40 }];
const COLORS = ['#6366F1', '#8B5CF6'];
const radarNow = RADAR_CATEGORIES.map(c => ({ cat: c, now: 50 + Math.random() * 40, before: 30 + Math.random() * 30 }));

export default function Analytics() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-1">Analytics 📈</h1>
        <p className="text-[#475569] mb-8">Track your interview preparation progress</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Sessions', value: 24, color: '#6366F1' },
          { label: 'Questions Answered', value: 156, color: '#8B5CF6' },
          { label: 'Time Practiced', value: 48, color: '#10B981', suffix: 'hrs' },
          { label: 'Best Streak', value: 14, color: '#F59E0B', suffix: ' days' },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-flat p-5 text-center">
            <p className="text-3xl font-extrabold" style={{ color: s.color }}>
              <CountUp end={s.value} duration={2} />{s.suffix || ''}
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Avg Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-flat p-6 flex flex-col items-center justify-center">
          <div className="w-24 h-24 mb-3">
            <CircularProgressbar value={72} text="7.2" styles={buildStyles({ pathColor: '#6366F1', trailColor: '#E2E8F0', textColor: '#0F172A', textSize: '28px' })} />
          </div>
          <p className="text-sm text-[#94A3B8]">Average Score</p>
        </motion.div>

        {/* Score Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-flat p-6 col-span-3">
          <h3 className="text-base font-bold text-[#0F172A] mb-4">Score Trend Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} /><YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#94A3B8' }} /><Tooltip />
              <Line type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2.5} dot={{ fill: '#6366F1', r: 3 }} animationDuration={1500} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Radar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-flat p-6">
          <h3 className="text-base font-bold text-[#0F172A] mb-4">Skill Evolution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarNow}>
              <PolarGrid stroke="#E2E8F0" /><PolarAngleAxis dataKey="cat" tick={{ fontSize: 10, fill: '#475569' }} /><PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="now" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} animationDuration={1500} />
              <Radar dataKey="before" stroke="#E2E8F0" fill="#E2E8F0" fillOpacity={0.3} animationDuration={1500} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#6366F1]" /> Latest</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#E2E8F0]" /> First Week</span>
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-flat p-6">
          <h3 className="text-base font-bold text-[#0F172A] mb-4">Questions by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catData}><XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} /><YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} /><Tooltip />
              <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} animationDuration={1500} /></BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-flat p-6">
          <h3 className="text-base font-bold text-[#0F172A] mb-4">Session Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" animationDuration={1500}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            {pieData.map((d, i) => <span key={d.name} className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: COLORS[i] }} /> {d.name} ({d.value}%)</span>)}
          </div>
        </motion.div>
      </div>

      {/* Category Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-flat p-6">
          <h3 className="text-base font-bold text-[#10B981] mb-4">💪 Top Categories</h3>
          {[{ name: 'Behavioral', pct: 85 }, { name: 'HR', pct: 78 }, { name: 'Communication', pct: 75 }].map(c => (
            <div key={c.name} className="mb-3">
              <div className="flex justify-between text-sm mb-1"><span className="text-[#0F172A] font-medium">{c.name}</span><span className="text-[#10B981] font-semibold">{c.pct}%</span></div>
              <div className="progress-bar"><motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ type: 'spring', delay: 0.5 }} className="progress-fill" style={{ background: '#10B981' }} /></div>
            </div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card-flat p-6">
          <h3 className="text-base font-bold text-[#EF4444] mb-4">📝 Needs Improvement</h3>
          {[{ name: 'System Design', pct: 52 }, { name: 'DSA', pct: 48 }, { name: 'Domain Knowledge', pct: 45 }].map(c => (
            <div key={c.name} className="mb-3">
              <div className="flex justify-between text-sm mb-1"><span className="text-[#0F172A] font-medium">{c.name}</span><span className="text-[#EF4444] font-semibold">{c.pct}%</span></div>
              <div className="progress-bar"><motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ type: 'spring', delay: 0.6 }} className="progress-fill" style={{ background: '#EF4444' }} /></div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
