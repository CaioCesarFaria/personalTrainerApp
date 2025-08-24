// HomeStudent.js
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../FirebaseConfig/FirebaseConfig";
import { signOut } from "firebase/auth";

const { width } = Dimensions.get("window");

const Colors = {
  primary: "#3B82F6",
  secondary: "#10B981",
  accent: "#F59E0B",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#1F2937",
  textSecondary: "#6B7280",
  error: "#EF4444",
  success: "#10B981",
  border: "#E5E7EB",
};

const HomeStudent = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState("Usuário");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Pegar usuário logado
    const currentUser = auth.currentUser;
    setUser(currentUser);

    if (currentUser) {
      setUserName(
        currentUser.displayName ||
          currentUser.email?.split("@")[0] ||
          "Usuário"
      );
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert("Atualizado", "Dados atualizados com sucesso!");
    }, 2000);
  }, []);

  const handleLogout = async () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (error) {
            Alert.alert("Erro", "Erro ao fazer logout");
          }
        },
      },
    ]);
  };

  const NoWorkoutCard = () => (
    <View style={styles.noWorkoutCard}>
      <View style={styles.noWorkoutContent}>
        <Ionicons
          name="fitness-outline"
          size={48}
          color={Colors.textSecondary}
        />
        <Text style={styles.noWorkoutTitle}>Nenhuma rotina cadastrada</Text>
        <Text style={styles.noWorkoutSubtitle}>
          Fale com o Personal Trainer para criar seus treinos
        </Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() =>
            Alert.alert("Em breve", "Funcionalidade de contato em desenvolvimento")
          }
        >
          <Ionicons name="chatbubble-outline" size={20} color={Colors.primary} />
          <Text style={styles.contactButtonText}>Entrar em contato</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const WelcomeCard = () => (
    <View style={styles.welcomeCard}>
      <View style={styles.welcomeContent}>
        <Ionicons name="hand-right" size={32} color={Colors.primary} />
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeTitle}>Bem-vindo ao seu app de treinos!</Text>
          <Text style={styles.welcomeSubtitle}>
            Assim que seu Personal Trainer criar suas rotinas, elas aparecerão aqui.
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Olá, {userName}!</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>
          </View>
          <View style={styles.headerActions}>
            {user && (
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={24} color={Colors.error} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => Alert.alert("Notificações", "Nenhuma notificação nova")}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={Colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Botões de Login/Cadastro (só se não estiver logado) */}
        {!user && (
          <View style={styles.authButtonsContainer}>
            <TouchableOpacity
              style={[styles.authButton, { backgroundColor: Colors.primary }]}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.authButtonText}>Fazer Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.authButton, { backgroundColor: Colors.secondary }]}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.authButtonText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Welcome Card */}
        <WelcomeCard />

        {/* No Workout Card */}
        <NoWorkoutCard />

        {/* Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoContent}>
            <Ionicons name="information-circle" size={24} color={Colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Como funciona?</Text>
              <Text style={styles.infoSubtitle}>
                1. Seu Personal Trainer irá criar treinos personalizados para você{"\n"}
                2. Os treinos aparecerão nesta tela{"\n"}
                3. Você poderá executá-los e acompanhar seu progresso
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  dateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    textTransform: "capitalize",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  notificationButton: {
    padding: 8,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },

  // Botões de login/cadastro
  authButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  authButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  authButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Welcome Card
  welcomeCard: {
    backgroundColor: `${Colors.primary}15`,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  welcomeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeText: {
    flex: 1,
    marginLeft: 16,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // No Workout Card
  noWorkoutCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  noWorkoutContent: {
    alignItems: "center",
  },
  noWorkoutTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  noWorkoutSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.primary}15`,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
  },

  // Info Card
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    marginLeft: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  infoSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default HomeStudent;

