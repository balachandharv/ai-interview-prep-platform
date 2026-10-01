import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { generateMockQuestions } from '../utils/helpers';
import { CATEGORIES, DIFFICULTIES } from '../constants/enums';
import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import AOS from 'aos';

export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    setQuestions(generateMockQuestions());
    
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearch(q);
  }, [location.search]);

  const filtered = questions.filter(q => {
    if (search && !q.text.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter && q.category !== categoryFilter) return false;
    if (difficultyFilter && q.difficulty !== difficultyFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const diffColors = { Easy: { bg: 'rgba(16,185,129,0.10)', text: 'var(--emerald-500)' }, Medium: { bg: 'rgba(245,158,11,0.10)', text: 'var(--amber-500)' }, Hard: { bg: 'rgba(239,68,68,0.10)', text: '#EF4444' } };

  const toggleBookmark = (id) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, bookmarked: !q.bookmarked } : q));
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-white mb-1">Question Bank</h1>
        <p className="text-[var(--text-secondary)] mb-6">Browse and practice from our curated collection</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-[var(--text-secondary)] group-focus-within:text-[var(--aqua-400)]" size={18} />
          <input
            type="text" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-[rgba(15,23,42,0.6)] border border-[var(--glass-border)] rounded-2xl py-3 pl-11 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--aqua-400)] focus:bg-[rgba(30,41,59,0.9)] transition-all placeholder-[var(--text-muted)] shadow-inner"
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
        <span className="hidden md:inline mx-2 text-[var(--glass-border)]">|</span>
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
                  {q.company && <span className="text-xs text-[var(--text-secondary)]">• {q.company}</span>}
                  {q.masteryCount >= 3 && <span className="badge" style={{ background: 'rgba(6,182,212,0.10)', color: 'var(--aqua-500)' }}>Mastered</span>}
                </div>
                <p className="text-white font-medium">{q.text}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={(e) => { e.stopPropagation(); toggleBookmark(q.id); }}
                className="bg-transparent border-none cursor-pointer text-xl p-1"
              >
                <motion.span animate={{ rotateY: q.bookmarked ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
                  {q.bookmarked ? <BookmarkCheck size={18} className="text-[var(--aqua-400)]" /> : <Bookmark size={18} className="text-[var(--text-secondary)]" />}
                </motion.span>
              </motion.button>
            </div>

            {expandedId === q.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-[#334155]"
              >
                <p className="text-sm font-semibold text-white mb-2">Model Answer:</p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{q.modelAnswer}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {q.keyPoints.map((kp, ki) => (
                    <span key={ki} className="text-xs px-2 py-1 rounded-lg bg-[rgba(16,185,129,0.15)] text-[var(--emerald-500)]">✓ {kp}</span>
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
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.06)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Prev
          </button>

          <div className="flex items-center gap-1">
            {(() => {
              const pages = [];
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                if (currentPage <= 4) {
                  pages.push(1, 2, 3, 4, 5, '...', totalPages);
                } else if (currentPage >= totalPages - 3) {
                  pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                } else {
                  pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                }
              }

              return pages.map((page, i) => (
                page === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-[var(--text-secondary)] font-medium">...</span>
                ) : (
                  <button
                    key={i} onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all cursor-pointer border-none ${
                      currentPage === page ? 'bg-[var(--aqua-500)] text-white shadow-md shadow-[var(--aqua-500)]/20' : 'bg-transparent text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.06)]'
                    }`}
                  >{page}</button>
                )
              ));
            })()}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.06)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
