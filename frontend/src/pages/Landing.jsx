import { useEffect, useCallback, useMemo } from 'react';
import { Target, VenetianMask, BarChart3, Building, Bot, ArrowRight, Play, Sparkles, Zap, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Particles from '@tsparticles/react';
import { loadSlim } from 'tsparticles-slim';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useInView } from 'react-intersection-observer';

const features = [
  { icon: <Target size={24} />, title: 'AI Mock Interviews', desc: 'Practice with AI-powered mock interviews tailored to your target role and company.', color: '#818CF8' },
  { icon: <VenetianMask size={24} />, title: 'Roleplay Mode', desc: 'Immersive interview simulation with AI personas from top tech companies.', color: '#A78BFA' },
  { icon: <BarChart3 size={24} />, title: 'Smart Analytics', desc: 'Track your progress with detailed scoring, radar charts, and performance trends.', color: '#38BDF8' },
  { icon: <Zap size={24} />, title: 'Adaptive Learning', desc: 'Questions adapt to your skill level automatically for optimal learning.', color: '#34D399' },
  { icon: <Building size={24} />, title: 'Company Prep', desc: 'Company-specific preparation with real interview processes and round structures.', color: '#FBBF24' },
  { icon: <Shield size={24} />, title: 'Resume Analysis', desc: 'AI analyzes your resume and generates personalized interview questions.', color: '#FB7185' },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '500+', label: 'Interview Questions' },
  { value: '50+', label: 'Companies Covered' },
  { value: '95%', label: 'Success Rate' },
];

const testimonials = [
  { name: 'Aisha Patel', role: 'SDE-2 at Google', quote: 'InterviewAI helped me crack my Google interview in just 3 weeks of practice. The roleplay mode felt incredibly real!', avatar: 'AP' },
  { name: 'Marcus Johnson', role: 'Frontend at Meta', quote: 'The adaptive difficulty feature pushed me to improve constantly. I went from scoring 4s to consistent 8s.', avatar: 'MJ' },
  { name: 'Priya Nair', role: 'SDE-1 at Amazon', quote: 'The AI feedback on my answers was more detailed than any mock interview I had with friends.', avatar: 'PN' },
];

const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

export default function Landing() {
  const navigate = useNavigate();
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const particlesInit = useCallback(async (engine) => { await loadSlim(engine); }, []);
  const particlesOptions = useMemo(() => ({
    fullScreen: false,
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    interactivity: { events: { onHover: { enable: true, mode: 'grab' } }, modes: { grab: { distance: 150, links: { opacity: 0.3 } } } },
    particles: {
      color: { value: '#818CF8' },
      links: { color: '#818CF8', distance: 150, enable: true, opacity: 0.08, width: 1 },
      move: { enable: true, speed: 0.6, direction: 'none', outModes: { default: 'bounce' } },
      number: { density: { enable: true, area: 1000 }, value: 50 },
      opacity: { value: 0.2 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 2.5 } },
    },
    detectRetina: true,
  }), []);

  return (
    <div style={{ minHeight: '100vh', background: '#0B0F1A', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Animated gradient orbs */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'orb-move-1 20s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'orb-move-2 25s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '20%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'orb-move-1 15s ease-in-out infinite reverse', pointerEvents: 'none' }} />

        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Particles id="hero-particles" init={particlesInit} options={particlesOptions} style={{ width: '100%', height: '100%' }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity, position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto', padding: '120px 24px 80px', textAlign: 'center' }}>
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', color: '#818CF8', borderRadius: '9999px', padding: '8px 20px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '32px', backdropFilter: 'blur(8px)' }}>
            <Sparkles size={16} />
            AI-Powered Interview Preparation
          </motion.div>

          {/* Heading */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, color: '#F1F5F9', marginBottom: '16px', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            Prepare to{' '}
            <span className="gradient-text">
              <TypeAnimation sequence={['Ace Google', 2000, 'Crack Amazon', 2000, 'Master System Design', 2000, 'Land Your Dream Job', 2500]} wrapper="span" speed={50} repeat={Infinity} />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#94A3B8', maxWidth: '600px', margin: '0 auto 48px', lineHeight: 1.7 }}>
            Practice with AI interviewers, get real-time feedback, and track your progress with intelligent analytics.
          </motion.p>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <motion.button whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(129,140,248,0.4)' }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register')} className="btn btn-primary btn-lg"
              style={{ fontSize: '1.0625rem', boxShadow: '0 8px 30px rgba(129,140,248,0.3)' }}>
              Start Free Now <ArrowRight size={20} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn btn-outline btn-lg" style={{ fontSize: '1.0625rem' }}>
              <Play size={18} /> Watch Demo
            </motion.button>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div initial={{ opacity: 0, y: 60, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginTop: '72px', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', position: 'relative' }}>
            {/* Glow behind preview */}
            <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(ellipse, rgba(129,140,248,0.12) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', background: 'rgba(17,24,39,0.7)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid rgba(148,163,184,0.1)', padding: '24px', boxShadow: '0 25px 80px rgba(0,0,0,0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FB7185' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FBBF24' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#34D399' }} />
                <span style={{ marginLeft: '12px', fontSize: '0.75rem', color: '#64748B' }}>InterviewAI Dashboard</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                <div style={{ background: 'rgba(30,41,59,0.5)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['Dashboard', 'Mock Interview', 'Roleplay', 'Analytics'].map((n, i) => (
                    <div key={n} style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '0.8125rem', transition: 'all 0.2s', ...(i === 0 ? { background: 'rgba(129,140,248,0.15)', color: '#818CF8', fontWeight: 600 } : { color: '#64748B' }) }}>{n}</div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.15), rgba(167,139,250,0.1))', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(129,140,248,0.1)' }}>
                    <div>
                      <p style={{ fontSize: '0.8125rem', color: '#818CF8', fontWeight: 600, margin: 0 }}>Readiness Score</p>
                      <p style={{ fontSize: '2rem', fontWeight: 700, color: '#F1F5F9', margin: '4px 0 0' }}>78%</p>
                    </div>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '3px solid #818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(129,140,248,0.3)' }}>
                      <span style={{ fontWeight: 700, color: '#818CF8', fontSize: '1rem' }}>78</span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'rgba(52,211,153,0.08)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(52,211,153,0.1)' }}>
                      <p style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600, margin: 0 }}>Sessions</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F1F5F9', margin: '2px 0 0' }}>24</p>
                    </div>
                    <div style={{ background: 'rgba(167,139,250,0.08)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(167,139,250,0.1)' }}>
                      <p style={{ fontSize: '0.75rem', color: '#A78BFA', fontWeight: 600, margin: 0 }}>Avg Score</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F1F5F9', margin: '2px 0 0' }}>7.8</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" style={{ padding: '120px 0', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} style={{ textAlign: 'center', marginBottom: '72px' }}>
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.15)', borderRadius: '9999px', padding: '6px 16px', fontSize: '0.8125rem', color: '#818CF8', fontWeight: 600, marginBottom: '20px' }}>
                <Sparkles size={14} /> Features
              </div>
            </motion.div>
            <motion.h2 variants={fadeUp} transition={{ duration: 0.6 }} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#F1F5F9', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Everything You Need to <span className="gradient-text">Succeed</span>
            </motion.h2>
            <motion.p variants={fadeUp} transition={{ duration: 0.6 }} style={{ fontSize: '1.125rem', color: '#94A3B8', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
              Comprehensive tools designed to maximize your interview performance.
            </motion.p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp} transition={{ duration: 0.5 }} className="card" style={{ cursor: 'pointer' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${f.color}15`, color: f.color, marginBottom: '20px', border: `1px solid ${f.color}20` }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section ref={statsRef} style={{ padding: '80px 0', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(129,140,248,0.03), transparent)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px' }}>
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} animate={statsInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ textAlign: 'center', padding: '32px 16px', background: 'rgba(17,24,39,0.5)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1px solid rgba(148,163,184,0.08)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '4px' }} className="gradient-text">{s.value}</div>
                <p style={{ color: '#94A3B8', fontWeight: 500, margin: 0, fontSize: '0.875rem' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" style={{ padding: '120px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '72px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#F1F5F9', marginBottom: '16px' }}>
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '48px' }}>
            {[
              { step: '01', title: 'Set Your Goals', desc: 'Choose your target role, company, and experience level.', icon: <Target size={28} />, color: '#818CF8' },
              { step: '02', title: 'Practice with AI', desc: 'Take mock interviews or roleplay with AI interviewers.', icon: <Bot size={28} />, color: '#A78BFA' },
              { step: '03', title: 'Track & Improve', desc: 'Get instant AI feedback and track your progress.', icon: <BarChart3 size={28} />, color: '#38BDF8' },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }} style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `${s.color}10`, border: `2px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', position: 'relative', color: s.color }}>
                  {s.icon}
                  <span style={{ position: 'absolute', top: '-6px', right: '-6px', width: '28px', height: '28px', background: `linear-gradient(135deg, ${s.color}, ${s.color}CC)`, color: '#FFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700 }}>{s.step}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '10px' }}>{s.title}</h3>
                <p style={{ color: '#94A3B8', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" style={{ padding: '120px 0', background: 'rgba(17,24,39,0.3)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '72px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#F1F5F9', marginBottom: '16px' }}>
              Loved by <span className="gradient-text">Thousands</span>
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}
                style={{ background: 'rgba(17,24,39,0.6)', backdropFilter: 'blur(16px)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(148,163,184,0.08)', transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="#FBBF24" color="#FBBF24" />)}
                </div>
                <p style={{ color: '#CBD5E1', fontStyle: 'italic', marginBottom: '24px', lineHeight: 1.7, fontSize: '0.9375rem' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #818CF8, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700, fontSize: '0.8125rem' }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontWeight: 600, color: '#F1F5F9', fontSize: '0.875rem', margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '120px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.15), rgba(167,139,250,0.1))', border: '1px solid rgba(129,140,248,0.2)', borderRadius: '32px', padding: 'clamp(40px, 6vw, 80px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.15), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#F1F5F9', marginBottom: '16px' }}>
                Ready to Land Your Dream Job?
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#94A3B8', marginBottom: '40px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
                Join thousands of developers who aced their interviews with InterviewAI.
              </p>
              <motion.button whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(129,140,248,0.4)' }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/register')} className="btn btn-primary btn-lg" style={{ fontSize: '1.0625rem' }}>
                Start Preparing Now — It's Free <ArrowRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
