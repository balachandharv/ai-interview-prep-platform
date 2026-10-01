import { motion } from 'framer-motion';
import { Construction, Sparkles, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10 text-center"
      >
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[rgba(6,182,212,0.08)] flex items-center justify-center text-[var(--aqua-400)] shadow-[0_0_30px_rgba(6,182,212,0.12)]">
            <Construction size={40} />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-4">Coming Soon</h1>
        <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
          We are currently working hard to bring this feature to you. 
          Stay tuned for updates as we continue to expand the InterviewAI platform!
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(-1)}
          className="btn btn-outline"
        >
          <ArrowLeft size={18} /> Go Back
        </motion.button>
      </motion.div>
    </div>
  );
}
