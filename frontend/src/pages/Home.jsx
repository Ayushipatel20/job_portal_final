// src/pages/HomePage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero.jpeg";       // top-left illustration
import jobsImg from "../assets/job1.jpeg";       // bottom-right illustration
import "../App.css";
import "../pages/Student/Student.css";    // corrected CSS path




export default function HomePage() {
  const [active, setActive] = useState("home");

  const panels = [
    {
      title: "Student Panel",
      desc: "Manage profiles, apply to jobs, and track applications.",
      link: "/login",
      buttonText: "Login",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Company Panel",
      desc: "Post jobs, shortlist candidates, and manage recruitment.",
      link: "/company/login",
      buttonText: "Login",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Placement Panel",
      desc: "Coordinate placements, monitor progress, and manage data.",
      link: "/login",
      buttonText: "Login",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
  ];

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="h-[80vh] flex flex-col justify-center items-center text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Placement Management System
        </h2>
        <p className="max-w-xl text-lg mb-6">
          Connecting Students, Companies, and Placement Officers in one unified platform.
        </p>
        <Link to="/login">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100">
            Get Started
          </button>
        </Link>
      </section>

      {/* Panels Section */}
      <section className="py-16 px-8 grid md:grid-cols-3 gap-8">
        {panels.map((panel, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition bg-white"
          >
            <h3 className="text-xl font-bold mb-2 text-blue-600">
              {panel.title}
            </h3>
            <p className="mb-4 text-gray-600">{panel.desc}</p>
            <Link to={panel.link}>
              <div
                className={`${panel.buttonColor} text-white px-4 py-2 rounded-lg text-center`}
              >
                {panel.buttonText}
              </div>
            </Link>
          </div>
        ))}
      </section>

      {/* Top Companies Section */}
      <section className="bg-[#f3f5f9] py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* LEFT SIDE */}
          <div>
            <h2 className="text-5xl font-bold text-[#1e3557] leading-tight mb-6">
              Over 10,000 top <br /> companies join with us
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
              Posting now includes out of the box integration with major CRM & accounting and ERP platforms, as well as an open API that allows you to seamlessly integrate with your business systems.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative h-[400px] flex items-center justify-center">
            <div className="absolute w-52 h-52 bg-white rounded-full shadow-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-700">SAMSUNG</span>
            </div>
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

      {/* Image/Text Sections */}
      <div className="section">
        <div className="imageWrapper">
          <img src={heroImg} alt="hero" />
        </div>
        <div className="textWrapper">
          <h2>Find your passion and achieve success</h2>
          <p>Find a job that suits your interests and talents...</p>
        </div>
      </div>

      <div className="section reverse">
        <div className="textWrapper">
          <h2>Millions of jobs, find the one that's right for you</h2>
          <p>Get your blood tests delivered at home...</p>
        </div>
        <div className="imageWrapper">
          <img src={jobsImg} alt="jobs" />
        </div>
      </div>

      {/* Contact Section */}
      {/* <section className="py-16 px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="text-gray-600">Email: support@placementsys.com</p>
        <p className="text-gray-600">Phone: +91 9876543210</p>
      </section> */}
    </div>
  );
}