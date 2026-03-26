// src/pages/Student/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../App.css";
import "./Student.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Call backend API to send reset code
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data.message || "Reset code sent to your email");

      // Redirect to reset password page with email in state after 1 second
      setTimeout(() => navigate("/reset-password", { state: { email } }), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Email not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Forgot Password</h2>

        <form onSubmit={handleSendCode} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            className="w-full p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700"
            disabled={loading}
          >
            {loading ? "Sending code..." : "Send Reset Code"}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </div>
    </div>
  );
}