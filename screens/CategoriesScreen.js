import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Surface } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { AuthContext } from '../services/authContext';
import CategoryService from '../services/categoryService';
import BottomNavigation from '../components/BottomNavigation';
import AppHeader from '../components/AppHeader';

const screenWidth = Dimensions.get('window').width;

const CategoriesScreen = () => {
  const { userData } = useContext(AuthContext);

  const [incomesData, setIncomesData] = useState([]);
  const [outcomesData, setOutcomesData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Aktif tab: 'income' ya da 'expense'
  const [activeTab, setActiveTab] = useState('income');

  useEffect(() => {
    const fetchCategories = async () => {
      if (!userData) return;

      setLoading(true);
      setError(null);

      try {
        const userId = userData.ID;

        const incomeColors = ['#7D2998', '#9b59b6', '#8e44ad', '#6c3483', '#a569bd', '#bb8fce'];
        const expenseColors = ['#D9534F', '#e74c3c', '#c0392b', '#922b21', '#cd6155', '#f1948a'];

        const incomeResponse = await CategoryService.getCategoriesByTypeAndUser(0, userId);
        const incomeCategories = incomeResponse.map((item, index) => ({
          Name: item.Name,
          Value: item.TotalAmount,
          Color: incomeColors[index % incomeColors.length],
        }));
        setIncomesData(incomeCategories);
        setTotalIncome(incomeResponse.reduce((sum, item) => sum + item.TotalAmount, 0));

        const expenseResponse = await CategoryService.getCategoriesByTypeAndUser(1, userId);
        const expenseCategories = expenseResponse.map((item, index) => ({
          Name: item.Name,
          Value: item.TotalAmount,
          Color: expenseColors[index % expenseColors.length],
        }));
        setOutcomesData(expenseCategories);
        setTotalExpense(expenseResponse.reduce((sum, item) => sum + item.TotalAmount, 0));
      } catch (err) {
        setError(err.message || 'Kategori verisi alınamadı');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [userData]);

  // Aktif tab'a göre veri seç
  const categories = activeTab === 'income' ? incomesData : outcomesData;

  // Grafik için veriyi dönüştür
  const chartData = categories.map(cat => ({
    name: cat.Name,
    population: Math.abs(cat.Value || 0),
    color: cat.Color || (activeTab === 'income' ? '#7D2998' : '#D9534F'),
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  }));

  return (
    <View style={styles.container}>
      <AppHeader title="Kategoriler" />

      {/* Tab menüsü */}
      <View style={styles.tabNavigator}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'income' && styles.activeTab]}
          onPress={() => setActiveTab('income')}
        >
          <Text style={activeTab === 'income' ? styles.activeTabText : styles.tabText}>Gelir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'expense' && styles.activeTab]}
          onPress={() => setActiveTab('expense')}
        >
          <Text style={activeTab === 'expense' ? styles.activeTabText : styles.tabText}>Gider</Text>
        </TouchableOpacity>
      </View>

      {/* İçerik */}
      <View style={styles.content}>
        <Surface style={styles.chartCard}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'income' ? `Toplam Gelir: ${totalIncome.toLocaleString()} ₺` : `Toplam Gider: ${totalExpense.toLocaleString()} ₺`}
          </Text>
          <View style={styles.chartContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#7D2998" />
            ) : error ? (
              <Text style={{ color: 'red' }}>{error}</Text>
            ) : categories.length > 0 ? (
              <PieChart
                data={chartData}
                width={screenWidth - 40}
                height={180}
                chartConfig={{
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  color: (opacity = 1) => `rgba(125, 41, 152, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  strokeWidth: 2,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 0]}
                absolute
              />
            ) : (
              <Text>Gösterilecek veri yok</Text>
            )}
          </View>
        </Surface>

        <Surface style={styles.transactionCard}>
          <Text style={styles.sectionTitle}>İşlem Geçmişi:</Text>
          <ScrollView>
            {loading ? (
              <ActivityIndicator size="small" color="#7D2998" />
            ) : error ? (
              <Text style={{ color: 'red' }}>{error}</Text>
            ) : categories.length > 0 ? (
              categories.map((item, index) => (
                <View key={index} style={styles.transactionItem}>
                  <Text style={styles.transactionTitle}>{item.Name}</Text>
                  <Text
                    style={[
                      styles.transactionAmount,
                      activeTab === 'income' ? styles.positiveAmount : styles.negativeAmount,
                    ]}
                  >
                    {activeTab === 'income' ? '+ ' : '- '}
                    {Math.abs(item.Value).toLocaleString()} ₺
                  </Text>
                </View>
              ))
            ) : (
              <Text>Veri yok</Text>
            )}
          </ScrollView>
        </Surface>
      </View>

      <BottomNavigation activeRoute="Categories" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8EFFF',
  },
  tabNavigator: {
    flexDirection: 'row',
    backgroundColor: '#f0e6f5',
    height: 50,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#d199e0',
  },
  tabText: {
    color: '#7D2998',
    fontWeight: '400',
  },
  activeTabText: {
    color: '#7D2998',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  chartCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  transactionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  transactionItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  positiveAmount: {
    color: 'green',
  },
  negativeAmount: {
    color: 'red',
  },
});

export default CategoriesScreen;
