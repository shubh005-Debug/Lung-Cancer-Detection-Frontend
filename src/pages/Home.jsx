import React from "react";
import { Link } from "react-router-dom";

const STATS = [
  { value: "92%", label: "Model Accuracy", icon: "🎯" },
  { value: "4", label: "Cancer Types", icon: "🔬" },
  { value: "224×224", label: "Input Resolution", icon: "📐" },
  { value: "VGG16", label: "Architecture", icon: "🧠" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Upload CT Scan", desc: "Upload your lung CT scan image in PNG, JPG, or TIFF format." },
  { step: "02", title: "Preprocessing", desc: "Image is resized to 224×224, converted to RGB and normalized." },
  { step: "03", title: "AI Inference", desc: "VGG16 CNN analyzes the scan and outputs class probabilities." },
  { step: "04", title: "Results", desc: "View prediction, confidence score, and personalized health advice." },
];

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-label">
            <span className="live-dot" />
            AI-Powered Medical Imaging
          </div>
          <h1 className="hero-title">
            Lung Cancer<br />
            <span className="hero-title-accent">Early Detection</span>
          </h1>
          <p className="hero-subtitle">
            A VGG16 deep learning model trained on CT scan images to classify
            lung cancer types with ~92% accuracy — enabling faster, AI-assisted screening.
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">
              Start Analysis
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </Link>
            <a href="#how-it-works" className="btn-secondary">How it works</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="ct-mockup">
            <div className="ct-screen">
              <div className="ct-scan-lines">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="ct-line" />
                ))}
              </div>
              <div className="ct-overlay">
                <div className="ct-crosshair" />
                <div className="ct-label">SCAN COMPLETE</div>
                <div className="ct-confidence">CONF: 92.1%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        {STATS.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span className="stat-icon">{stat.icon}</span>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section className="how-section" id="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Four-step AI analysis pipeline from image to diagnosis</p>
        </div>
        <div className="steps-grid">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="step-card">
              <div className="step-number">{item.step}</div>
              <h3 className="step-title">{item.title}</h3>
              <p className="step-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cancer Types */}
      <section className="types-section">
        <div className="section-header">
          <h2>Detectable Cancer Types</h2>
          <p>Our model classifies four categories from CT scan images</p>
        </div>
        <div className="types-grid">
          {[
            { name: "Adenocarcinoma", color: "#dc2626", desc: "Most common type. Starts in mucus-secreting gland cells in the outer lung." },
            { name: "Large Cell Carcinoma", color: "#ea580c", desc: "Rapidly growing cancer found in any part of the lung. Can spread quickly." },
            { name: "Squamous Cell Carcinoma", color: "#ca8a04", desc: "Arises in flat cells lining airways. Strongly associated with smoking history." },
            { name: "Normal", color: "#16a34a", desc: "No malignant features detected. Healthy lung tissue patterns observed." },
          ].map((type) => (
            <div key={type.name} className="type-card" style={{ "--type-color": type.color }}>
              <h3 className="type-name">{type.name}</h3>
              <p className="type-desc">{type.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to analyze your CT scan?</h2>
        <p>Upload your image and get AI-powered results in seconds.</p>
        <Link to="/dashboard" className="btn-primary btn-large">
          Open Analysis Dashboard
        </Link>
        <p className="cta-disclaimer">
          For screening purposes only. Not a substitute for professional medical diagnosis.
        </p>
      </section>
    </div>
  );
}