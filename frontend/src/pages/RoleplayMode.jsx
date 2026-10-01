import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { roleplayAPI } from '../services/api';
import { ROLEPLAY_PERSONAS } from '../constants/enums';
import { Loader, Clock } from 'lucide-react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const diffBadge = { Easy: 'var(--emerald-500)', Medium: '#F59E42', Hard: '#EF4444' };

// Styled initials for professional avatar rendering
const AVATAR_MAP = {
  'Priya Sharma': 'PS',
  'David Chen': 'DC',
  'Sarah Johnson': 'SJ',
  'Rahul Gupta': 'RG',
  'Jennifer Lee': 'JL',
  'Michael Brown': 'MB',
  'Anjali Verma': 'AV',
  'James Wilson': 'JW',
};

const COLOR_MAP = {
  'Priya Sharma': '#4285F4',
  'David Chen': '#FF9900',
  'Sarah Johnson': '#00A4EF',
  'Rahul Gupta': 'var(--aqua-500)',
  'Jennifer Lee': '#6D9EEB',
  'Michael Brown': '#0668E1',
  'Anjali Verma': '#F7CB0A',
  'James Wilson': '#004B8D',
};

export default function RoleplayMode() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [companyMode, setCompanyMode] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch personas from backend to get real database UUIDs
  useEffect(() => {
    roleplayAPI.getPersonas()
      .then((res) => {
        const backendPersonas = res.data.map((p) => ({
          id: p.id,               // Real DB UUID
          backendId: p.id,        // Same — this IS the real ID now
          name: p.name,
          role: p.role,
          company: p.company,
          style: p.style,
          difficulty: p.difficulty,
          duration: p.duration,
          avatar: AVATAR_MAP[p.name] || p.name.split(' ').map(w => w[0]).join(''),
          color: COLOR_MAP[p.name] || 'var(--aqua-500)',
          description: `${p.style} interview at ${p.company}. Difficulty: ${p.difficulty}.`,
        }));
        setPersonas(backendPersonas);
      })
      .catch((err) => {
        console.warn('Failed to fetch personas from backend, using fallback:', err);
        setPersonas(ROLEPLAY_PERSONAS);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStart = () => {
    if (!selected) return;
    navigate('/roleplay-session', { state: { persona: selected, companyMode } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={32} className="animate-spin text-[var(--aqua-400)]" />
        <span className="ml-3 text-[var(--text-secondary)] font-medium">Loading interviewers...</span>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-1">Roleplay Mode</h1>
        <p className="text-[var(--text-secondary)] mb-8">Choose your AI interviewer and start a realistic interview experience</p>
      </motion.div>

      {/* Company Mode Toggle */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-[#F5F3FF] border border-[var(--blue-500)]/20">
        <div className={`toggle ${companyMode ? 'active' : ''}`} onClick={() => setCompanyMode(!companyMode)} style={{ '--toggle-color': 'var(--blue-500)' }} />
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Company Mode</p>
          <p className="text-xs text-[var(--text-secondary)]">Simulate full multi-round interview process</p>
        </div>
      </motion.div>

      {/* Persona Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {personas.map((persona) => (
          <motion.div
            key={persona.id}
            variants={item}
            whileHover={{ y: -4 }}
            onClick={() => setSelected(persona)}
            className={`relative p-5 rounded-2xl cursor-pointer transition-all border-2 bg-[var(--glass-bg)] ${
              selected?.id === persona.id
                ? 'border-[#3B82F6] shadow-lg shadow-[#3B82F6]/10'
                : 'border-[var(--glass-border)] hover:border-[#3B82F6]/50'
            }`}
          >
            {selected?.id === persona.id && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center text-white text-xs">✓</motion.div>
            )}
            <div className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${persona.color}, ${persona.color}CC)` }}>{persona.avatar}</div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">{persona.name}</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-3">{persona.role} at {persona.company}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="badge badge-primary text-[10px]">{persona.style}</span>
              <span className="badge text-[10px]" style={{ background: diffBadge[persona.difficulty] + '15', color: diffBadge[persona.difficulty] }}>{persona.difficulty}</span>
              <span className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1"><Clock size={10} /> {persona.duration}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{persona.description}</p>
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
