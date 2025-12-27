import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const signupHandler = async () => {
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

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
          Sign Up
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

        <input
          className="w-full p-3 mb-4 rounded-xl bg-white/70 focus:bg-white transition outline-none"
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {errorMsg && (
          <p className="text-red-300 text-sm mb-3">{errorMsg}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={signupHandler}
          className="w-full bg-emerald text-white py-3 mt-2 rounded-xl font-semibold shadow hover:bg-emeraldDark"
        >
          Sign Up
        </motion.button>

        <p className="mt-6 text-gray-200">
          Already have an account?{" "}
          <a href="/login" className="text-emerald font-bold hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
