export type Stay = {
  id: string;
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
  price: number;
  currency?: string;
  rating: number;
  reviewCount: number;
  image: string;
  location: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  description: string;
  host: {
    name: string;
    image: string;
    isSuperhost: boolean;
  };
  rooms: {
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
  reviews: Review[];
};

export type Review = {
  id: string;
  author: {
    name: string;
    image: string;
  };
  rating: number;
  date: string;
  comment: string;
};

export type MapBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type MapState = {
  center: [number, number];
  zoom: number;
  bounds: MapBounds;
};

export type FilterState = {
  priceRange: [number, number];
  dates: [string, string];
  guests: number;
  amenities: string[];
  rating: number;
};

export type SearchState = {
  query: string;
  location: string;
  filters: FilterState;
  mapState: MapState;
};

export type AppState = {
  stays: Stay[];
  search: SearchState;
  selectedStay: Stay | null;
  favorites: string[];
  recentSearches: string[];
  user: {
    name: string;
    email: string;
    image: string;
  } | null;
}; 