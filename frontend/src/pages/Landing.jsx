import { useEffect, useCallback, useMemo } from 'react';
import { Target, VenetianMask, BarChart3, Building, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import CountUp from '../components/common/CountUp';
import Particles from '@tsparticles/react';
import { loadSlim } from 'tsparticles-slim';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useInView } from 'react-intersection-observer';
import AOS from 'aos';
import 'aos/dist/aos.css';

const features = [
  { icon: <Target className="w-6 h-6 text-indigo-500" />, title: 'AI Mock Interviews', desc: 'Practice with AI-powered mock interviews tailored to your target role and company.' },
  { icon: <VenetianMask className="w-6 h-6 text-indigo-500" />, title: 'Roleplay Mode', desc: 'Immersive interview simulation with AI personas from top tech companies.' },
  { icon: <BarChart3 className="w-6 h-6 text-indigo-500" />, title: 'Smart Analytics', desc: 'Track your progress with detailed scoring, radar charts, and performance trends.' },
  { icon: '🧠', title: 'Adaptive Learning', desc: 'Questions adapt to your skill level automatically for optimal learning.' },
  { icon: <Building className="w-6 h-6 text-indigo-500" />, title: 'Company Prep', desc: 'Company-specific preparation with real interview processes and round structures.' },
  { icon: '📄', title: 'Resume Analysis', desc: 'AI analyzes your resume and generates personalized interview questions.' },
];

const stats = [
  { value: 10000, label: 'Users', suffix: '+' },
  { value: 500, label: 'Questions', suffix: '+' },
  { value: 50, label: 'Companies', suffix: '+' },
  { value: 95, label: 'Success Rate', suffix: '%' },
];

const testimonials = [
  { name: 'Aisha Patel', role: 'SDE-2 at Google', quote: 'InterviewAI helped me crack my Google interview in just 3 weeks of practice. The roleplay mode felt incredibly real!' },
  { name: 'Marcus Johnson', role: 'Frontend at Meta', quote: 'The adaptive difficulty feature pushed me to improve constantly. I went from scoring 4s to consistent 8s.' },
  { name: 'Priya Nair', role: 'SDE-1 at Amazon', quote: 'The AI feedback on my answers was more detailed than any mock interview I had with friends.' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Landing() {
  const navigate = useNavigate();
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 100 });
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = useMemo(() => ({
    fullScreen: false,
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
      },
    },
    particles: {
      color: { value: '#6366F1' },
      links: { color: '#6366F1', distance: 150, enable: true, opacity: 0.15, width: 1 },
      move: { enable: true, speed: 1, direction: 'none', outModes: { default: 'bounce' } },
      number: { density: { enable: true, area: 800 }, value: 60 },
      opacity: { value: 0.3 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }), []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative pt-36 sm:pt-40 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Particles id="hero-particles" init={particlesInit} options={particlesOptions} className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#EEF2FF] text-[#6366F1] rounded-full px-4 py-2 text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-[#6366F1] rounded-full animate-pulse" />
              AI-Powered Interview Prep
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] mb-4 sm:mb-6 leading-tight tracking-tight">
              Prepare to{' '}
              <span className="gradient-text">
                <TypeAnimation
                  sequence={[
                    'Ace Your Google Interview', 2000,
                    'Crack Amazon SDE-1', 2000,
                    'Master Behavioral Rounds', 2000,
                    'Nail Your System Design', 2000,
                    'Land Your Dream Job', 2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#475569] max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
              Practice with AI interviewers from top tech companies. Get instant feedback, 
              track your progress, and build confidence for your next interview.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/register')}
                className="btn btn-primary btn-lg shadow-lg shadow-[#6366F1]/25"
                style={{ fontSize: '1.0625rem' }}
              >
                Get Started Free
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="btn btn-outline btn-lg"
                style={{ fontSize: '1.0625rem' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="#6366F1" stroke="none" />
                </svg>
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl shadow-[#6366F1]/10 border border-[#E2E8F0] p-4 sm:p-6 md:p-8 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="hidden sm:block col-span-1 bg-[#F8FAFC] rounded-xl p-4 space-y-3">
                  {['Dashboard', 'Mock Interview', 'Roleplay Mode', 'Analytics'].map((n, i) => (
                    <div key={n} className={`py-2 px-3 rounded-lg text-sm ${i === 0 ? 'bg-[#EEF2FF] text-[#6366F1] font-semibold' : 'text-[#94A3B8]'}`}>{n}</div>
                  ))}
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <div className="bg-[#EEF2FF] rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6366F1] font-semibold">Readiness Score</p>
                      <p className="text-3xl font-bold text-[#0F172A]">78%</p>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-[#6366F1] flex items-center justify-center">
                      <span className="font-bold text-[#6366F1]">78</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#ECFDF5] rounded-xl p-3">
                      <p className="text-xs text-[#10B981] font-semibold">Sessions</p>
                      <p className="text-xl font-bold text-[#0F172A]">24</p>
                    </div>
                    <div className="bg-[#F5F3FF] rounded-xl p-3">
                      <p className="text-xs text-[#8B5CF6] font-semibold">Avg Score</p>
                      <p className="text-xl font-bold text-[#0F172A]">7.8</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section id="features" className="py-20" style={{ background: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">
              Everything You Need to <span className="gradient-text">Ace Your Interview</span>
            </h2>
            <p className="text-lg text-[#475569] max-w-xl mx-auto">
              Comprehensive AI-powered tools designed to maximize your interview performance.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="card cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: '#EEF2FF' }}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">{feature.title}</h3>
                <p className="text-[#475569] text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ STATS BAR ═══════════════ */}
      <section ref={statsRef} className="py-16" style={{ background: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold text-[#6366F1] mb-2">
                  {statsInView && (
                    <span>{stat.value}{stat.suffix}</span>
                  )}
                </div>
                <p className="text-[#475569] font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how-it-works" className="py-20" style={{ background: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Set Your Goals', desc: 'Choose your target role, company, and experience level to personalize your prep.', icon: <Target className="w-6 h-6 text-indigo-500" /> },
              { step: '02', title: 'Practice with AI', desc: 'Take mock interviews or roleplay with AI personas from top companies.', icon: <Bot className="w-6 h-6 text-indigo-500" /> },
              { step: '03', title: 'Track & Improve', desc: 'Get instant AI feedback, track progress, and focus on weak areas.', icon: '📈' },
            ].map((s, i) => (
              <div key={s.step} className="text-center" data-aos="fade-up" data-aos-delay={i * 150}>
                <div className="w-20 h-20 rounded-full bg-[#EEF2FF] flex items-center justify-center text-3xl mx-auto mb-6 relative">
                  {s.icon}
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-[#6366F1] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{s.title}</h3>
                <p className="text-[#475569]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section id="testimonials" className="py-20" style={{ background: '#F1F5F9' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">
              Loved by <span className="gradient-text">Thousands</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p className="text-[#475569] italic mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="avatar" style={{ background: '#EEF2FF', color: '#6366F1' }}>
                    {t.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F172A] text-sm">{t.name}</p>
                    <p className="text-xs text-[#94A3B8]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-20" style={{ background: '#F8FAFC' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: '#FFFFFF' }}>
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-lg mx-auto" style={{ color: '#E0E7FF' }}>
              Join thousands of developers who aced their interviews with InterviewAI.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/register')}
              className="bg-white text-[#6366F1] font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              Start Preparing Now — It's Free
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
