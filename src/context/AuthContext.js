// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../FirebaseConfig/FirebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const ADMINS = ["321caioster@gmail.com"];
  const [role, setRole] = useState(null);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    setUser(firebaseUser);
    if (firebaseUser) {
      const isAdmin = ADMINS.includes(firebaseUser.email);
      setRole(isAdmin ? "personal" : "student"); // agora funciona
    } else {
      setRole(null);
    }
    setLoading(false);
  });
  return unsubscribe;
}, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
