// src/pages/Student/ScheduleInterview.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";

export default function ScheduleInterview() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) navigate("/login");
    else setUser(loggedInUser);

    const savedInterviews = JSON.parse(localStorage.getItem(`${loggedInUser.email}_interviews`)) || [];
    setInterviews(savedInterviews);
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobTitle || !date || !time) return alert("All fields are required!");
    const newInterview = { jobTitle, date, time };
    const updatedInterviews = [...interviews, newInterview];
    localStorage.setItem(`${user.email}_interviews`, JSON.stringify(updatedInterviews));
    alert(`Interview scheduled for ${jobTitle} on ${date} at ${time}`);
    navigate("/student/dashboard");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-red-50 rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaCalendarAlt size={30} className="text-red-600" />
          <h2 className="text-2xl font-bold text-gray-800">Schedule Interview</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400"
            required
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400"
            required
          />
          <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition">
            Schedule Interview
          </button>
          <button type="button" onClick={() => navigate("/student/dashboard")} className="w-full bg-gray-300 py-2 rounded hover:bg-gray-400 transition">
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}