import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ResumeInterview() {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [skills, setSkills] = useState([]);
  const [gapData, setGapData] = useState([]);
  const [questions, setQuestions] = useState([]);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));

    setSkills(['React.js', 'Node.js', 'Python', 'AWS', 'PostgreSQL', 'Docker', 'TypeScript', 'Git']);
    setGapData([
      { skill: 'React', user: 85, required: 90 }, { skill: 'System Design', user: 40, required: 80 },
      { skill: 'DSA', user: 55, required: 85 }, { skill: 'Node.js', user: 75, required: 70 },
      { skill: 'AWS', user: 60, required: 75 }, { skill: 'Python', user: 70, required: 65 },
    ]);
    setQuestions([
      'Can you describe a project where you used React.js for a complex UI?',
      'How would you design the backend architecture for a real-time application?',
      'Walk me through your experience with AWS services you\'ve used.',
      'Tell me about a challenging bug you debugged in production.',
      'How do you approach optimizing database queries for performance?',
      'Describe your experience with Docker and containerization.',
      'What testing strategies do you follow in your projects?',
      'How do you handle state management in large React applications?',
      'Tell me about a time you had to learn a new technology quickly.',
      'What\'s your approach to code reviews and maintaining code quality?',
    ]);
    setAnalyzing(false);
    setAnalyzed(true);
  };

  const handleDragOver = (e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#6366F1'; };
  const handleDragLeave = (e) => { e.currentTarget.style.borderColor = '#E2E8F0'; };
  const handleDrop = (e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#E2E8F0'; /* Handle file drop */ };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-1">Resume Interview 📄</h1>
        <p className="text-[#475569] mb-8">Get personalized interview questions based on your resume</p>
      </motion.div>

      {!analyzed ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Upload Area */}
          <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            className="border-2 border-dashed border-[#E2E8F0] rounded-2xl p-12 text-center mb-6 hover:border-[#6366F1] transition-colors cursor-pointer">
            <span className="text-5xl block mb-4">📎</span>
            <p className="font-semibold text-[#0F172A] mb-1">Drag & drop your resume (PDF)</p>
            <p className="text-sm text-[#94A3B8]">or paste your resume text below</p>
          </div>

          <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)}
            className="input textarea mb-6" style={{ minHeight: '200px' }}
            placeholder="Paste your resume text here..." />

          <motion.button whileTap={{ scale: 0.97 }} onClick={handleAnalyze} disabled={!resumeText.trim() || analyzing}
            className="btn btn-primary btn-lg w-full disabled:opacity-50">
            {analyzing ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing your resume...
              </div>
            ) : 'Analyze Resume'}
          </motion.button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Skills Extracted */}
          <div className="card-flat p-6">
            <h3 className="text-base font-bold text-[#0F172A] mb-4">🔧 Skills Extracted</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => <span key={s} className="chip chip-active">{s}</span>)}
            </div>
          </div>

          {/* Gap Analysis */}
          <div className="card-flat p-6">
            <h3 className="text-base font-bold text-[#0F172A] mb-4">Skill Gap Analysis</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gapData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis type="category" dataKey="skill" tick={{ fontSize: 12, fill: '#475569' }} width={100} />
                <Tooltip />
                <Bar dataKey="user" fill="#6366F1" name="Your Skills" radius={[0, 4, 4, 0]} animationDuration={1500} />
                <Bar dataKey="required" fill="#E2E8F0" name="Required" radius={[0, 4, 4, 0]} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#6366F1]" /> Your Skills</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#E2E8F0]" /> Required Level</span>
            </div>
          </div>

          {/* Generated Questions */}
          <div className="card-flat p-6">
            <h3 className="text-base font-bold text-[#0F172A] mb-4">Personalized Questions ({questions.length})</h3>
            <div className="space-y-3">
              {questions.map((q, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3">
                  <span className="badge badge-primary flex-shrink-0">{i + 1}</span>
                  <p className="text-sm text-[#0F172A]">{q}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/interview-session', { state: { categories: ['Technical', 'Behavioral'], questionCount: 10, timerEnabled: true, timerMinutes: 3 } })}
            className="btn btn-primary btn-lg w-full">
            Start Resume-Based Interview 🚀
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
