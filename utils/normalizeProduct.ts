import { Profile } from "@/types/types";

export const normalizeProduct = (Product: any): Profile => {
  return {
    id: Product.id,
    title: Product.title || "Product Title",
    description: Product.description || "",
    discount_percent: Product.discount_percent || 0,
    final_price: Product.final_price || 0,
    stock_quantity: Product.stock_quantity || "0",
    thumbnail_url: Product.thumbnail_url || "",
    images: Product.gallery
      ? Product.gallery.map((item: any) => item.img_url)
      : [],
    categories: [
      Product.category?.id,
      Product.sub_category?.id,
      Product.sub_sub_category?.id,
    ].filter(Boolean) as string[],
    star: Product.star || 4.5,
    brand: Product.brand || undefined,
    sizes: Product.sizes || [],
    gallery: Product.gallery || [],
  };
};
