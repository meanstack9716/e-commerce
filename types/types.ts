interface Profile {
    id: string;
    images: string[];
    title: string;
    price: string;
    star: number;
    categories: string[];
  }
  
  interface Category {
    id: string;
    title: string;
    imageUrl: string;
    isActive?: boolean;
  }
  
  interface ProductData {
    categories: {
      All: Category[];
      Men: Category[];
      Women: Category[];
    };
    products: Profile[];
  }
  
  export { Profile, Category, ProductData };