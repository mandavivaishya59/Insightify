
import { motion, useScroll } from "framer-motion";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import TextTransition, { presets } from "react-text-transition";
import { auth } from "../firebase";

export default function Home() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const user = auth.currentUser;

  const phrases = ["From Raw Data", "To Beautiful Insights", "To Smart Decisions"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex(i => i + 1), 2500);
    return () => clearInterval(timer);
  }, []);

  const handleStart = () => user ? navigate("/dashboard") : navigate("/login");

  return (
    <div className="relative snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth">



      <section id="page1" className="snap-start h-screen flex flex-col items-center justify-center text-center px-6 relative z-30">
        <motion.h1
          className="text-5xl font-extrabold text-white mb-4 drop-shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Transform Your Data into Insights
        </motion.h1>

        <TextTransition springConfig={presets.stiff} className="text-3xl font-semibold text-emerald mb-6">
          {phrases[index % phrases.length]}
        </TextTransition>

        <motion.p
          className="text-gray-200 text-lg max-w-3xl mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Upload your dataset, generate visual reports, and chat with AI to uncover trends instantly.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="relative group bg-emerald text-white px-8 py-4 rounded-xl text-lg font-semibold shadow hover:bg-emeraldDark"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-emerald to-emeraldDark blur-xl opacity-0 group-hover:opacity-25 transition"></span>
          <span className="relative">Get Started</span>
        </motion.button>

        <Link to="page2" smooth duration={700}>
          <motion.div
            className="mt-24 cursor-pointer text-gray-200 text-xl"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          >
            ↓ Scroll to Explore
          </motion.div>
        </Link>
      </section>


      <section id="page2" className="snap-start h-screen flex flex-col items-center justify-center text-center px-6 relative z-30">
        <motion.h2
          className="text-4xl font-extrabold text-white mb-6 drop-shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          What is Insightify?
        </motion.h2>

        <motion.p
          className="text-gray-200 max-w-3xl text-lg mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Insightify is an AI-powered analytics platform that cleans, visualizes, summarizes, and chats with your data — instantly.
        </motion.p>

        <Link to="page3" smooth duration={700}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group bg-emerald text-white px-6 py-3 rounded-xl font-semibold shadow"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald to-emeraldDark blur-xl opacity-0 group-hover:opacity-25 transition"></span>
            <span className="relative">How It Works</span>
            </motion.button>
            <motion.div
            className="mt-24 cursor-pointer text-gray-200 text-xl"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          >
            Know More ↓
          </motion.div>


        </Link>
      </section>




      <section id="page3" className="snap-start h-screen flex flex-col items-center justify-center text-center px-6 relative z-30">
        <motion.h2
          className="text-4xl font-extrabold text-white mb-12 drop-shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How to Use Insightify
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-10 max-w-5xl"
          variants={{ show: { transition: { staggerChildren: 0.2 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {[
            { title: "📁 Upload Dataset", desc: "Drag & drop Excel / CSV for analysis." },
            { title: "📊 View Charts & Insights", desc: "Auto visuals, cleaning report, AI summary." },
            { title: "🤖 Chat with Your Data", desc: "Ask AI anything about your dataset." }
          ].map((card, i) => (
            <Tilt glareEnable={true} glareColor="#0BA37F" glareBorderRadius="14px" key={i}>
              <motion.div
                className="bg-white bg-opacity-90 shadow-xl p-6 rounded-xl backdrop-blur-xl"
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              >
                <h3 className="text-xl font-semibold text-emerald mb-2">{card.title}</h3>
                <p className="text-gray-700">{card.desc}</p>
              </motion.div>
            </Tilt>
          ))}
        </motion.div>

        <motion.button
          onClick={handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group mt-12 bg-emerald text-white px-8 py-4 rounded-xl text-lg font-semibold shadow"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-emerald to-emeraldDark blur-xl opacity-0 group-hover:opacity-25 transition"></span>
          <span className="relative">Start Using Insightify →</span>
        </motion.button>
      </section>
    </div>
  );
}


/*
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        color: "white",
        background:
          "radial-gradient(circle at top, #0f5132, #0a3d2e, #062e23)",
      }}
    >
   
      <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>
        Welcome Back, mandavivaishya20 👋
      </h1>
      <p style={{ opacity: 0.85 }}>
        Your smart analytics workspace is ready.
      </p>

     
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        <Card
          title="Upload Data"
          desc="Upload your CSV / Excel files"
          onClick={() => navigate("/upload")}
        />

        <Card
          title="Generate Reports"
          desc="Export PDF insights"
          onClick={() => navigate("/chat")}
        />

        <Card
          title="AI Chat"
          desc="Talk with your data using AI"
          onClick={() => navigate("/chat")}
        />

        <Card
          title="History"
          desc="See previous analysis"
          onClick={() => navigate("/history")}
        />
      </div>

    
      <div
        style={{
          marginTop: "50px",
          padding: "30px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2>Recent Activity</h2>
        <p style={{ opacity: 0.8 }}>
          Your recent uploads and reports will appear here.
        </p>
      </div>
    </div>
  );
}

function Card({ title, desc, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "30px",
        borderRadius: "20px",
        cursor: "pointer",
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(12px)",
        transition: "0.3s",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
      }
    >
      <h3>{title}</h3>
      <p style={{ opacity: 0.85 }}>{desc}</p>
    </div>
  );
}

const user = localStorage.getItem("user");

const goToChat = () => {
  if (!user) navigate("/login");
  else navigate("/chat");
};


import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const goToChat = () => {
    if (!user) navigate("/login");
    else navigate("/dashboard");
  };

  return (
    <button onClick={goToChat}>
      Get Started
    </button>
  );
}


import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const handleGetStarted = () => {
    if (!user) navigate("/login");
    else navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "white",
        padding: "60px",
        background:
          "radial-gradient(circle at top, #0f5132, #0a3d2e, #062e23)",
      }}
    >
     
      <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
        Insightify
      </h1>
      <p style={{ fontSize: "18px", opacity: 0.85, maxWidth: "600px" }}>
        Turn raw data into instant insights, charts, and dashboards using AI.
        No manual analysis. No complexity.
      </p>

      <button
        onClick={handleGetStarted}
        style={{
          marginTop: "30px",
          padding: "14px 28px",
          borderRadius: "30px",
          border: "none",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          background: "linear-gradient(135deg, #13efcb, #4ECDC4)",
        }}
      >
        Get Started
      </button>

      
      <div style={{ marginTop: "80px", maxWidth: "800px" }}>
        <h2>Why Insightify?</h2>
        <ul style={{ opacity: 0.85, lineHeight: "1.8" }}>
          <li>📊 Upload CSV / Excel and analyze instantly</li>
          <li>🤖 Ask questions in plain English</li>
          <li>📈 Auto-generate charts & dashboards</li>
          <li>📄 Export reports as PDF</li>
        </ul>
      </div>
    </div>
  );
}
*/
