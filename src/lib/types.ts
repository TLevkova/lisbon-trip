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

export interface TransportMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface VivaViagemCard {
  title: string;
  description: string;
  pricing: {
    cardCost: number;
    recommendedCredit: {
      min: number;
      max: number;
    };
    totalCost: {
      min: number;
      max: number;
    };
  };
  fares: {
    metro: number;
    bus: number;
    tram: number;
    ferry: number;
  };
  estimatedTrips: string;
  link: string;
}

export interface TransportOption {
  id: string;
  name: string;
  icon: string;
  recommended?: boolean;
  cost: {
    amount: number | string;
    currency: string;
    note: string;
  };
  journeyTime: string;
  pros: string[];
  cons: string[];
  route?: string;
  tip?: string;
}

export interface DepartureStation {
  name: string;
  note: string;
}

export interface SintraTrip {
  title: string;
  trainDetails: {
    departureStations: DepartureStation[];
    schedule: {
      firstTrain: string;
      lastTrain: string;
      frequency: string;
      journeyTime: string;
    };
  };
  pricing: {
    oneWay: number;
    return: number;
    currency: string;
    note: string;
  };
  ticketing: {
    options: string[];
  };
  tips: string[];
}

export interface MovesData {
  publicTransport: {
    overview: string;
    modes: TransportMode[];
  };
  vivaViagem: VivaViagemCard;
  airportTransport: {
    arrivalInfo: {
      terminal: string;
      arrivalTime: string;
      passengers: number;
      luggage: boolean;
    };
    options: TransportOption[];
  };
  sintraTrip: SintraTrip;
  lastUpdated: string;
}

 