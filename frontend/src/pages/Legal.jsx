import { motion } from 'framer-motion';
import { Sparkles, Scale, ShieldCheck, Cookie } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Legal() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'terms';

  const tabs = [
    { id: 'terms', label: 'Terms of Service', icon: <Scale size={18} /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <ShieldCheck size={18} /> },
    { id: 'cookie', label: 'Cookie Policy', icon: <Cookie size={18} /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0B0F1A', fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar (Minimal) */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[rgba(148,163,184,0.1)] backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #818CF8, #6366F1)' }}>
            <Sparkles size={16} color="white" />
          </div>
          <span className="text-xl font-bold text-[#F1F5F9]">Interview<span style={{ color: '#818CF8' }}>AI</span></span>
        </Link>
        <Link to="/login" className="text-sm font-semibold text-[#F1F5F9] hover:text-[#818CF8] transition-colors">Sign In</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-[#F1F5F9] mb-4">Legal & Compliance</h1>
          <p className="text-[#94A3B8]">Last updated: August 2026</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[rgba(148,163,184,0.1)] pb-4">
          {tabs.map(tab => (
            <Link
              key={tab.id}
              to={`/legal?tab=${tab.id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${currentTab === tab.id ? 'bg-[rgba(129,140,248,0.1)] text-[#818CF8]' : 'text-[#64748B] hover:text-[#94A3B8] hover:bg-[rgba(148,163,184,0.05)]'}`}
              style={{ textDecoration: 'none' }}
            >
              {tab.icon} {tab.label}
            </Link>
          ))}
        </div>

        {/* Content */}
        <div className="card-flat bg-[rgba(30,41,59,0.3)] p-8">
          {currentTab === 'terms' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-[#94A3B8]">
              <h2 className="text-2xl font-bold text-[#F1F5F9] mb-4">Terms of Service</h2>
              <p>Welcome to InterviewAI. By accessing or using our platform, you agree to be bound by these terms.</p>
              <h3 className="text-lg font-bold text-[#E2E8F0] mt-6">1. User Accounts</h3>
              <p>You must provide accurate information when creating an account. You are responsible for safeguarding your password and any activities under your account.</p>
              <h3 className="text-lg font-bold text-[#E2E8F0] mt-6">2. Acceptable Use</h3>
              <p>Our platform is designed for interview preparation. Any attempt to abuse, scrape, or exploit the platform's AI systems will result in immediate termination of your account.</p>
            </motion.div>
          )}

          {currentTab === 'privacy' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-[#94A3B8]">
              <h2 className="text-2xl font-bold text-[#F1F5F9] mb-4">Privacy Policy</h2>
              <p>Your privacy is our priority. We are committed to protecting your personal information.</p>
              <h3 className="text-lg font-bold text-[#E2E8F0] mt-6">Data Collection</h3>
              <p>We collect information such as your email address, profile data, and interview responses solely for the purpose of personalizing your experience and improving our AI models. We do not sell your data to third parties.</p>
            </motion.div>
          )}

          {currentTab === 'cookie' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-[#94A3B8]">
              <h2 className="text-2xl font-bold text-[#F1F5F9] mb-4">Cookie Policy</h2>
              <p>We use cookies to enhance your browsing experience and analyze our traffic.</p>
              <h3 className="text-lg font-bold text-[#E2E8F0] mt-6">Essential Cookies</h3>
              <p>These cookies are required to authenticate you and keep your session secure while practicing.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
