import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import { motion } from 'framer-motion';

export default function DashboardLayout() {
  return (
    <div className="app-layout" style={{ fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      <Sidebar />
      <div className="main-content" style={{ position: 'relative', zIndex: 10 }}>
        <Topbar />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="page-content"
        >
          <Outlet />
        </motion.main>
      </div>
      <BottomNav />
    </div>
  );
}
