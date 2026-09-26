import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root");

if (!root) throw new Error("Jelite Tutor root element is missing.");

try {
  createRoot(root).render(<App />);
} catch (error) {
  const message = error instanceof Error ? error.message : "The application failed to start.";
  root.innerHTML = `<main style="min-height:100vh;display:grid;place-items:center;padding:24px;font-family:system-ui;background:#f8fafc;color:#172033"><section style="max-width:560px;border:1px solid #e2e8f0;border-radius:18px;padding:28px;background:white;box-shadow:0 12px 32px rgba(15,23,42,.08)"><p style="font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#2563eb">Jelite Tutor</p><h1 style="font-size:24px;margin:12px 0 8px">We couldn&apos;t start the app</h1><p style="line-height:1.6;color:#64748b">${message.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character] ?? character))}</p></section></main>`;
}
