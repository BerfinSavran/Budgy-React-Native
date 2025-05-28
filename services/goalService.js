// services/goalService.js
import axiosInstance from "./axiosInstanceService";

const goalService = {
  getAll: () => axiosInstance.get("/goals"),

  getById: (id) => axiosInstance.get(`/goals/id/${id}`),

  addOrUpdate: (data) => axiosInstance.post("/goals", data),

  deleteById: (id) => axiosInstance.delete(`/goals/delete/${id}`),

  getTotalByDate: (userId, startDate) =>
    axiosInstance.get(`/goals/dateRange/${userId}/${startDate}`),
};

export default goalService;
