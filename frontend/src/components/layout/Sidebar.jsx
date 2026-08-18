import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Target, VenetianMask, Building, Trophy, Sparkles } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../store/authSlice';
import { toggleMobileSidebar } from '../../store/uiSlice';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
  { path: '/question-bank', label: 'Question Bank', icon: '📚' },
  { path: '/mock-interview', label: 'Mock Interview', icon: <Target size={20} /> },
  { path: '/roleplay', label: 'Roleplay Mode', icon: <VenetianMask size={20} /> },
  { path: '/analytics', label: 'Analytics', icon: '📈' },
  { path: '/company-prep', label: 'Company Prep', icon: <Building size={20} /> },
  { path: '/resume-interview', label: 'Resume Interview', icon: '📄' },
  { path: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={20} /> },
  { path: '/profile', label: 'Profile', icon: '👤' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
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
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }} className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg, #818CF8, #6366F1)', boxShadow: '0 4px 12px rgba(129,140,248,0.3)' }}>
            <Sparkles size={20} color="white" />
          </motion.div>
          <span className="text-xl font-bold text-[#F1F5F9]">
            Interview<span style={{ color: '#818CF8' }}>AI</span>
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="px-3">
          <p className="px-4 mb-3 text-xs font-bold text-[#64748B] uppercase tracking-widest">Menu</p>
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
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#818CF8] rounded-r-full shadow-[0_0_10px_rgba(129,140,248,0.8)]"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="text-lg flex-shrink-0 z-10" style={{ color: isActive ? '#818CF8' : '#94A3B8' }}>{item.icon}</span>
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
          whileHover={{ scale: 1.02, background: 'rgba(251,113,133,0.15)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#FB7185] bg-[rgba(251,113,133,0.05)] border border-[rgba(251,113,133,0.1)] transition-all cursor-pointer"
        >
          <span className="text-lg">🚪</span>
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
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
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
