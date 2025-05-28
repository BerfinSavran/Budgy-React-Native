import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Surface } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';

import BottomNavigation from '../components/BottomNavigation';
import AppHeader from '../components/AppHeader';

import incomeExpenseService from '../services/incomeExpenseService'; // backend API servislerin
import { AuthContext } from '../services/authContext'; // kullanıcı bilgisi için context

const screenWidth = Dimensions.get('window').width;

const AnalysisScreen = () => {
  const { userData } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('gelir'); // 'gelir' veya 'gider'
  const [gelirIslemler, setGelirIslemler] = useState([]);
  const [giderIslemler, setGiderIslemler] = useState([]);

  const [gelirData, setGelirData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [giderData, setGiderData] = useState({ labels: [], datasets: [{ data: [] }] });

  useEffect(() => {
    const fetchData = async () => {
      if (!userData) return;

      try {
        const userId = userData.ID;

        // Şimdiki tarih ve yıl/ay bilgisi
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0 tabanlı (Ocak=0)

        // Helper: ay içindeki işlemleri filtrele
        const filterCurrentMonth = (items) =>
          items.filter(item => {
            const itemDate = new Date(item.Date);
            return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
          });

        // Helper: günlere göre grupla (day: data)
        const groupByDay = (items) => {
          const map = {};
          items.forEach(item => {
            const day = new Date(item.Date).getDate(); // 1-31
            if (!map[day]) map[day] = 0;
            map[day] += item.Amount;
          });

          // Günleri artan sırada sıralayıp label/data dizisi oluştur
          const sortedDays = Object.keys(map).sort((a, b) => a - b);

          const labels = sortedDays.map(day => `${day}.gün`);
          const data = sortedDays.map(day => map[day]);

          return { labels, data };
        };

        // Gelir verisi (type=0)
        const incomeResponse = await incomeExpenseService.getByTypeAndUser(0, userId);
        const incomeCurrentMonth = filterCurrentMonth(incomeResponse.data);
        setGelirIslemler(incomeCurrentMonth.map(i => ({
          id: i.ID,
          baslik: i.Description,
          tarih: i.Date.slice(0, 10),
          miktar: i.Amount,
        })));
        const gelirChart = groupByDay(incomeCurrentMonth);
        setGelirData({
          labels: gelirChart.labels,
          datasets: [{
            data: gelirChart.data,
            color: (opacity = 1) => `rgba(125, 41, 152, ${opacity})`,
            strokeWidth: 2,
          }],
        });

        // Gider verisi (type=1)
        const expenseResponse = await incomeExpenseService.getByTypeAndUser(1, userId);
        const expenseCurrentMonth = filterCurrentMonth(expenseResponse.data);
        setGiderIslemler(expenseCurrentMonth.map(i => ({
          id: i.ID,
          baslik: i.Description,
          tarih: i.Date.slice(0, 10),
          miktar: -i.Amount, // Giderler negatif gösterilsin
        })));
        const giderChart = groupByDay(expenseCurrentMonth);
        setGiderData({
          labels: giderChart.labels,
          datasets: [{
            data: giderChart.data.map(d => Math.abs(d)),
            color: (opacity = 1) => `rgba(125, 41, 152, ${opacity})`,
            strokeWidth: 2,
          }],
        });

      } catch (err) {
        console.error('Analiz verisi alınamadı', err);
      }
    };

    fetchData();
  }, [userData]);

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(125, 41, 152, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#7D2998"
    }
  };

  return (
    <View style={styles.container}>

      <AppHeader title="Gelir ve Gider Analizi" />

      <View style={styles.tabNavigator}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'gelir' && styles.activeTab]}
          onPress={() => setActiveTab('gelir')}
        >
          <Text style={activeTab === 'gelir' ? styles.activeTabText : styles.tabText}>Gelir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'gider' && styles.activeTab]}
          onPress={() => setActiveTab('gider')}
        >
          <Text style={activeTab === 'gider' ? styles.activeTabText : styles.tabText}>Gider</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Surface style={styles.chartCard}>
          <View style={styles.chartContainer}>
            {(activeTab === 'gelir' ? gelirData.datasets[0].data.length : giderData.datasets[0].data.length) > 0 ? (
              <LineChart
                data={activeTab === 'gelir' ? gelirData : giderData}
                width={screenWidth - 40}
                height={180}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            ) : (
              <Text style={{ textAlign: 'center', color: '#888', paddingVertical: 70 }}>
                {activeTab === 'gelir' ? 'Gelir verisi bulunamadı.' : 'Gider verisi bulunamadı.'}
              </Text>
            )}
          </View>
        </Surface>

        <Surface style={styles.transactionCard}>
          <Text style={styles.sectionTitle}>İşlem Geçmişi:</Text>
          <ScrollView>
            {(activeTab === 'gelir' ? gelirIslemler : giderIslemler).length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
                Kayıt bulunamadı.
              </Text>
            ) : (
              (activeTab === 'gelir' ? gelirIslemler : giderIslemler).map((islem) => (
                <View key={islem.id} style={styles.transactionItem}>
                  <View>
                    <Text style={styles.transactionTitle}>{islem.baslik}</Text>
                    <Text style={styles.transactionDate}>{islem.tarih}</Text>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    islem.miktar > 0 ? styles.positiveAmount : styles.negativeAmount
                  ]}>
                    {islem.miktar > 0 ? '+ ' : '-'}{Math.abs(islem.miktar)}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </Surface>
      </View>

      <BottomNavigation activeRoute="Analysis" />
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
    height: 50
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeTab: {
    backgroundColor: '#d199e0'
  },
  tabText: {
    color: '#7D2998',
    fontWeight: '400'
  },
  activeTabText: {
    color: '#7D2998',
    fontWeight: 'bold'
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
  chart: {
    borderRadius: 16,
  },
  transactionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'white',
    marginBottom: 16,
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
    alignItems: 'center'
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionDate: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  positiveAmount: {
    color: '#4caf50'
  },
  negativeAmount: {
    color: '#f44336'
  },
});

export default AnalysisScreen;
