// core.ts
export interface FlightSegment {
    date: string;            // ISO eg “2025-05-26”
    depCity: string;
    depAirport: string;
    depTerminal?: string;
    depTime: string;         // “19:20”
    arrCity: string;
    arrAirport: string;
    arrTerminal?: string;
    arrTime: string;
    carrier: string;         // “Bulgaria Air”
    flightNo: string;        // “FB 563”
    bookingRef: string;      // XVTX5C
    travellers: string[];    // names on the booking
}

export interface Stay {
    name: string;
    address: string;
    checkIn: string;         // ISO date
    checkOut: string;
    totalCost?: number;      // € €
    splitNeeded?: boolean;   // you said “yes”
}

export interface ExploreItem {
    id: string;              // slug, eg “oceanario”
    title: string;
    heroImg: string;         // local asset path
    description: string;
    price?: string;          // “€25 adults”
    openHours?: string;
    beenThere?: boolean;
    notes?: string;
    gmapsUrl: string;
    rating?: number;         // from Google
}

export interface EatSpot {
    id: string;
    name: string;
    heroImg: string;
    cuisine: string;         // “Pastéis de nata”
    gmapsUrl: string;
    rating?: number;
    priceBand?: string;      // “€€”
    notes?: string;
}

export interface TransportTip {
    mode: 'metro' | 'tram' | 'taxi' | 'walk';
    title: string;
    description: string;
    link?: string;           // external refs
}
