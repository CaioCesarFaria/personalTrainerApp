import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WorkoutList = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Treinos</Text>
      <Text>Aqui você verá a lista de treinos cadastrados pelo seu personal.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});

export default WorkoutList;
