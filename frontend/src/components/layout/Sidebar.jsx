import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Target, VenetianMask, Building, Trophy, Sparkles, BookOpen, TrendingUp, FileText, User, Settings, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../store/authSlice';
import { toggleMobileSidebar } from '../../store/uiSlice';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
  { path: '/question-bank', label: 'Question Bank', icon: <BookOpen size={20} /> },
  { path: '/mock-interview', label: 'Mock Interview', icon: <Target size={20} /> },
  { path: '/roleplay', label: 'Roleplay Mode', icon: <VenetianMask size={20} /> },
  { path: '/analytics', label: 'Analytics', icon: <TrendingUp size={20} /> },
  { path: '/company-prep', label: 'Company Prep', icon: <Building size={20} /> },
  { path: '/resume-interview', label: 'Resume Interview', icon: <FileText size={20} /> },
  { path: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={20} /> },
  { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
];

const sidebarVariants = {
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { x: -280, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mobileSidebarOpen } = useSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const closeSidebar = () => {
    if (mobileSidebarOpen) dispatch(toggleMobileSidebar());
  };

  const sidebarContent = (
    <div className="sidebar" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Logo */}
      <div className="px-5 mb-8 mt-2">
        <NavLink to="/dashboard" className="flex items-center gap-3 no-underline" onClick={closeSidebar}>
          <motion.img 
            src="/logo.png" 
            alt="Logo" 
            whileHover={{ scale: 1.05, rotate: 5 }} 
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="w-11 h-11 rounded-xl shadow-lg flex-shrink-0 object-cover border border-[rgba(255,255,255,0.1)]" 
            style={{ boxShadow: '0 4px 12px rgba(6,182,212,0.3)' }} 
          />
          <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Interview<span style={{ color: 'var(--aqua-400)' }}>AI</span>
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="px-3">
          <p className="px-4 mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Menu</p>
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-link rounded-xl mx-2 ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
                style={{ borderLeft: 'none' }}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                        style={{ background: 'var(--aqua-400)', boxShadow: '0 0 8px rgba(34,211,238,0.6)' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="flex-shrink-0 z-10" style={{ color: isActive ? 'var(--aqua-400)' : 'var(--text-secondary)' }}>{item.icon}</span>
                    <span className="min-w-0 truncate z-10" style={{ fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="px-5 pt-6 pb-4 mt-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all"
          style={{
            color: 'var(--danger-500)',
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.12)',
          }}
        >
          <LogOut size={18} />
          <span className="font-semibold">Log Out</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block relative z-40">{sidebarContent}</div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(3,9,18,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
              onClick={closeSidebar}
            />
            <motion.div
              variants={sidebarVariants} initial="closed" animate="open" exit="closed"
              className="lg:hidden z-50 fixed top-0 left-0 shadow-2xl shadow-black/50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
