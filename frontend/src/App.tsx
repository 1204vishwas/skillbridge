import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import Profile from './pages/Profile';
import SavedJobs from './pages/SavedJobs';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import JobApplicants from './pages/JobApplicants';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute roles={['student']}>
                <SavedJobs />
              </ProtectedRoute>
            }
          />

          {/* Any authenticated user */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Recruiter */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute roles={['recruiter', 'admin']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/post"
            element={
              <ProtectedRoute roles={['recruiter', 'admin']}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/edit/:id"
            element={
              <ProtectedRoute roles={['recruiter', 'admin']}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:id/applicants"
            element={
              <ProtectedRoute roles={['recruiter', 'admin']}>
                <JobApplicants />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
