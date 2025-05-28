import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // useNavigation hook'u
import userService from '../services/userService';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // navigation objesini al

  const handleRegister = async () => {
    console.log("handleRegister çağrıldı");
    try {
      const user = {
        FullName: name,
        Email: email,
        Password: password,
        Gender: 0,
        TelNo: "",
      };
      console.log("Kullanıcı objesi hazır:", user);


      const result = await userService.register(user);
      console.log("Kayıt başarılı:", result);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Kayıt hatası:", error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budgy</Text>

      <TextInput
        label="Ad Soyad"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        label="Şifre"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />

      <Button mode="contained" style={styles.button} onPress={handleRegister}>
        Kayıt Ol
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8EFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#7D2998',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#7D2998',
  },
});

export default RegisterScreen;
