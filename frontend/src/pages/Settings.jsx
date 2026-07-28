import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const profileSchema = z.object({ name: z.string().min(2), email: z.string().email() });

export default function Settings() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: true, weekly: true, achievements: true });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: 'Balachandhar V', email: 'bala@example.com' },
  });

  const onSave = () => toast.success('Settings saved!', { style: { background: '#ECFDF5', color: '#0F172A', border: '1px solid #10B981' } });

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-1">Settings ⚙️</h1>
        <p className="text-[#475569] mb-8">Manage your account and preferences</p>
      </motion.div>

      <div className="max-w-2xl space-y-6">
        {/* Account Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-flat p-6">
          <h3 className="text-lg font-bold text-[#0F172A] mb-4">Account Settings</h3>
          <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Full Name</label>
              <input {...register('name')} className={`input ${errors.name ? 'input-error' : ''}`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Email</label>
              <input {...register('email')} type="email" className={`input ${errors.email ? 'input-error' : ''}`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Change Password</label>
              <input type="password" className="input" placeholder="New password" />
            </div>
            <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn btn-primary">Save Changes</motion.button>
          </form>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-flat p-6">
          <h3 className="text-lg font-bold text-[#0F172A] mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive session reminders and updates' },
              { key: 'push', label: 'Push Notifications', desc: 'Get notified about new features' },
              { key: 'weekly', label: 'Weekly Report', desc: 'Receive weekly progress summary' },
              { key: 'achievements', label: 'Achievement Alerts', desc: 'Notifications when you earn badges' },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{n.label}</p>
                  <p className="text-xs text-[#94A3B8]">{n.desc}</p>
                </div>
                <div className={`toggle ${notifications[n.key] ? 'active' : ''}`}
                  onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Interview Preferences */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-flat p-6">
          <h3 className="text-lg font-bold text-[#0F172A] mb-4">Interview Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Default Difficulty</label>
              <select className="input" defaultValue="Medium">
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Default Timer (minutes)</label>
              <select className="input" defaultValue="3">
                <option>2</option><option>3</option><option>5</option><option>7</option><option>Unlimited</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl border-2 border-[#EF4444]/20" style={{ background: '#FEF2F2' }}>
          <h3 className="text-lg font-bold text-[#EF4444] mb-2">⚠️ Danger Zone</h3>
          <p className="text-sm text-[#475569] mb-4">Once you delete your account, there is no going back.</p>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowDeleteConfirm(true)}
            className="btn btn-danger">Delete Account</motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="modal-content">
              <h3 className="text-lg font-bold text-[#EF4444] mb-3">Delete Account?</h3>
              <p className="text-sm text-[#475569] mb-6">This action cannot be undone. All your data will be permanently deleted.</p>
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowDeleteConfirm(false)} className="btn btn-ghost flex-1">Cancel</motion.button>
                <motion.button whileTap={{ scale: 0.97 }} className="btn btn-danger flex-1">Delete Forever</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
