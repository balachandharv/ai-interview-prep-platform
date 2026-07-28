import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES, DIFFICULTIES } from '../constants/enums';

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
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-1">Mock Interview Setup 🎯</h1>
        <p className="text-[#475569] mb-8">Customize your practice session</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Categories */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-flat p-6">
            <h3 className="text-lg font-bold text-[#0F172A] mb-4">Select Categories</h3>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map(cat => (
                <motion.button
                  key={cat} whileTap={{ scale: 0.95 }}
                  onClick={() => toggleCategory(cat)}
                  className={`chip ${config.categories.includes(cat) ? 'chip-active' : ''}`}
                >{cat}</motion.button>
              ))}
            </div>
            {config.categories.length === 0 && <p className="text-xs text-[#94A3B8] mt-2">Leave empty for all categories</p>}
          </motion.div>

          {/* Difficulty */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-flat p-6">
            <h3 className="text-lg font-bold text-[#0F172A] mb-4">Difficulty Level</h3>
            <div className="flex gap-3">
              {DIFFICULTIES.map(d => (
                <motion.button
                  key={d} whileTap={{ scale: 0.95 }}
                  onClick={() => setConfig(prev => ({ ...prev, difficulty: d }))}
                  className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm cursor-pointer transition-all ${
                    config.difficulty === d
                      ? 'border-[#6366F1] bg-[#EEF2FF] text-[#6366F1]'
                      : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-[#6366F1]/50'
                  }`}
                >{d}</motion.button>
              ))}
            </div>
          </motion.div>

          {/* Question Count */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-flat p-6">
            <h3 className="text-lg font-bold text-[#0F172A] mb-4">Number of Questions</h3>
            <div className="flex items-center gap-4">
              <input
                type="range" min="3" max="15" value={config.questionCount}
                onChange={(e) => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                className="flex-1 accent-[#6366F1]"
              />
              <span className="text-2xl font-bold text-[#6366F1] w-12 text-center">{config.questionCount}</span>
            </div>
          </motion.div>

          {/* Timer */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-flat p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0F172A]">Timer per Question</h3>
              <div
                className={`toggle ${config.timerEnabled ? 'active' : ''}`}
                onClick={() => setConfig(prev => ({ ...prev, timerEnabled: !prev.timerEnabled }))}
              />
            </div>
            {config.timerEnabled && (
              <div className="flex items-center gap-4">
                {[2, 3, 5, 7].map(m => (
                  <motion.button
                    key={m} whileTap={{ scale: 0.95 }}
                    onClick={() => setConfig(prev => ({ ...prev, timerMinutes: m }))}
                    className={`px-4 py-2 rounded-lg border font-semibold text-sm cursor-pointer transition-all ${
                      config.timerMinutes === m
                        ? 'border-[#6366F1] bg-[#EEF2FF] text-[#6366F1]'
                        : 'border-[#E2E8F0] text-[#475569]'
                    }`}
                  >{m} min</motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Preview Panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-1">
          <div className="card-flat p-6 sticky top-20">
            <h3 className="text-lg font-bold text-[#0F172A] mb-6">Session Preview</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-[#94A3B8]">Categories</span>
                <span className="text-sm font-semibold text-[#0F172A]">
                  {config.categories.length ? config.categories.join(', ') : 'All'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#94A3B8]">Difficulty</span>
                <span className="text-sm font-semibold text-[#0F172A]">{config.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#94A3B8]">Questions</span>
                <span className="text-sm font-semibold text-[#0F172A]">{config.questionCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#94A3B8]">Timer</span>
                <span className="text-sm font-semibold text-[#0F172A]">
                  {config.timerEnabled ? `${config.timerMinutes} min/question` : 'Off'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#94A3B8]">Est. Duration</span>
                <span className="text-sm font-semibold text-[#0F172A]">
                  {config.timerEnabled ? `~${config.questionCount * config.timerMinutes} min` : 'Untimed'}
                </span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleStart}
              className="btn btn-primary w-full btn-lg"
            >
              Start Interview 🚀
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
