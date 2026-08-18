import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES, DIFFICULTIES } from '../constants/enums';
import { Settings, Play, Sliders, Clock, Hash, Zap } from 'lucide-react';

export default function MockInterview() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    categories: [],
    difficulty: 'Medium',
    questionCount: 5,
    timerEnabled: true,
    timerMinutes: 3,
  });

  const toggleCategory = (cat) => {
    setConfig(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleStart = () => {
    navigate('/interview-session', { state: config });
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 relative z-10">
        <h1 className="text-3xl font-extrabold text-[#F1F5F9] mb-2 flex items-center gap-3">
          Mock Interview Setup <Settings className="text-[#818CF8]" size={28} />
        </h1>
        <p className="text-[#94A3B8] text-lg">Customize your practice session for maximum impact.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Categories */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-flat p-6">
            <h3 className="text-lg font-bold text-[#F1F5F9] mb-4 flex items-center gap-2"><Sliders size={20} className="text-[#818CF8]" /> Select Categories</h3>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map(cat => (
                <motion.button
                  key={cat} whileTap={{ scale: 0.95 }}
                  onClick={() => toggleCategory(cat)}
                  className={`chip cursor-pointer transition-all ${config.categories.includes(cat) ? 'bg-[#818CF8] text-white border-[#818CF8] shadow-[0_4px_12px_rgba(129,140,248,0.4)]' : 'bg-[rgba(30,41,59,0.5)] text-[#94A3B8] border-[rgba(148,163,184,0.1)] hover:border-[rgba(129,140,248,0.3)] hover:text-[#E2E8F0]'}`}
                >{cat}</motion.button>
              ))}
            </div>
            {config.categories.length === 0 && <p className="text-xs text-[#64748B] mt-3 italic">Leave empty to include all categories randomly</p>}
          </motion.div>

          {/* Difficulty */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-flat p-6">
            <h3 className="text-lg font-bold text-[#F1F5F9] mb-4 flex items-center gap-2"><Zap size={20} className="text-[#A78BFA]" /> Difficulty Level</h3>
            <div className="flex flex-wrap gap-3">
              {DIFFICULTIES.map(d => (
                <motion.button
                  key={d} whileTap={{ scale: 0.95 }}
                  onClick={() => setConfig(prev => ({ ...prev, difficulty: d }))}
                  className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm cursor-pointer transition-all ${
                    config.difficulty === d
                      ? 'border-[#818CF8] bg-[rgba(129,140,248,0.15)] text-[#818CF8] shadow-[0_0_15px_rgba(129,140,248,0.2)]'
                      : 'border-[rgba(148,163,184,0.1)] bg-[rgba(30,41,59,0.3)] text-[#94A3B8] hover:border-[rgba(129,140,248,0.3)] hover:text-[#E2E8F0]'
                  }`}
                >{d}</motion.button>
              ))}
            </div>
          </motion.div>

          {/* Question Count */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-flat p-6">
            <h3 className="text-lg font-bold text-[#F1F5F9] mb-4 flex items-center gap-2"><Hash size={20} className="text-[#34D399]" /> Number of Questions</h3>
            <div className="flex items-center gap-6 bg-[rgba(30,41,59,0.3)] p-4 rounded-xl border border-[rgba(148,163,184,0.05)]">
              <input
                type="range" min="3" max="15" value={config.questionCount}
                onChange={(e) => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                className="flex-1 accent-[#818CF8]"
              />
              <span className="text-2xl font-bold text-[#818CF8] w-12 text-center drop-shadow-md">{config.questionCount}</span>
            </div>
          </motion.div>

          {/* Timer */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-flat p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#F1F5F9] flex items-center gap-2"><Clock size={20} className="text-[#FBBF24]" /> Timer per Question</h3>
              <div
                className={`toggle ${config.timerEnabled ? 'bg-[#818CF8]' : 'bg-[rgba(148,163,184,0.2)]'} relative w-12 h-6 rounded-full cursor-pointer transition-colors`}
                onClick={() => setConfig(prev => ({ ...prev, timerEnabled: !prev.timerEnabled }))}
              >
                <motion.div className="w-4 h-4 rounded-full bg-white absolute top-1 shadow-sm" animate={{ left: config.timerEnabled ? '26px' : '4px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
              </div>
            </div>
            
            <AnimatePresence>
              {config.timerEnabled && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap items-center gap-3">
                  {[2, 3, 5, 7].map(m => (
                    <motion.button
                      key={m} whileTap={{ scale: 0.95 }}
                      onClick={() => setConfig(prev => ({ ...prev, timerMinutes: m }))}
                      className={`px-5 py-2.5 rounded-xl border font-bold text-sm cursor-pointer transition-all ${
                        config.timerMinutes === m
                          ? 'border-[#818CF8] bg-[#818CF8] text-white shadow-[0_4px_12px_rgba(129,140,248,0.4)]'
                          : 'border-[rgba(148,163,184,0.1)] bg-[rgba(30,41,59,0.3)] text-[#94A3B8] hover:border-[rgba(129,140,248,0.3)] hover:text-[#E2E8F0]'
                      }`}
                    >{m} min</motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Preview Panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-1">
          <div className="card-flat p-6 sticky top-24 border-[rgba(129,140,248,0.2)] bg-[rgba(15,23,42,0.6)] shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#818CF8] opacity-10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <h3 className="text-xl font-bold text-[#F1F5F9] mb-6">Session Preview</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-2 border-b border-[rgba(148,163,184,0.05)]">
                <span className="text-sm font-medium text-[#64748B]">Categories</span>
                <span className="text-sm font-bold text-[#E2E8F0] max-w-[150px] truncate text-right">
                  {config.categories.length ? config.categories.join(', ') : 'All'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(148,163,184,0.05)]">
                <span className="text-sm font-medium text-[#64748B]">Difficulty</span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded ${config.difficulty === 'Easy' ? 'text-[#34D399] bg-[rgba(52,211,153,0.1)]' : config.difficulty === 'Medium' ? 'text-[#FBBF24] bg-[rgba(251,191,36,0.1)]' : 'text-[#FB7185] bg-[rgba(251,113,133,0.1)]'}`}>
                  {config.difficulty}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(148,163,184,0.05)]">
                <span className="text-sm font-medium text-[#64748B]">Questions</span>
                <span className="text-sm font-bold text-[#E2E8F0]">{config.questionCount}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(148,163,184,0.05)]">
                <span className="text-sm font-medium text-[#64748B]">Timer</span>
                <span className="text-sm font-bold text-[#E2E8F0]">
                  {config.timerEnabled ? `${config.timerMinutes}m / q` : <span className="text-[#94A3B8] italic">Off</span>}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-[#64748B]">Est. Duration</span>
                <span className="text-sm font-bold text-[#818CF8]">
                  {config.timerEnabled ? `~${config.questionCount * config.timerMinutes} mins` : 'Untimed'}
                </span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={handleStart}
              className="btn btn-primary w-full btn-lg flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(129,140,248,0.4)] hover:shadow-[0_12px_32px_rgba(129,140,248,0.6)]"
            >
              Start Interview <Play fill="currentColor" size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
