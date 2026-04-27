import React from "react";

const CLASS_LABELS = {
  adenocarcinoma: "Adenocarcinoma",
  large_cell_carcinoma: "Large Cell Carcinoma",
  squamous_cell_carcinoma: "Squamous Cell Carcinoma",
  normal: "Normal (No Cancer)",
};

const CLASS_DESCRIPTIONS = {
  adenocarcinoma: "Most common lung cancer type. Originates in mucus-secreting gland cells.",
  large_cell_carcinoma: "Fast-growing cancer that can appear in any part of the lung.",
  squamous_cell_carcinoma: "Forms in the flat cells lining the airways. Strongly linked to smoking.",
  normal: "No malignant patterns detected in this CT scan.",
};

export default function PredictionResult({ result }) {
  if (!result) return null;

  const { prediction, confidence, probabilities, risk_level, risk_color } = result;
  const sortedProbs = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);
  const isNormal = prediction === "normal";

  return (
    <div className="result-panel" style={{ "--risk-color": risk_color }}>
      {/* Primary Prediction */}
      <div className="result-header">
        <div className="result-icon">{isNormal ? "✅" : "⚠️"}</div>
        <div className="result-title-block">
          <h2 className="result-prediction">{CLASS_LABELS[prediction] || prediction}</h2>
          <p className="result-description">{CLASS_DESCRIPTIONS[prediction]}</p>
        </div>
        <div className="result-badge" style={{ background: `${risk_color}22`, border: `1px solid ${risk_color}66`, color: risk_color }}>
          <span className="risk-dot" style={{ background: risk_color }} />
          {risk_level} Risk
        </div>
      </div>

      {/* Confidence Score */}
      <div className="confidence-block">
        <div className="confidence-label">
          <span>Confidence Score</span>
          <span className="confidence-value">{confidence}%</span>
        </div>
        <div className="confidence-bar-track">
          <div
            className="confidence-bar-fill"
            style={{
              width: `${confidence}%`,
              background: `linear-gradient(90deg, ${risk_color}88, ${risk_color})`,
            }}
          />
        </div>
      </div>

      {/* Probability Chart */}
      <div className="prob-chart">
        <h3 className="section-label">Class Probability Distribution</h3>
        <div className="prob-bars">
          {sortedProbs.map(([cls, prob]) => (
            <div key={cls} className={`prob-row ${cls === prediction ? "active-prob" : ""}`}>
              <span className="prob-class-label">{CLASS_LABELS[cls] || cls}</span>
              <div className="prob-bar-track">
                <div
                  className="prob-bar-fill"
                  style={{
                    width: `${(prob * 100).toFixed(1)}%`,
                    background: cls === prediction
                      ? `linear-gradient(90deg, ${risk_color}66, ${risk_color})`
                      : "rgba(255,255,255,0.15)",
                  }}
                />
              </div>
              <span className="prob-pct">{(prob * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="result-disclaimer">
        ⚕️ This AI analysis is for screening assistance only. Always consult a licensed medical professional for diagnosis and treatment.
      </div>
    </div>
  );
}