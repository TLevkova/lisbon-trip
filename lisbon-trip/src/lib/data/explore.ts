export interface ExploreLocation {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  category: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  openingHours?: string;
  price?: string;
  heroImg: string;
  gmapsUrl: string;
}

export const exploreLocations: ExploreLocation[] = [
  {
    id: '1',
    slug: 'belem-tower',
    title: 'Belém Tower',
    description: 'A 16th-century fortification and UNESCO World Heritage site, this iconic tower served as a ceremonial gateway to Lisbon and a symbol of Portugal\'s maritime discoveries.',
    image: '/images/explore/belem-tower.jpg',
    rating: 4.6,
    category: 'Historical Site',
    coordinates: {
      lat: 38.6916,
      lng: -9.2160
    },
    address: 'Av. Brasília, 1400-038 Lisboa, Portugal',
    openingHours: '10:00 - 17:30',
    price: '€15',
    heroImg: '/images/explore/belem-tower.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.6916,-9.2160'
  },
  {
    id: '2',
    slug: 'jeronimos-monastery',
    title: 'Jerónimos Monastery',
    description: 'A stunning example of Portuguese Late Gothic Manueline architecture, this monastery is one of the most prominent monuments in Lisbon and a UNESCO World Heritage site.',
    image: '/images/explore/jeronimos-monastery.jpg',
    rating: 4.5,
    category: 'Historical Site',
    coordinates: {
      lat: 38.6978,
      lng: -9.2067
    },
    address: 'Praça do Império 1400-206 Lisboa, Portugal',
    openingHours: '9:30 - 17:30',
    price: '€18',
    heroImg: '/images/explore/jeronimos-monastery.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.6978,-9.2067'
  },
  {
    id: '3',
    slug: 'castelo-de-sao-jorge',
    title: 'Castelo de São Jorge',
    description: 'A historic castle and national monument offering panoramic views of Lisbon. The castle\'s hilltop location provides a perfect vantage point to admire the city\'s beauty.',
    image: '/images/explore/castelo-sao-jorge.jpg',
    rating: 4.4,
    category: 'Castle',
    coordinates: {
      lat: 38.7139,
      lng: -9.1335
    },
    address: 'R. de Santa Cruz do Castelo, 1100-129 Lisboa, Portugal',
    openingHours: '09:00 - 21:00',
    price: '€15',
    heroImg: '/images/explore/castelo-sao-jorge.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7139,-9.1335'
  },
  {
    id: '4',
    slug: 'oceanario',
    title: 'Oceanário de Lisboa',
    description: 'One of the largest indoor aquariums in Europe, featuring a massive central tank and various marine ecosystems. A perfect destination for families and marine life enthusiasts.',
    image: '/images/explore/oceanario.jpg',
    rating: 4.7,
    category: 'Aquarium',
    coordinates: {
      lat: 38.7636,
      lng: -9.0952
    },
    address: 'Esplanada Dom Carlos I s/nº, 1990-005 Lisboa, Portugal',
    openingHours: '10:00 - 19:00',
    price: '€25',
    heroImg: '/images/explore/oceanario.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7636,-9.0952'
  },
  {
    id: '5',
    slug: 'alfama',
    title: 'Alfama District & Tram 28',
    description: "Lisbon's oldest district, Alfama charms visitors with narrow cobblestone streets, colorful historic buildings, and a vibrant atmosphere rich in traditional fado music. Lisbon's iconic vintage Tram 28 winds through picturesque streets and historic neighborhoods, offering travelers an unforgettable journey through the city's most scenic landmarks.",
    image: '/images/explore/alfama.jpg',
    rating: 5.0,
    category: 'Historical Site',
    coordinates: {
      lat: 38.7138,
      lng: -9.1252
    },
    address: 'Alfama, Lisbon, Portugal',
    openingHours: 'n/a',
    price: 'n/a',
    heroImg: '/images/explore/alfama.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7138,-9.1252'
  },
  {
    id: '6',
    slug: 'praca-do-comercio',
    title: 'Praça do Comércio',
    description: "A majestic riverside square framed by grand arcades and the iconic Arco da Rua Augusta, Praça do Comércio is Lisbon's historic gateway and vibrant gathering point by the Tagus River.",
    image: '/images/explore/praca-do-comercio.jpg',
    rating: 4.7,
    category: 'Square',
    coordinates: {
      lat: 38.7072,
      lng: -9.1363
    },
    address: 'Praça do Comércio, 1100-148 Lisboa, Portugal',
    openingHours: 'n/a',
    price: 'n/a',
    heroImg: '/images/explore/praca-do-comercio.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7072,-9.1363'
  },
  {
    id: '7',
    slug: 'santa-justa',
    title: 'Santa Justa Lift',
    description: 'This iconic iron elevator, designed in neo-Gothic style, connects downtown Lisbon with the elevated Carmo Square, offering panoramic city views and architectural charm.',
    image: '/images/explore/santa-justa.jpg',
    rating: 4.0,
    category: 'Lift',
    coordinates: {
      lat: 38.7129,
      lng: -9.1396
    },
    address: 'Santa Justa, 1150-060 Lisboa, Portugal',
    openingHours: '07:00 - 22:45',
    price: 'n/a',
    heroImg: '/images/explore/santa-justa.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7129,-9.1396'
  },
  {
    id: '8',
    slug: 'maat',
    title: 'MAAT Museum',
    description: "The strikingly modern Museum of Art, Architecture, and Technology (MAAT) blends innovative architecture with contemporary exhibitions, creating a dynamic cultural space along Lisbon's riverside.",
    image: '/images/explore/maat.jpg',
    rating: 4.3,
    category: 'Museum',
    coordinates: {
      lat: 38.6957,
      lng: -9.1979
    },
    address: 'R. de São Domingos, 1300-598 Lisboa, Portugal',
    openingHours: '10:00 - 19:00',
    price: '€11',
    heroImg: '/images/explore/maat.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.6957,-9.1979'
  }
]; 