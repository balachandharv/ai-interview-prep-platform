import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROLEPLAY_PERSONAS } from '../constants/enums';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const diffBadge = { Easy: '#10B981', Medium: '#F59E0B', Hard: '#EF4444' };

export default function RoleplayMode() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [companyMode, setCompanyMode] = useState(false);

  const handleStart = () => {
    if (!selected) return;
    navigate('/roleplay-session', { state: { persona: selected, companyMode } });
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-1">Roleplay Mode</h1>
        <p className="text-[#475569] mb-8">Choose your AI interviewer and start a realistic interview experience</p>
      </motion.div>

      {/* Company Mode Toggle */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-[#F5F3FF] border border-[#8B5CF6]/20">
        <div className={`toggle ${companyMode ? 'active' : ''}`} onClick={() => setCompanyMode(!companyMode)} style={{ '--toggle-color': '#8B5CF6' }} />
        <div>
          <p className="text-sm font-semibold text-[#0F172A]">Company Mode</p>
          <p className="text-xs text-[#94A3B8]">Simulate full multi-round interview process</p>
        </div>
      </motion.div>

      {/* Persona Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {ROLEPLAY_PERSONAS.map((persona) => (
          <motion.div
            key={persona.id}
            variants={item}
            whileHover={{ y: -4 }}
            onClick={() => setSelected(persona)}
            className={`relative p-5 rounded-2xl cursor-pointer transition-all border-2 bg-white ${
              selected?.id === persona.id
                ? 'border-[#6366F1] shadow-lg shadow-[#6366F1]/10'
                : 'border-[#E2E8F0] hover:border-[#6366F1]/50'
            }`}
          >
            {selected?.id === persona.id && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 bg-[#6366F1] rounded-full flex items-center justify-center text-white text-xs">✓</motion.div>
            )}
            <div className="text-4xl mb-3">{persona.avatar}</div>
            <h3 className="text-base font-bold text-[#0F172A]">{persona.name}</h3>
            <p className="text-xs text-[#475569] mb-3">{persona.role} at {persona.company}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="badge badge-primary text-[10px]">{persona.style}</span>
              <span className="badge text-[10px]" style={{ background: diffBadge[persona.difficulty] + '15', color: diffBadge[persona.difficulty] }}>{persona.difficulty}</span>
              <span className="text-[10px] text-[#94A3B8]">⏱️ {persona.duration}</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">{persona.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Start Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleStart}
        disabled={!selected}
        className="btn btn-primary btn-lg w-full max-w-md mx-auto block disabled:opacity-50"
      >
        {selected ? `Start Interview with ${selected.name}` : 'Select an interviewer to begin'}
      </motion.button>
    </div>
  );
}
