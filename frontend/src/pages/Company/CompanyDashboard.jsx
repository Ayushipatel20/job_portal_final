import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanyName from "../Company/CompanyName.jsx";

// Helper to format date strings
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
};

const STATUS_COLORS = {
  "Under Review": "bg-yellow-100 text-yellow-800",
  "Shortlisted": "bg-blue-100 text-blue-800",
  "Interview Scheduled": "bg-purple-100 text-purple-800",
  "Selected": "bg-green-100 text-green-800",
  "Rejected": "bg-red-100 text-red-800",
  "Open": "bg-green-100 text-green-800",
  "Closed": "bg-gray-100 text-gray-800",
  "Scheduled": "bg-blue-100 text-blue-800",
  "Completed": "bg-green-100 text-green-800",
  "Cancelled": "bg-red-100 text-red-800",
};

const Badge = ({ status }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status] || "bg-gray-100 text-gray-700"}`}>
    {status}
  </span>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&#x2715;</button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

export default function CompanyDashboard() {
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState("overview");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Modals
  const [showJobModal, setShowJobModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  // Forms
  const [jobForm, setJobForm] = useState({ 
  title: "", 
  department: "", 
  location: "", 
  type: "Full-time", 
  description: "" 
});

const [intForm, setIntForm] = useState({ 
  candidateName: "", 
  job: "", 
  date: "", 
  time: "", 
  interviewer: "", 
  mode: "Video Call", 
  link: "" 
});
  const API_URL = "http://localhost:5000/api";

  // Define navItems inside component
  const navItems = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "jobs", label: "Job Openings", icon: "💼" },
    { id: "applications", label: "Applications", icon: "📋" },
    { id: "shortlist", label: "Shortlisted", icon: "⭐" },
    { id: "interviews", label: "Interviews", icon: "📅" },
  ];

  // --- HELPER: GET TOKEN & HEADERS ---
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      
      // 1. Agar token nahi hai, sidha login pe bhejo
      if (!token) {
        navigate("/company/login");
        return;
      }

      try {
        // 2. Fetch Data with Headers
        const headers = getAuthHeaders();
        
        const [jobsRes, appsRes, intsRes] = await Promise.all([
          fetch(`${API_URL}/jobs`, { headers }).then(res => res.json()),
          fetch(`${API_URL}/applications`, { headers }).then(res => res.json()),
          fetch(`${API_URL}/interviews`, { headers }).then(res => res.json())
        ]);

        // 3. Check if data is valid array (Prevents Crash)
        if (Array.isArray(jobsRes)) setJobs(jobsRes);
        if (Array.isArray(appsRes)) setApplications(appsRes);
        if (Array.isArray(intsRes)) setInterviews(intsRes);

      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Agar error aaye toh login pe redirect karo
        navigate("/company/login");
      }
    };
    fetchData();
  }, [navigate]);

  // --- STATS CALCULATION (Safe) ---
  const stats = [
    { label: "Open Positions", value: jobs.filter(j => j.status === "Open").length, icon: "💼", color: "bg-blue-50 border-blue-200" },
    { label: "Total Applications", value: applications.length, icon: "📋", color: "bg-purple-50 border-purple-200" },
    { label: "Shortlisted", value: applications.filter(a => a.status === "Shortlisted" || a.status === "Interview Scheduled").length, icon: "⭐", color: "bg-yellow-50 border-yellow-200" },
    { label: "Selected", value: applications.filter(a => a.status === "Selected").length, icon: "✅", color: "bg-green-50 border-green-200" },
  ];

  // --- ACTIONS ---

  // 1. Post Job
  async function postJob() {
    if (!jobForm.title || !jobForm.department) return;
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(jobForm)
      });
      const newJob = await res.json();
      if (newJob._id) setJobs(prev => [...prev, newJob]); // Only add if valid
      setJobForm({ title: "", department: "", location: "", type: "Full-time", description: "" });
      setShowJobModal(false);
    } catch (err) {
      console.error("Error posting job:", err);
    }
  }

  // 2. Update Application Status
  async function updateStatus(appId, newStatus) {
    try {
      await fetch(`${API_URL}/applications/${appId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
      if (selectedCandidate?._id === appId) setSelectedCandidate(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }

  // 3. Schedule Interview
  async function scheduleInterview() {
    if (!intForm.candidateName || !intForm.date) return;
    const app = applications.find(a => a.name === intForm.candidateName);
    
    try {
      const res = await fetch(`${API_URL}/interviews`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...intForm, applicationId: app ? app._id : null })
      });
      const newInterview = await res.json();
      
      if (newInterview._id) {
        setInterviews(prev => [...prev, newInterview]);
        if (app) {
          setApplications(prev => prev.map(a => a._id === app._id ? {...a, status: "Interview Scheduled"} : a));
        }
      }
      
      setIntForm({ candidateName: "", job: "", date: "", time: "", interviewer: "", mode: "Video Call", link: "" });
      setShowInterviewModal(false);
    } catch (err) {
      console.error("Error scheduling interview:", err);
    }
  }

  // 4. Toggle Job Status
  async function toggleJobStatus(id) {
    try {
      const res = await fetch(`${API_URL}/jobs/${id}/toggle`, {
        method: "PATCH",
        headers: getAuthHeaders()
      });
      const updatedJob = await res.json();
      
      if (updatedJob._id) setJobs(prev => prev.map(j => j._id === id ? updatedJob : j));
    } catch (err) {
      console.error("Error toggling job status:", err);
    }
  }

  // 5. Update Interview Status
  async function updateInterviewStatus(id, status) {
    try {
      await fetch(`${API_URL}/interviews/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      setInterviews(prev => prev.map(x => x._id === id ? { ...x, status } : x));
    } catch (err) {
      console.error("Error updating interview:", err);
    }
  }

  // --- FILTERS ---
  const filteredApps = filterStatus === "All" ? applications : applications.filter(a => a.status === filterStatus);
  const shortlisted = applications.filter(a => ["Shortlisted", "Interview Scheduled", "Selected"].includes(a.status));

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1";
  const btnPrimary = "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition";
  const btnSecondary = "bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition";

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shrink-0`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">C</div>
          {sidebarOpen && <CompanyName />}
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                activeTab === item.id ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <button onClick={() => setSidebarOpen(o => !o)} className="m-4 text-xs text-gray-400 hover:text-gray-600 text-left">
          {sidebarOpen ? "◀ Collapse" : "▶"}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {navItems.find(n => n.id === activeTab)?.icon} {navItems.find(n => n.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === "jobs" && (<button onClick={() => setShowJobModal(true)} className={btnPrimary}>+ Post Job</button>)}
            {activeTab === "interviews" && (<button onClick={() => setShowInterviewModal(true)} className={btnPrimary}>+ Schedule Interview</button>)}
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">HR</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map(s => (
                    <div key={s.label} className={`border rounded-2xl p-5 ${s.color} flex items-center gap-4`}>
                      <div className="text-3xl">{s.icon}</div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{s.value}</div>
                        <div className="text-xs text-gray-500">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Grid for recent activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h2 className="font-semibold text-gray-800 mb-4">Recent Applications</h2>
                    <div className="space-y-3">
                      {applications.slice(0, 4).map(a => (
                        <div key={a._id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">{a.name}</p>
                            <p className="text-xs text-gray-400">{a.job}</p>
                          </div>
                          <Badge status={a.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h2 className="font-semibold text-gray-800 mb-4">Upcoming Interviews</h2>
                    <div className="space-y-3">
                      {interviews.filter(i => i.status === "Scheduled").map(i => (
                        <div key={i._id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">{i.candidateName}</p>
                            <p className="text-xs text-gray-400">{i.date} at {i.time}</p>
                          </div>
                          <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">{i.mode}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* JOBS */}
            {activeTab === "jobs" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map(j => (
                  <div key={j._id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{j.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{j.department}</p>
                      </div>
                      <Badge status={j.status} />
                    </div>
                    <div className="space-y-1 text-xs text-gray-500 mb-4">
                      <p>📍 {j.location}</p>
                      <p>📅 Posted: {formatDate(j.posted)}</p>
                    </div>
                    <button onClick={() => toggleJobStatus(j._id)} className={`w-full text-xs py-1.5 rounded-lg font-medium transition ${j.status === "Open" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                      {j.status === "Open" ? "Close Position" : "Reopen Position"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* APPLICATIONS */}
            {activeTab === "applications" && (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">All Applications ({filteredApps.length})</h2>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
                    {["All", "Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"].map(s => (<option key={s}>{s}</option>))}
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                        <th className="px-5 py-3 text-left">Candidate</th>
                        <th className="px-5 py-3 text-left">Job</th>
                        <th className="px-5 py-3 text-left">Status</th>
                        <th className="px-5 py-3 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredApps.map(a => (
                        <tr key={a._id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 font-medium text-gray-800">{a.name}</td>
                          <td className="px-5 py-3 text-gray-600">{a.job}</td>
                          <td className="px-5 py-3"><Badge status={a.status} /></td>
                          <td className="px-5 py-3"><button onClick={() => setSelectedCandidate(a)} className="text-blue-600 hover:underline text-xs">View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SHORTLIST */}
            {activeTab === "shortlist" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shortlisted.map(a => (
                  <div key={a._id} className="bg-white border border-gray-200 rounded-2xl p-5">
                    <p className="font-semibold">{a.name}</p>
                    <Badge status={a.status} />
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => updateStatus(a._id, "Selected")} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">Select</button>
                      <button onClick={() => updateStatus(a._id, "Rejected")} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* INTERVIEWS */}
            {activeTab === "interviews" && (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                     <tr>
                       <th className="px-5 py-3 text-left">Candidate</th>
                       <th className="px-5 py-3 text-left">Date</th>
                       <th className="px-5 py-3 text-left">Status</th>
                       <th className="px-5 py-3 text-left">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {interviews.map(i => (
                       <tr key={i._id}>
                         <td className="px-5 py-3">{i.candidateName}</td>
                         <td className="px-5 py-3">{i.date} at {i.time}</td>
                         <td className="px-5 py-3"><Badge status={i.status} /></td>
                         <td className="px-5 py-3">
                           <button onClick={() => updateInterviewStatus(i._id, "Completed")} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded mr-2">Done</button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
              </div>
            )}
        </main>
      </div>

      {/* Modals (Kept standard) */}
      {/* ------------------- POST JOB MODAL ------------------- */}
{showJobModal && (
  <Modal title="Post New Job Opening" onClose={() => setShowJobModal(false)}>
    <div className="space-y-3">
      {/* Title */}
      <div>
        <label className={labelCls}>Job Title *</label>
        <input
          className={inputCls}
          placeholder="e.g. Software Engineer"
          value={jobForm.title}
          onChange={e => setJobForm(p => ({ ...p, title: e.target.value }))}
        />
      </div>

      {/* Department */}
      <div>
        <label className={labelCls}>Department *</label>
        <input
          className={inputCls}
          placeholder="e.g. Engineering"
          value={jobForm.department}
          onChange={e => setJobForm(p => ({ ...p, department: e.target.value }))}
        />
      </div>

      {/* Location */}
      <div>
        <label className={labelCls}>Location</label>
        <input
          className={inputCls}
          placeholder="e.g. Remote, New York, London"
          value={jobForm.location}
          onChange={e => setJobForm(p => ({ ...p, location: e.target.value }))}
        />
      </div>

      {/* Type (Dropdown) */}
      <div>
        <label className={labelCls}>Employment Type</label>
        <select
          className={inputCls}
          value={jobForm.type}
          onChange={e => setJobForm(p => ({ ...p, type: e.target.value }))}
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Job Description</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={3}
          placeholder="Describe responsibilities, requirements..."
          value={jobForm.description}
          onChange={e => setJobForm(p => ({ ...p, description: e.target.value }))}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <button onClick={postJob} className={btnPrimary}>Post Job</button>
        <button onClick={() => setShowJobModal(false)} className={btnSecondary}>Cancel</button>
      </div>
    </div>
  </Modal>
)}

{/* ------------------- SCHEDULE INTERVIEW MODAL ------------------- */}
{showInterviewModal && (
  <Modal title="Schedule Interview" onClose={() => setShowInterviewModal(false)}>
    <div className="space-y-3">
      {/* Candidate Name (Select from applications) */}
      <div>
        <label className={labelCls}>Candidate *</label>
        <select
          className={inputCls}
          value={intForm.candidateName}
          onChange={e => setIntForm(p => ({ ...p, candidateName: e.target.value }))}
        >
          <option value="">Select candidate</option>
          {applications.map(a => (
            <option key={a._id} value={a.name}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Job Role */}
      <div>
        <label className={labelCls}>Job Role</label>
        <input
          className={inputCls}
          placeholder="e.g. Frontend Developer"
          value={intForm.job}
          onChange={e => setIntForm(p => ({ ...p, job: e.target.value }))}
        />
      </div>

      {/* Date & Time Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Date *</label>
          <input
            type="date"
            className={inputCls}
            value={intForm.date}
            onChange={e => setIntForm(p => ({ ...p, date: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelCls}>Time</label>
          <input
            type="time"
            className={inputCls}
            value={intForm.time}
            onChange={e => setIntForm(p => ({ ...p, time: e.target.value }))}
          />
        </div>
      </div>

      {/* Interviewer */}
      <div>
        <label className={labelCls}>Interviewer</label>
        <input
          className={inputCls}
          placeholder="e.g. Jane Doe (HR Manager)"
          value={intForm.interviewer}
          onChange={e => setIntForm(p => ({ ...p, interviewer: e.target.value }))}
        />
      </div>

      {/* Mode (Dropdown) */}
      <div>
        <label className={labelCls}>Mode</label>
        <select
          className={inputCls}
          value={intForm.mode}
          onChange={e => setIntForm(p => ({ ...p, mode: e.target.value }))}
        >
          <option value="Video Call">Video Call</option>
          <option value="In-Person">In-Person</option>
          <option value="Phone">Phone</option>
        </select>
      </div>

      {/* Meeting Link */}
      <div>
        <label className={labelCls}>Meeting Link (optional)</label>
        <input
          className={inputCls}
          placeholder="https://meet.google.com/..."
          value={intForm.link}
          onChange={e => setIntForm(p => ({ ...p, link: e.target.value }))}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <button onClick={scheduleInterview} className={btnPrimary}>Schedule</button>
        <button onClick={() => setShowInterviewModal(false)} className={btnSecondary}>Cancel</button>
      </div>
    </div>
  </Modal>
)}
      

      {selectedCandidate && (
        <Modal title="Candidate" onClose={() => setSelectedCandidate(null)}>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">{selectedCandidate.name}</h3>
            <p className="text-sm text-gray-500">{selectedCandidate.email}</p>
            <div className="flex flex-wrap gap-2 mt-4">
               {["Under Review", "Shortlisted", "Selected", "Rejected"].map(s => (
                  <button key={s} onClick={() => updateStatus(selectedCandidate._id, s)} className={`text-xs px-3 py-1.5 rounded-full border ${selectedCandidate.status === s ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>{s}</button>
               ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}