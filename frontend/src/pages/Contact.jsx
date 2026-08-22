import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Using Web3Forms for email forwarding
    const formData = new FormData(e.target);
    formData.append("access_key", "YOUR_WEB3FORMS_ACCESS_KEY"); // You will need to replace this!

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      
      const data = await response.json();

      if (data.success) {
        toast.success('Message sent successfully! We will get back to you soon.', {
          style: { background: 'rgba(17, 24, 39, 0.9)', color: '#fff', border: '1px solid rgba(52, 211, 153, 0.3)' }
        });
        e.target.reset();
      } else {
        toast.error(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10">
          <h1 className="text-4xl font-extrabold text-[#F1F5F9] mb-4">Get in touch</h1>
          <p className="text-[#94A3B8] text-lg mb-10 leading-relaxed">
            Have questions about our platform or enterprise pricing? 
            Our team is here to help you get the most out of InterviewAI.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[rgba(129,140,248,0.1)] flex items-center justify-center text-[#818CF8]">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">Email Us</p>
                <a href="mailto:balachandhar021@gmail.com" className="text-[#F1F5F9] font-medium mt-1 hover:text-[#818CF8] transition-colors block no-underline">balachandhar021@gmail.com</a>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[rgba(52,211,153,0.1)] flex items-center justify-center text-[#34D399]">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">Office</p>
                <p className="text-[#F1F5F9] font-medium mt-1">PSR Engineering College, Sivakasi</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[rgba(10,102,194,0.1)] flex items-center justify-center text-[#0A66C2]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">LinkedIn</p>
                <a href="https://www.linkedin.com/in/balachandhar021" target="_blank" rel="noopener noreferrer" className="text-[#F1F5F9] font-medium mt-1 hover:text-[#0A66C2] transition-colors block no-underline">balachandhar021</a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column (Form) */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <form onSubmit={handleSubmit} className="card p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#E2E8F0] mb-2">Name</label>
              <input type="text" name="name" required className="input" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#E2E8F0] mb-2">Email</label>
              <input type="email" name="email" required className="input" placeholder="jane@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#E2E8F0] mb-2">Message</label>
              <textarea name="message" required className="input textarea" placeholder="How can we help you?" />
            </div>
            <motion.button disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary w-full disabled:opacity-50">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
