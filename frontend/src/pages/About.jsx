import { motion } from 'framer-motion';
import { Users, Target, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--ocean-950)', fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar (Minimal) */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)] backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, var(--aqua-400), var(--aqua-500))' }}>
            <Sparkles size={16} color="white" />
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)]">Interview<span style={{ color: 'var(--aqua-400)' }}>AI</span></span>
        </Link>
        <Link to="/login" className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--aqua-400)] transition-colors">Sign In</Link>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 px-6 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--aqua-400)] opacity-10 rounded-full filter blur-[100px] pointer-events-none" />
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--text-secondary)] mb-6 relative z-10"
        >
          Democratizing Interview Prep
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed relative z-10"
        >
          We believe everyone deserves access to world-class interview preparation. 
          By leveraging advanced AI, we provide realistic, feedback-rich environments 
          to help you land your dream job.
        </motion.p>
      </div>

      {/* Values Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-12 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Target className="text-[var(--aqua-400)]" size={32} />, title: "Precision", desc: "Targeted feedback that actually improves your performance, not just generic advice." },
            { icon: <Users className="text-[#34D399]" size={32} />, title: "Accessibility", desc: "Available 24/7. Practice anytime, anywhere, at a fraction of the cost of traditional coaching." },
            { icon: <Shield className="text-[#FBBF24]" size={32} />, title: "Privacy First", desc: "Your interview data and personal information are strictly confidential and encrypted." }
          ].map((val, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-flat bg-[rgba(30,41,59,0.3)] text-center p-8 hover:border-[rgba(6,182,212,0.20)] transition-colors"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-[rgba(6,182,212,0.08)] flex items-center justify-center mb-6">
                {val.icon}
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{val.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
