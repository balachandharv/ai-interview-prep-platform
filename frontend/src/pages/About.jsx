import { motion } from 'framer-motion';
import { Users, Target, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
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

      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 px-6 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#818CF8] opacity-10 rounded-full filter blur-[100px] pointer-events-none" />
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#94A3B8] mb-6 relative z-10"
        >
          Democratizing Interview Prep
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed relative z-10"
        >
          We believe everyone deserves access to world-class interview preparation. 
          By leveraging advanced AI, we provide realistic, feedback-rich environments 
          to help you land your dream job.
        </motion.p>
      </div>

      {/* Values Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-[#F1F5F9] mb-12 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Target className="text-[#818CF8]" size={32} />, title: "Precision", desc: "Targeted feedback that actually improves your performance, not just generic advice." },
            { icon: <Users className="text-[#34D399]" size={32} />, title: "Accessibility", desc: "Available 24/7. Practice anytime, anywhere, at a fraction of the cost of traditional coaching." },
            { icon: <Shield className="text-[#FBBF24]" size={32} />, title: "Privacy First", desc: "Your interview data and personal information are strictly confidential and encrypted." }
          ].map((val, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-flat bg-[rgba(30,41,59,0.3)] text-center p-8 hover:border-[rgba(129,140,248,0.3)] transition-colors"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-[rgba(129,140,248,0.1)] flex items-center justify-center mb-6">
                {val.icon}
              </div>
              <h3 className="text-xl font-bold text-[#F1F5F9] mb-3">{val.title}</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
