import React, { useState, useEffect } from "react";
import UploadImage from "../components/UploadImage";
import PredictionResult from "../components/PredictionResult";
import HealthAdvice from "../components/HealthAdvice";
import GradCam from "../components/Gradcam.jsx";
import ReportDownload from "../components/ReportDownload";
import { api } from "../services/api";

const CLASS_LABELS = {
  adenocarcinoma: "Adenocarcinoma",
  large_cell_carcinoma: "Large Cell Carcinoma",
  squamous_cell_carcinoma: "Squamous Cell Carcinoma",
  normal: "Normal",
};

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    api.checkHealth()
      .then(() => { setBackendStatus("online"); return api.getModelInfo(); })
      .then(setModelInfo)
      .catch(() => setBackendStatus("offline"));
  }, []);

  const handleUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.predict(file);
      setResult(data);
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Analysis Dashboard</h1>
          <p className="dashboard-subtitle">Upload a CT scan image for AI-powered lung cancer screening</p>
        </div>
        <div className="status-cluster">
          <div className={`status-pill ${backendStatus === "online" ? "status-online" : backendStatus === "offline" ? "status-offline" : "status-checking"}`}>
            <span className="status-dot" />
            {backendStatus === "online" ? "Model Online" : backendStatus === "offline" ? "Backend Offline" : "Connecting..."}
          </div>
          {modelInfo && (
            <div className="model-info-pill">
              🧠 {modelInfo.model_type} · {modelInfo.accuracy}% Accuracy
            </div>
          )}
        </div>
      </div>

      {backendStatus === "offline" && (
        <div className="alert-banner alert-error">
          <span>⚠️</span>
          <div>
            <strong>Backend Offline</strong>
            <p>Start the Flask server: <code>python app.py</code></p>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Upload Column */}
        <div className="upload-col">
          <div className="panel">
            <div className="panel-label">Step 1 · Upload CT Scan</div>
            <UploadImage onUpload={handleUpload} isLoading={isLoading} />
            {error && (
              <div className="alert-banner alert-error" style={{ marginTop: "1rem" }}>
                <span>❌</span>
                <div><strong>Error</strong><p>{error}</p></div>
              </div>
            )}
            {!result && !isLoading && (
              <div className="upload-instructions">
                <div className="instr-row"><span>📁</span> Supported: PNG, JPG, JPEG, BMP, TIFF</div>
                <div className="instr-row"><span>🔒</span> Images processed in memory only</div>
              </div>
            )}
          </div>

          {modelInfo && (
            <div className="panel model-card">
              <div className="panel-label">Model Specifications</div>
              <div className="model-specs">
                <div className="spec-row"><span className="spec-key">Architecture</span><span className="spec-val">{modelInfo.model_type}</span></div>
                <div className="spec-row"><span className="spec-key">Input Size</span><span className="spec-val">{modelInfo.input_size}</span></div>
                <div className="spec-row"><span className="spec-key">Classes</span><span className="spec-val">{modelInfo.num_classes}</span></div>
                <div className="spec-row"><span className="spec-key">Accuracy</span><span className="spec-val spec-accent">{modelInfo.accuracy}%</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Results Column */}
        {result ? (
          <div className="results-col" id="results-section">
            <div className="panel-label">Step 2 · AI Prediction</div>
            <PredictionResult result={result} />

            {/* Grad-CAM Heatmap */}
            {result.gradcam && (
              <>
                <div className="panel-label" style={{ marginTop: "1rem" }}>Step 3 · Grad-CAM Explanation</div>
                <GradCam
                  gradcamImage={result.gradcam}
                  originalLabel={CLASS_LABELS[result.prediction] || result.prediction}
                />
              </>
            )}

            {/* Health Advice */}
            <div className="panel-label" style={{ marginTop: "1rem" }}>Step 4 · Health Recommendations</div>
            <HealthAdvice recommendations={result.recommendations} />

            {/* PDF Report */}
            <div className="panel-label" style={{ marginTop: "1rem" }}>Step 5 · Download Report</div>
            <ReportDownload result={result} />

            <button className="btn-reset" onClick={handleReset}>
              ↩ Analyze Another Scan
            </button>
          </div>
        ) : (
          <div className="results-col results-placeholder">
            <div className="placeholder-content">
              <div className="placeholder-icon">🔬</div>
              <h3>Awaiting CT Scan</h3>
              <p>Upload a lung CT scan image to begin AI analysis.</p>
              <div className="placeholder-steps">
                {["Upload image", "AI preprocesses scan", "CNN inference + Grad-CAM", "Results + PDF report"].map((step, i) => (
                  <div key={i} className="ph-step">
                    <span className="ph-num">{i + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}