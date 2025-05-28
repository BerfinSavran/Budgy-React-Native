// services/incomeExpenseService.js
import axiosInstance from "./axiosInstanceService";

const incomeExpenseService = {
  getAll: async () => axiosInstance.get("/incomeExpenses"),
  
  getById: async (id) => axiosInstance.get(`/incomeExpenses/id/${id}`),

  getByTypeAndUser: async (type, userId) =>
    axiosInstance.get(`/incomeExpenses/type/${type}/${userId}`),

  getMonthlyTotals: async (userId) =>
    axiosInstance.get(`/incomeExpenses/MonthlyTotals/${userId}`),

  addOrUpdate: async (data) => axiosInstance.post("/incomeExpenses", data),

  deleteById: async (id) => axiosInstance.delete(`/incomeExpenses/delete/${id}`),

  updateMonthlyCategoryTotals: (month, year, inExType) =>
    axiosInstance.post("/incomeExpenses/MonthlyUpdate", {
      month,
      year,
      inExType,
    }),
};

export default incomeExpenseService;
