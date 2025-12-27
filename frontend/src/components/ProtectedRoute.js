/*
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth, onAuthStateChanged } from "../firebase";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return user ? children : <Navigate to="/" />;
}
  */

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

