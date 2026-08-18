import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleMobileSidebar, markNotificationsRead } from '../../store/uiSlice';
import { getInitials } from '../../utils/helpers';
import { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, User as UserIcon, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.ui);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="topbar" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-[rgba(30,41,59,0.5)] border border-[rgba(148,163,184,0.1)] cursor-pointer hover:bg-[rgba(30,41,59,0.8)] transition-all"
        onClick={() => dispatch(toggleMobileSidebar())}
        aria-label="Open sidebar"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F1F5F9" strokeWidth="2" strokeLinecap="round">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Search Bar — hidden on mobile */}
      <div className="hidden md:flex items-center flex-1 max-w-md min-w-0">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] group-focus-within:text-[#818CF8] transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search questions, topics..."
            className="input pl-10 bg-[rgba(30,41,59,0.4)] border-transparent hover:bg-[rgba(30,41,59,0.6)] focus:bg-[rgba(30,41,59,0.8)]"
            style={{ height: '44px', fontSize: '0.875rem', borderRadius: '14px' }}
          />
        </div>
      </div>

      {/* Spacer for mobile */}
      <div className="flex-1 lg:hidden" />

      {/* Right Side */}
      <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
        {/* Notification Bell */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05, background: 'rgba(30,41,59,0.8)' }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-[rgba(30,41,59,0.4)] border border-transparent cursor-pointer transition-all relative hover:border-[rgba(129,140,248,0.3)]"
            onClick={() => dispatch(markNotificationsRead())}
            aria-label="Notifications"
          >
            <Bell size={20} className="text-[#F1F5F9]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#FB7185] to-[#E11D48] text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-[0_0_10px_rgba(251,113,133,0.6)] border-2 border-[#0B0F1A]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </motion.button>
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 cursor-pointer bg-[rgba(30,41,59,0.3)] border border-[rgba(148,163,184,0.1)] p-1.5 pr-3 rounded-2xl hover:bg-[rgba(30,41,59,0.6)] hover:border-[rgba(129,140,248,0.2)] transition-all"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #818CF8, #6366F1)', color: '#FFF', boxShadow: '0 2px 10px rgba(129,140,248,0.3)' }}>
              {user?.name ? getInitials(user.name) : '?'}
            </div>
            <div className="hidden md:block text-left min-w-0">
              <p className="text-sm font-bold text-[#F1F5F9] leading-none truncate max-w-[120px]">{user?.name || 'User'}</p>
              <p className="text-[11px] font-medium text-[#818CF8] truncate max-w-[120px] mt-1">{user?.targetRole || 'Developer'}</p>
            </div>
            <ChevronDown size={16} className={`hidden sm:block text-[#64748B] transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-3 w-56 bg-[rgba(17,24,39,0.95)] backdrop-blur-xl rounded-2xl border border-[rgba(148,163,184,0.15)] shadow-[0_20px_60px_rgba(0,0,0,0.5)] py-2 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 mb-1 border-b border-[rgba(148,163,184,0.1)] md:hidden">
                  <p className="text-sm font-bold text-[#F1F5F9] truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-[#818CF8] truncate mt-0.5">{user?.email || 'user@example.com'}</p>
                </div>
                
                <div className="px-2">
                  <button onClick={() => { navigate('/profile'); setShowDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#E2E8F0] font-medium rounded-xl hover:bg-[rgba(129,140,248,0.1)] hover:text-[#818CF8] transition-colors cursor-pointer bg-transparent border-none">
                    <UserIcon size={16} /> Profile
                  </button>
                  <button onClick={() => { navigate('/settings'); setShowDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#E2E8F0] font-medium rounded-xl hover:bg-[rgba(129,140,248,0.1)] hover:text-[#818CF8] transition-colors cursor-pointer bg-transparent border-none mt-1">
                    <Settings size={16} /> Settings
                  </button>
                  <div className="h-px bg-[rgba(148,163,184,0.1)] my-2 mx-2" />
                  <button onClick={() => { navigate('/login'); setShowDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#FB7185] font-semibold rounded-xl hover:bg-[rgba(251,113,133,0.1)] transition-colors cursor-pointer bg-transparent border-none mb-1">
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
