import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Surface } from 'react-native-paper';
import BottomNavigation from '../components/BottomNavigation';
import AppHeader from '../components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../services/authContext';
import userService from '../services/userService';

const ProfileScreen = () => {
  const { userData, logout } = useContext(AuthContext); // logout fonksiyonunu da ekledik
  const navigation = useNavigation();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const cinsiyetOptions = ['Bilinmiyor', 'Kadın', 'Erkek', 'Diğer'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userData) {
          setLoading(false);
          return;
        }
        
        console.log('userData:', userData); // Debug için
        
        const response = await userService.getById(userData.ID);
        console.log('API response:', response); // Debug için
        
        // API'den gelen veriyi uygun formatta düzenle
        const profileData = {
          isim: response.FullName || response.fullName || response.isim || '',
          telefon: response.TelNo || response.telNo || response.telefon || '',
          email: response.Email || response.email || '',
          cinsiyet: getCinsiyetText(response.Gender || response.gender) || 'Bilinmiyor'
        };
        
        console.log('Profile data:', profileData); // Debug için
        
        setProfile(profileData);
        setEditedProfile(profileData);
      } catch (error) {
        console.error('Profil alınamadı:', error);
        Alert.alert('Hata', 'Profil bilgileri alınamadı');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userData]);

  // Gender enum'unu metne çevir
  const getCinsiyetText = (genderValue) => {
    switch (genderValue) {
      case 0: return 'Erkek';
      case 1: return 'Kadın';
      case 2: return 'Diğer';
      default: return 'Bilinmiyor';
    }
  };

  // Metin'i gender enum'una çevir
  const getCinsiyetValue = (genderText) => {
    switch (genderText) {
      case 'Erkek': return 0;
      case 'Kadın': return 1;
      case 'Diğer': return 2;
      default: return null;
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      // API'ye göndermek için veriyi uygun formata çevir
      const updateData = {
        FullName: editedProfile.isim,
        TelNo: editedProfile.telefon,
        Email: editedProfile.email,
        Gender: getCinsiyetValue(editedProfile.cinsiyet)
      };
      
      console.log('Update data:', updateData); // Debug için
      
      await userService.updateUser(userData.ID, updateData);
      setProfile({ ...editedProfile });
      setIsEditing(false);
      Alert.alert('Başarılı', 'Profil bilgileri güncellendi');
    } catch (error) {
      console.error('Profil güncellenemedi:', error);
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu');
    }
  };

  const handleCancel = () => {
    // Değişiklikleri geri al
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Evet', 
          onPress: () => {
            if (logout) {
              logout();
            }
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const renderProfileContent = () => {
    if (loading) {
      return (
        <Surface style={styles.profileCard}>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </Surface>
      );
    }

    if (!profile) {
      return (
        <Surface style={styles.profileCard}>
          <Text style={styles.errorText}>Profil bilgileri yüklenemedi</Text>
        </Surface>
      );
    }

    if (isEditing) {
      return (
        <Surface style={styles.profileCard}>
          {['isim', 'telefon', 'email'].map((field) => (
            <View key={field} style={styles.inputContainer}>
              <Text style={styles.label}>
                {field === 'isim' ? 'İsim' : 
                 field === 'telefon' ? 'Telefon' : 
                 field === 'email' ? 'E-mail' : field}:
              </Text>
              <TextInput
                style={styles.input}
                value={editedProfile[field] || ''}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, [field]: text }))}
                placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} girin`}
              />
            </View>
          ))}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cinsiyet:</Text>
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

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.actionButtonText}>Kaydet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.actionButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </Surface>
      );
    }

    return (
      <View>
        <Surface style={styles.profileCard}>
          {['isim', 'telefon', 'email', 'cinsiyet'].map((field) => (
            <View key={field} style={styles.profileItem}>
              <Text style={styles.label}>
                {field === 'isim' ? 'İsim' : 
                 field === 'telefon' ? 'Telefon' : 
                 field === 'email' ? 'E-mail' : 
                 field === 'cinsiyet' ? 'Cinsiyet' : field}:
              </Text>
              <Text style={styles.value}>{profile[field] || 'Belirtilmemiş'}</Text>
            </View>
          ))}
          
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Düzenle</Text>
          </TouchableOpacity>
        </Surface>

        {/* Çıkış butonu */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Profil" />
      <View style={styles.content}>{renderProfileContent()}</View>
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
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e6f5'
  },
  label: {
    fontSize: 14,
    color: '#7D2998',
    fontWeight: 'bold',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
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
    paddingVertical: 8,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
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
  pickerButton: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#7D2998',
    marginTop: 5,
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#333'
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7D2998',
    paddingVertical: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#f44336',
    paddingVertical: 20,
  }
});

export default ProfileScreen;