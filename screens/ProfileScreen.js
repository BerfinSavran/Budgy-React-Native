import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Surface } from 'react-native-paper';
import BottomNavigation from '../components/BottomNavigation';
import AppHeader from '../components/AppHeader';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    isim: 'berfin',
    telefon: '05328654875',
    email: 'bs@example.com',
    cinsiyet: 'Bilinmiyor'
  });

  const navigation = useNavigation();


  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const cinsiyetOptions = [
    'Bilinmiyor',
    'Kadın',
    'Erkek',
    'Diğer'
  ];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile({ ...editedProfile });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
    navigation.navigate('Login');
  };

  const renderProfileContent = () => {
    if (isEditing) {
      return (
        <Surface style={styles.profileCard}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>İsim:</Text>
            <TextInput
              style={styles.input}
              value={editedProfile.isim}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, isim: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefon:</Text>
            <TextInput
              style={styles.input}
              value={editedProfile.telefon}
              keyboardType="phone-pad"
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, telefon: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail:</Text>
            <TextInput
              style={styles.input}
              value={editedProfile.email}
              keyboardType="email-address"
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, email: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cinsiyet:</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => {
                  const currentIndex = cinsiyetOptions.indexOf(editedProfile.cinsiyet);
                  const nextIndex = (currentIndex + 1) % cinsiyetOptions.length;
                  setEditedProfile(prev => ({ ...prev, cinsiyet: cinsiyetOptions[nextIndex] }));
                }}
              >
                <Text style={styles.pickerButtonText}>{editedProfile.cinsiyet}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]} 
              onPress={handleSave}
            >
              <Text style={styles.actionButtonText}>Kaydet</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={handleCancel}
            >
              <Text style={styles.actionButtonText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        </Surface>
      );
    }

    return (
      <Surface style={styles.profileCard}>
        <View style={styles.profileItem}>
          <Text style={styles.label}>İsim:</Text>
          <Text style={styles.value}>{profile.isim}</Text>
        </View>

        <View style={styles.profileItem}>
          <Text style={styles.label}>Telefon:</Text>
          <Text style={styles.value}>{profile.telefon}</Text>
        </View>

        <View style={styles.profileItem}>
          <Text style={styles.label}>E-mail:</Text>
          <Text style={styles.value}>{profile.email}</Text>
        </View>

        <View style={styles.profileItem}>
          <Text style={styles.label}>Cinsiyet:</Text>
          <Text style={styles.value}>{profile.cinsiyet}</Text>
        </View>

        <TouchableOpacity 
          style={styles.editButton} 
          onPress={handleEdit}
        >
          <Text style={styles.editButtonText}>Düzenle</Text>
        </TouchableOpacity>
      </Surface>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Profil" />
      
      <View style={styles.content}>
        {renderProfileContent()}
      </View>

      <BottomNavigation activeRoute="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8EFFF',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center'
  },
  profileCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'white',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e6f5'
  },
  label: {
    fontSize: 14,
    color: '#7D2998',
    fontWeight: 'bold'
  },
  value: {
    fontSize: 14,
    color: '#333'
  },
  editButton: {
    backgroundColor: '#d199e0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  editButtonText: {
    color: '#7D2998',
    fontWeight: 'bold'
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#7D2998',
    fontSize: 14,
    paddingVertical: 8
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5
  },
  saveButton: {
    backgroundColor: '#4caf50'
  },
  cancelButton: {
    backgroundColor: '#f44336'
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#7D2998',
  },
  pickerButton: {
    paddingVertical: 8
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#333'
  }
});

export default ProfileScreen;