import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { loginUser } from '../store/authSlice';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      toast.success('Welcome back!', { style: { background: 'rgba(17, 24, 39, 0.9)', color: '#fff', border: '1px solid rgba(52, 211, 153, 0.3)' } });
      navigate(result.user?.onboardingComplete ? '/dashboard' : '/onboarding');
    } catch (err) {
      toast.error(err || 'Login failed', { style: { background: 'rgba(17, 24, 39, 0.9)', color: '#fff', border: '1px solid rgba(251, 113, 133, 0.3)' } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0B0F1A', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Animated Orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'orb-move-1 20s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'orb-move-2 25s ease-in-out infinite', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 no-underline">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }} className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #818CF8, #6366F1)' }}>
              <Sparkles size={20} color="white" />
            </motion.div>
            <span className="text-2xl font-bold text-[#F1F5F9]">Interview<span style={{ color: '#818CF8' }}>AI</span></span>
          </Link>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '40px 32px' }}>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#F1F5F9] mb-2">Welcome Back</h1>
            <p className="text-[#94A3B8]">Log in to continue your interview prep</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
              <label htmlFor="email" className="block text-sm font-medium text-[#E2E8F0] mb-1.5">Email</label>
              <input
                id="email"
                {...register('email')}
                type="email"
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-[#FB7185] text-xs mt-1">{errors.email.message}</p>}
            </motion.div>

            {/* Password */}
            <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
              <label htmlFor="password" className="block text-sm font-medium text-[#E2E8F0] mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className={`input pr-12 ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] bg-transparent border-none cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[#FB7185] text-xs mt-1">{errors.password.message}</p>}
            </motion.div>

            {/* Forgot Password */}
            <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="flex justify-end">
              <a href="#" onClick={(e) => { e.preventDefault(); toast('Password reset link sent (Mock)', { icon: '📧' }); }} className="text-sm text-[#818CF8] font-medium hover:text-[#A78BFA] no-underline transition-colors">Forgot password?</a>
            </motion.div>

            {/* Submit */}
            <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full btn-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Logging in...
                  </div>
                ) : (
                  <>Log In <ArrowRight size={18} /></>
                )}
              </motion.button>
            </motion.div>

            {/* Divider */}
            <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="flex items-center gap-3 py-2">
              <hr className="flex-1 border-[rgba(148,163,184,0.1)]" />
              <span className="text-xs text-[#64748B]">OR</span>
              <hr className="flex-1 border-[rgba(148,163,184,0.1)]" />
            </motion.div>

            {/* Google OAuth */}
            <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
              <motion.button
                whileHover={{ scale: 1.02, background: 'rgba(30,41,59,0.8)' }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[rgba(30,41,59,0.5)] border border-[rgba(148,163,184,0.1)] rounded-xl text-[#F1F5F9] font-medium transition-all cursor-pointer hover:border-[rgba(148,163,184,0.3)]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </motion.button>
            </motion.div>
          </form>

          <p className="text-center mt-8 pb-2 text-sm text-[#94A3B8]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#818CF8] font-semibold hover:text-[#A78BFA] no-underline transition-colors">Sign up free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
