import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, FileText, UploadCloud, ChevronRight } from 'lucide-react';

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

  const handleDragOver = (e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--aqua-400)'; e.currentTarget.style.background = 'rgba(6,182,212,0.08)'; };
  const handleDragLeave = (e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(30,41,59,0.3)'; };
  const handleDrop = (e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(30,41,59,0.3)'; /* Handle file drop */ };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 relative z-10">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2 flex items-center gap-3">
          Resume Interview <FileText className="text-[var(--aqua-300)]" size={28} />
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">Get personalized interview questions based on your resume.</p>
      </motion.div>

      {!analyzed ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-3xl">
          {/* Upload Area */}
          <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            className="border-2 border-dashed border-[rgba(255,255,255,0.12)] bg-[rgba(30,41,59,0.3)] rounded-2xl p-12 text-center hover:border-[var(--aqua-400)] hover:bg-[rgba(129,140,248,0.05)] transition-all cursor-pointer group">
            <UploadCloud size={48} className="mx-auto mb-4 text-[var(--text-muted)] group-hover:text-[var(--aqua-400)] transition-colors" />
            <p className="font-bold text-[var(--text-primary)] text-lg">Drag & drop your resume (PDF)</p>
            <p className="text-[var(--text-secondary)] text-sm mt-2">or click to browse files</p>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[var(--glass-border)]"></div>
            <span className="px-4 text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">or paste text</span>
            <div className="flex-1 border-t border-[var(--glass-border)]"></div>
          </div>

          <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)}
            className="input textarea mb-8 w-full p-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl focus:bg-[var(--glass-bg-strong)] focus:border-[var(--aqua-400)] transition-all resize-y shadow-inner text-[var(--text-primary)]" style={{ minHeight: '200px' }}
            placeholder="Paste your resume text here..." />

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAnalyze} disabled={!resumeText.trim() || analyzing}
            className="btn btn-primary btn-lg w-full disabled:opacity-50">
            {analyzing ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing your resume...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles size={20} /> Analyze Resume
              </div>
            )}
          </motion.button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Extracted */}
            <div className="card-flat p-6 border-[rgba(6,182,212,0.12)] bg-[rgba(129,140,248,0.05)]">
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Sparkles className="text-[var(--aqua-400)]" size={18} /> Skills Extracted
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {skills.map(s => <span key={s} className="chip chip-active bg-[rgba(6,182,212,0.12)] border-[var(--aqua-400)] text-[var(--text-primary)] hover:bg-[rgba(6,182,212,0.25)]">{s}</span>)}
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="card-flat p-6">
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-6">Skill Gap Analysis</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={gapData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
                  <YAxis type="category" dataKey="skill" tick={{ fontSize: 12, fill: 'var(--glass-border)' }} width={100} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--glass-bg-strong)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                  <Bar dataKey="user" fill="var(--aqua-400)" name="Your Skills" radius={[0, 4, 4, 0]} animationDuration={1500} />
                  <Bar dataKey="required" fill="rgba(255,255,255,0.12)" name="Required" radius={[0, 4, 4, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4 text-xs font-semibold text-[var(--text-secondary)]">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[var(--aqua-400)]" /> Your Skills</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[rgba(255,255,255,0.12)]" /> Required Level</span>
              </div>
            </div>
          </div>

          {/* Generated Questions */}
          <div className="card-flat p-6">
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-6">Personalized Questions ({questions.length})</h3>
            <div className="space-y-4">
              {questions.map((q, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[rgba(148,163,184,0.05)] flex items-start gap-4 group hover:bg-[rgba(129,140,248,0.05)] hover:border-[rgba(6,182,212,0.12)] transition-colors">
                  <span className="w-8 h-8 rounded-lg bg-[rgba(6,182,212,0.08)] text-[var(--aqua-400)] flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-[var(--aqua-400)] group-hover:text-white transition-colors">{i + 1}</span>
                  <p className="text-sm font-medium text-[var(--glass-border)] leading-relaxed pt-1">{q}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/interview-session', { state: { categories: ['Technical', 'Behavioral'], questionCount: 10, timerEnabled: true, timerMinutes: 3 } })}
            className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2">
            Start Resume-Based Interview <ChevronRight size={20} />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
