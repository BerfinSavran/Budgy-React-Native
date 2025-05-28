import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB, Portal, Modal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import incomeExpenseService from '../services/incomeExpenseService';
import goalService from '../services/goalService';
import categoryService from '../services/categoryService';
import { AuthContext } from '../services/authContext';

const BottomNavigation = ({ activeRoute }) => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    if (visible) {
      const userId = userData.ID;
      let inExType = selectedOption === 'income' ? 0 : 1;

      if (selectedOption === 'income' || selectedOption === 'expense' || selectedOption === 'goal') {
        categoryService.getCategoriesByTypeAndUser(inExType, userId)
          .then((data) => {
            setCategories(data);
            setCategory('');
          })
          .catch((err) => {
            console.error('Kategori çekme hatası:', err);
            setCategories([]);
            setCategory('');
          });
      } else {
        setCategories([]);
        setCategory('');
      }
    }
  }, [visible, selectedOption]);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setShowDatePicker(false);
    setAmount('');
    setCategory('');
    setDate(new Date());
    setStartDate(new Date());
    setEndDate(new Date());
    setDescription('');
  };

  const formatDateToBackend = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    if (!amount || !category) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    const userId = userData?.ID;

    try {
      if (selectedOption === 'income' || selectedOption === 'expense') {
        const data = {
          Amount: Number(amount),
          CategoryId: category,
          Date: formatDateToBackend(date),
          Description: description,
          InExType: selectedOption === 'income' ? 0 : 1,
          UserId: userId,
        };

        await incomeExpenseService.addOrUpdate(data);
        Alert.alert('Başarılı', 'Gelir/Gider kaydedildi.');

      } else if (selectedOption === 'goal') {
        const data = {
          Amount: Number(amount),
          CategoryId: category,
          StartDate: formatDateToBackend(startDate),
          EndDate: formatDateToBackend(endDate),
          Description: description,
          UserId: userId,
        };

        await goalService.addOrUpdate(data);
        Alert.alert('Başarılı', 'Hedef kaydedildi.');
      }

      hideModal();
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Kaydetme işlemi başarısız oldu.');
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);

    if (event.type === 'set') {
      if (selectedOption === 'goal') {
        if (selectingStart) setStartDate(selectedDate);
        else setEndDate(selectedDate);
      } else {
        setDate(selectedDate);
      }
    }
  };

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          onRequestClose={hideModal}
          contentContainerStyle={styles.modalContainer}
          animationType="slide"
        >
          <Text style={styles.modalTitle}>Yeni Kayıt</Text>

          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[styles.optionButton, selectedOption === 'income' && styles.selectedOption]}
              onPress={() => setSelectedOption('income')}
            >
              <Text style={[styles.optionText, selectedOption === 'income' && styles.selectedOptionText]}>Gelir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, selectedOption === 'expense' && styles.selectedOption]}
              onPress={() => setSelectedOption('expense')}
            >
              <Text style={[styles.optionText, selectedOption === 'expense' && styles.selectedOptionText]}>Gider</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, selectedOption === 'goal' && styles.selectedOption]}
              onPress={() => setSelectedOption('goal')}
            >
              <Text style={[styles.optionText, selectedOption === 'goal' && styles.selectedOptionText]}>Hedef</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Miktar"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Kategori Seçin" value="" />
            {categories.map(cat => (
              <Picker.Item key={cat.ID} label={cat.Name} value={cat.ID} />
            ))}
          </Picker>

          {selectedOption === 'goal' ? (
            <>
              <Text style={{ marginBottom: 5 }}>Başlangıç Tarihi</Text>
              <Pressable
                onPress={() => {
                  setSelectingStart(true);
                  setShowDatePicker(true);
                }}
                style={styles.datePickerButton}
              >
                <Text style={styles.datePickerText}>
                  {startDate ? startDate.toLocaleDateString() : 'Başlangıç Tarihi Seçin'}
                </Text>
              </Pressable>

              <Text style={{ marginBottom: 5 }}>Bitiş Tarihi</Text>
              <Pressable
                onPress={() => {
                  setSelectingStart(false);
                  setShowDatePicker(true);
                }}
                style={styles.datePickerButton}
              >
                <Text style={styles.datePickerText}>
                  {endDate ? endDate.toLocaleDateString() : 'Bitiş Tarihi Seçin'}
                </Text>
              </Pressable>
            </>
          ) : (
            <Pressable onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>
                {date ? date.toLocaleDateString() : 'Tarih Seçin'}
              </Text>
            </Pressable>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={selectedOption === 'goal' ? (selectingStart ? startDate : endDate) : date}
              mode="date"
              display="spinner"
              onChange={onDateChange}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Açıklama"
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </Modal>
      </Portal>

      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Icon name="home" size={24} color={activeRoute === 'Home' ? '#7D2998' : '#9E9E9E'} />
            <Text style={[styles.navText, activeRoute === 'Home' && styles.activeNavText]}>Anasayfa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Analysis')}>
            <Icon name="chart-bar" size={24} color={activeRoute === 'Analysis' ? '#7D2998' : '#9E9E9E'} />
            <Text style={[styles.navText, activeRoute === 'Analysis' && styles.activeNavText]}>Analiz</Text>
          </TouchableOpacity>

          <View style={styles.fabPlaceholder} />

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Categories')}>
            <Icon name="format-list-bulleted" size={24} color={activeRoute === 'Categories' ? '#7D2998' : '#9E9E9E'} />
            <Text style={[styles.navText, activeRoute === 'Categories' && styles.activeNavText]}>Kategori</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
            <Icon name="account" size={24} color={activeRoute === 'Profile' ? '#7D2998' : '#9E9E9E'} />
            <Text style={[styles.navText, activeRoute === 'Profile' && styles.activeNavText]}>Profil</Text>
          </TouchableOpacity>
        </View>

        <FAB style={styles.fab} icon="plus" onPress={showModal} color="white" />
      </View>
    </>
  );
};

BottomNavigation.propTypes = {
  activeRoute: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  bottomNavContainer: { position: 'relative', height: 60 },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 60,
    elevation: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: { alignItems: 'center', flex: 1 },
  navText: { fontSize: 12, marginTop: 2, color: '#666' },
  activeNavText: { color: '#7D2998', fontWeight: 'bold' },
  fabPlaceholder: { width: 60 },
  fab: {
    position: 'absolute',
    backgroundColor: '#7D2998',
    bottom: 20,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7D2998',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  optionButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    alignItems: 'center',
  },
  selectedOption: { backgroundColor: '#7D2998', borderColor: '#7D2998' },
  selectedOptionText: { color: 'white' },
  optionText: { color: '#7D2998' },
  picker: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#7D2998',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: { color: 'white', fontWeight: 'bold' },
  datePickerButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    zIndex: 999,
  },
  datePickerText: { color: '#7D2998', fontSize: 16 },
});

export default BottomNavigation;
