import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { setOnboardingComplete } from '../store/authSlice';
import { updateProfile } from '../store/userSlice';
import { TARGET_ROLES, EXPERIENCE_LEVELS, COMPANIES, WEAK_AREAS } from '../constants/enums';
import { FaGoogle, FaAmazon, FaMicrosoft, FaFacebook, FaApple, FaPlay, FaShoppingCart, FaBuilding } from 'react-icons/fa';

const companyIcons = {
  google: <FaGoogle size={18} />,
  amazon: <FaAmazon size={18} />,
  microsoft: <FaMicrosoft size={18} />,
  meta: <FaFacebook size={18} />,
  apple: <FaApple size={18} />,
  netflix: <FaPlay size={18} />,
  flipkart: <FaShoppingCart size={18} />,
  goldman: <FaBuilding size={18} />
};

const steps = ['Target Role', 'Experience Level', 'Target Companies', 'Weak Areas'];

export default function Onboarding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    targetRole: '',
    experienceLevel: '',
    targetCompanies: [],
    weakAreas: [],
  });

  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = () => {
    if (step === 0 && !formData.targetRole) { toast.error('Please select a target role'); return; }
    if (step === 1 && !formData.experienceLevel) { toast.error('Please select your experience level'); return; }
    if (step < steps.length - 1) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = async () => {
    try {
      await dispatch(updateProfile(formData));
      dispatch(setOnboardingComplete());
      toast.success('Setup complete! Let\'s go!', { style: { background: 'rgba(16,185,129,0.1)', color: 'var(--emerald-500)', border: '1px solid rgba(16,185,129,0.2)' } });
      navigate('/dashboard');
    } catch {
      toast.error('Failed to save preferences');
    }
  };

  const toggleCompany = (id) => {
    setFormData(prev => ({
      ...prev,
      targetCompanies: prev.targetCompanies.includes(id)
        ? prev.targetCompanies.filter(c => c !== id)
        : [...prev.targetCompanies, id],
    }));
  };

  const toggleWeakArea = (area) => {
    setFormData(prev => ({
      ...prev,
      weakAreas: prev.weakAreas.includes(area)
        ? prev.weakAreas.filter(a => a !== area)
        : [...prev.weakAreas, area],
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: 'var(--glass-bg)', fontFamily: 'Inter, sans-serif' }}>
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  i <= step ? 'bg-[var(--aqua-500)] text-white' : 'bg-[var(--glass-border)] text-[var(--text-secondary)]'
                }`}>{i + 1}</div>
                <span className={`text-sm font-medium hidden sm:block ${i <= step ? 'text-[var(--aqua-500)]' : 'text-[var(--text-secondary)]'}`}>{s}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-[var(--glass-border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--aqua-500)] rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-[var(--glass-bg)] rounded-2xl border border-[var(--glass-border)] shadow-lg shadow-[var(--aqua-500)]/5 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Target Role */}
              {step === 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">What role are you targeting?</h2>
                  <p className="text-[var(--text-secondary)] mb-6">Choose the role you're preparing for</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {TARGET_ROLES.map((role) => (
                      <motion.button
                        key={role.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setFormData({ ...formData, targetRole: role.id })}
                        className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                          formData.targetRole === role.id
                            ? 'border-[var(--aqua-500)] bg-[#EEF2FF]'
                            : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--aqua-500)]/50'
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{role.icon}</span>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{role.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Experience Level */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">What's your experience level?</h2>
                  <p className="text-[var(--text-secondary)] mb-6">This helps us calibrate question difficulty</p>
                  <div className="space-y-3">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <motion.button
                        key={level}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, experienceLevel: level })}
                        className={`w-full p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                          formData.experienceLevel === level
                            ? 'border-[var(--aqua-500)] bg-[#EEF2FF]'
                            : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--aqua-500)]/50'
                        }`}
                      >
                        <span className="font-semibold text-[var(--text-primary)]">{level}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Target Companies */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Target companies?</h2>
                  <p className="text-[var(--text-secondary)] mb-6">Select all that apply</p>
                  <div className="flex flex-wrap gap-3">
                    {COMPANIES.map((company) => (
                      <motion.button
                        key={company.id}
                        whileTap={{ scale: 0.95 }}
                        layout
                        onClick={() => toggleCompany(company.id)}
                        className={`px-3 py-2 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                          formData.targetCompanies.includes(company.id)
                            ? 'border-[#3B82F6] bg-[#3B82F6]/5'
                            : 'border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:border-[#3B82F6]/50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: company.color }}>
                          {companyIcons[company.id] || company.logo}
                        </div>
                        <span className="font-semibold text-sm text-[var(--text-primary)]">{company.name}</span>
                        {formData.targetCompanies.includes(company.id) && <span className="text-[var(--aqua-400)] ml-1">✓</span>}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Weak Areas */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Areas to improve?</h2>
                  <p className="text-[var(--text-secondary)] mb-6">We'll focus your practice on these topics</p>
                  <div className="grid grid-cols-2 gap-3">
                    {WEAK_AREAS.map((area) => (
                      <motion.label
                        key={area}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.weakAreas.includes(area)
                            ? 'border-[var(--aqua-500)] bg-[#EEF2FF]'
                            : 'border-[var(--glass-border)] hover:border-[var(--aqua-500)]/50'
                        }`}
                      >
                        <motion.div
                          animate={{ scale: formData.weakAreas.includes(area) ? 1 : 0.8 }}
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                            formData.weakAreas.includes(area)
                              ? 'bg-[var(--aqua-500)] text-white'
                              : 'bg-[var(--glass-border)]'
                          }`}
                        >
                          {formData.weakAreas.includes(area) && '✓'}
                        </motion.div>
                        <input
                          type="checkbox"
                          checked={formData.weakAreas.includes(area)}
                          onChange={() => toggleWeakArea(area)}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium text-[var(--text-primary)]">{area}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-[var(--glass-border)]">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => step > 0 && setStep(step - 1)}
              className={`btn btn-ghost ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}
            >
              ← Back
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="btn btn-primary btn-lg"
            >
              {step === steps.length - 1 ? 'Complete Setup' : 'Next →'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
