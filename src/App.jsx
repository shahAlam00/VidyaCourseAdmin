import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses/Courses";
import CreateCourse from "./pages/Courses/CreateCourse";
import EditCourse from "./pages/Courses/EditCourse";
import CourseContent from "./pages/Courses/CourseContent";
import Students from "./pages/Students/Students";
import StudentDetails from "./pages/Students/StudentDetails";
import Login from "./pages/Login";
import DoubtSupport from "./pages/Doubt/DoubtSupport";
import Certificates from "./pages/Certificates/Certificates.jsx"

// ScrollToTop component to force page view to start from top on every navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Change to "smooth" if you want smooth scrolling effect
    });
  }, [pathname]);

  return null;
};

const Placeholder = ({ title }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        {title}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        This module is under development.
      </p>
    </div>
  );
};

// Protected Route Component to restrict access if token is missing
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route Component to redirect away from login if already authenticated
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        {/* =========================
            ROOT REDIRECT
        ========================== */}
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* =========================
            AUTH ROUTES
        ========================== */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* =========================
            ADMIN LAYOUT (PROTECTED)
        ========================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          {/* Dashboard */}
          <Route
            index
            element={<Dashboard />}
          />

          {/* =========================
              LEARNING
          ========================== */}
          <Route
            path="courses"
            element={<Courses />}
          />
          <Route path="courses/create" element={<CreateCourse />} />
          <Route path="courses/edit/:id" element={<EditCourse />} />
          <Route path="courses/content/:id" element={<CourseContent />} />

          <Route
            path="lessons"
            element={<Placeholder title="Modules & Lessons" />}
          />

          <Route
            path="assignments"
            element={<Placeholder title="Assignments" />}
          />

          <Route
            path="submissions"
            element={<Placeholder title="Submissions" />}
          />

          <Route
            path="quizzes"
            element={<Placeholder title="Quizzes" />}
          />

          <Route
            path="question-bank"
            element={<Placeholder title="Question Bank" />}
          />

          <Route
            path="quiz-attempts"
            element={<Placeholder title="Quiz Attempts" />}
          />

          {/* =========================
              STUDENTS
          ========================== */}
          <Route
            path="students"
            element={<Students />}
          />

          <Route
            path="students/:id"
            element={<StudentDetails />}
          />

          <Route
            path="progress"
            element={<Placeholder title="Student Progress" />}
          />

          {/* =========================
              ENGAGEMENT
          ========================== */}
          <Route
            path="doubt-sessions"
            element={<DoubtSupport/>}
          />

          <Route
            path="doubts"
            element={<Placeholder title="Student Doubts" />}
          />

          <Route
            path="announcements"
            element={<Placeholder title="Announcements" />}
          />

          {/* =========================
              SALES
          ========================== */}
          <Route
            path="orders"
            element={<Placeholder title="Orders" />}
          />

          <Route
            path="payments"
            element={<Placeholder title="Payments" />}
          />

          <Route
            path="coupons"
            element={<Placeholder title="Coupons" />}
          />

          {/* =========================
              CERTIFICATION
          ========================== */}
          <Route
            path="certificates"
            element={<Certificates/>}
          />

          {/* =========================
              CONTENT
          ========================== */}
          <Route
            path="instructors"
            element={<Placeholder title="Instructors" />}
          />

          <Route
            path="testimonials"
            element={<Placeholder title="Testimonials" />}
          />

          <Route
            path="faqs"
            element={<Placeholder title="FAQs" />}
          />

          {/* =========================
              ANALYTICS
          ========================== */}
          <Route
            path="reports"
            element={<Placeholder title="Reports" />}
          />

          {/* =========================
              SYSTEM
          ========================== */}
          <Route
            path="settings"
            element={<Placeholder title="Settings" />}
          />

        </Route>

        {/* =========================
            UNKNOWN ROUTES
        ========================== */}
        <Route
          path="*"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;