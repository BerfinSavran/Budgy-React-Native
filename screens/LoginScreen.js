import React, { useState, useContext  } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import userService from '../services/userService';
import { AuthContext } from '../services/authContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();  
  const { login } = useContext(AuthContext); 

  const handleLogin = async () => {
    console.log('Login işlemi başladı:', email);

    try {
      // userService.login API çağrısı
      const { token, user } = await userService.login(email, password);
      console.log("Giriş başarılı, token ve user alındı:", token, user);

      // AuthContext içindeki login fonksiyonunu çağır, token ve user verisini saklar
      await login(token, user);

      // Ana ekrana yönlendir
      navigation.navigate('Home');
    } catch (error) {
      console.error("Giriş hatası:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budgy</Text>

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

      <Button mode="contained" style={styles.button} onPress={handleLogin}>
        Giriş Yap
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Kayıt Oluştur</Text>
      </TouchableOpacity>
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
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#7D2998',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
