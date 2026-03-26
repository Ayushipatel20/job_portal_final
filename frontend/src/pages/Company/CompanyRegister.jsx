import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CompanyRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    email: "",
    location: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/company/register",
        form
      );

      alert("Registered Successfully ✅");
      navigate("/company/login");
    } catch (err) {
      console.log(err);
      alert("Registration Failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[350px]">
        <h2 className="text-2xl font-bold text-center mb-4">
          Company Register
        </h2>

        <input
          name="companyName"
          placeholder="Company Name"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}