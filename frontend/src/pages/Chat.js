import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DashboardOptions from "../components/DashboardOptions";

/* ------------------ THEMES ------------------ */
const THEMES = {
  emerald: {
    bg: "linear-gradient(135deg, #1b8442ff 0%, #009135ff 50%, #00aa3eff 100%)",
    card: "rgba(255,255,255,0.12)",
    accent: "#13efcb",
    text: "#ffffff",
    title: "Emerald Theme",
    palette: ["#13efcb", "#36e1dbff", "#1c8c92ff"]
  },
  dark: {
    bg: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    card: "rgba(255,255,255,0.08)",
    accent: "#1e3a8a",
    text: "#ffffff",
    title: "Dark Theme",
    palette: ["#1e3a8a", "#3b82f6", "#6366f1"]
  },
  dark_minimal: {
    bg: "#000000",
    card: "rgba(255,255,255,0.08)",
    accent: "#1e3a8a",
    text: "#ffffff",
    title: "Dark Minimal Theme",
    palette: ["#1e3a8a", "#0a1b22ff", "#ffffff"]
  },
  minimal: {
    bg: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    card: "rgba(255,255,255,0.9)",
    accent: "#2563eb",
    text: "#1e293b",
    title: "Minimal Theme",
    palette: ["#2563eb", "#1e40af", "#3b82f6"]
  },
};

export default function InsightifyChat() {
  /* ------------------ STATE ------------------ */
  const [dataset, setDataset] = useState([]);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [listening, setListening] = useState(false);

  const [chartConfig, setChartConfig] = useState(null);
  const [dashboardCharts, setDashboardCharts] = useState([]);
  const [dashboardMode, setDashboardMode] = useState(false);

  const [showDashboardOptions, setShowDashboardOptions] = useState(false);
  const [theme, setTheme] = useState("emerald");
  const [muted, setMuted] = useState(false);
  const [lastAiMessage, setLastAiMessage] = useState("");

  const recognitionRef = useRef(null);
  const dashboardRef = useRef(null);

  /* ------------------ SMART DATA PROFILING ------------------ */
  const profileDataset = () => {
    const cols = Object.keys(dataset[0]);

    const numeric = [];
    const categorical = [];
    const dateCols = [];

    cols.forEach(col => {
      const sample = dataset[0][col];

      if (!isNaN(Number(sample))) numeric.push(col);
      else if (!isNaN(Date.parse(sample))) dateCols.push(col);
      else categorical.push(col);
    });

    return { numeric, categorical, dateCols };
  };

  /* ------------------ KPI GENERATOR ------------------ */
  const generateKPIs = () => {
    const { numeric } = profileDataset();
    if (!numeric.length) return [];

    const col = numeric[0];
    const values = dataset.map(r => Number(r[col] || 0));

    const total = values.reduce((a,b)=>a+b,0);
    const avg = total / values.length;
    const max = Math.max(...values);

    return [
      { label: `Total ${col}`, value: total.toLocaleString() },
      { label: `Average ${col}`, value: avg.toFixed(2) },
      { label: `Max ${col}`, value: max.toLocaleString() },
      { label: `Records`, value: dataset.length },
    ];
  };

  /* ------------------ DATA CONTEXT BUILDER ------------------ */
  const buildDataContext = () => {
    const { numeric, categorical, dateCols } = profileDataset();

    const context = {
      columns: Object.keys(dataset[0]),
      numericColumns: numeric,
      categoricalColumns: categorical,
      dateColumns: dateCols,
      totalRows: dataset.length,
      sampleRows: dataset.slice(0, 5),
    };

    // Pre-aggregations (VERY IMPORTANT)
    if (numeric.length) {
      const col = numeric[0];
      const values = dataset.map(r => Number(r[col] || 0));

      context.metrics = {
        total: values.reduce((a,b)=>a+b,0),
        average: values.reduce((a,b)=>a+b,0) / values.length,
        max: Math.max(...values),
        min: Math.min(...values),
      };
    }

    return context;
  };

  /* ------------------ AI ANSWER FUNCTION ------------------ */
  const askAI = async (question) => {
    try {
      const res = await fetch("http://localhost:8000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          df: dataset,
        }),
      });

      const data = await res.json();

      if (data.response && data.response.summary) {
        return data.response.summary;
      } else {
        return null;
      }
    } catch (err) {
      console.error("AI error:", err);
      return null;
    }
  };

  /* ------------------ LOAD DATASET ------------------ */
  useEffect(() => {
    const stored = localStorage.getItem("insightify_df");
    if (!stored) return;

    const df = JSON.parse(stored);
    setDataset(df);

    setMessages([
      {
        from: "ai",
        text: "Dataset loaded successfully 📊 Ask me anything about your data.",
      },
    ]);
  }, []);

  /* ------------------ SPEECH ------------------ */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) =>
      setQuestion(e.results[0][0].transcript);

    recognitionRef.current = recognition;
  }, []);

  const speakText = (text) => {
    setLastAiMessage(text);   // always remember last AI response
    if (muted) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleMuteToggle = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (newMuted) {
      window.speechSynthesis.cancel();
    } else if (lastAiMessage) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lastAiMessage);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  /* ------------------ NUMERIC ANSWER HELPER ------------------ */
  const getNumericAnswer = (q) => {
    const lower = q.toLowerCase();
    const cols = Object.keys(dataset[0]);

    // find numeric column
    const numericCol = cols.find(
      (c) => !isNaN(Number(dataset[0][c]))
    );

    if (!numericCol) return null;

    const values = dataset.map(r => Number(r[numericCol] || 0)).filter(v => !isNaN(v));

    if (lower.includes("total") || lower.includes("sum")) {
      const total = values.reduce((sum, v) => sum + v, 0);
      return `Total ${numericCol}: ${total.toLocaleString()}`;
    }

    if (lower.includes("average") || lower.includes("avg") || lower.includes("mean")) {
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
      return `Average ${numericCol}: ${avg.toFixed(2)}`;
    }

    if (lower.includes("maximum") || lower.includes("max")) {
      const max = Math.max(...values);
      return `Maximum ${numericCol}: ${max.toLocaleString()}`;
    }

    if (lower.includes("minimum") || lower.includes("min")) {
      const min = Math.min(...values);
      return `Minimum ${numericCol}: ${min.toLocaleString()}`;
    }

    if (lower.includes("count") || lower.includes("number of")) {
      return `Total records: ${dataset.length}`;
    }

    return null;
  };

  /* ------------------ CHAT SEND ------------------ */
  const sendMessage = () => {
    if (!question.trim()) return;

    const q = question.toLowerCase();
    setMessages((p) => [...p, { from: "user", text: question }]);
    setQuestion("");

    // ---- SMART AI QUESTIONS ----
    const aiKeywords = [
      "highest",
      "lowest",
      "top",
      "average",
      "total",
      "best",
      "worst",
      "month",
      "customer",
      "category",
      "trend",
      "growth",
      "performance",
    ];

    if (aiKeywords.some(k => q.includes(k))) {
      askAI(question).then((answer) => {
        if (answer) {
          setMessages(p => [...p, { from: "ai", text: answer }]);
          speakText(answer);
        } else {
          setMessages(p => [...p, { from: "ai", text: "I couldn't analyze that from the current dataset." }]);
        }
      });
      return;
    }

    /* ---- SUMMARY ---- */
    if (
      q.includes("summary") ||
      q.includes("overview") ||
      q.includes("insight")
    ) {
      fetch("http://localhost:8000/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preview: dataset }),
      })
        .then((r) => r.json())
        .then((d) => {
          const txt = d.summary || "Unable to generate summary.";
          setMessages((p) => [...p, { from: "ai", text: txt }]);
          speakText(txt);
        });
      return;
    }

    /* ---- DASHBOARD REQUEST ---- */
    if (
      q.includes("dashboard") ||
      q.includes("create charts") ||
      q.includes("create dashboard")
    ) {
      setShowDashboardOptions(true);
      const txt =
        "Choose a dashboard template: Sales, Finance, or School.";
      setMessages((p) => [...p, { from: "ai", text: txt }]);
      speakText(txt);
      return;
    }

    /* ---- NUMERIC ANSWERS ---- */
    const numericAnswer = getNumericAnswer(q);
    if (numericAnswer) {
      setMessages((p) => [...p, { from: "ai", text: numericAnswer }]);
      speakText(numericAnswer);
      return;
    }

    /* ---- CHARTS ---- */
    if (q.includes("bar")) generateBarChart();
    else if (q.includes("pie")) generatePieChart();
    else if (q.includes("line") || q.includes("trend"))
      generateLineChart();

    const reply = "Chart generated based on your data 📈";
    setMessages((p) => [...p, { from: "ai", text: reply }]);
    speakText(reply);
  };

  /* ------------------ TEMPLATE SELECT ------------------ */
  const handleDashboardSelect = (template) => {
    setShowDashboardOptions(false);

    if (template === "sales") generateSalesDashboard();
    if (template === "finance") generateFinanceDashboard();
    if (template === "school") generateSchoolDashboard();

    const txt = "Dashboard created successfully 📊";
    setMessages((p) => [...p, { from: "ai", text: txt }]);
    speakText(txt);
  };

  /* ------------------ HELPERS ------------------ */
  const getCols = () => Object.keys(dataset[0]);

  /* ------------------ SINGLE CHARTS ------------------ */
  const generateBarChart = () => {
    const [cat, val] = getCols();
    const grouped = {};
    dataset.forEach(
      (r) => (grouped[r[cat]] = (grouped[r[cat]] || 0) + Number(r[val] || 0))
    );
    setChartConfig({
      type: "bar",
      data: Object.entries(grouped).map(([k, v]) => ({
        name: k,
        value: v,
      })),
    });
    setDashboardMode(false);
  };

  const generatePieChart = () => {
    const cat = getCols()[0];
    const grouped = {};
    dataset.forEach(
      (r) => (grouped[r[cat]] = (grouped[r[cat]] || 0) + 1)
    );
    setChartConfig({
      type: "pie",
      data: Object.entries(grouped).map(([k, v]) => ({
        name: k,
        value: v,
      })),
    });
    setDashboardMode(false);
  };

  const generateLineChart = () => {
    const [x, y] = getCols();
    setChartConfig({
      type: "line",
      data: dataset.slice(0, 20).map((r) => ({
        name: r[x],
        value: Number(r[y] || 0),
      })),
    });
    setDashboardMode(false);
  };

  /* ------------------ DASHBOARDS (AI DECIDES) ------------------ */
  const generateSalesDashboard = () => {
    const { numeric, categorical } = profileDataset();

    const charts = [];

    // Add KPIs if numeric columns exist
    if (numeric.length) {
      const kpis = generateKPIs();
      charts.push({ type: "kpi", title: "Key Performance Indicators", data: kpis });
    }

    // Bar chart for first numeric vs first categorical
    if (numeric.length && categorical.length) {
      const cat = categorical[0];
      const val = numeric[0];
      const bar = {};
      dataset.forEach(
        (r) => (bar[r[cat]] = (bar[r[cat]] || 0) + Number(r[val] || 0))
      );
      charts.push({
        type: "bar",
        title: `${val} by ${cat}`,
        xLabel: cat,
        yLabel: val,
        data: Object.entries(bar).map(([k, v]) => ({ name: k, value: v }))
      });
    }

    // Pie chart for categorical distribution
    if (categorical.length) {
      const cat = categorical[0];
      const pie = {};
      dataset.forEach(
        (r) => (pie[r[cat]] = (pie[r[cat]] || 0) + 1)
      );
      charts.push({
        type: "pie",
        title: `${cat} Distribution`,
        data: Object.entries(pie).map(([k, v]) => ({ name: k, value: v, percentage: ((v / dataset.length) * 100).toFixed(1) }))
      });
    }

    // Line chart for trend (first 20 rows)
    if (numeric.length) {
      const xCol = categorical.length ? categorical[0] : numeric[0];
      const yCol = numeric[0];
      const line = dataset.slice(0, 20).map((r) => ({
        name: r[xCol],
        value: Number(r[yCol] || 0),
      }));
      charts.push({
        type: "line",
        title: `${yCol} Trend Over Time`,
        xLabel: xCol,
        yLabel: yCol,
        data: line
      });
    }

    setDashboardCharts(charts);
    setDashboardMode(true);
  };

  const generateFinanceDashboard = generateSalesDashboard;
  const generateSchoolDashboard = generateSalesDashboard;

  /* ------------------ PDF ------------------ */
  const waitForCharts = () =>
    new Promise(resolve => setTimeout(resolve, 800));

  const exportDashboardPDF = async () => {
    const element = document.getElementById("dashboard-export");
    if (!element) return;

    await waitForCharts();

    const canvas = await html2canvas(element, {
      scale: 2,                 // 🔥 sharp charts
      useCORS: true,
      backgroundColor: "#1f8f4d",
      logging: false,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      canvas.width,
      canvas.height
    );

    pdf.save("Insightify_Dashboard.pdf");
  };

  /* ------------------ TABLE ------------------ */
  const renderTable = () => {
    const cols = Object.keys(dataset[0]);

    return (
      <div style={{ overflow: "auto", maxHeight: "500px" }}>
        <table style={{
          width: "100%",
          fontSize: "12px",
          borderCollapse: "collapse",
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: "8px"
        }}>
          <thead>
            <tr style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
              {cols.map((c) => (
                <th key={c} style={{
                  padding: "8px 12px",
                  textAlign: "left",
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  fontWeight: "bold",
                  color: "white",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "rgba(255,255,255,0.1)"
                }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataset.map((r, i) => (
              <tr key={i} style={{
                backgroundColor: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent"
              }}>
                {cols.map((c) => (
                  <td key={c} style={{
                    padding: "6px 12px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    whiteSpace: "nowrap"
                  }}>
                    {r[c] === null || r[c] === "" ? "—" : String(r[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{
          textAlign: "center",
          padding: "8px",
          color: "rgba(255,255,255,0.7)",
          fontSize: "11px"
        }}>
          Total rows: {dataset.length.toLocaleString()}
        </div>
      </div>
    );
  };

  /* ------------------ RENDER ------------------ */
  if (!dataset.length) {
    return <h2 style={{ padding: 40 }}>Upload a dataset first</h2>;
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1.4fr",
        gridTemplateRows: "1fr auto",
        gap: 16,
        padding: 16,
        background: THEMES[theme].bg,
        color: THEMES[theme].text,
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflow: "auto",
      }}
    >
      {/* CHAT */}
      <div
        style={{
          gridRow: "1 / span 2",
          background: THEMES[theme].card,
          padding: 16,
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Insightify AI Chat</h2>
        <div style={{ marginBottom: 16 }}>
          <label style={{ marginRight: 8 }}>Theme:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "none",
              background: "rgba(255,255,255,0.2)",
              color: "black",
            }}
          >
            <option value="emerald">Emerald</option>
            <option value="dark">Dark</option>
            <option value="minimal">Minimal</option>
            <option value="dark_minimal">Dark Minimal</option>
          </select>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: 16,
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                marginBottom: 12,
                textAlign: m.from === "user" ? "right" : "left",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  background: m.from === "user" ? "rgba(9, 246, 222, 0.16)" : "rgba(0,0,0,0.3)",
                  color: "white",
                }}
              >
                {m.text}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something about your data..."
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              outline: "none",
              background: "rgba(255, 255, 255, 1)",
              color: "black",
              fontSize: "14px",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: THEMES[theme].accent,
              color: "white",
              fontWeight: "bold",
            }}
          >
            Send
          </button>
          <button
            onClick={() => listening ? recognitionRef.current.stop() : recognitionRef.current.start()}
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: listening ? "#ff6b6b" : "#4ecdc4",
              color: "white",
              fontSize: "16px",
            }}
          >
            🎤
          </button>
          <button
            onClick={handleMuteToggle}
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: muted ? "#666" : "#ff9500",
              color: "white",
              fontSize: "16px",
            }}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* PREVIEW */}
      <div
        style={{
          background: THEMES[theme].card,
          padding: 16,
          borderRadius: "12px",
        }}
      >
        <h3>Dataset Preview</h3>
        {renderTable()}
      </div>

      {/* DASHBOARD */}
      <div
        ref={dashboardRef}
        style={{
          background: THEMES[theme].card,
          padding: 16,
          borderRadius: "12px",
        }}
      >
        {dashboardMode && (
          <>
            <h3 style={{ marginBottom: 16 }}>Dashboard</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {dashboardCharts.map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: THEMES[theme].card,
                    padding: 16,
                    borderRadius: "8px",
                    minHeight: "300px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h4 style={{ marginBottom: 8 }}>{c.title}</h4>
                  {c.type === "kpi" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {c.data.map((kpi, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            padding: "12px",
                            borderRadius: "8px",
                            textAlign: "center",
                          }}
                        >
                          <div style={{ fontSize: "14px", opacity: 0.8 }}>{kpi.label}</div>
                          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{kpi.value}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      {c.type === "bar" && (
                        <BarChart data={c.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <XAxis
                            dataKey="name"
                            label={{ value: c.xLabel || 'Category', position: 'insideBottom', offset: -5, fill: 'white' }}
                            tick={{ fontSize: 12, fill: 'white' }}
                          />
                          <YAxis
                            label={{ value: c.yLabel || 'Value', angle: -90, position: 'insideLeft', fill: 'white' }}
                            tick={{ fontSize: 12, fill: 'white' }}
                          />
                          <Tooltip
                            formatter={(value) => [value.toLocaleString(), c.yLabel || 'Value']}
                            labelFormatter={(label) => `${c.xLabel || 'Category'}: ${label}`}
                          />
                          <Bar dataKey="value" fill={THEMES[theme].accent} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      )}
                      {c.type === "pie" && (
                        <PieChart>
                          <Pie
                            data={c.data}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={70}
                            label={({ name, percentage }) => `${name}: ${percentage || ((c.data.find(d => d.name === name)?.value / dataset.length * 100).toFixed(1))}%`}
                            labelLine={false}
                          >
                            {c.data.map((entry, i) => (
                              <Cell
                                key={i}
                                fill={THEMES[theme].palette[i % THEMES[theme].palette.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name) => [
                              `${value} (${((value / dataset.length) * 100).toFixed(1)}%)`,
                              name
                            ]}
                          />
                        </PieChart>
                      )}
                      {c.type === "line" && (
                        <LineChart data={c.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <XAxis
                            dataKey="name"
                            label={{ value: c.xLabel || 'Time Period', position: 'insideBottom', offset: -5, fill: 'white' }}
                            tick={{ fontSize: 12, fill: 'white' }}
                          />
                          <YAxis
                            label={{ value: c.yLabel || 'Value', angle: -90, position: 'insideLeft', fill: 'white' }}
                            tick={{ fontSize: 12, fill: 'white' }}
                          />
                          <Tooltip
                            formatter={(value) => [value.toLocaleString(), c.yLabel || 'Value']}
                            labelFormatter={(label) => `${c.xLabel || 'Period'}: ${label}`}
                          />
                          <Line
                            dataKey="value"
                            stroke={THEMES[theme].accent}
                            strokeWidth={3}
                            dot={{ fill: THEMES[theme].accent, strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: THEMES[theme].accent, strokeWidth: 2 }}
                          />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={exportDashboardPDF}
              style={{
                marginTop: 16,
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: THEMES[theme].accent,
                color: "white",
                fontWeight: "bold",
              }}
            >
              Download Dashboard PDF
            </button>
          </>
        )}
      </div>

      {showDashboardOptions && (
        <DashboardOptions onSelect={handleDashboardSelect} />
      )}
    </div>
  );
}
