import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { setOnboardingComplete } from '../store/authSlice';
import { updateProfile } from '../store/userSlice';
import { TARGET_ROLES, EXPERIENCE_LEVELS, COMPANIES, WEAK_AREAS } from '../constants/enums';

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
      toast.success('Setup complete! Let\'s go! 🚀', { style: { background: '#ECFDF5', color: '#0F172A', border: '1px solid #10B981' } });
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  i <= step ? 'bg-[#6366F1] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'
                }`}>{i + 1}</div>
                <span className={`text-sm font-medium hidden sm:block ${i <= step ? 'text-[#6366F1]' : 'text-[#94A3B8]'}`}>{s}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#6366F1] rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-lg shadow-[#6366F1]/5 p-8">
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
                  <h2 className="text-2xl font-bold text-[#0F172A] mb-2">What role are you targeting? 🎯</h2>
                  <p className="text-[#475569] mb-6">Choose the role you're preparing for</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {TARGET_ROLES.map((role) => (
                      <motion.button
                        key={role.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setFormData({ ...formData, targetRole: role.id })}
                        className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                          formData.targetRole === role.id
                            ? 'border-[#6366F1] bg-[#EEF2FF]'
                            : 'border-[#E2E8F0] bg-white hover:border-[#6366F1]/50'
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{role.icon}</span>
                        <span className="text-sm font-semibold text-[#0F172A]">{role.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Experience Level */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A] mb-2">What's your experience level? 📊</h2>
                  <p className="text-[#475569] mb-6">This helps us calibrate question difficulty</p>
                  <div className="space-y-3">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <motion.button
                        key={level}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, experienceLevel: level })}
                        className={`w-full p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                          formData.experienceLevel === level
                            ? 'border-[#6366F1] bg-[#EEF2FF]'
                            : 'border-[#E2E8F0] bg-white hover:border-[#6366F1]/50'
                        }`}
                      >
                        <span className="font-semibold text-[#0F172A]">{level}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Target Companies */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Target companies? 🏢</h2>
                  <p className="text-[#475569] mb-6">Select all that apply</p>
                  <div className="flex flex-wrap gap-3">
                    {COMPANIES.map((company) => (
                      <motion.button
                        key={company.id}
                        whileTap={{ scale: 0.95 }}
                        layout
                        onClick={() => toggleCompany(company.id)}
                        className={`px-4 py-2 rounded-full border-2 cursor-pointer transition-all flex items-center gap-2 ${
                          formData.targetCompanies.includes(company.id)
                            ? 'border-[#6366F1] bg-[#6366F1] text-white'
                            : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-[#6366F1]'
                        }`}
                      >
                        <span>{company.logo}</span>
                        <span className="font-medium text-sm">{company.name}</span>
                        {formData.targetCompanies.includes(company.id) && <span>✓</span>}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Weak Areas */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Areas to improve? 📝</h2>
                  <p className="text-[#475569] mb-6">We'll focus your practice on these topics</p>
                  <div className="grid grid-cols-2 gap-3">
                    {WEAK_AREAS.map((area) => (
                      <motion.label
                        key={area}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.weakAreas.includes(area)
                            ? 'border-[#6366F1] bg-[#EEF2FF]'
                            : 'border-[#E2E8F0] hover:border-[#6366F1]/50'
                        }`}
                      >
                        <motion.div
                          animate={{ scale: formData.weakAreas.includes(area) ? 1 : 0.8 }}
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                            formData.weakAreas.includes(area)
                              ? 'bg-[#6366F1] text-white'
                              : 'bg-[#E2E8F0]'
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
                        <span className="text-sm font-medium text-[#0F172A]">{area}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-[#E2E8F0]">
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
              {step === steps.length - 1 ? 'Complete Setup 🚀' : 'Next →'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
