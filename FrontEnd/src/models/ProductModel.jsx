const CLOUDINARY_BASE = import.meta.env.VITE_URL_CLOUDINARY || "";

export class ProductModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name || "No Name";
    this.description = data.description || "";
    this.price = data.price || 0;

    this.thumbnailUrl = data.thumbnailUrl || "";

    if (this.thumbnailUrl.startsWith("http")) {
      this.image = this.thumbnailUrl;
    } else if (this.thumbnailUrl) {
      this.image = `${CLOUDINARY_BASE}${this.thumbnailUrl}`;
    } else {
      this.image = "https://picsum.photos/150";
    }
    // -----------------------

    this.categoryId = data.categoryId;
    this.categoryName = data.categoryName || "Uncategorized";
    this.isAvailable = data.available;
    this.statusText = data.available ? "In Stock" : "Out of Stock";
    this.createdAt = data.createdAt;
  }

  get formattedPrice() {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(this.price);
  }
}
