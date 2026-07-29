import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toggleMobileSidebar, markNotificationsRead } from '../../store/uiSlice';
import { getInitials } from '../../utils/helpers';
import { useState, useRef, useEffect } from 'react';

export default function Topbar() {
  const dispatch = useDispatch();
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
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer hover:bg-[#F1F5F9] transition-colors"
        onClick={() => dispatch(toggleMobileSidebar())}
        aria-label="Open sidebar"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Search Bar — hidden on mobile */}
      <div className="hidden md:flex items-center flex-1 max-w-md min-w-0">
        <div className="relative w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search questions, topics..."
            className="input pl-10"
            style={{ background: '#F1F5F9', height: '40px', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {/* Spacer for mobile */}
      <div className="flex-1 lg:hidden" />

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {/* Notification Bell */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer hover:bg-[#F1F5F9] transition-colors relative"
            onClick={() => dispatch(markNotificationsRead())}
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </motion.button>
        </div>

        {/* User Avatar */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-1 rounded-xl hover:bg-[#F1F5F9] transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="avatar" style={{ background: '#EEF2FF', color: '#6366F1' }}>
              {user?.name ? getInitials(user.name) : '?'}
            </div>
            <div className="hidden md:block text-left min-w-0">
              <p className="text-sm font-semibold text-[#0F172A] leading-none truncate max-w-[120px]">{user?.name || 'User'}</p>
              <p className="text-xs text-[#94A3B8] truncate max-w-[120px]">{user?.targetRole || 'Developer'}</p>
            </div>
            <svg className="hidden sm:block flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </motion.button>

          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-[#E2E8F0] shadow-lg py-2 z-50"
            >
              <a href="/profile" className="block px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F8FAFC] no-underline">Profile</a>
              <a href="/settings" className="block px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F8FAFC] no-underline">Settings</a>
              <hr className="my-1 border-[#E2E8F0]" />
              <a href="/login" className="block px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#FEF2F2] no-underline">Log Out</a>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
