import { writable, derived } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  departure: {
    airport: string;
    time: string;
    terminal: string;
  };
  arrival: {
    airport: string;
    time: string;
    terminal: string;
  };
  duration: string;
  price: number;
  type: 'outbound' | 'return';
}

interface FlightsData {
  flights: Flight[];
}

// Create the store
const createFlightsStore = () => {
  const { subscribe, set, update } = writable<Flight[]>([]);

  return {
    subscribe,
    setFlights: (flights: Flight[]) => set(flights),
    // Add more methods if needed
  };
};

export const flightsStore = createFlightsStore();

// Derived stores for outbound and return flights
export const outboundFlights = derived(flightsStore, $flights => 
  $flights.filter(flight => flight.type === 'outbound')
);

export const returnFlights = derived(flightsStore, $flights => 
  $flights.filter(flight => flight.type === 'return')
); 