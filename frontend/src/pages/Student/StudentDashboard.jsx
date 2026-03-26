// src/pages/Student/StudentDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaFileAlt, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import "../../App.css";
import "./Student.css";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const [profile, setProfile] = useState({});
  const [resume, setResume] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    if (!user) navigate("/login");

    const savedProfile = JSON.parse(localStorage.getItem(`${user.email}_profile`)) || {};
    const savedResume = localStorage.getItem(`${user.email}_resume`) || null;
    const savedApplications = JSON.parse(localStorage.getItem(`${user.email}_applications`)) || [];
    const savedInterviews = JSON.parse(localStorage.getItem(`${user.email}_interviews`)) || [];

    setProfile(savedProfile);
    setResume(savedResume);
    setApplications(savedApplications);
    setInterviews(savedInterviews);
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const cards = [
    {
      title: "Profile",
      icon: <FaUser size={30} className="text-blue-600" />,
      description: profile.name ? `Name: ${profile.name}\nCollege: ${profile.college || "-"}\nDegree: ${profile.degree || "-"}` : "No profile info yet.",
      actionText: "Edit Profile",
      action: () => navigate("/student/profile"),
      color: "bg-blue-50",
    },
    {
      title: "Resume",
      icon: <FaFileAlt size={30} className="text-green-600" />,
      description: resume || "No resume uploaded.",
      actionText: "Upload Resume",
      action: () => navigate("/student/upload-resume"),
      color: "bg-green-50",
    },
    {
      title: "Apply Jobs",
      icon: <FaBriefcase size={30} className="text-purple-600" />,
      description: `Applied Jobs: ${applications.length}`,
      actionText: "Apply Now",
      action: () => navigate("/student/apply-job"),
      color: "bg-purple-50",
    },
    {
      title: "Interviews",
      icon: <FaCalendarAlt size={30} className="text-red-600" />,
      description: interviews.length === 0 ? "No interviews scheduled." : "",
      actionText: "Schedule Interview",
      action: () => navigate("/student/schedule-interview"),
      color: "bg-red-50",
    },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Welcome, {user.name}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform transition cursor-pointer ${card.color}`}
            onClick={card.action}
          >
            <div className="flex items-center gap-4 mb-4">{card.icon}<h2 className="text-xl font-bold text-gray-700">{card.title}</h2></div>
            <p className="text-gray-600 whitespace-pre-line mb-4">{card.description}</p>
            <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition w-full">{card.actionText}</button>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Application Status</h2>
        {applications.length === 0 ? <p className="text-gray-600">No applications yet.</p> :
          <ul className="list-disc list-inside text-gray-700">{applications.map((app, idx) => <li key={idx}>{app.jobTitle} - {app.status}</li>)}</ul>}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Interview Schedule</h2>
        {interviews.length === 0 ? <p className="text-gray-600">No interviews scheduled.</p> :
          <ul className="list-disc list-inside text-gray-700">{interviews.map((intv, idx) => <li key={idx}>{intv.jobTitle} - {intv.date}</li>)}</ul>}
      </div>
    </div>
  );
}