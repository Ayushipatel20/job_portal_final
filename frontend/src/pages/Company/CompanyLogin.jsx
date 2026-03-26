import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function CompanyLogin() {
  const navigate = useNavigate();

  // ✅ State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Login Function
  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/company/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("company", JSON.stringify(res.data.company));

      alert("Login Success ✅");

      // ✅ Redirect after login
      navigate("/company/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login Failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[350px]">
        <h2 className="text-2xl font-bold text-center mb-4">Company Login</h2>

        {/* ✅ Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        {/* ✅ Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        {/* ✅ Call API */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>

        <p className="text-center mt-3 text-sm">
          Don't have an account?
          <span
            onClick={() => navigate("/company/register")}
            className="text-blue-600 cursor-pointer ml-1"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}