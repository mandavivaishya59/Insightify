/*
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth } from "../firebase";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Get current user info
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Use display name or email as username
      setUserName(currentUser.displayName || currentUser.email.split('@')[0]);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.1);
            }
          }
        `}
      </style>
      // Video Background 
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
          filter: "brightness(0.6) contrast(1.1)",
        }}
      >
        <source src="/login.mp4" type="video/mp4" />
      </video>

      // Enhanced Overlay with Gradient 
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.5) 100%)",
          zIndex: 0,
        }}
      />

      // Animated Header 
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "30px 50px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: "20px",
              fontWeight: "600",
              background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              letterSpacing: "0.5px"
            }}
          >
            Hi {userName} 👋
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "4px",
              padding: "4px 10px",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "20px",
              backdropFilter: "blur(10px)"
            }}
          >
            <div style={{
              width: "8px",
              height: "8px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              borderRadius: "50%",
              boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)",
              animation: "pulse 2s infinite"
            }}></div>
            <span style={{
              fontSize: "12px",
              fontWeight: "500",
              color: "#10b981",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)"
            }}>
              AI Ready
            </span>
          </motion.div>
        </div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 8px 25px rgba(255, 255, 255, 0.2)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          style={{
            padding: "12px 24px",
            background: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            borderRadius: "12px",
            color: "white",
            cursor: "pointer",
            backdropFilter: "blur(20px)",
            fontWeight: "500",
            fontSize: "14px",
            letterSpacing: "0.5px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          Logout
        </motion.button>
      </motion.div>

      // Animated Main Content 
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        style={{
          position: "relative",
          zIndex: 10,
          padding: "50px",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{
            fontSize: "52px",
            marginBottom: "16px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            letterSpacing: "-1px",
            lineHeight: "1.1"
          }}
        >
          Welcome Back 👋
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{
            opacity: 0.9,
            fontSize: "18px",
            fontWeight: "400",
            color: "#f1f5f9",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            letterSpacing: "0.3px",
            maxWidth: "600px"
          }}
        >
          Your smart analytics workspace is ready.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            marginTop: "50px",
          }}
        >
          <Card
            title="Data to Dashboard"
            subtitle="Export PDF insights"
            icon="📊"
            isGreen={true}
          />

          <Card
            title="AI Chat"
            subtitle="Talk with your data using AI"
            icon="💬"
            isGreen={true}
          />

          <Card
            title="Quick Summary"
            subtitle="Get quick insights"
            icon="📈"
            isGreen={true}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <Card
            title="Upload Data"
            subtitle="Upload your CSV / Excel files"
            onClick={() => navigate("/upload")}
            icon="📁"
            isPrimary={true}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          style={{
            marginTop: "60px",
            padding: "32px",
            borderRadius: "22px",
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(14px)",
          }}
        >
          <h2 style={{
            color: "white",
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "16px",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
          }}>Get Started</h2>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            alignItems: "flex-start"
          }}>
            <p style={{
              opacity: 0.9,
              color: "#e2e8f0",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
              marginBottom: "8px",
              fontSize: "16px"
            }}>
              No datasets uploaded yet. Start by uploading your data to unlock AI-powered insights.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/upload")}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #10b981, #059669)",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              📁 Upload Your First Dataset
            </motion.button>

            <div style={{
              marginTop: "16px",
              padding: "16px",
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
              <h4 style={{
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "8px",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)"
              }}>
                💡 Try asking AI questions like:
              </h4>
              <ul style={{
                color: "#e2e8f0",
                fontSize: "14px",
                lineHeight: "1.6",
                margin: 0,
                paddingLeft: "20px",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
              }}>
                <li>"Show me sales trends"</li>
                <li>"Which category performs best?"</li>
                <li>"Create a revenue dashboard"</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Card({ title, subtitle, onClick, icon, isPrimary = false }) {
  const isClickable = !!onClick;
  return (
    <motion.div
      onClick={onClick}
      whileHover={isClickable ? {
        scale: 1.02,
        y: -8,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
      } : {}}
      whileTap={isClickable ? { scale: 0.98 } : {}}
      style={{
        padding: "34px",
        borderRadius: "22px",
        cursor: isClickable ? "pointer" : "default",
        background: isPrimary
          ? "rgba(255,255,255,0.22)"
          : "rgba(255,255,255,0.18)",
        backdropFilter: "blur(16px)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: isPrimary ? "2px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {isPrimary && (
        <div style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "white",
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "11px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>
          Start Here
        </div>
      )}

      <div style={{
        fontSize: "32px",
        marginBottom: "16px",
        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
      }}>
        {icon}
      </div>

      <h3 style={{
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "8px",
        color: "white",
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)"
      }}>
        {title}
      </h3>

      <p style={{
        fontSize: "14px",
        opacity: 0.8,
        color: "#e2e8f0",
        lineHeight: "1.4",
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
      }}>
        {subtitle}
      </p>
    </motion.div>
  );
}
*/

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth } from "../firebase";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [datasetUploaded, setDatasetUploaded] = useState(false); // later connect to backend

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserName(currentUser.displayName || currentUser.email.split("@")[0]);
    }

    // TEMP: simulate uploaded data
    // later replace with API call
    setDatasetUploaded(false);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <video autoPlay loop muted style={bgVideo}>
        <source src="/login.mp4" type="video/mp4" />
      </video>
      <div style={overlay} />

      {/* HEADER */}
      <motion.div style={header}>
        <div>
          <div style={hello}>Hi {userName} 👋</div>
          {/*<div style={aiReady}>● AI Ready</div>*/}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleLogout} style={logoutBtn}>Logout</button>
        </div>
      </motion.div>

      {/* MAIN */}
      <motion.div style={main}>
        <h1 style={title}>Your AI Analytics Workspace</h1>
        <p style={subtitle}>Chat with data, generate dashboards, export insights.</p>

        <div style={grid}>
          {/* DATA TO DASHBOARD */}
          <FeatureCard
            icon="📊"
            title="Data to Dashboard"
            desc="Export PDF insights"
            green
          />

          {/* AI CHAT */}
          <FeatureCard
            icon="💬"
            title="AI Chat"
            desc="Talk with your data using AI"
            green
          />

          {/* QUICK SUMMARY */}
          <FeatureCard
            icon="📈"
            title="Quick Summary"
            desc="Get quick insights"
            green
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
          <FeatureCard
            icon="📁"
            title="Upload Data"
            desc="Upload your CSV / Excel files"
            onClick={() => navigate("/upload")}
          />
        </div>

        {/* SMART AI SUGGESTIONS 
        <div style={hintBox}>
          <h4>💡 Try asking AI:</h4>
          <ul>
            <li>“Give me a summary of this dataset”</li>
            <li>“Create a sales dashboard”</li>
            <li>“Which category performs best?”</li>
          </ul>
        </div>
        */}
      </motion.div>
    </div>
  );
}

/* ---------- COMPONENT ---------- */

function FeatureCard({ icon, title, desc, onClick, primary, green }) {
  const isClickable = !!onClick;
  return (
    <motion.div
      whileHover={isClickable ? { scale: 1.04 } : {}}
      onClick={onClick}
      style={{
        padding: "32px",
        borderRadius: "22px",
        cursor: isClickable ? "pointer" : "default",
        background: green
          ? "rgba(16, 185, 129, 0.15)"
          : primary
          ? "rgba(255,255,255,0.25)"
          : "rgba(255,255,255,0.15)",
        backdropFilter: "blur(16px)",
        border: green
          ? "1px solid rgba(16, 185, 129, 0.3)"
          : primary
          ? "2px solid #10b981"
          : "1px solid rgba(255,255,255,0.2)"
      }}
    >
      <div style={{ fontSize: 32 }}>{icon}</div>
      <h3 style={{ color: "white", marginTop: 12 }}>{title}</h3>
      <p style={{ color: "#e5e7eb", fontSize: 14 }}>{desc}</p>
    </motion.div>
  );
}

/* ---------- STYLES ---------- */

const bgVideo = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: -2,
  filter: "brightness(0.8)  contrast(1.1)"
};

const overlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  zIndex: -1
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  padding: "30px 50px",
  color: "white"
};

const hello = { fontSize: 18, fontWeight: 600 };
const aiReady = { color: "#10b981", fontSize: 12 };

const historyBtn = {
  padding: "10px 20px",
  background: "rgba(59, 130, 246, 0.2)",
  border: "1px solid rgba(59, 130, 246, 0.3)",
  borderRadius: 10,
  color: "#60a5fa",
  cursor: "pointer",
  fontWeight: "500"
};

const logoutBtn = {
  padding: "10px 20px",
  background: "rgba(255,255,255,0.2)",
  border: "none",
  borderRadius: 10,
  color: "white",
  cursor: "pointer"
};

const main = { padding: "50px" };
const title = { fontSize: 44, color: "white", fontWeight: 800 };
const subtitle = { color: "#e5e7eb", marginBottom: 40 };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: 24
};

const hintBox = {
  marginTop: 50,
  padding: 24,
  borderRadius: 18,
  background: "rgba(255,255,255,0.12)",
  color: "white"
};
