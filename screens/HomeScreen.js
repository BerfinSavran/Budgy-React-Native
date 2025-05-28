import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import AppHeader from '../components/AppHeader';
import BottomNavigation from '../components/BottomNavigation';
import incomeExpenseService from '../services/incomeExpenseService';
import goalService from '../services/goalService';
import { AuthContext } from '../services/authContext';

const HomeScreen = () => {
  const { userData, loading } = useContext(AuthContext);

  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [plannedBudget, setPlannedBudget] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [spentPercentage, setSpentPercentage] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!userData) return;  // userData yoksa API çağrısı yapma

      try {
        const userId = userData.ID;  // Gerçek kullanıcı ID'si buradan geliyor

        const incomeExpenseResponse = await incomeExpenseService.getMonthlyTotals(userId);
        const goalResponse = await goalService.getTotalByDate(userId, new Date().toISOString());

        const currentMonthData = incomeExpenseResponse.data.length > 0 ? incomeExpenseResponse.data[0] : null;

        if (currentMonthData) {
          setIncome(currentMonthData.TotalIncome);
          setExpense(currentMonthData.TotalExpense);
          setBalance(currentMonthData.TotalIncome - currentMonthData.TotalExpense);
          setPlannedBudget(goalResponse.data.totalAmount || 0);

          const remaining = (goalResponse.data.totalAmount || 0) - currentMonthData.TotalExpense;
          setRemainingBudget(remaining > 0 ? remaining : 0);

          const spentPerc = (currentMonthData.TotalExpense / (goalResponse.data.totalAmount || 1)) * 100;
          setSpentPercentage(spentPerc.toFixed(1));
        }
      } catch (error) {
        console.error('Veriler alınamadı:', error);
      }
    }

    if (!loading) {
      fetchData();
    }
  }, [userData, loading]);

  if (loading) {
    return <Text>Yükleniyor...</Text>;
  }

  if (!userData) {
    return <Text>Lütfen giriş yapınız.</Text>;
  }

  return (
    <View style={styles.container}>

      <AppHeader />

      <View style={styles.content}>

        <Surface style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Mevcut Bakiye</Text>
          <Text style={styles.balanceAmount}>{balance}</Text>

          <View style={styles.financeSummary}>
            <View style={styles.financeBox}>
              <Text style={styles.financeLabel}>Gelir</Text>
              <Text style={styles.financeValue}>{income}</Text>
            </View>
            <View style={styles.financeBox}>
              <Text style={styles.financeLabel}>Gider</Text>
              <Text style={styles.financeValue}>{expense}</Text>
            </View>
          </View>
        </Surface>

        <View style={styles.budgetCards}>
          <Surface style={styles.budgetCard}>
            <Text style={styles.budgetLabel}>Planlanan Bütçe</Text>
            <Text style={styles.budgetValue}>{plannedBudget}</Text>
          </Surface>
          <Surface style={styles.budgetCard}>
            <Text style={styles.budgetLabel}>Kalan Bütçe</Text>
            <Text style={styles.budgetValue}>{remainingBudget}</Text>
          </Surface>
        </View>

        <Surface style={styles.progressCard}>
          <Text style={styles.progressLabel}>Bütçe Harcama Durumu</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${spentPercentage}%` }]} />
          </View>
          <Text style={styles.progressValue}>%{spentPercentage} Harcandı</Text>
        </Surface>

        <Surface style={styles.chartCard}>
          <View style={styles.chartContainer}>
            <View style={styles.barContainer}>
              <View style={[styles.barIncome, { height: (income / 100) * 2 }]} />
              <View style={[styles.barExpense, { height: (expense / 100) * 2 }]} />
            </View>
            <Text style={styles.chartLabel}>Bu Ay</Text>
          </View>
        </Surface>
      </View>

      <BottomNavigation activeRoute="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  // ...senin verdiğin stil aynı kalabilir
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
    backgroundColor: '#7D2998',
    marginRight: 10,
  },
  barExpense: {
    width: 40,
    backgroundColor: '#4A1A59',
  },
  chartLabel: {
    fontSize: 14,
    color: '#333',
  },
});

export default HomeScreen;
