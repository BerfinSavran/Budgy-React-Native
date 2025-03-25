import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Surface } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import BottomNavigation from '../components/BottomNavigation';
import AppHeader from '../components/AppHeader';

const screenWidth = Dimensions.get('window').width;

const CategoriesScreen = () => {
  const [activeTab, setActiveTab] = useState('gelir'); // 'gelir' or 'gider'
  
  // Income data
  const gelirData = [
    {
      name: 'Yatırım',
      value: 6120,
      color: 'rgba(125, 41, 152, 0.7)',
      percentage: 42.4
    },
    {
      name: 'Maaş',
      value: 4500,
      color: 'rgba(125, 41, 152, 0.5)',
      percentage: 57.6
    },
    {
      name: 'Diğer',
      value: 0,
      color: 'rgba(125, 41, 152, 0.3)',
      percentage: 0.0
    }
  ];
  
  // Expense data
  const giderData = [
    {
      name: 'Kira',
      value: -3251,
      color: 'rgba(125, 41, 152, 0.7)',
      percentage: 45.9
    },
    {
      name: 'Sigorta',
      value: -4500,
      color: 'rgba(125, 41, 152, 0.5)',
      percentage: 21.1
    },
    {
      name: 'Diğer Giderler',
      value: -2055,
      color: 'rgba(125, 41, 152, 0.3)',
      percentage: 33.0
    }
  ];

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(125, 41, 152, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  const renderPieChart = () => {
    const currentData = activeTab === 'gelir' ? gelirData : giderData;
    
    const chartData = currentData.map(item => ({
      name: item.name,
      population: Math.abs(item.value),
      color: item.color,
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    }));

    return (
      <PieChart
        data={chartData}
        width={screenWidth - 40}
        height={180}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 0]}
        absolute
      />
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Kategoriler" />
      
      {/* Main tabs: Income and Expense */}
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

      {/* Content for selected tab */}
      <View style={styles.content}>
        <Surface style={styles.chartCard}>
          <View style={styles.chartContainer}>
            {renderPieChart()}
          </View>
        </Surface>

        <Surface style={styles.transactionCard}>
          <Text style={styles.sectionTitle}>İşlem Geçmişi:</Text>
          <ScrollView>
            {(activeTab === 'gelir' ? gelirData : giderData).map((item, index) => (
              <View key={index} style={styles.transactionItem}>
                <View>
                  <Text style={styles.transactionTitle}>{item.name}</Text>
                </View>
                <Text style={[
                  styles.transactionAmount, 
                  activeTab === 'gelir' ? styles.positiveAmount : styles.negativeAmount
                ]}>
                  {activeTab === 'gelir' ? '+ ' : '- '}{Math.abs(item.value)}
                </Text>
              </View>
            ))}
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

export default CategoriesScreen;