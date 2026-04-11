import { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

// Component 2 — Student
import MissionsPage    from './pages/student/MissionsPage';
import QuizPage        from './pages/student/QuizPage';
import PerformancePage from './pages/student/PerformancePage';

// Component 2 — Admin
import AdminMissionsPage from './pages/admin/AdminMissionsPage';
import AdminQuizzesPage  from './pages/admin/AdminQuizzesPage';

// Component 2 styles
import './assessment.css';

const role = () => localStorage.getItem('role');
const isDev = import.meta.env.DEV;

function RequireRole({ allowed, children }) {
  const currentRole = role();

  // In local development, let the pages open even before auth wiring is ready.
  if (isDev && !currentRole) return children;

  return allowed.includes(currentRole) ? children : <Navigate to="/" replace />;
}

function HomePage() {
  const [courseId, setCourseId] = useState('demo-course');
  const currentRole = role() || 'not set';

  const setRole = (nextRole) => {
    localStorage.setItem('role', nextRole);
    window.location.reload();
  };

  const clearRole = () => {
    localStorage.removeItem('role');
    window.location.reload();
  };

  return (
    <div className="page card" style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h1>SkillBridge Frontend</h1>
      <p>Use this page to open the screens directly while checking your components.</p>

      <div style={{ display: 'grid', gap: '0.75rem', margin: '1.25rem 0' }}>
        <label>
          Course ID
          <input
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            placeholder="Enter a course id"
            style={{ display: 'block', width: '100%', marginTop: '0.35rem' }}
          />
        </label>
        <div>
          <strong>Current role:</strong> {currentRole}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setRole('student')}>Set Student</button>
          <button onClick={() => setRole('admin')}>Set Admin</button>
          <button onClick={() => setRole('university')}>Set University</button>
          <button onClick={clearRole}>Clear Role</button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Link to={`/courses/${courseId}/missions`}>Student Missions</Link>
        <Link to={`/courses/${courseId}/quizzes`}>Student Quizzes</Link>
        <Link to={`/courses/${courseId}/performance`}>Student Performance</Link>
        <Link to={`/admin/courses/${courseId}/missions`}>Admin Missions</Link>
        <Link to={`/admin/courses/${courseId}/quizzes`}>Admin Quizzes</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Student */}
      <Route path="/courses/:courseId/missions"
        element={<RequireRole allowed={['student']}><MissionsPage /></RequireRole>} />
      <Route path="/courses/:courseId/quizzes"
        element={<RequireRole allowed={['student']}><QuizPage /></RequireRole>} />
      <Route path="/courses/:courseId/performance"
        element={<RequireRole allowed={['student']}><PerformancePage /></RequireRole>} />

      {/* Admin */}
      <Route path="/admin/courses/:courseId/missions"
        element={<RequireRole allowed={['admin','university']}><AdminMissionsPage /></RequireRole>} />
      <Route path="/admin/courses/:courseId/quizzes"
        element={<RequireRole allowed={['admin','university']}><AdminQuizzesPage /></RequireRole>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
