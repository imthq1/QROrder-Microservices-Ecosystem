import api from "../../utils/api";

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "smartRes");

    const response = await api.post("/api/v1/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data.url;
  } catch (error) {
    throw error.response?.data?.message || "Lỗi upload ảnh";
  }
};
