
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const loginHandler = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      // 🔑 VERY IMPORTANT (sync with ProtectedRoute)
      localStorage.setItem("user", res.user.uid);

      // ✅ React Router navigation (NO reload)
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message.replace("Firebase:", "").trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div
        className="relative z-20 bg-white/15 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white/20 w-[400px] text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-extrabold text-white mb-8 drop-shadow">
          Login
        </h2>

        <input
          className="w-full p-3 mb-4 rounded-xl bg-white/70 focus:bg-white transition outline-none"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 rounded-xl bg-white/70 focus:bg-white transition outline-none"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && (
          <p className="text-red-300 text-sm mb-3">{errorMsg}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loginHandler}
          className="w-full bg-emerald text-white py-3 mt-2 rounded-xl font-semibold shadow hover:bg-emeraldDark"
        >
          Login
        </motion.button>

        <p className="mt-6 text-gray-200">
          Don't have an account?{" "}
          <a href="/signup" className="text-emerald font-bold hover:underline">
            Create One
          </a>
        </p>
      </motion.div>
    </div>
  );
}

