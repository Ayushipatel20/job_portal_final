// src/pages/Student/ApplyJob.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase } from "react-icons/fa";

export default function ApplyJob() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) navigate("/login");
    else setUser(loggedInUser);

    const savedApps = JSON.parse(localStorage.getItem(`${loggedInUser.email}_applications`)) || [];
    setApplications(savedApps);
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobTitle || !companyName) return alert("Job title and company name are required!");
    const newApp = { jobTitle, companyName, coverLetter, status: "Applied" };
    const updatedApps = [...applications, newApp];
    localStorage.setItem(`${user.email}_applications`, JSON.stringify(updatedApps));
    alert(`Applied for ${jobTitle} at ${companyName} successfully!`);
    navigate("/student/dashboard");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-purple-50 rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaBriefcase size={30} className="text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Apply for a Job</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
            required
          />
          <textarea
            placeholder="Cover Letter (Optional)"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
            rows={4}
          />
          <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">
            Submit Application
          </button>
          <button type="button" onClick={() => navigate("/student/dashboard")} className="w-full bg-gray-300 py-2 rounded hover:bg-gray-400 transition">
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}