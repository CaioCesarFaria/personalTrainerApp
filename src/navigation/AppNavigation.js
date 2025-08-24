import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

// Screens
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";
import HomeStudent from "../screens/Student/HomeStudent";
import WorkoutList from "../screens/Student/WorkoutList";
import Progress from "../screens/Student/Progress";
import ProfileStudent from "../screens/Student/ProfileStudent";
import HomePersonal from "../screens/Personal/HomePersonal";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Colors = {
  primary: "#3B82F6",
  textSecondary: "#6B7280",
};

// Placeholder para tabs protegidas
const PlaceholderScreen = ({ navigation }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Ionicons name="lock-closed-outline" size={40} color="red" />
  </View>
);

// Tabs do aluno
const StudentTabs = ({ user }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case "Home":
            iconName = focused ? "home" : "home-outline";
            break;
          case "WorkoutList":
            iconName = focused ? "fitness" : "fitness-outline";
            break;
          case "Progress":
            iconName = focused ? "analytics" : "analytics-outline";
            break;
          case "Profile":
            iconName = focused ? "person" : "person-outline";
            break;
          default:
            iconName = "help-outline";
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textSecondary,
    })}
  >
    <Tab.Screen name="Home" component={HomeStudent} options={{ tabBarLabel: "Início" }} />
    <Tab.Screen
      name="WorkoutList"
      component={user ? WorkoutList : PlaceholderScreen}
      options={{ tabBarLabel: "Treinos" }}
    />
    <Tab.Screen
      name="Progress"
      component={user ? Progress : PlaceholderScreen}
      options={{ tabBarLabel: "Progresso" }}
    />
    <Tab.Screen
      name="Profile"
      component={user ? ProfileStudent : PlaceholderScreen}
      options={{ tabBarLabel: "Perfil" }}
    />
  </Tab.Navigator>
);

export default function AppNavigation() {
  const { user, role, loading } = useAuth();

  console.log("AppNavigation - User:", !!user, "Role:", role, "Loading:", loading);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 🔥 PERSONAL TRAINER - tem prioridade máxima */}
        {user && role === "personal" ? (
          <Stack.Screen name="HomePersonal" component={HomePersonal} />
        ) : user && role === "student" ? (
          /* 🔥 STUDENT LOGADO */
          <Stack.Screen name="StudentTabs">
            {() => <StudentTabs user={user} />}
          </Stack.Screen>
        ) : (
          /* 🔥 NÃO LOGADO - tela pública */
          <>
            <Stack.Screen name="HomeStudent">
              {() => <StudentTabs user={null} />}
            </Stack.Screen>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});