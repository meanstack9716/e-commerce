import { Product } from "@/types/types";

export const normalizeProduct = (Product: any): Product => {
  return {
    id: Product.id,
    title: Product.title || "Product Title",
    description: Product.description || "",
    discount_percent: Product.discount_percent || 0,
    price: Product.price || 0,
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
    seller: Product.seller
      ? {
          id: Product.seller.id,
          business_name: Product.seller.business_name,
          business_type: Product.seller.business_type,
          business_email: Product.seller.business_email,
          business_mobile: Product.seller.business_mobile,
        }
      : undefined,
    delivery_days: Product.delivery_days,
    reviews: Product.reviews
      ? Product.reviews.map((review: any) => ({
          id: review.id,
          product_id: review.product_id,
          order_id: review.order_id,
          rating: review.rating,
          review: review.review,
          img_urls: review.img_urls || [],
          by: {
            email: review.by.email,
            first_name: review.by.first_name || "",
            last_name: review.by.last_name || "",
            id: review.by.id,
            profile_url: review.by.profile_url || null,
            role: review.by.role || null,
          },
        }))
      : [],
  };
};
