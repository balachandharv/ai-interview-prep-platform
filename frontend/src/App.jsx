import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { store } from './store';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/admin/AdminRoute';
import BackgroundLayer from './components/common/BackgroundLayer';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import QuestionBank from './pages/QuestionBank';
import MockInterview from './pages/MockInterview';
import InterviewSession from './pages/InterviewSession';
import SessionResults from './pages/SessionResults';
import RoleplayMode from './pages/RoleplayMode';
import RoleplaySession from './pages/RoleplaySession';
import RoleplayResults from './pages/RoleplayResults';
import Analytics from './pages/Analytics';
import CompanyPrep from './pages/CompanyPrep';
import ResumeInterview from './pages/ResumeInterview';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import ComingSoon from './pages/ComingSoon';

/* ── Route-aware background variant selector ── */
function AppBackground() {
  const { pathname } = useLocation();
  const variant = pathname === '/'
    ? 'hero'
    : ['/interview-session', '/roleplay-session'].includes(pathname)
      ? 'calm'
      : 'default';
  return <BackgroundLayer variant={variant} />;
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        {/* Global ocean background — rendered once, behind everything */}
        <AppBackground />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              borderRadius: '999px',
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: '#F0F6FC',
              boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            },
          }}
        />

        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/blog" element={<ComingSoon />} />
            <Route path="/careers" element={<ComingSoon />} />

            {/* Full-screen Pages (no sidebar) - Protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="/interview-session" element={<InterviewSession />} />
              <Route path="/roleplay-session" element={<RoleplaySession />} />

              {/* Dashboard Pages (with sidebar layout) */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/question-bank" element={<QuestionBank />} />
                <Route path="/mock-interview" element={<MockInterview />} />
                <Route path="/session-results" element={<SessionResults />} />
                <Route path="/session/:id/results" element={<SessionResults />} />
                <Route path="/roleplay" element={<RoleplayMode />} />
                <Route path="/roleplay-results" element={<RoleplayResults />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/company-prep" element={<CompanyPrep />} />
                <Route path="/resume-interview" element={<ResumeInterview />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Admin Route Tree (Fully separated from User Dash) */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
            </Route>

            {/* 404 Not Found (Catch all) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </Provider>
  );
}
