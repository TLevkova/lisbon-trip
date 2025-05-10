export interface FlightSegment {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
  };
  arrival: {
    airport: string;
    time: string;
  };
  duration: string;
  price: number;
  currency: string;
}

export interface Review {
  id: string;
  author: {
    name: string;
    image: string;
  };
  rating: number;
  date: string;
  comment: string;
}

export interface Stay {
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
}

export interface ExploreItem {
  id: string;
  title: string;
  heroImg: string;
  description: string;
  price?: string;
  openHours?: string;
  gmapsUrl: string;
  rating?: number;
  location: {
    lat: number;
    lng: number;
  };
}

export interface EatSpot {
  id: string;
  name: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  image: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  openHours: string;
  description: string;
  menu?: string;
  reservations?: string;
} 