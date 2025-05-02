export interface Profile {
  id: string;
  image: string;
  title: string;
  price: string;
  star: number;
  categories: string[];
}

export interface SubSubCategory {
  id: string;
  name: string;
  description?: string;
  img_url: string;
  sub_category_id: string;
  category_id: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  img_url: string;
  category_id: string;
  sub_sub_categories?: SubSubCategory[];
}

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  img_url: string;
  sub_categories: SubCategory[];
}

export interface ProductData {
  products: Profile[];
}