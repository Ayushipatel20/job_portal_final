// src/pages/Student/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaCamera } from "react-icons/fa";
import "../../App.css";
import "./Student.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [degree, setDegree] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [skills, setSkills] = useState("");

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) navigate("/login");
    else setUser(loggedInUser);

    // Load saved profile
    const savedProfile = JSON.parse(localStorage.getItem(`${loggedInUser.email}_profile`)) || {};
    setProfilePic(savedProfile.profilePic || null);
    setName(savedProfile.name || loggedInUser.name);
    setCollege(savedProfile.college || "");
    setDegree(savedProfile.degree || "");
    setPhone(savedProfile.phone || "");
    setAddress(savedProfile.address || "");
    setSkills(savedProfile.skills || "");
  }, [navigate]);

  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setProfilePic(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = { profilePic, name, college, degree, phone, address, skills };
    localStorage.setItem(`${user.email}_profile`, JSON.stringify(updatedProfile));
    alert("Profile saved successfully!");
    navigate("/student/dashboard");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-blue-50 rounded-2xl shadow-lg w-full max-w-3xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FaUser className="text-blue-600" /> Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 mb-2">
              <img
                src={profilePic || "/default-avatar.png"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
              />
              <label htmlFor="profilePic" className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                <FaCamera className="text-white" />
              </label>
              <input type="file" id="profilePic" accept="image/*" className="hidden" onChange={handlePicUpload} />
            </div>
            <p className="text-gray-600 text-sm">Click the camera to upload profile picture</p>
          </div>

          {/* Two-column grid for inputs */}
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" required />
            <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />

            <input type="text" placeholder="College / University" value={college} onChange={(e) => setCollege(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
            <input type="text" placeholder="Degree" value={degree} onChange={(e) => setDegree(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />

            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 md:col-span-2" />
            <input type="text" placeholder="Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 md:col-span-2" />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Save Profile
          </button>
          <button type="button" onClick={() => navigate("/student/dashboard")} className="w-full bg-gray-300 py-2 rounded hover:bg-gray-400 transition">
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}