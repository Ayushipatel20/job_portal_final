// src/pages/Student/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../App.css";
import "./Student.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Call backend login API
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      // Save JWT token and user info in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("loggedInUser", JSON.stringify(res.data.user));

      // Redirect to student dashboard
      navigate("/student/dashboard", { replace: true });
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Student Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-red-600">{message}</p>}

        {/* Links */}
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 hover:underline">
            Register
          </Link>
        </p>
        <p className="mt-2 text-center text-gray-600">
          <Link to="/forgot-password" className="text-yellow-600 hover:underline">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
}