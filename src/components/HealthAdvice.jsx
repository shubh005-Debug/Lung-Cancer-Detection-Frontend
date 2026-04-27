import React, { useState } from "react";

const TABS = [
  { key: "precautions", label: "Precautions", icon: "🛡️" },
  { key: "diet_recommendations", label: "Diet", icon: "🥗" },
  { key: "lifestyle_advice", label: "Lifestyle", icon: "🏃" },
  { key: "doctor_consultation", label: "Consult Doctor", icon: "👨‍⚕️" },
];

export default function HealthAdvice({ recommendations }) {
  const [activeTab, setActiveTab] = useState("precautions");

  if (!recommendations) return null;

  const items = recommendations[activeTab] || [];

  return (
    <div className="advice-panel">
      <div className="advice-header">
        <h2>AI Health Recommendations</h2>
        <p>Personalized guidance based on your analysis results</p>
      </div>

      <div className="advice-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`advice-tab ${activeTab === tab.key ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="advice-content">
        {items.length === 0 ? (
          <p className="no-advice">No recommendations available.</p>
        ) : (
          <ul className="advice-list">
            {items.map((item, i) => (
              <li key={i} className="advice-item">
                <span className="advice-bullet" style={{ animationDelay: `${i * 0.07}s` }} />
                <span className="advice-text">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="advice-footer">
        <span className="ai-badge">🤖 AI-Generated Recommendations</span>
        <span className="advice-note">Always verify with a qualified healthcare provider</span>
      </div>
    </div>
  );
}