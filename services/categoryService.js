import axiosInstance from "./axiosInstanceService";

const CategoryService = {
    // Tüm kategorileri getir
    getAllCategories: async () => {
        const response = await axiosInstance.get("/categories");
        return response.data;
    },

    // ID'ye göre kategori getir
    getCategoryById: async (id) => {
        const response = await axiosInstance.get(`/categories/id/${id}`);
        return response.data;
    },

    // Type ve userId'ye göre kategori getir
    getCategoriesByTypeAndUser: async (inExType, userId) => {
        try {

            const response = await axiosInstance.get(`/categories/type/${inExType}/${userId}`);
            return response.data;
        } catch (err) {
            console.error('Kategori API çağrısı başarısız:', err.response?.data || err.message);
            throw err;
        }
    }
};

export default CategoryService;
