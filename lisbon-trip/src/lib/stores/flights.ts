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
  type: 'outbound' | 'return';
  status?: string;
  statusDetails?: {
    lastUpdated: string;
    actualDeparture: string;
  };
}

interface FlatFlightData {
  date: string;
  depCity: string;
  depTime: string;
  depTerminal: string;
  arrCity: string;
  arrTime: string;
  arrTerminal: string;
  airline: string;
  airlineCode: string;
  duration: string;
}

// Create the store
const createFlightsStore = () => {
  const { subscribe, set, update } = writable<Flight[]>([]);

  const transformFlatFlight = (data: FlatFlightData, index: number): Flight => {
    // Convert date + time into ISO strings
    const depDate = new Date(data.date);
    const [depHours, depMinutes] = data.depTime.split(':');
    depDate.setHours(parseInt(depHours), parseInt(depMinutes));

    const arrDate = new Date(data.date);
    const [arrHours, arrMinutes] = data.arrTime.split(':');
    arrDate.setHours(parseInt(arrHours), parseInt(arrMinutes));

    return {
      id: `${data.airlineCode}-${data.date}-${index}`,
      airline: data.airline,
      airlineCode: data.airlineCode,
      departure: {
        airport: data.depCity,
        time: depDate.toISOString(),
        terminal: data.depTerminal
      },
      arrival: {
        airport: data.arrCity,
        time: arrDate.toISOString(),
        terminal: data.arrTerminal
      },
      duration: data.duration,
      type: (index === 0 ? 'outbound' : 'return') as 'outbound' | 'return'
    };
  };

  return {
    subscribe,
    setFlights: (raw: any[]) => {
      // If the first item already has a 'departure' field, assume it's in correct shape
      if (raw.length && raw[0].departure) {
        set(raw);
        return;
      }

      // --- Fallback: legacy flat format (keep your original mapping here) ---
      const mapped = (raw as any[]).map((seg: any, i: number) => ({
        id: `${seg.flightNo || 'MOCKED_FLIGHTNO'}-${i}`,
        airline: seg.carrier || 'MOCKED_CARRIER',
        airlineCode: seg.flightNo ? seg.flightNo.split(' ')[0] : 'MOCKED_CODE',
        departure: {
          airport: seg.depAirport,
          time: `${seg.date}T${seg.depTime}`,
          terminal: seg.depTerminal
        },
        arrival: {
          airport: seg.arrAirport,
          time: `${seg.date}T${seg.arrTime}`,
          terminal: seg.arrTerminal
        },
        type: (i === 0 ? 'outbound' : 'return') as 'outbound' | 'return',
        duration: seg.duration,
      }));
      set(mapped);
    },
    update
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