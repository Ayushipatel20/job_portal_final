import heroImg from "../assets/hero.jpeg";       // top-left illustration
import jobsImg from "../assets/job1.jpeg";  
import aboutImg from "../assets/about1.jpg";
// bottom-right illustrationg
import "../App.css"; 
export default function About() {
  return (
    <div className="bg-gray-50 text-gray-800">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About Placement Management System
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">
          A smart platform connecting students, companies, and placement officers
          to simplify and modernize the recruitment process.
        </p>
      </section>

      {/* About Description */}
    <div className="joinSection">
      <div className="imageContainer">
        <img src={aboutImg} alt="join us" />
      </div>

      <div className="content">
        <h1>Come on, join with us !</h1>
        <p>Create an account and refer your friend</p>
      </div>
    </div>


      {/* Mission Section */}
      <section className="bg-white py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-10 text-blue-600">
          Our Mission
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            "Empower students with better career opportunities",
            "Help companies find the right talent quickly",
            "Enable colleges to manage placements efficiently",
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl shadow-md hover:shadow-xl transition bg-gray-50"
            >
              <p className="text-lg font-medium text-center">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">
          What We Provide
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Student */}
          <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-3 text-blue-600">
              👨‍🎓 Students
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Create and manage profiles</li>
              <li>• Apply for jobs & internships</li>
              <li>• Track applications</li>
            </ul>
          </div>

          {/* Company */}
          <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-3 text-blue-600">
              🏢 Companies
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Post job openings</li>
              <li>• Shortlist candidates</li>
              <li>• Manage recruitment</li>
            </ul>
          </div>

          {/* Placement */}
          <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-3 text-blue-600">
              🧑‍💼 Placement Officers
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Monitor student progress</li>
              <li>• Manage companies</li>
              <li>• Generate reports</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-10 text-blue-600">
          Why Choose Our System?
        </h2>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto text-center">
          {[
            "🤝 Seamless Connections",
            "🔒 Secure & Reliable",
            "🌐 find jobs easily",
            "⚡ Fast & Efficient",
               
          ].map((item, index) => (
            <div
              key={index}
              className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              <p className="font-medium">{item}</p>
            </div>
          ))}
        </div>
      </section>

<section className="bg-[#f3f5f9] py-24 px-6">
  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

    {/* LEFT SIDE */}
    <div>
      <h2 className="text-5xl font-bold text-[#1e3557] leading-tight mb-6">
        Over 10,000 top <br /> companies join with us
      </h2>

      <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
        Posting now includes out of the box integration with major CRM &
        accounting and ERP platforms, as well as an open API that allows
        you to seamlessly integrate with your business systems.
      </p>
    </div>

    {/* RIGHT SIDE */}
    <div className="relative h-[400px] flex items-center justify-center">

      {/* CENTER BIG */}
      <div className="absolute w-52 h-52 bg-white rounded-full shadow-xl flex items-center justify-center">
        <span className="text-2xl font-bold text-blue-700">SAMSUNG</span>
      </div>

      {/* SMALL LOGOS */}
      <div className="absolute top-4 left-20 w-16 h-16 bg-white rounded-full shadow flex items-center justify-center text-xs">
        <span className="font-bold text-blue-700">Microsoft</span>
      </div>

      <div className="absolute top-10 right-16 w-16 h-16 bg-white rounded-full shadow flex items-center justify-center text-xs">
        <span className="font-bold text-blue-700">GOOGLE</span>
      </div>

      <div className="absolute top-32 right-4 w-16 h-16 bg-white rounded-full shadow flex items-center justify-center text-xs">
        <span className="font-bold text-pink-700">IBM</span>
      </div>

      <div className="absolute bottom-6 left-10 w-16 h-16 bg-white rounded-full shadow flex items-center justify-center text-xs">
        <span className="font-bold text-blue-700">TCS</span>
      </div>

      <div className="absolute bottom-10 right-20 w-16 h-16 bg-white rounded-full shadow flex items-center justify-center text-xs">
        <span className="font-bold text-blue-700">Infosys</span>
      </div>

      <div className="absolute bottom-[-10px] right-0 w-20 h-20 bg-white rounded-full shadow flex items-center justify-center text-xs">
        <span className="font-bold text-red-700">Accenture</span>
      </div>

      <div className="absolute bottom-[-20px] left-40 w-16 h-16 bg-white rounded-full shadow flex items-center justify-center text-xs">
        <span className="font-bold text-pink-700">Wipro</span>
      </div>

      <div className="absolute top-40 left-0 w-14 h-14 bg-white rounded-full shadow flex items-center justify-center text-xs">
        <span className="font-bold text-green-700">SBI</span>
      </div>

    </div>
  </div>
</section>
{/* <div className="section">
        <div className="imageWrapper">
          <img src={heroImg} alt="hero" />
        </div>

        <div className="textWrapper">
          <h2>Find your passion and achieve success</h2>
          <p>
            Find a job that suits your interests and talents. A high salary is
            not the top priority. Most importantly, you can work according to
            your heart's desire.
          </p>
        </div>
      </div>

      {/* Section 2 */}
      {/* <div className="section reverse">
        <div className="textWrapper">
          <h2>Million of jobs, finds the one thats rights for you</h2>
          <p>
            Get your blood tests delivered at home collect a sample from the
            news your blood tests.
          </p>
        </div>

        <div className="imageWrapper">
          <img src={jobsImg} alt="jobs" />
        </div>
      </div> */} 
    </div>
  );
}