import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#testimonials', label: 'Testimonials' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      fontFamily: 'Inter, sans-serif',
      background: scrolled || menuOpen ? 'rgba(11,15,26,0.85)' : 'transparent',
      backdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(148,163,184,0.08)' : '1px solid transparent',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #818CF8, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(129,140,248,0.3)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F1F5F9' }}>
            Interview<span style={{ color: '#818CF8' }}>AI</span>
          </span>
        </Link>

        <div className="desktop-nav-links" style={{ alignItems: 'center', gap: '32px' }}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="nav-link" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{link.label}</a>
          ))}
        </div>

        <div className="desktop-nav-cta" style={{ alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/dashboard')} className="btn btn-primary">Dashboard</motion.button>
          ) : (
            <>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/login')} className="btn btn-ghost" style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Log In</motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/register')} className="btn btn-primary" style={{ fontSize: '0.875rem' }}>Get Started</motion.button>
            </>
          )}
        </div>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <motion.span animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} style={{ display: 'block', width: '22px', height: '2px', background: '#F1F5F9', borderRadius: '9999px' }} />
          <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.3 }} style={{ display: 'block', width: '22px', height: '2px', background: '#F1F5F9', borderRadius: '9999px' }} />
          <motion.span animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} style={{ display: 'block', width: '22px', height: '2px', background: '#F1F5F9', borderRadius: '9999px' }} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="mobile-menu-dropdown" style={{ overflow: 'hidden', background: 'rgba(11,15,26,0.95)', borderTop: '1px solid rgba(148,163,184,0.08)' }}>
            <div style={{ padding: '16px' }}>
              {navLinks.map(link => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                  style={{ display: 'block', padding: '12px 16px', color: '#94A3B8', borderRadius: '12px', fontSize: '1rem', fontWeight: 500, textDecoration: 'none' }}>{link.label}</a>
              ))}
              <hr style={{ border: 'none', borderTop: '1px solid rgba(148,163,184,0.08)', margin: '12px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => { navigate('/login'); setMenuOpen(false); }} className="btn btn-outline" style={{ width: '100%' }}>Log In</button>
                <button onClick={() => { navigate('/register'); setMenuOpen(false); }} className="btn btn-primary" style={{ width: '100%' }}>Get Started</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
