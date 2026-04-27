import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import Chatbot from "./components/Chatbot";

function Nav() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <div className="brand-icon">🫁</div>
          <span className="brand-name">LungAI</span>
        </Link>

        <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "nav-active" : ""}`} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/dashboard" className={`nav-link ${location.pathname === "/dashboard" ? "nav-active" : ""}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/dashboard" className="nav-cta" onClick={() => setMenuOpen(false)}>Analyze Scan</Link>
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">🫁 LungAI</span>
          <p>AI-powered lung cancer detection using a VGG16 CNN model trained on CT scan images.</p>
        </div>
        <div className="footer-disclaimer">
          <strong>Medical Disclaimer:</strong> This tool is for research and screening assistance only.
          It is not a substitute for professional medical diagnosis or treatment.
          Always consult a qualified physician.
        </div>
        <div className="footer-meta">
          <span>TensorFlow · Keras · VGG16</span>
          <span>Flask · React</span>
          <span>~92% Accuracy</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Nav />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}