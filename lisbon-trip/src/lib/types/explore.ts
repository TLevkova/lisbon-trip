export interface ExploreItem {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  price: {
    amount: number;
    currency: string;
  };
  openingHours: {
    [key: string]: string; // e.g., "monday": "09:00-18:00"
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  category: string;
  rating: number;
} 