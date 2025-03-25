import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB, Portal, Modal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const BottomNavigation = ({ activeRoute }) => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');

  const showModal = () => {
    setVisible(true);
  }
  const hideModal = () => {
    setVisible(false);
    setShowDatePicker(false);
  }

  const handleSave = () => {
    console.log('Saving:', { selectedOption, amount, category, date, description });
    hideModal();
  };

  const onDateChange = (event, selectedDate) => {
    // Android ve iOS için farklı yaklaşım
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type === 'set') {
        setDate(selectedDate);
      }
    } else {
      // iOS için
      setShowDatePicker(false);
      setDate(selectedDate);
    }
  };
  
  const ToggleDatepicker = () => {
    // Emin olmak için her iki platformda da
    setShowDatePicker(true);
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
              style={[styles.optionButton, selectedOption === 'target' && styles.selectedOption]}
              onPress={() => setSelectedOption('target')}
            >
              <Text style={[styles.optionText, selectedOption === 'target' && styles.selectedOptionText]}>Hedef</Text>
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
            <Picker.Item label="Yemek" value="food" />
            <Picker.Item label="Ulaşım" value="transport" />
            <Picker.Item label="Eğlence" value="entertainment" />
          </Picker>

          <Pressable onPress={ToggleDatepicker} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>
                {date ? date.toLocaleDateString() : 'Tarih Seçin'}
              </Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={"spinner"}
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
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Icon
              name="home"
              size={24}
              color={activeRoute === 'Home' ? '#7D2998' : '#9E9E9E'}
            />
            <Text
              style={[styles.navText, activeRoute === 'Home' && styles.activeNavText]}
            >
              Anasayfa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Analysis')}
          >
            <Icon
              name="chart-bar"
              size={24}
              color={activeRoute === 'Analysis' ? '#7D2998' : '#9E9E9E'}
            />
            <Text
              style={[styles.navText, activeRoute === 'Analysis' && styles.activeNavText]}
            >
              Analiz
            </Text>
          </TouchableOpacity>

          <View style={styles.fabPlaceholder} />

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Categories')}
          >
            <Icon
              name="format-list-bulleted"
              size={24}
              color={activeRoute === 'Categories' ? '#7D2998' : '#9E9E9E'}
            />
            <Text
              style={[styles.navText, activeRoute === 'Categories' && styles.activeNavText]}
            >
              Kategori
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon
              name="account"
              size={24}
              color={activeRoute === 'Profile' ? '#7D2998' : '#9E9E9E'}
            />
            <Text
              style={[styles.navText, activeRoute === 'Profile' && styles.activeNavText]}
            >
              Profil
            </Text>
          </TouchableOpacity>
        </View>

        <FAB
          style={styles.fab}
          icon="plus"
          onPress={showModal}
          color="white"
        />
      </View>
    </>
  );
};

BottomNavigation.propTypes = {
  activeRoute: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: 'relative',
    height: 60,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 60,
    elevation: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
    color: '#666',
  },
  activeNavText: {
    color: '#7D2998',
    fontWeight: 'bold',
  },
  fabPlaceholder: {
    width: 60,
  },
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
    overflow: 'scroll',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7D2998',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#7D2998',
    borderColor: '#7D2998',
  },
  selectedOptionText: {
    color: 'white',
  },
  optionText: {
    color: '#7D2998',
  },
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
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  datePickerButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',  // İçeriği ortalamak
    justifyContent: 'center',  // İçeriği ortalamak
    height: 40,
    zIndex: 999,  // Butonun yüksekliği
  },
  datePickerText: {
    color: '#7D2998',
    fontSize: 16,
  },
});

export default BottomNavigation;
