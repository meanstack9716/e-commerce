// Base interface for common category properties
export interface CategoryDefaultItem {
  id: string;
  name: string;
  description?: string;
  img_url?: string;
}

// Sub-sub-category interface
export interface SubSubCategoryItem extends CategoryDefaultItem {
  category_id: string;
  sub_category_id: string;
  category?: CategoryDefaultItem;
  sub_category?: CategoryDefaultItem;
}

// Sub-category interface
export interface SubCategoryItem extends CategoryDefaultItem {
  category_id: string;
  category?: CategoryDefaultItem;
  sub_sub_category_count?: number;
  sub_sub_categories: SubSubCategoryItem[];
}

// Main category interface
export interface CategoryItem extends CategoryDefaultItem {
  sub_category_count?: number;
  sub_categories: SubCategoryItem[];
  sub_sub_category_count?: number;
}