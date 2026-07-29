import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPANIES } from '../constants/enums';

const companyDetails = {
  google: { overview: 'Google is known for its rigorous interview process focusing on algorithms, system design, and Googleyness.', rounds: ['Phone Screen', 'Technical Round 1', 'Technical Round 2', 'System Design', 'Behavioral (Googleyness & Leadership)'], topics: ['Algorithms', 'Data Structures', 'System Design', 'Problem Solving', 'Leadership'], difficulty: 'Hard', avgRounds: 5 },
  amazon: { overview: 'Amazon interviews focus heavily on Leadership Principles alongside technical skills.', rounds: ['Online Assessment', 'Phone Screen', 'Loop Round 1 (Technical)', 'Loop Round 2 (System Design)', 'Loop Round 3 (Leadership Principles)'], topics: ['Leadership Principles', 'System Design', 'OOP', 'Data Structures', 'Behavioral'], difficulty: 'Hard', avgRounds: 5 },
  microsoft: { overview: 'Microsoft interviews evaluate problem-solving ability, coding skills, and cultural fit.', rounds: ['Phone Screen', 'Technical Round 1', 'Technical Round 2', 'As-Appropriate Round'], topics: ['Algorithms', 'System Design', 'Coding', 'Problem Solving'], difficulty: 'Medium', avgRounds: 4 },
  meta: { overview: 'Meta interviews focus on coding efficiency, system design at scale, and behavioral competencies.', rounds: ['Recruiter Call', 'Technical Phone Screen', 'Onsite Coding', 'System Design'], topics: ['Coding', 'System Design', 'Behavioral', 'Product Sense'], difficulty: 'Hard', avgRounds: 4 },
  apple: { overview: 'Apple interviews focus on deep technical expertise and passion for building great products.', rounds: ['Phone Screen', 'Technical Round', 'Design Round', 'Hiring Manager Round'], topics: ['System Design', 'Algorithms', 'Product Thinking', 'Technical Depth'], difficulty: 'Hard', avgRounds: 4 },
  netflix: { overview: 'Netflix interviews emphasize culture fit, judgment, and technical excellence.', rounds: ['Recruiter Screen', 'Technical Round', 'Culture Fit Round'], topics: ['System Design', 'Culture', 'Technical Depth'], difficulty: 'Hard', avgRounds: 3 },
  flipkart: { overview: 'Flipkart interviews focus on data structures, algorithms, and system design for scale.', rounds: ['Online Coding Test', 'Technical Round 1', 'Technical Round 2', 'Hiring Manager Round'], topics: ['DSA', 'System Design', 'Problem Solving', 'LLD'], difficulty: 'Medium', avgRounds: 4 },
  goldman: { overview: 'Goldman Sachs interviews test analytical thinking, coding skills, and attention to detail.', rounds: ['HackerRank Test', 'Technical Round 1', 'Technical Round 2', 'HR Round'], topics: ['Algorithms', 'OOP', 'System Design', 'Puzzles'], difficulty: 'Medium', avgRounds: 4 },
};

export default function CompanyPrep() {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);

  const details = selectedCompany ? companyDetails[selectedCompany.id] : null;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-1">Company Prep</h1>
        <p className="text-[#475569] mb-8">Prepare for interviews at top tech companies</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {COMPANIES.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }} onClick={() => setSelectedCompany(c)}
            className={`p-6 rounded-2xl text-center cursor-pointer transition-all border-2 ${
              selectedCompany?.id === c.id ? 'border-[#6366F1] bg-[#EEF2FF]' : 'border-[#E2E8F0] bg-white hover:bg-[#EEF2FF]'
            }`}>
            <span className="text-4xl block mb-2">{c.logo}</span>
            <p className="font-semibold text-[#0F172A] text-sm">{c.name}</p>
            <p className="text-xs text-[#94A3B8]">{c.rounds} rounds</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {details && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Overview */}
            <div className="card-flat p-6">
              <h3 className="text-lg font-bold text-[#0F172A] mb-3">{selectedCompany.logo} {selectedCompany.name}</h3>
              <p className="text-[#475569] text-sm mb-4">{details.overview}</p>
              <div className="flex gap-3">
                <span className="badge badge-primary">Difficulty: {details.difficulty}</span>
                <span className="badge badge-secondary">{details.avgRounds} Rounds</span>
              </div>
            </div>

            {/* Interview Process */}
            <div className="card-flat p-6">
              <h3 className="text-base font-bold text-[#0F172A] mb-4">Interview Process</h3>
              <div className="space-y-3">
                {details.rounds.map((round, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-sm font-bold">{i + 1}</div>
                      {i < details.rounds.length - 1 && <div className="w-0.5 h-8 bg-[#E2E8F0]" />}
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-[#F8FAFC]">
                      <p className="text-sm font-semibold text-[#0F172A]">{round}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div className="card-flat p-6">
              <h3 className="text-base font-bold text-[#0F172A] mb-4">Common Topics</h3>
              <div className="flex flex-wrap gap-2">
                {details.topics.map(t => <span key={t} className="chip chip-active">{t}</span>)}
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/mock-interview', { state: { company: selectedCompany.id } })}
              className="btn btn-primary btn-lg w-full">
              Start {selectedCompany.name} Mock Interview
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
