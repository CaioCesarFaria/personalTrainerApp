import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";

const ProfileStudent = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      {user ? (
        <>
          <Text>Nome: {user.displayName || "Sem nome"}</Text>
          <Text>Email: {user.email}</Text>
          <Text>ID: {user.uid}</Text>
          <Text onPress={logout} style={styles.logout}>Sair</Text>
        </>
      ) : (
        <Text>Você precisa estar logado para ver o perfil.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  logout: { marginTop: 20, color: "red", fontWeight: "bold" },
});

export default ProfileStudent;
