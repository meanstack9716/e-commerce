import { ReviewPayload } from "@/store/review/reviewSlice";

export const buildFormData = (payload: ReviewPayload & { remove_img_indexes?: number[] }) => {
  const formData = new FormData();
  formData.append("product_id", payload.product_id);
  formData.append("rating", payload.rating);
  formData.append("review", payload.review.trim());

  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((imageUri, index) => {
      if (imageUri.startsWith("file://") || imageUri.startsWith("content://")) {
        const fileExtension = imageUri.split(".").pop()?.toLowerCase() || "jpg";
        const mimeType = fileExtension === "png" ? "image/png" : "image/jpeg";

        formData.append("images[]", {
          uri: imageUri,
          name: `image_${index}.${fileExtension}`,
          type: mimeType,
        } as any);
      }
    });
  }

  if (payload.remove_img_indexes && payload.remove_img_indexes.length > 0) {
    payload.remove_img_indexes.forEach((index) => {
      formData.append("remove_img_indexes[]", index.toString());
    });
  }

  return formData;
};