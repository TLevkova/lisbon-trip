export interface Zone {
  id: string;
  name: string;
  color: string;
  description: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export const zones: Zone[] = [
  {
    id: 'sintra',
    name: 'Sintra',
    color: '#8B5CF6', // Purple
    description: 'Historic town with palaces and castles',
    bounds: {
      north: 38.80,
      south: 38.78,
      east: -9.38,
      west: -9.43
    }
  },
  {
    id: 'belem',
    name: 'Belém',
    color: '#EF4444', // Red
    description: 'Riverside district with monuments and museums',
    bounds: {
      north: 38.705,
      south: 38.69,
      east: -9.19,
      west: -9.22
    }
  },
  {
    id: 'alfama-central',
    name: 'Alfama & Historic Center',
    color: '#F59E0B', // Amber/Orange
    description: 'Historic neighborhoods with castles and viewpoints',
    bounds: {
      north: 38.72,
      south: 38.705,
      east: -9.12,
      west: -9.145
    }
  },
  {
    id: 'baixa-chiado',
    name: 'Baixa & Chiado',
    color: '#10B981', // Emerald/Green
    description: 'Downtown area with squares and shopping',
    bounds: {
      north: 38.718,
      south: 38.705,
      east: -9.135,
      west: -9.15
    }
  },
  {
    id: 'parque-nacoes',
    name: 'Parque das Nações',
    color: '#3B82F6', // Blue
    description: 'Modern district with contemporary attractions',
    bounds: {
      north: 38.77,
      south: 38.76,
      east: -9.09,
      west: -9.10
    }
  },
  {
    id: 'avenidas-novas',
    name: 'Avenidas Novas & Northern Areas',
    color: '#F8BBD9', // Light pink
    description: 'Northern areas with parks and modern attractions',
    bounds: {
      north: 38.735,
      south: 38.715,
      east: -9.10,
      west: -9.16
    }
  },
  {
    id: 'western-central',
    name: 'Western Lisbon',
    color: '#EC4899', // Pink
    description: 'Western central areas including MAAT and surroundings',
    bounds: {
      north: 38.705,
      south: 38.69,
      east: -9.18,
      west: -9.20
    }
  }
];

export function getLocationZone(lat: number, lng: number): Zone | null {
  for (const zone of zones) {
    if (
      lat >= zone.bounds.south &&
      lat <= zone.bounds.north &&
      lng >= zone.bounds.west &&
      lng <= zone.bounds.east
    ) {
      return zone;
    }
  }
  return null;
}

export function getZoneById(id: string): Zone | undefined {
  return zones.find(zone => zone.id === id);
} 