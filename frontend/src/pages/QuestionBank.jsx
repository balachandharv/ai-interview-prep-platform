import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateMockQuestions } from '../utils/helpers';
import { CATEGORIES, DIFFICULTIES } from '../constants/enums';
import AOS from 'aos';

export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  useEffect(() => { AOS.init({ duration: 600, once: true }); setQuestions(generateMockQuestions()); }, []);

  const filtered = questions.filter(q => {
    if (search && !q.text.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter && q.category !== categoryFilter) return false;
    if (difficultyFilter && q.difficulty !== difficultyFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const diffColors = { Easy: { bg: '#ECFDF5', text: '#10B981' }, Medium: { bg: '#FFFBEB', text: '#F59E0B' }, Hard: { bg: '#FEF2F2', text: '#EF4444' } };

  const toggleBookmark = (id) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, bookmarked: !q.bookmarked } : q));
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-1">Question Bank 📚</h1>
        <p className="text-[#475569] mb-6">Browse and practice from our curated collection</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="input pl-12" style={{ background: '#F1F5F9' }}
            placeholder="Search questions..."
          />
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => { setCategoryFilter(''); setCurrentPage(1); }} className={`chip ${!categoryFilter ? 'chip-active' : ''}`}>All</button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => { setCategoryFilter(c); setCurrentPage(1); }} className={`chip ${categoryFilter === c ? 'chip-active' : ''}`}>{c}</button>
        ))}
        <span className="hidden md:inline mx-2 text-[#E2E8F0]">|</span>
        {DIFFICULTIES.map(d => (
          <button key={d} onClick={() => { setDifficultyFilter(difficultyFilter === d ? '' : d); setCurrentPage(1); }} className={`chip ${difficultyFilter === d ? 'chip-active' : ''}`}>{d}</button>
        ))}
      </motion.div>

      {/* Questions */}
      <div className="space-y-4">
        {paginated.map((q, i) => (
          <motion.div
            key={q.id}
            data-aos="fade-up" data-aos-delay={i * 50}
            className="card-flat cursor-pointer"
            onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge" style={{ background: diffColors[q.difficulty]?.bg, color: diffColors[q.difficulty]?.text }}>{q.difficulty}</span>
                  <span className="badge badge-primary">{q.category}</span>
                  {q.company && <span className="text-xs text-[#94A3B8]">• {q.company}</span>}
                  {q.masteryCount >= 3 && <span className="badge" style={{ background: '#EEF2FF', color: '#6366F1' }}>Mastered</span>}
                </div>
                <p className="text-[#0F172A] font-medium">{q.text}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={(e) => { e.stopPropagation(); toggleBookmark(q.id); }}
                className="bg-transparent border-none cursor-pointer text-xl p-1"
              >
                <motion.span animate={{ rotateY: q.bookmarked ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
                  {q.bookmarked ? '🔖' : '🏷️'}
                </motion.span>
              </motion.button>
            </div>

            {expandedId === q.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-[#E2E8F0]"
              >
                <p className="text-sm font-semibold text-[#0F172A] mb-2">Model Answer:</p>
                <p className="text-sm text-[#475569] leading-relaxed">{q.modelAnswer}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {q.keyPoints.map((kp, ki) => (
                    <span key={ki} className="text-xs px-2 py-1 rounded-lg bg-[#ECFDF5] text-[#10B981]">✓ {kp}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i} onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all cursor-pointer border-none ${
                currentPage === i + 1 ? 'bg-[#6366F1] text-white' : 'bg-white text-[#475569] hover:bg-[#EEF2FF]'
              }`}
            >{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
