import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../store/authSlice';
import { toggleMobileSidebar } from '../../store/uiSlice';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/question-bank', label: 'Question Bank', icon: '📚' },
  { path: '/mock-interview', label: 'Mock Interview', icon: '🎯' },
  { path: '/roleplay', label: 'Roleplay Mode', icon: '🎭' },
  { path: '/analytics', label: 'Analytics', icon: '📈' },
  { path: '/company-prep', label: 'Company Prep', icon: '🏢' },
  { path: '/resume-interview', label: 'Resume Interview', icon: '📄' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { path: '/profile', label: 'Profile', icon: '👤' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mobileSidebarOpen } = useSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const sidebarContent = (
    <div className="sidebar" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Logo */}
      <div className="px-5 mb-6">
        <NavLink to="/dashboard" className="flex items-center gap-2 no-underline">
          <div className="w-9 h-9 rounded-xl bg-[#6366F1] flex items-center justify-center">
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
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={() => dispatch(toggleMobileSidebar())}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pt-4 border-t border-[#E2E8F0] mt-auto">
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
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">{sidebarContent}</div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => dispatch(toggleMobileSidebar())}
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
