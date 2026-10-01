import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10 text-center"
      >
        <div className="mb-6 relative inline-block">
          <span className="text-[120px] font-extrabold leading-none tracking-tighter" style={{ background: 'linear-gradient(135deg, var(--aqua-400), #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            404
          </span>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[var(--aqua-400)] filter blur-3xl opacity-20 -z-10" />
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Page Not Found</h1>
        <p className="text-[var(--text-secondary)] mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="btn btn-outline w-full sm:w-auto"
          >
            <ArrowLeft size={18} /> Go Back
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="btn btn-primary w-full sm:w-auto"
          >
            <Home size={18} /> Back to Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
