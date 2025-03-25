import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Surface } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import BottomNavigation from '../components/BottomNavigation';
import AppHeader from '../components/AppHeader';

const screenWidth = Dimensions.get('window').width;

const AnalysisScreen = () => {
  const [activeTab, setActiveTab] = useState('gelir'); // 'gelir' veya 'gider'
  
  // Gelir verileri
  const gelirData = {
    labels: ["7", "9"],
    datasets: [
      {
        data: [4500, 6000],
        color: (opacity = 1) => `rgba(125, 41, 152, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };
  
  // Gider verileri
  const giderData = {
    labels: ["4", "10", "13"],
    datasets: [
      {
        data: [3250, 4500, 2050],
        color: (opacity = 1) => `rgba(125, 41, 152, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };
  
  // İşlem geçmişi verileri
  const gelirIslemler = [
    { id: 1, baslik: 'Yatırım', tarih: '2025-1-9', miktar: 6120 },
    { id: 2, baslik: 'Maaş', tarih: '2025-1-7', miktar: 4500 }
  ];
  
  const giderIslemler = [
    { id: 1, baslik: 'Eğlence', tarih: '2025-1-13', miktar: -2055 },
    { id: 2, baslik: 'Sigorta', tarih: '2025-1-10', miktar: -4500 },
    { id: 3, baslik: 'Kira', tarih: '2025-1-4', miktar: -3251 }
  ];
  
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
      
      {/* Ana sekmeler: Gelir ve Gider */}
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

      {/* Seçilen sekme için içerik */}
      <View style={styles.content}>
        <Surface style={styles.chartCard}>
          <View style={styles.chartContainer}>
            <LineChart
              data={activeTab === 'gelir' ? gelirData : giderData}
              width={screenWidth - 40}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </Surface>

        <Surface style={styles.transactionCard}>
          <Text style={styles.sectionTitle}>İşlem Geçmişi:</Text>
          <ScrollView>
            {(activeTab === 'gelir' ? gelirIslemler : giderIslemler).map((islem) => (
              <View key={islem.id} style={styles.transactionItem}>
                <View>
                  <Text style={styles.transactionTitle}>{islem.baslik}</Text>
                  <Text style={styles.transactionDate}>{islem.tarih}</Text>
                </View>
                <Text style={[styles.transactionAmount, islem.miktar > 0 ? styles.positiveAmount : styles.negativeAmount]}>
                  {islem.miktar > 0 ? '+ ' : ''}{Math.abs(islem.miktar)}
                </Text>
              </View>
            ))}
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
