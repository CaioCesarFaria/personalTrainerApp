import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Progress = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Progresso</Text>
      <Text>Aqui você verá seus gráficos de evolução (peso, medidas, etc).</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});

export default Progress;
