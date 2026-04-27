import React, { useState, useRef, useCallback } from "react";

export default function UploadImage({ onUpload, isLoading }) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef();

  const handleFile = useCallback((file) => {
    if (!file) return;
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/bmp", "image/tiff"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (PNG, JPG, BMP, TIFF).");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    onUpload(file);
  }, [onUpload]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (e) => handleFile(e.target.files[0]);

  return (
    <div className="upload-section">
      <div
        className={`drop-zone ${dragOver ? "drag-active" : ""} ${preview ? "has-preview" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.bmp,.tiff"
          onChange={handleChange}
          style={{ display: "none" }}
        />

        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="CT Scan Preview" className="preview-image" />
            <div className="preview-overlay">
              <div className="preview-badge">
                <span className="badge-icon">🔬</span>
                <span>{fileName}</span>
              </div>
              {!isLoading && (
                <p className="preview-change-hint">Click to change image</p>
              )}
            </div>
          </div>
        ) : (
          <div className="drop-zone-content">
            <div className="upload-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M8 12l4-4m0 0l4 4m-4-4v8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Upload CT Scan Image</h3>
            <p>Drag & drop or <span className="link-text">browse files</span></p>
            <div className="supported-formats">
              <span>PNG</span><span>JPG</span><span>BMP</span><span>TIFF</span>
            </div>
          </div>
        )}

        {dragOver && <div className="drag-overlay">Drop to analyze</div>}
      </div>

      {isLoading && (
        <div className="analyzing-bar">
          <div className="analyzing-progress">
            <div className="analyzing-fill" />
          </div>
          <p className="analyzing-text">
            <span className="pulse-dot" />
            Running AI inference on CT scan...
          </p>
        </div>
      )}
    </div>
  );
}