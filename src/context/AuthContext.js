// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../FirebaseConfig/FirebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const appDocId = "personalAppMain";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Buscar dados do usuário no Firestore
          const userDocRef = doc(db, "personalApp", appDocId, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.userType || "student"); // usa o userType do Firestore
            console.log("Role do usuário:", userData.userType);
          } else {
            // Se não encontrar o documento, considera como student
            setRole("student");
            console.log("Documento do usuário não encontrado, definindo como student");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          setRole("student"); // fallback para student
        }
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
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
