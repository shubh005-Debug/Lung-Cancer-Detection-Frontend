import React, { useState } from "react";
import { api } from "../services/api";

export default function ReportDownload({ result }) {
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const name = patientName.trim() || "Anonymous";
      const blob = await api.generateReport(
        {
          prediction: result.prediction,
          confidence: result.confidence,
          probabilities: result.probabilities,
          risk_level: result.risk_level,
        },
        result.recommendations,
        name
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `LungAI_Report_${name.replace(/\s+/g, "_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-panel">
      <div className="report-header">
        <span className="report-icon">📄</span>
        <div>
          <h3 className="report-title">Download PDF Report</h3>
          <p className="report-desc">Get a complete medical report with predictions and recommendations</p>
        </div>
      </div>

      <div className="report-form">
        <label className="report-label">Patient Name (optional)</label>
        <input
          type="text"
          className="report-input"
          placeholder="Enter patient name..."
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && <p className="report-error">{error}</p>}

      <button
        className="btn-download"
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="btn-spinner" />
            Generating PDF...
          </>
        ) : (
          <>
            ⬇ Download PDF Report
          </>
        )}
      </button>

      <p className="report-note">
        Includes: diagnosis, confidence score, probability chart, and all health recommendations
      </p>
    </div>
  );
}