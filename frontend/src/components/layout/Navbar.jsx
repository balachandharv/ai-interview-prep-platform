import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E2E8F0]'
          : 'bg-transparent'
      }`}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-9 h-9 rounded-xl bg-[#6366F1] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[#0F172A]">
            Interview<span className="text-[#6366F1]">AI</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[#475569] hover:text-[#6366F1] transition-colors text-sm font-medium no-underline">
            Features
          </a>
          <a href="#how-it-works" className="text-[#475569] hover:text-[#6366F1] transition-colors text-sm font-medium no-underline">
            How It Works
          </a>
          <a href="#testimonials" className="text-[#475569] hover:text-[#6366F1] transition-colors text-sm font-medium no-underline">
            Testimonials
          </a>
          <a href="#pricing" className="text-[#475569] hover:text-[#6366F1] transition-colors text-sm font-medium no-underline">
            Pricing
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              Dashboard
            </motion.button>
          ) : (
            <>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/login')}
                className="btn btn-ghost text-sm"
              >
                Log In
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/register')}
                className="btn btn-primary text-sm"
              >
                Get Started Free
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
