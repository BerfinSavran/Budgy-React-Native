import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import AppHeader from '../components/AppHeader';
import BottomNavigation from '../components/BottomNavigation';

const HomeScreen = () => {
  return (
    <View style={styles.container}>

      <AppHeader />


      <View style={styles.content}>

        <Surface style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Mevcut Bakiye</Text>
          <Text style={styles.balanceAmount}>1620</Text>
          
          <View style={styles.financeSummary}>
            <View style={styles.financeBox}>
              <Text style={styles.financeLabel}>Gelir</Text>
              <Text style={styles.financeValue}>6120</Text>
            </View>
            <View style={styles.financeBox}>
              <Text style={styles.financeLabel}>Gider</Text>
              <Text style={styles.financeValue}>4500</Text>
            </View>
          </View>
        </Surface>


        <View style={styles.budgetCards}>
          <Surface style={styles.budgetCard}>
            <Text style={styles.budgetLabel}>Planlanan Bütçe</Text>
            <Text style={styles.budgetValue}>9000</Text>
          </Surface>
          <Surface style={styles.budgetCard}>
            <Text style={styles.budgetLabel}>Kalan Bütçe</Text>
            <Text style={styles.budgetValue}>4500</Text>
          </Surface>
        </View>


        <Surface style={styles.progressCard}>
          <Text style={styles.progressLabel}>Bütçe Harcama Durumu</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar} />
          </View>
          <Text style={styles.progressValue}>%50.0 Harcandı</Text>
        </Surface>


        <Surface style={styles.chartCard}>
          <View style={styles.chartContainer}>
            <View style={styles.barContainer}>
              <View style={styles.barIncome} />
              <View style={styles.barExpense} />
            </View>
            <Text style={styles.chartLabel}>Jan</Text>
          </View>
        </Surface>
      </View>


      <BottomNavigation activeRoute="Home" />
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
  },
  balanceCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'white',
    marginBottom: 16,
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  financeSummary: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  financeBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    elevation: 2,
    alignItems: 'center',
    width: '40%',
  },
  financeLabel: {
    fontSize: 16,
    color: '#333',
  },
  financeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  budgetCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  budgetCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'white',
    width: '48%',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 14,
    color: '#333',
  },
  budgetValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  progressCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    width: '50%',
    height: '100%',
    backgroundColor: '#7D2998',
  },
  progressValue: {
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
    marginTop: 4,
  },
  chartCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'white',
  },
  chartContainer: {
    alignItems: 'center',
  },
  barContainer: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  barIncome: {
    width: 40,
    height: 120,
    backgroundColor: '#7D2998',
    marginRight: 10,
  },
  barExpense: {
    width: 40,
    height: 90,
    backgroundColor: '#4A1A59',
  },
  chartLabel: {
    fontSize: 14,
    color: '#333',
  },
});

export default HomeScreen;