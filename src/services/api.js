// In production Flask serves both frontend and backend on same URL
// In development React runs on 3000, Flask on 5000
const BASE_URL = process.env.NODE_ENV === 'production'
  ? ''
  : (process.env.REACT_APP_API_URL || 'http://localhost:5000');

export const api = {
  async checkHealth() {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error("Backend unavailable");
    return res.json();
  },

  async getModelInfo() {
    const res = await fetch(`${BASE_URL}/model-info`);
    if (!res.ok) throw new Error("Failed to fetch model info");
    return res.json();
  },

  async predict(imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
    const res = await fetch(`${BASE_URL}/predict`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Prediction failed");
    return data;
  },

  async generateReport(predictionResult, recommendations, patientName) {
    const res = await fetch(`${BASE_URL}/generate-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prediction_result: predictionResult,
        recommendations: recommendations,
        patient_name: patientName,
      }),
    });
    if (!res.ok) throw new Error("Report generation failed");
    return res.blob();
  },
};