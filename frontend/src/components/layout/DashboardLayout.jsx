import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import { motion } from 'framer-motion';

export default function DashboardLayout() {
  return (
    <div className="app-layout" style={{ fontFamily: 'Inter, sans-serif', position: 'relative', background: '#0B0F1A', overflow: 'hidden' }}>
      
      {/* Premium Dashboard Background Orbs */}
      <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-20%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

      <Sidebar />
      <div className="main-content" style={{ position: 'relative', zIndex: 10 }}>
        <Topbar />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="page-content"
        >
          <Outlet />
        </motion.main>
      </div>
      <BottomNav />
    </div>
  );
}
