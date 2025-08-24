// src/screens/Auth/Register.js
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig/FirebaseConfig";

const Colors = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  error: '#EF4444',
  border: '#E5E7EB'
};

const Register = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    weight: '',
    height: '',
    objective: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword, age, weight, height } = formData;
    
    if (!name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return false;
    }
    
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Erro', 'Email inválido');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'Senhas não conferem');
      return false;
    }
    
    if (!age || !weight || !height) {
      Alert.alert('Erro', 'Por favor, preencha todos os dados físicos');
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Atualizar displayName no perfil do Firebase
      await updateProfile(user, {
        displayName: formData.name,
      });

      // Salvar dados no Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        userType: "student", // 🔹 sempre aluno
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        objective: formData.objective,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Sucesso!", "Conta criada com sucesso.");
      navigation.reset({
  index: 0,
  routes: [{ name: "HomeStudent" }],
});

    } catch (error) {
      console.log("Erro no cadastro:", error);
      Alert.alert("Erro", "Não foi possível criar a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Criar Conta</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Formulário */}
          <View style={styles.formContainer}>
            {/* Dados Básicos */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome Completo</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Digite seu nome completo"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Digite seu email"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.email}
                  onChangeText={(text) => updateFormData('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.password}
                  onChangeText={(text) => updateFormData('password', text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={Colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirmar Senha</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Digite a senha novamente"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateFormData('confirmPassword', text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Dados Específicos do Aluno */}
            <Text style={styles.sectionTitle}>Dados Físicos</Text>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, styles.inputHalf]}>
                <Text style={styles.inputLabel}>Idade</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Anos"
                    placeholderTextColor={Colors.textSecondary}
                    value={formData.age}
                    onChangeText={(text) => updateFormData('age', text)}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
              </View>

              <View style={[styles.inputContainer, styles.inputHalf]}>
                <Text style={styles.inputLabel}>Peso (kg)</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="speedometer-outline" size={20} color={Colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="70.5"
                    placeholderTextColor={Colors.textSecondary}
                    value={formData.weight}
                    onChangeText={(text) => updateFormData('weight', text)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Altura (cm)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="resize-outline" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="175"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.height}
                  onChangeText={(text) => updateFormData('height', text)}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Objetivo</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="target-outline" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Ex: Perder peso, Ganhar massa..."
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.objective}
                  onChangeText={(text) => updateFormData('objective', text)}
                />
              </View>
            </View>

            {/* Botão de Cadastro */}
            <TouchableOpacity
              style={[styles.registerButton, styles.studentButton]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </Text>
            </TouchableOpacity>

            {/* Link para Login */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Faça login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  keyboardAvoid: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: Colors.text },
  placeholder: { width: 40 },
  scrollContent: { padding: 20 },
  formContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 16,
  },
  inputContainer: { marginBottom: 20 },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textInput: { flex: 1, fontSize: 16, color: Colors.text, marginLeft: 12 },
  eyeButton: { padding: 4 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  inputHalf: { flex: 1 },
  registerButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  studentButton: { backgroundColor: Colors.secondary },
  buttonText: { fontSize: 16, fontWeight: '600', color: Colors.surface },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: { fontSize: 14, color: Colors.textSecondary },
  linkText: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
});

export default Register;
