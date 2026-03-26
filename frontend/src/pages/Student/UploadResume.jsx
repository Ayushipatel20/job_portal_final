// src/pages/Student/UploadResume.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaUpload } from "react-icons/fa";

export default function UploadResume() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState("");

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) navigate("/login");
    else setUser(loggedInUser);

    const savedResume = localStorage.getItem(`${loggedInUser.email}_resume`);
    if (savedResume) setResumeName(savedResume);
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      alert("Please upload PDF or Word document only!");
      return;
    }
    setResumeFile(file);
    setResumeName(file.name);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      alert("Please upload PDF or Word document only!");
      return;
    }
    setResumeFile(file);
    setResumeName(file.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resumeFile) return alert("Please select a resume file!");
    localStorage.setItem(`${user.email}_resume`, resumeFile.name);
    alert("Resume uploaded successfully!");
    navigate("/student/dashboard");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-green-50 rounded-2xl shadow-lg w-full max-w-md p-8 flex flex-col items-center">
        <FaFileAlt size={50} className="text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Your Resume</h2>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
          {/* Drag & Drop Box */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="w-full p-8 border-2 border-dashed border-green-400 rounded-lg flex flex-col items-center justify-center text-gray-600 hover:border-green-600 transition cursor-pointer"
          >
            {resumeName ? (
              <p className="text-gray-700 font-medium">Selected File: <span className="font-bold">{resumeName}</span></p>
            ) : (
              <p className="text-gray-500">Drag & drop your resume here or click the button below</p>
            )}
          </div>

          {/* File Input Button */}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            id="resumeInput"
            className="hidden"
          />
          <label
            htmlFor="resumeInput"
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition cursor-pointer"
          >
            <FaUpload /> Choose File
          </label>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition mt-2"
          >
            Upload Resume
          </button>

          <button
            type="button"
            onClick={() => navigate("/student/dashboard")}
            className="w-full bg-gray-300 py-2 rounded hover:bg-gray-400 transition"
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}