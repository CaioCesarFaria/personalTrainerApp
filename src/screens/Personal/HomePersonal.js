// HomePersonal.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from "../../FirebaseConfig/FirebaseConfig";
import { signOut } from "firebase/auth";
const { width } = Dimensions.get('window');

const Colors = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  error: '#EF4444',
  success: '#10B981',
  border: '#E5E7EB'
};

const HomePersonal = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    activeStudents: 12,
    totalWorkouts: 28,
    totalExercises: 156,
    weeklyProgress: 85
  });
  const handleLogout = () => {
  Alert.alert(
    'Sair',
    'Tem certeza que deseja sair?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          signOut(auth)
            .then(() => {
              // Redireciona para a tela de login/home do estudante
              navigation.reset({
                index: 0,
                routes: [{ name: 'HomeStudent' }],
              });
            })
            .catch((error) => {
              console.log('Erro ao deslogar:', error);
              Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
            });
        },
      },
    ],
    { cancelable: true }
  );
};


  const [recentStudents] = useState([
    {
      id: 1,
      name: 'Ana Silva',
      lastWorkout: '2 dias atrás',
      progress: 85,
      avatar: 'A'
    },
    {
      id: 2,
      name: 'Carlos Santos',
      lastWorkout: '1 dia atrás',
      progress: 92,
      avatar: 'C'
    },
    {
      id: 3,
      name: 'Maria Oliveira',
      lastWorkout: '3 dias atrás',
      progress: 78,
      avatar: 'M'
    },
    {
      id: 4,
      name: 'João Costa',
      lastWorkout: 'Hoje',
      progress: 95,
      avatar: 'J'
    }
  ]);

  const quickActions = [
    {
      id: 1,
      title: 'Novo Aluno',
      subtitle: 'Cadastrar',
      icon: 'person-add',
      color: Colors.primary,
      screen: 'AddStudent'
    },
    {
      id: 2,
      title: 'Novo Exercício',
      subtitle: 'Criar',
      icon: 'add-circle',
      color: Colors.secondary,
      screen: 'AddExercise'
    },
    {
      id: 3,
      title: 'Novo Treino',
      subtitle: 'Montar',
      icon: 'create',
      color: Colors.accent,
      screen: 'AddWorkout'
    }
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simular carregamento de dados
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <View style={styles.statIconContainer}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.statTextContainer}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );

  const ActionCard = ({ item }) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIconContainer, { backgroundColor: `${item.color}15` }]}>
        <Ionicons name={item.icon} size={28} color={item.color} />
      </View>
      <Text style={styles.actionTitle}>{item.title}</Text>
      <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  );

  const StudentCard = ({ student }) => (
    <TouchableOpacity 
      style={styles.studentCard}
      onPress={() => navigation.navigate('StudentDetail', { studentId: student.id })}
      activeOpacity={0.7}
    >
      <View style={styles.studentInfo}>
        <View style={styles.studentAvatar}>
          <Text style={styles.avatarText}>{student.avatar}</Text>
        </View>
        <View style={styles.studentDetails}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentLastWorkout}>Último treino: {student.lastWorkout}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${student.progress}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>{student.progress}%</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
       <View style={styles.headerContent}>
  <View>
    <Text style={styles.greeting}>Olá, Personal!</Text>
    <Text style={styles.subGreeting}>Como está seu dia?</Text>
  </View>

  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <TouchableOpacity 
      style={styles.logoutButton}
      onPress={handleLogout}
    >
      <Ionicons name="log-out-outline" size={28} color={Colors.error} />
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.profileButton}
      onPress={() => navigation.navigate('Profile')}
    >
      <Ionicons name="person-circle" size={32} color={Colors.primary} />
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
        {/* Stats Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visão Geral</Text>
          <View style={styles.statsContainer}>
            <StatCard
              title="Alunos Ativos"
              value={stats.activeStudents}
              icon="people"
              color={Colors.primary}
            />
            <StatCard
              title="Treinos Criados"
              value={stats.totalWorkouts}
              icon="barbell"
              color={Colors.secondary}
            />
            <StatCard
              title="Exercícios"
              value={stats.totalExercises}
              icon="fitness"
              color={Colors.accent}
              subtitle="Cadastrados"
            />
            <StatCard
              title="Progresso Semanal"
              value={`${stats.weeklyProgress}%`}
              icon="trending-up"
              color={Colors.success}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsContainer}>
            {quickActions.map((action) => (
              <ActionCard key={action.id} item={action} />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alunos Recentes</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Students')}
            >
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.studentsContainer}>
            {recentStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </View>
        </View>

        {/* Weekly Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo da Semana</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Ionicons name="calendar" size={20} color={Colors.primary} />
                <Text style={styles.summaryLabel}>Treinos Agendados</Text>
                <Text style={styles.summaryValue}>24</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={styles.summaryLabel}>Concluídos</Text>
                <Text style={styles.summaryValue}>18</Text>
              </View>
            </View>
            
            <View style={styles.summaryProgress}>
              <Text style={styles.summaryProgressLabel}>Taxa de Conclusão</Text>
              <View style={styles.summaryProgressBar}>
                <View style={[styles.summaryProgressFill, { width: '75%' }]} />
              </View>
              <Text style={styles.summaryProgressText}>75%</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subGreeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  
  // Stats
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    width: (width - 52) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    marginRight: 12,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  
  // Actions
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  
  // Students
  studentsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  studentLastWorkout: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  
  // Summary
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
    marginHorizontal: 20,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginVertical: 4,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  summaryProgress: {
    alignItems: 'center',
  },
  summaryProgressLabel: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  summaryProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  summaryProgressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  summaryProgressText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success,
  },
});

export default HomePersonal;