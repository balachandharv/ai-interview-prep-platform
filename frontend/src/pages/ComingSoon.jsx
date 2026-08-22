import { motion } from 'framer-motion';
import { Construction, Sparkles, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0B0F1A', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Animated Orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'orb-move-1 20s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'orb-move-2 25s ease-in-out infinite', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10 text-center"
      >
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[rgba(129,140,248,0.1)] flex items-center justify-center text-[#818CF8] shadow-[0_0_30px_rgba(129,140,248,0.2)]">
            <Construction size={40} />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-[#F1F5F9] mb-4">Coming Soon</h1>
        <p className="text-[#94A3B8] mb-8 leading-relaxed">
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
