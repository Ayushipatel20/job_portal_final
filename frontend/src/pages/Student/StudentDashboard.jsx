import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";


export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
const [profilePic, setProfilePic] = useState(null);

  const navigate = useNavigate();

  // ================= FORMAT DATE =================
  const formatDateUTC = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = date.getUTCMonth() + 1; // months 1-12
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // '0' should be '12'

    return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
  };

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // ================= FETCH USER =================
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/student/me", {
        headers: getAuthHeaders(),
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
useEffect(() => {
    fetchUser();
    fetchJobs();
    fetchApplications();
    fetchInterviews();
  }, []);

  // ================= JOBS =================
  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/student/jobs", {
        headers: getAuthHeaders(),
      });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error fetching jobs");
    }
  };

  // ================= APPLICATIONS =================
  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/student/applications/my",
        { headers: getAuthHeaders() }
      );
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error fetching applications");
    }
  };

  // ================= INTERVIEWS =================
  const fetchInterviews = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/student/interviews/my",
        { headers: getAuthHeaders() }
      );
      setInterviews(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error fetching interviews");
    }
  };

  // ================= APPLY JOB =================
  const applyJob = async (jobId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/student/applications",
        { jobId },
        { headers: getAuthHeaders() }
      );
      alert("✅ Applied Successfully");
      fetchApplications();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("Token expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Error applying");
      }
    }
  };

  // ================= UPDATE PROFILE =================
  const handleProfileUpdate = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.put(
  "http://localhost:5000/api/student/me",
  {
    name: user.name,
    university: user.university,
    gpa: user.gpa,
    phone: user.phone,
    skills: user.skills,
    bio: user.bio,
  },
  { headers: getAuthHeaders() }
);

    setUser(res.data);
    alert("✅ Profile updated");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error updating profile");
  }
};




const handleProfilePicUpload = async () => {
  console.log(profilePic); // 👈 ADD HERE

  if (!profilePic) return alert("Select image first");
  const formData = new FormData();
  formData.append("profilePic", profilePic);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/student/upload-profile-pic",
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setUser(res.data.user || res.data);
    alert("✅ Profile pic uploaded");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Upload failed");
  }
};




  // ================= UPLOAD RESUME =================
const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return alert("Please select a file");

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/student/upload-resume",
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(res.data.user || res.data);
      alert("✅ Resume uploaded successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error uploading resume");
    }
  };


  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <h2 className="p-6">Loading...</h2>;



  const statusData = [
  { name: "Applied", value: applications.filter(a => a.status === "Applied").length },
  { name: "Selected", value: applications.filter(a => a.status === "Selected").length },
  { name: "Rejected", value: applications.filter(a => a.status === "Rejected").length },
];

const overviewData = [
  { name: "Jobs", count: jobs.length },
  { name: "Applications", count: applications.length },
  { name: "Interviews", count: interviews.length },
];





 return (
<div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>    {/* Sidebar */}
{/* Sidebar */}
{/* Sidebar */}
<div
  className={`w-64 p-5 shadow-lg transition-all duration-300 ${
    darkMode
      ? "bg-gray-800 text-white border-r border-gray-700"
      : "bg-white text-black"
  }`}
>
  <h2 className="text-2xl font-bold text-blue-500 mb-6">
    🎓 Student Panel
  </h2>

  <ul className="space-y-3">

    {/* OVERVIEW */}
    <li
      onClick={() => setActiveTab("overview")}
      className={`p-3 rounded-lg cursor-pointer transition ${
        activeTab === "overview"
          ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
          : darkMode
          ? "hover:bg-gray-700"
          : "hover:bg-gray-100"
      }`}
    >
      📊 Overview
    </li>

    {/* PROFILE */}
    <li
      onClick={() => setActiveTab("profile")}
      className={`p-3 rounded-lg cursor-pointer transition ${
        activeTab === "profile"
          ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
          : darkMode
          ? "hover:bg-gray-700"
          : "hover:bg-gray-100"
      }`}
    >
      👤 Profile
    </li>

    {/* JOBS */}
    <li
      onClick={() => {
        setActiveTab("jobs");
        fetchJobs();
      }}
      className={`p-3 rounded-lg cursor-pointer transition ${
        activeTab === "jobs"
          ? "bg-blue-500 text-white shadow"
          : darkMode
          ? "hover:bg-gray-700"
          : "hover:bg-gray-100"
      }`}
    >
      💼 Jobs
    </li>

    {/* APPLICATIONS */}
    <li
      onClick={() => {
        setActiveTab("applications");
        fetchApplications();
      }}
      className={`p-3 rounded-lg cursor-pointer transition ${
        activeTab === "applications"
          ? "bg-blue-500 text-white shadow"
          : darkMode
          ? "hover:bg-gray-700"
          : "hover:bg-gray-100"
      }`}
    >
      📄 Applications
    </li>

    {/* INTERVIEWS */}
    <li
      onClick={() => {
        setActiveTab("interviews");
        fetchInterviews();
      }}
      className={`p-3 rounded-lg cursor-pointer transition ${
        activeTab === "interviews"
          ? "bg-blue-500 text-white shadow"
          : darkMode
          ? "hover:bg-gray-700"
          : "hover:bg-gray-100"
      }`}
    >
      📅 Interviews
    </li>

    {/* LOGOUT */}
    <li
      onClick={logout}
      className={`p-3 rounded-lg cursor-pointer transition ${
        darkMode
          ? "text-red-400 hover:bg-red-900/30"
          : "text-red-500 hover:bg-red-100"
      }`}
    >
      🚪 Logout
    </li>
  </ul>
</div>


    

    {/* Content */}
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, <span className="text-blue-600">{user.name}</span> 👋
      </h1>


      <button
  onClick={() => setDarkMode(!darkMode)}
  className="mb-4 px-4 py-2 rounded bg-gray-800 text-white"
>
  {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
</button>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-6">

  <div className={`p-4 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
    <h3 className="text-gray-500">Jobs</h3>
    <p className="text-2xl font-bold">{jobs.length}</p>
  </div>

        <div className={`p-4 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="text-gray-500">Applications</h3>
          <p className="text-2xl font-bold">{applications.length}</p>
        </div>

        <div className={`p-4 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="text-gray-500">Interviews</h3>
          <p className="text-2xl font-bold">{interviews.length}</p>
        </div>

        <div className={`p-4 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="text-gray-500">Selected</h3>
          <p className="text-2xl font-bold text-green-600">
            {applications.filter((a) => a.status === "Selected").length}
          </p>
        </div>
      </div>

{activeTab === "overview" && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

    {/* BAR CHART */}
    <div className={`p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 ${
      darkMode ? "bg-gray-800 text-white" : "bg-white"
    }`}>
      <h2 className="text-lg font-semibold mb-4 text-indigo-600">
        📊 Overview Analytics
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={overviewData}>
          <XAxis dataKey="name" stroke={darkMode ? "#d1d5db" : "#6b7280"} tick={{ fill: darkMode ? "#d1d5db" : "#6b7280" }} />
          <YAxis stroke={darkMode ? "#d1d5db" : "#6b7280"} tick={{ fill: darkMode ? "#d1d5db" : "#6b7280" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#1f2937" : "#fff",
              borderRadius: "8px",
              border: "none"
            }}
            labelStyle={{ color: darkMode ? "#fff" : "#000" }}
            itemStyle={{ color: darkMode ? "#fff" : "#000" }}
          />
          <Bar dataKey="count" radius={[10, 10, 0, 0]}>
            {overviewData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  index === 0 ? "#6366f1" :
                  index === 1 ? "#22c55e" :
                  "#f59e0b"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* PIE CHART */}
    <div className={`p-6 rounded-2xl shadow-md transition ${
      darkMode ? "bg-gray-800 text-white" : "bg-white/80 backdrop-blur-lg border-r border-gray-200"
    }`}>
      <h2 className="text-lg font-semibold mb-4">🥧 Application Status</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={100} label>
            {statusData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.name === "Applied" ? "#3b82f6" :
                  entry.name === "Selected" ? "#22c55e" :
                  "#ef4444"
                }
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

  </div>
)}


      

{/* PROFILE */}
{activeTab === "profile" && (
  <div
    className={`p-6 rounded-xl shadow ${
      darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
    }`}
  >
    {/* PROFILE HEADER */}
    <div className="flex items-center gap-4 mb-4">
      <img
      src={
  user.profilePicUrl
    ? user.profilePicUrl
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
}
        alt="profile"
        className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover"
      />
      <div>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className={darkMode ? "text-gray-300" : "text-gray-500"}>
          {user.email}
        </p>
      </div>
    </div>

    {/* Profile Form */}
    <form onSubmit={handleProfileUpdate} className="space-y-3">
      <input
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        placeholder="Name"
        className={`w-full border p-2 rounded ${
          darkMode ? "bg-gray-700 text-white border-gray-600" : ""
        }`}
      />

      {/* NEW FIELD */}
      <input
        value={user.phone || ""}
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
        placeholder="Phone"
        className={`w-full border p-2 rounded ${
          darkMode ? "bg-gray-700 text-white border-gray-600" : ""
        }`}
      />

      <input
        value={user.university || ""}
        onChange={(e) => setUser({ ...user, university: e.target.value })}
        placeholder="University"
        className={`w-full border p-2 rounded ${
          darkMode ? "bg-gray-700 text-white border-gray-600" : ""
        }`}
      />

      <input
        value={user.gpa || ""}
        onChange={(e) => setUser({ ...user, gpa: e.target.value })}
        placeholder="GPA"
        className={`w-full border p-2 rounded ${
          darkMode ? "bg-gray-700 text-white border-gray-600" : ""
        }`}
      />

      {/* NEW FIELD */}
      <input
        value={user.skills || ""}
        onChange={(e) => setUser({ ...user, skills: e.target.value })}
        placeholder="Skills (React, Node, etc)"
        className={`w-full border p-2 rounded ${
          darkMode ? "bg-gray-700 text-white border-gray-600" : ""
        }`}
      />

      {/* NEW FIELD */}
      <textarea
        value={user.bio || ""}
        onChange={(e) => setUser({ ...user, bio: e.target.value })}
        placeholder="Short Bio"
        className={`w-full border p-2 rounded ${
          darkMode ? "bg-gray-700 text-white border-gray-600" : ""
        }`}
      />

      <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
        Update Profile
      </button>
    </form>

    {/* PROFILE PIC UPLOAD (UI ONLY) */}
    <div className="mt-4">
      <input
  type="file"
  accept="image/*"
  onChange={(e) => setProfilePic(e.target.files[0])}
  className={`border p-2 rounded ${
    darkMode ? "bg-gray-700 text-white border-gray-600" : ""
  }`}
/>
      <button
  type="button"
  onClick={handleProfilePicUpload}
  className="bg-purple-600 text-white px-4 py-2 rounded ml-2 hover:bg-purple-700"
>
  Upload Photo
</button>
    </div>

    {/* Resume Upload */}
    <form onSubmit={handleResumeUpload} className="mt-4 space-y-2">
      <input
        type="file"
        onChange={(e) => setResumeFile(e.target.files[0])}
        className={`border p-2 rounded ${
          darkMode ? "bg-gray-700 text-white border-gray-600" : ""
        }`}
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded ml-2 hover:bg-green-700">
        Upload Resume
      </button>

      {/* Current Resume Section */}
      {user.resumeUrl && (
        <div
          className={`mt-4 p-3 rounded border ${
            darkMode
              ? "border-gray-600 bg-gray-700"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <p className="font-semibold mb-2">📄 Current Resume:</p>

          <a
            href={user.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline hover:text-blue-700 break-all"
          >
            {user.resume
              ? user.resume
              : user.resumeUrl.split("/").pop()}
          </a>
        </div>
      )}
    </form>
  </div>
)}


      

      {/* JOBS */}
{activeTab === "jobs" && (
  <div className="grid gap-4">
    {jobs.map((job) => {
const hasApplied = applications.some(app => app.jobId === job._id);
      return (
        <div
          key={job._id}
          className={`p-5 rounded-xl shadow hover:shadow-lg transition ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <h3 className="text-xl font-bold">
            Job Title: {job.title}
          </h3>

          <p className={darkMode ? "text-gray-300" : "text-gray-500"}>
            Location: {job.location}
          </p>

          <p
            className={`${
              darkMode ? "text-gray-400" : "text-gray-600"
            } text-sm`}
          >
            Company: {job.companyName || "N/A"}
          </p>

          <button
            disabled={hasApplied}
            onClick={() => applyJob(job._id)}
            className={`mt-3 px-4 py-2 rounded text-white ${
              hasApplied
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {hasApplied ? "Applied" : "Apply"}
          </button>
        </div>
      );
    })}
  </div>
)}

      {/* APPLICATIONS */}
{activeTab === "applications" && (
  <div className="grid gap-3">
    {applications.map((app) => (
      <div
        key={app._id}
        className={`p-4 rounded-xl shadow ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <p className="font-semibold">
          Job Title: {app.job}
        </p>

        <p className={darkMode ? "text-gray-300" : "text-gray-500"}>
          Company: {app.companyName}
        </p>

        <p>
          Status:{" "}
          <span className="text-blue-500 font-bold">
            {app.status}
          </span>
        </p>
      </div>
    ))}
  </div>
)}

  {/* INTERVIEWS */}
{activeTab === "interviews" && (
  <div className="grid gap-3">
    
    {interviews.length === 0 && (
      <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
        No interviews scheduled
      </p>
    )}

    {interviews.map((intv) => (
      <div
        key={intv._id}
        className={`p-4 rounded shadow ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <p className="font-semibold">{intv.jobTitle}</p>

        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
          Company: {intv.companyName || "N/A"}
        </p>

        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
          Interview Date: {formatDateUTC(intv.date)}
        </p>

        <p>
          Status:{" "}
          <span className="font-bold text-blue-500">
            {intv.status}
          </span>
        </p>

        {intv.interviewer && (
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Interviewer: {intv.interviewer}
          </p>
        )}

        {intv.mode && (
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Mode: {intv.mode}
          </p>
        )}

        {intv.link && (
          <p>
            Link:{" "}
            <a
              href={intv.link}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline"
            >
              Join Interview
            </a>
          </p>
        )}
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
}