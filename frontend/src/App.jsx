import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Student/Login";
import Register from "./pages/Student/Register";
import ForgotPassword from "./pages/Student/ForgotPassword";
import ResetPassword from "./pages/Student/ResetPassword";
import StudentDashboard from "./pages/Student/StudentDashboard";
import Profile from "./pages/Student/Profile";
import ApplyJob from "./pages/Student/ApplyJob";
import UploadResume from "./pages/Student/UploadResume";
import ScheduleInterview from "./pages/Student/ScheduleInterview";
import ProtectedRoute from "./components/ProtectedRoute";
import "./pages/Student/Student.css";
import CompanyLogin from "./pages/Company/CompanyLogin";
import CompanyRegister from "./pages/Company/CompanyRegister";
import CompanyDashboard from "./pages/Company/CompanyDashboard";

function App() {
  return (
    <>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-blue-600">Placement Portal</h1>

        <ul className="flex gap-6">
          <li>
            <Link to="/" className="hover:text-blue-600">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-600">About</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-blue-600">Contact</Link>
          </li>
          {/* Login/Register links removed from navbar */}
        </ul>
      </nav>

      {/* Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />



        {/* Protected Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/apply"
          element={
            <ProtectedRoute>
              <ApplyJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/upload-resume"
          element={
            <ProtectedRoute>
              <UploadResume />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/schedule-interview"
          element={
            <ProtectedRoute>
              <ScheduleInterview />
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <h2 style={{ textAlign: "center", marginTop: "50px" }}>
              404 Page Not Found
            </h2>
          }
        />
      </Routes>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center p-4 mt-10">
        <section className="py-16 px-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Our Contact Information
          </h2>
          <div className="space-y-4 text-gray-400">
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:support@placementsys.com"
                className="hover:underline text-white"
              >
                support@placementsys.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong> +91 9876543210
            </p>
          </div>
        </section>
        <p>© 2026 Placement Management System</p>
      </footer>
    </>
  );
}

export default App;