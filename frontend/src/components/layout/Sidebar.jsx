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
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }} className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 4px 12px rgba(59,130,246,0.25)' }}>
            <Sparkles size={20} color="white" />
          </motion.div>
          <span className="text-xl font-bold text-[#F0F4F8]">
            Interview<span style={{ color: '#3B82F6' }}>AI</span>
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="px-3">
          <p className="px-4 mb-3 text-xs font-bold text-[#5A6B82] uppercase tracking-widest">Menu</p>
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
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#3B82F6] rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="flex-shrink-0 z-10" style={{ color: isActive ? '#3B82F6' : '#8B9DB8' }}>{item.icon}</span>
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
          whileHover={{ scale: 1.02, background: 'rgba(239,68,68,0.12)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#EF4444] bg-[rgba(239,68,68,0.04)] border border-[rgba(239,68,68,0.1)] transition-all cursor-pointer"
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
