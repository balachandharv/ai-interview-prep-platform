import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import { motion } from 'framer-motion';

export default function DashboardLayout() {
  return (
    <div className="app-layout" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="page-content"
        >
          <Outlet />
        </motion.main>
      </div>
      <BottomNav />
    </div>
  );
}
