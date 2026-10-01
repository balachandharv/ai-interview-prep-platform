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
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/question-bank?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

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
        className="lg:hidden flex items-center justify-center w-10 h-10 cursor-pointer transition-all"
        style={{
          borderRadius: 'var(--radius-sm)',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
        }}
        onClick={() => dispatch(toggleMobileSidebar())}
        aria-label="Open sidebar"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Search Bar — hidden on mobile */}
      <div className="hidden md:flex items-center flex-1 max-w-md min-w-0">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-[var(--glass-border)] group-focus-within:text-[var(--aqua-400)]" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search questions, topics..."
            className="w-full bg-[rgba(15,23,42,0.6)] border border-[var(--glass-border)] rounded-2xl py-2.5 pl-11 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--aqua-400)] focus:bg-[rgba(30,41,59,0.9)] transition-all placeholder-[var(--text-muted)]"
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-11 h-11 cursor-pointer transition-all relative"
            style={{
              borderRadius: 'var(--radius-sm)',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
            }}
            onClick={() => dispatch(markNotificationsRead())}
            aria-label="Notifications"
          >
            <Bell size={20} style={{ color: 'var(--text-primary)' }} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 text-white text-[10px] rounded-full flex items-center justify-center font-bold"
                style={{
                  background: 'linear-gradient(135deg, var(--danger-500), #DC2626)',
                  boxShadow: '0 0 10px rgba(239,68,68,0.5)',
                  border: '2px solid var(--ocean-950)',
                }}
              >
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
            className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 transition-all"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-lg)',
            }}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--aqua-500), var(--blue-500))', color: '#FFF', boxShadow: '0 2px 10px rgba(6,182,212,0.2)' }}>
              {user?.name ? getInitials(user.name) : '?'}
            </div>
            <div className="hidden md:block text-left min-w-0">
              <p className="text-sm font-bold leading-none truncate max-w-[120px]" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
              <p className="text-[11px] font-medium truncate max-w-[120px] mt-1" style={{ color: 'var(--aqua-400)' }}>{user?.targetRole || 'Developer'}</p>
            </div>
            <ChevronDown size={16} className={`hidden sm:block transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
          </motion.button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 top-full mt-3 w-56 py-2 z-50 overflow-hidden glass-strong"
              >
                <div className="px-4 py-3 mb-1 md:hidden" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--aqua-400)' }}>{user?.email || 'user@example.com'}</p>
                </div>
                
                <div className="px-2">
                  <button onClick={() => { navigate('/profile'); setShowDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors cursor-pointer bg-transparent border-none" style={{ color: 'var(--text-secondary)' }}>
                    <UserIcon size={16} /> Profile
                  </button>
                  <button onClick={() => { navigate('/settings'); setShowDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors cursor-pointer bg-transparent border-none mt-1" style={{ color: 'var(--text-secondary)' }}>
                    <Settings size={16} /> Settings
                  </button>
                  <div className="my-2 mx-2" style={{ height: '1px', background: 'var(--glass-border)' }} />
                  <button onClick={() => { navigate('/login'); setShowDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors cursor-pointer bg-transparent border-none mb-1" style={{ color: 'var(--danger-500)' }}>
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
