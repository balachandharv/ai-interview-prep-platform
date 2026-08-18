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

  const handleDragOver = (e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#818CF8'; e.currentTarget.style.background = 'rgba(129,140,248,0.1)'; };
  const handleDragLeave = (e) => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'; e.currentTarget.style.background = 'rgba(30,41,59,0.3)'; };
  const handleDrop = (e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'; e.currentTarget.style.background = 'rgba(30,41,59,0.3)'; /* Handle file drop */ };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 relative z-10">
        <h1 className="text-3xl font-extrabold text-[#F1F5F9] mb-2 flex items-center gap-3">
          Resume Interview <FileText className="text-[#A78BFA]" size={28} />
        </h1>
        <p className="text-[#94A3B8] text-lg">Get personalized interview questions based on your resume.</p>
      </motion.div>

      {!analyzed ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-3xl">
          {/* Upload Area */}
          <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            className="border-2 border-dashed border-[rgba(148,163,184,0.2)] bg-[rgba(30,41,59,0.3)] rounded-2xl p-12 text-center hover:border-[#818CF8] hover:bg-[rgba(129,140,248,0.05)] transition-all cursor-pointer group">
            <UploadCloud size={48} className="mx-auto mb-4 text-[#64748B] group-hover:text-[#818CF8] transition-colors" />
            <p className="font-bold text-[#F1F5F9] text-lg">Drag & drop your resume (PDF)</p>
            <p className="text-[#94A3B8] text-sm mt-2">or click to browse files</p>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[rgba(148,163,184,0.1)]"></div>
            <span className="px-4 text-xs text-[#64748B] font-bold uppercase tracking-wider">or paste text</span>
            <div className="flex-1 border-t border-[rgba(148,163,184,0.1)]"></div>
          </div>

          <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)}
            className="input textarea mb-8 w-full p-4 bg-[rgba(30,41,59,0.4)] border border-[rgba(148,163,184,0.1)] rounded-xl focus:bg-[rgba(30,41,59,0.6)] focus:border-[#818CF8] transition-all resize-y shadow-inner text-[#F1F5F9]" style={{ minHeight: '200px' }}
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
            <div className="card-flat p-6 border-[rgba(129,140,248,0.2)] bg-[rgba(129,140,248,0.05)]">
              <h3 className="text-base font-bold text-[#F1F5F9] mb-4 flex items-center gap-2">
                <Sparkles className="text-[#818CF8]" size={18} /> Skills Extracted
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {skills.map(s => <span key={s} className="chip chip-active bg-[rgba(129,140,248,0.2)] border-[#818CF8] text-[#F1F5F9] hover:bg-[rgba(129,140,248,0.4)]">{s}</span>)}
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="card-flat p-6">
              <h3 className="text-base font-bold text-[#F1F5F9] mb-6">📊 Skill Gap Analysis</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={gapData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis type="category" dataKey="skill" tick={{ fontSize: 12, fill: '#E2E8F0' }} width={100} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'rgba(17,24,39,0.9)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px', color: '#F1F5F9' }} />
                  <Bar dataKey="user" fill="#818CF8" name="Your Skills" radius={[0, 4, 4, 0]} animationDuration={1500} />
                  <Bar dataKey="required" fill="rgba(148,163,184,0.2)" name="Required" radius={[0, 4, 4, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4 text-xs font-semibold text-[#94A3B8]">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#818CF8]" /> Your Skills</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[rgba(148,163,184,0.2)]" /> Required Level</span>
              </div>
            </div>
          </div>

          {/* Generated Questions */}
          <div className="card-flat p-6">
            <h3 className="text-base font-bold text-[#F1F5F9] mb-6">💬 Personalized Questions ({questions.length})</h3>
            <div className="space-y-4">
              {questions.map((q, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-[rgba(30,41,59,0.4)] border border-[rgba(148,163,184,0.05)] flex items-start gap-4 group hover:bg-[rgba(129,140,248,0.05)] hover:border-[rgba(129,140,248,0.2)] transition-colors">
                  <span className="w-8 h-8 rounded-lg bg-[rgba(129,140,248,0.1)] text-[#818CF8] flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-[#818CF8] group-hover:text-white transition-colors">{i + 1}</span>
                  <p className="text-sm font-medium text-[#E2E8F0] leading-relaxed pt-1">{q}</p>
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
