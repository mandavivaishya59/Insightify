import { useState } from "react";

const templates = [
  {
    id: "sales",
    name: "Sales Dashboard",
    description: "Revenue, customers, trends",
    image: `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#f0f9ff"/>
        <text x="100" y="20" text-anchor="middle" font-family="Arial" font-size="12" fill="#1e40af">Sales Dashboard</text>
        <rect x="20" y="40" width="30" height="60" fill="#13efcb"/>
        <rect x="60" y="30" width="30" height="70" fill="#13efcb"/>
        <rect x="100" y="50" width="30" height="50" fill="#13efcb"/>
        <rect x="140" y="25" width="30" height="75" fill="#13efcb"/>
        <circle cx="70" cy="110" r="25" fill="none" stroke="#13efcb" stroke-width="2"/>
        <path d="M 70 100 L 80 105 L 75 115 Z" fill="#13efcb"/>
        <text x="70" y="108" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">40%</text>
        <text x="100" y="140" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">Revenue by Category</text>
      </svg>
    `)}`
  },
  {
    id: "finance",
    name: "Finance Dashboard",
    description: "Expenses, budgets, KPIs",
    image: `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#fefefe"/>
        <text x="100" y="20" text-anchor="middle" font-family="Arial" font-size="12" fill="#1e40af">Finance Dashboard</text>
        <rect x="20" y="40" width="25" height="50" fill="#2563eb"/>
        <rect x="55" y="35" width="25" height="55" fill="#2563eb"/>
        <rect x="90" y="45" width="25" height="45" fill="#2563eb"/>
        <rect x="125" y="30" width="25" height="60" fill="#2563eb"/>
        <rect x="160" y="50" width="25" height="40" fill="#2563eb"/>
        <polyline points="20,90 50,85 80,80 110,75 140,70 170,65" fill="none" stroke="#2563eb" stroke-width="2"/>
        <circle cx="20" cy="90" r="3" fill="#2563eb"/>
        <circle cx="50" cy="85" r="3" fill="#2563eb"/>
        <circle cx="80" cy="80" r="3" fill="#2563eb"/>
        <circle cx="110" cy="75" r="3" fill="#2563eb"/>
        <circle cx="140" cy="70" r="3" fill="#2563eb"/>
        <circle cx="170" cy="65" r="3" fill="#2563eb"/>
        <text x="100" y="140" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">Budget vs Actual</text>
      </svg>
    `)}`
  },
  {
    id: "marketing",
    name: "Marketing Dashboard",
    description: "Campaigns, conversions, ROI",
    image: `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#fff7ed"/>
        <text x="100" y="20" text-anchor="middle" font-family="Arial" font-size="12" fill="#ea580c">Marketing Dashboard</text>
        <rect x="20" y="40" width="35" height="55" fill="#ff9500"/>
        <rect x="70" y="35" width="35" height="60" fill="#ff9500"/>
        <rect x="120" y="45" width="35" height="50" fill="#ff9500"/>
        <circle cx="60" cy="110" r="30" fill="none" stroke="#ff9500" stroke-width="2"/>
        <path d="M 60 95 L 75 105 L 70 120 Z" fill="#ff9500"/>
        <text x="60" y="108" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">35%</text>
        <path d="M 60 125 L 50 135 L 70 135 Z" fill="#ff9500"/>
        <text x="60" y="132" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">25%</text>
        <text x="100" y="140" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">Campaign Performance</text>
      </svg>
    `)}`
  },
  {
    id: "hr",
    name: "HR Dashboard",
    description: "Employees, performance, retention",
    image: `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#f0fdf4"/>
        <text x="100" y="20" text-anchor="middle" font-family="Arial" font-size="12" fill="#166534">HR Dashboard</text>
        <rect x="20" y="40" width="28" height="45" fill="#4ecdc4"/>
        <rect x="58" y="35" width="28" height="50" fill="#4ecdc4"/>
        <rect x="96" y="42" width="28" height="43" fill="#4ecdc4"/>
        <rect x="134" y="38" width="28" height="47" fill="#4ecdc4"/>
        <circle cx="70" cy="110" r="25" fill="none" stroke="#4ecdc4" stroke-width="2"/>
        <path d="M 70 100 L 80 105 L 75 115 Z" fill="#4ecdc4"/>
        <text x="70" y="108" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">45%</text>
        <path d="M 70 125 L 60 135 L 80 135 Z" fill="#4ecdc4"/>
        <text x="70" y="132" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">30%</text>
        <text x="100" y="140" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">Employee Metrics</text>
      </svg>
    `)}`
  },
  {
    id: "operations",
    name: "Operations Dashboard",
    description: "Efficiency, processes, metrics",
    image: `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#faf5ff"/>
        <text x="100" y="20" text-anchor="middle" font-family="Arial" font-size="12" fill="#7c3aed">Operations Dashboard</text>
        <rect x="20" y="40" width="26" height="48" fill="#9b59b6"/>
        <rect x="56" y="36" width="26" height="52" fill="#9b59b6"/>
        <rect x="92" y="42" width="26" height="46" fill="#9b59b6"/>
        <rect x="128" y="38" width="26" height="50" fill="#9b59b6"/>
        <rect x="164" y="44" width="26" height="44" fill="#9b59b6"/>
        <polyline points="20,95 50,90 80,85 110,80 140,75 170,70" fill="none" stroke="#9b59b6" stroke-width="2"/>
        <circle cx="20" cy="95" r="2" fill="#9b59b6"/>
        <circle cx="50" cy="90" r="2" fill="#9b59b6"/>
        <circle cx="80" cy="85" r="2" fill="#9b59b6"/>
        <circle cx="110" cy="80" r="2" fill="#9b59b6"/>
        <circle cx="140" cy="75" r="2" fill="#9b59b6"/>
        <circle cx="170" cy="70" r="2" fill="#9b59b6"/>
        <text x="100" y="140" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">Process Efficiency</text>
      </svg>
    `)}`
  },
  {
    id: "school",
    name: "School Dashboard",
    description: "Students, grades, performance",
    image: `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#eff6ff"/>
        <text x="100" y="20" text-anchor="middle" font-family="Arial" font-size="12" fill="#1e3a8a">School Dashboard</text>
        <rect x="20" y="40" width="32" height="52" fill="#1e3a8a"/>
        <rect x="62" y="38" width="32" height="54" fill="#1e3a8a"/>
        <rect x="104" y="42" width="32" height="50" fill="#1e3a8a"/>
        <rect x="146" y="36" width="32" height="56" fill="#1e3a8a"/>
        <circle cx="60" cy="110" r="28" fill="none" stroke="#1e3a8a" stroke-width="2"/>
        <path d="M 60 95 L 75 105 L 70 118 Z" fill="#1e3a8a"/>
        <text x="60" y="108" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">A: 40%</text>
        <path d="M 60 125 L 50 135 L 70 135 Z" fill="#1e3a8a"/>
        <text x="60" y="132" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">B: 35%</text>
        <text x="100" y="140" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">Grade Distribution</text>
      </svg>
    `)}`
  },
];

export default function DashboardOptions({ onSelect }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleCreate = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "15px",
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(10px)",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ marginBottom: "15px", color: "white" }}>Choose Dashboard Template</h3>

      {/* Template Selection */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: selectedTemplate === template.id ? "2px solid #13efcb" : "2px solid transparent",
                cursor: "pointer",
                background: selectedTemplate === template.id ? "rgba(19, 239, 203, 0.1)" : "rgba(255,255,255,0.1)",
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              <img
                src={template.image}
                alt={template.name}
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />
              <div style={{ fontWeight: "bold", color: "white" }}>{template.name}</div>
              <div style={{ fontSize: "12px", opacity: 0.8, color: "white" }}>{template.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Button */}
      <button
        onClick={handleCreate}
        disabled={!selectedTemplate}
        style={{
          padding: "12px 24px",
          borderRadius: "10px",
          border: "none",
          cursor: selectedTemplate ? "pointer" : "not-allowed",
          background: selectedTemplate ? "#13efcb" : "rgba(255,255,255,0.3)",
          color: selectedTemplate ? "#000" : "rgba(255,255,255,0.5)",
          fontWeight: "bold",
          width: "100%",
        }}
      >
        Create Dashboard
      </button>
    </div>
  );
}
