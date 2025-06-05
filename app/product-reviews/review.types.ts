export interface Review {
  id: string;
  rating: string;
  review: string;
  by: {
    first_name?: string;
    last_name?: string;
  };
  img_urls?: string[];
}