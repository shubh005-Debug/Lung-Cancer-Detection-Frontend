import React from "react";

export default function GradCam({ gradcamImage, originalLabel }) {
  if (!gradcamImage) return null;

  return (
    <div className="gradcam-panel">
      <div className="gradcam-header">
        <h3 className="gradcam-title">Grad-CAM Heatmap</h3>
        <p className="gradcam-desc">
          Highlighted regions show where the AI focused to make its prediction.
          Red/warm areas = high attention, Blue/cool areas = low attention.
        </p>
      </div>
      <div className="gradcam-image-wrap">
        <img
          src={`data:image/png;base64,${gradcamImage}`}
          alt="Grad-CAM Heatmap"
          className="gradcam-image"
        />
        <div className="gradcam-legend">
          <div className="legend-bar" />
          <div className="legend-labels">
            <span>Low attention</span>
            <span>High attention</span>
          </div>
        </div>
      </div>
      <div className="gradcam-note">
        📍 Model focused on these lung regions to classify as <strong>{originalLabel}</strong>
      </div>
    </div>
  );
}