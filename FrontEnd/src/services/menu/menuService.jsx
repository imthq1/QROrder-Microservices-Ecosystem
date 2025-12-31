import axiosClient from "../../utils/api";
import { ProductModel } from "../../models/ProductModel";

export const getProducts = async () => {
  try {
    const response = await axiosClient.get(`/api/v1/items`);

    const rawData = response.data.data;

    if (Array.isArray(rawData)) {
      return rawData.map((item) => new ProductModel(item));
    }

    return [];
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch products";
  }
};
export const getProductById = async (id) => {
  try {
    const response = await axiosClient.get(`/api/v1/items/${id}`);
    return new ProductModel(response.data.data);
  } catch (error) {
    throw error.response?.data?.message || "Lỗi lấy thông tin sản phẩm";
  }
};

export const updateProduct = async (id, data) => {
  try {
    console.log("Service received data:", data);

    const payload = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      thumbnailUrl: data.thumbnailUrl,
      isAvailable: data.isAvailable,
      categoryId: Number(data.categoryId),
    };

    console.log(" Payload sending to API:", payload);

    const response = await axiosClient.put(`/api/v1/items/${id}`, payload);

    console.log(" Server response:", response.data);

    if (!response.data.data) {
      throw "Server trả về dữ liệu rỗng!";
    }

    return new ProductModel(response.data.data);
  } catch (error) {
    console.log("Service Error:", error);
    throw (
      error.response?.data?.message || error.message || "Lỗi service update"
    );
  }
};
export const getCategories = async () => {
  try {
    const response = await axiosClient.get(`/api/v1/categories`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch categories";
  }
};
export const deleteProduct = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/v1/items/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Delete product failed";
  }
};
export const createProduct = async (data) => {
  try {
    const payload = {
      name: data.name,
      description: data.description,
      price: data.price ? parseFloat(data.price) : 0,
      thumbnailUrl: data.thumbnailUrl || "",
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      categoryId: parseInt(data.categoryId),
    };

    const response = await axiosClient.post("/api/v1/items", payload);
    return new ProductModel(response.data.data);
  } catch (error) {
    console.error("Create Error:", error);
    throw error.response?.data?.message || "Lỗi tạo sản phẩm";
  }
};
