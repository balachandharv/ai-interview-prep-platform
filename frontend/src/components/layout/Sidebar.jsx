import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Target, VenetianMask, Building, Trophy } from 'lucide-react';
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
      <div className="px-5 mb-6">
        <NavLink to="/dashboard" className="flex items-center gap-2 no-underline" onClick={closeSidebar}>
          <div className="w-9 h-9 rounded-xl bg-[#6366F1] flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-bold text-[#0F172A]">
            Interview<span className="text-[#6366F1]">AI</span>
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="px-3">
          <p className="px-3 mb-2 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <span className="min-w-0 truncate">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pt-4 border-t border-[#E2E8F0] mt-auto flex-shrink-0">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="sidebar-link w-full text-[#EF4444] hover:bg-[#FEF2F2]"
          style={{ borderLeft: 'none' }}
        >
          <span className="text-lg">🚪</span>
          <span>Log Out</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar — always visible on lg+ */}
      <div className="hidden lg:block">{sidebarContent}</div>

      {/* Mobile/Tablet Overlay Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeSidebar}
            />
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden z-50 fixed top-0 left-0"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
