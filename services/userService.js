import axiosInstance from "./axiosInstanceService";

const userService = {
    register: async (userData) => {
        console.log("API çağrısı yapılıyor:", userData);
        try {
            const response = await axiosInstance.post("/users", userData);
            console.log("API cevabı alındı:", response.data);
            return response.data;
        } catch (error) {
            console.error("Axios hatası:", error.message);
            throw error;
        }
    },

    updateUser: async (userId, userData) => {
    console.log("API çağrısı yapılıyor:", { userId, userData });
    try {
        const response = await axiosInstance.put(`/users/${userId}`, userData);
        console.log("API cevabı alındı:", response.data);
        return response.data;
    } catch (error) {
        console.error("Axios hatası:", error.message);
        throw error;
    }
},

    getByEmail: async (email) => {
        try {
            const response = await axiosInstance.get(`/users/email/${email}`);
            return response.data;
        } catch (error) {
            console.error("GetByEmail hatası:", error.message);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await axiosInstance.get(`/users/id/${id}`);
            return response.data;
        } catch (error) {
            console.error("GetById hatası:", error.message);
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            const response = await axiosInstance.post('/api/auth/login', { email, password });
            return response.data; // { token: "...", user: { ... } }
        } catch (error) {
            console.error("Login hatası:", error.message);
            throw error;
        }
    },
};

export default userService;
