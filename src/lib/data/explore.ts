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
      lat: 38.6960,
      lng: -9.1936
    },
    address: 'R. de São Domingos, 1300-598 Lisboa, Portugal',
    openingHours: '10:00 - 19:00',
    price: '€11',
    heroImg: '/images/explore/maat.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.6960,-9.1936'
  },
  {
    id: '9',
    slug: 'palacio-da-pena',
    title: 'Palácio da Pena',
    description: 'A stunning Romanticist castle in Sintra, known for its vibrant colors and eclectic architectural style. This UNESCO World Heritage site offers breathtaking views of the surrounding landscape.',
    image: '/images/explore/palacio-da-pena.jpg',
    rating: 4.8,
    category: 'Palace',
    coordinates: {
      lat: 38.7876,
      lng: -9.3905
    },
    address: 'Estrada da Pena, 2710-609 Sintra, Portugal',
    openingHours: '09:30 - 18:30',
    price: '€14',
    heroImg: '/images/explore/palacio-da-pena.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7876,-9.3905'
  },
  {
    id: '10',
    slug: 'chalet-countess-edla',
    title: 'Chalet and Garden of the Countess of Edla',
    description: 'A romantic retreat built in the style of an alpine chalet, featuring unique architectural elements and beautiful gardens.',
    image: '/images/explore/chalet-countess-edla.jpg',
    rating: 4.2,
    category: 'Historical Site',
    coordinates: {
      lat: 38.7851,
      lng: -9.3991
    },
    address: 'Parque da Pena, 2710-609 Sintra, Portugal',
    openingHours: '09:30 - 17:30',
    price: 'n/a',
    heroImg: '/images/explore/chalet-countess-edla.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7851,-9.3991'
  },
  {
    id: '11',
    slug: 'castelo-dos-mouros',
    title: 'Castelo dos Mouros',
    description: 'A medieval castle with stunning views, built by the Moors in the 8th and 9th centuries. Its walls snake across the hills of Sintra.',
    image: '/images/explore/castelo-dos-mouros.jpg',
    rating: 4.6,
    category: 'Castle',
    coordinates: {
      lat: 38.7925,
      lng: -9.3893
    },
    address: 'Estrada da Pena, 2710-609 Sintra, Portugal',
    openingHours: '09:30 - 18:00',
    price: '€12',
    heroImg: '/images/explore/castelo-dos-mouros.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7925,-9.3893'
  },
  {
    id: '12',
    slug: 'quinta-da-regaleira',
    title: 'Quinta da Regaleira',
    description: 'A romantic palace and chapel with elaborate Gothic, Renaissance, and Manueline architectural elements, surrounded by mysterious gardens with hidden tunnels and wells.',
    image: '/images/explore/quinta-da-regaleira.jpg',
    rating: 4.8,
    category: 'Palace',
    coordinates: {
      lat: 38.7963,
      lng: -9.3960
    },
    address: 'R. Barbosa du Bocage 5, 2710-567 Sintra, Portugal',
    openingHours: '10:00 - 17:30',
    price: '€15',
    heroImg: '/images/explore/quinta-da-regaleira.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7963,-9.3960'
  },
  {
    id: '13',
    slug: 'palacio-de-monserrate',
    title: 'Palácio de Monserrate',
    description: 'An exotic palatial villa that exemplifies Romantic architecture, surrounded by a beautiful park with botanical gardens.',
    image: '/images/explore/palacio-de-monserrate.jpg',
    rating: 4.7,
    category: 'Ruins',
    coordinates: {
      lat: 38.7919,
      lng: -9.4190
    },
    address: 'Estrada de Monserrate, 2710-405 Sintra, Portugal',
    openingHours: 'Always open',
    price: 'Free',
    heroImg: '/images/explore/palacio-de-monserrate.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7919,-9.4190'
  },
  {
    id: '14',
    slug: 'national-palace-sintra',
    title: 'National Palace of Sintra',
    description: 'The best-preserved medieval royal palace in Portugal, known for its distinctive twin chimneys and beautiful interior decorations.',
    image: '/images/explore/national-palace-sintra.jpg',
    rating: 4.5,
    category: 'Palace',
    coordinates: {
      lat: 38.7976,
      lng: -9.3906
    },
    address: 'Largo Rainha Dona Amélia, 2710-616 Sintra, Portugal',
    openingHours: '09:30 - 18:30',
    price: '€13',
    heroImg: '/images/explore/national-palace-sintra.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7976,-9.3906'
  },
  {
    id: '15',
    slug: 'parque-da-liberdade',
    title: 'Parque da Liberdade',
    description: 'A peaceful urban park in Sintra offering walking trails, playgrounds, and beautiful landscaping.',
    image: '/images/explore/parque-da-liberdade.jpg',
    rating: 4.6,
    category: 'Park',
    coordinates: {
      lat: 38.7963,
      lng: -9.3864
    },
    address: 'Av. Dr. Miguel Bombarda, 2710 Sintra, Portugal',
    openingHours: 'Always open',
    price: 'Free',
    heroImg: '/images/explore/parque-da-liberdade.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7963,-9.3864'
  },
  {
    id: '16',
    slug: 'rua-augusta',
    title: 'Arco da Rua Augusta',
    description: 'Triumphal arch completed in 1873 after more than a century of intermittent construction..',
    image: '/images/explore/rua-augusta.jpg',
    rating: 4.7,
    category: 'Monument',
    coordinates: {
      lat: 38.7084,
      lng: -9.1368
    },
    address: 'Rua Augusta, Lisbon, Portugal',
    openingHours: '10:00 - 19:00',
    price: 'Free',
    heroImg: '/images/explore/rua-augusta.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7084,-9.1368'
  },
  {
    id: '17',
    slug: 'rossio',
    title: 'Rossio Square',
    description: 'The popular name for Pedro IV Square, one of Lisbon\'s main squares since the Middle Ages, known for its wave-pattern cobblestones and historic cafes.',
    image: '/images/explore/rossio.jpg',
    rating: 4.6,
    category: 'Square',
    coordinates: {
      lat: 38.7133,
      lng: -9.1392
    },
    address: 'Praça Dom Pedro IV, Lisbon, Portugal',
    openingHours: 'Always open',
    price: 'Free',
    heroImg: '/images/explore/rossio.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7133,-9.1392'
  },
  {
    id: '18',
    slug: 'carmo-convent',
    title: 'Carmo Convent',
    description: 'Gothic ruins of a medieval convent, serving as a powerful reminder of the 1755 earthquake and housing an archaeological museum.',
    image: '/images/explore/carmo-convent.jpg',
    rating: 4.5,
    category: 'Archeological Museum',
    coordinates: {
      lat: 38.7120,
      lng: -9.1406
    },
    address: 'Largo do Carmo, 1200-092 Lisboa, Portugal',
    openingHours: '10:00 - 19:00, Closed on Sundays',
    price: '€7',
    heroImg: '/images/explore/carmo-convent.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7120,-9.1406'
  },
  {
    id: '19',
    slug: 'miradouro-sao-pedro',
    title: 'Miradouro de São Pedro de Alcântara',
    description: 'A beautiful viewpoint offering panoramic views of central Lisbon, São Jorge Castle, and the Tagus River.',
    image: '/images/explore/miradouro-sao-pedro.jpg',
    rating: 4.6,
    category: 'Viewpoint',
    coordinates: {
      lat: 38.7153,
      lng: -9.1441
    },
    address: 'R. de São Pedro de Alcântara, 1250-237 Lisboa, Portugal',
    openingHours: 'Always open',
    price: 'Free',
    heroImg: '/images/explore/miradouro-sao-pedro.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7153,-9.1441'
  },
  {
    id: '20',
    slug: 'lisbon-cathedral',
    title: 'Lisbon Cathedral (Sé se Lisboa)',
    description: 'The oldest church in Lisbon, built in 1147, featuring a mixture of architectural styles from Romanesque to Gothic and Baroque.',
    image: '/images/explore/lisbon-cathedral.jpg',
    rating: 4.4,
    category: 'Religious Site',
    coordinates: {
      lat: 38.7098,
      lng: -9.1329
    },
    address: 'Largo da Sé, 1100-585 Lisboa, Portugal',
    openingHours: '10:00 - 18:00',
    price: '€5',
    heroImg: '/images/explore/lisbon-cathedral.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7097,-9.1336'
  },
  {
    id: '21',
    slug: 'museu-nacional-do-azulejo',
    title: 'Museu Nacional do Azulejo',
    description: 'A unique museum dedicated to the art of Portuguese tiles, housed in a former monastery with a stunning collection spanning five centuries.',
    image: '/images/explore/museu-nacional-do-azulejo.jpg',
    rating: 4.6,
    category: 'Museum',
    coordinates: {
      lat: 38.7250,
      lng: -9.1135
    },
    address: 'R. Me. Deus 4, 1900-312 Lisboa, Portugal',
    openingHours: '10:00 - 18:00',
    price: '€10',
    heroImg: '/images/explore/museu-nacional-do-azulejo.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7250,-9.1135'
  },
  {
    id: '22',
    slug: 'padrao-dos-descobrimentos',
    title: 'Padrão dos Descobrimentos',
    description: 'A monument celebrating Portuguese explorers, featuring sculptures of historical figures and offering panoramic views from its viewing platform.',
    image: '/images/explore/padrao-dos-descobrimentos.jpg',
    rating: 4.6,
    category: 'Monument',
    coordinates: {
      lat: 38.6936,
      lng: -9.2057
    },
    address: 'Av. Brasília, 1400-038 Lisboa, Portugal',
    openingHours: '10:00 - 19:00',
    price: '€10',
    heroImg: '/images/explore/padrao-dos-descobrimentos.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.6936,-9.2057'
  },
  {
    id: '23',
    slug: 'parque-das-nacoes',
    title: 'Parque das Nações',
    description: 'A modern district developed for Expo \'98, featuring contemporary architecture, gardens, the Oceanário, and various leisure facilities.',
    image: '/images/explore/parque-das-nacoes.jpg',
    rating: 4.5,
    category: 'District',
    coordinates: {
      lat: 38.7633,
      lng: -9.0951
    },
    address: 'Parque das Nações & Telecabine, 1990 Lisboa, Portugal',
    openingHours: 'Always open, 11:00 - 19:00 for the Telecabine',
    price: '€7.50/€9.50 Telecabine',
    heroImg: '/images/explore/parque-das-nacoes.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7633,-9.0951'
  },
  {
    id: '24',
    slug: 'panteao-nacional',
    title: 'Panteão Nacional (Church of Santa Engrácia)',
    description: 'A stunning 17th-century monument and national pantheon, housing the tombs of important Portuguese figures. Its impressive dome offers panoramic views of Lisbon and the Tagus River.',
    image: '/images/explore/panteao-nacional.jpg',
    rating: 4.5,
    category: 'Monument',
    coordinates: {
      lat: 38.7149,
      lng: -9.1246
    },
    address: 'Campo de Santa Clara, 1100-471 Lisboa, Portugal',
    openingHours: '10:00 - 18:00, Closed on Mondays',
    price: '€10',
    heroImg: '/images/explore/panteao-nacional.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7149,-9.1246'
  },
  {
    id: '25',
    slug: 'sao-vicente-de-fora',
    title: 'Igreja de São Vicente de Fora',
    description: 'A 17th-century monastery and church, one of the most important religious monuments in Lisbon, featuring beautiful azulejos and the tomb of the Braganza dynasty.',
    image: '/images/explore/sao-vicente-de-fora.jpg',
    rating: 4.6,
    category: 'Religious Site',
    coordinates: {
      lat: 38.7147,
      lng: -9.1283
    },
    address: 'Largo de São Vicente, 1100-572 Lisboa, Portugal',
    openingHours: '10:00 - 17:45',
    price: '€8',
    heroImg: '/images/explore/sao-vicente-de-fora.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7147,-9.1283'
  },
  {
    id: '26',
    slug: 'miradouro-portas-do-sol',
    title: 'Miradouro das Portas do Sol',
    description: 'One of Lisbon\'s most famous viewpoints, offering spectacular views over Alfama\'s terracotta rooftops and the Tagus River.',
    image: '/images/explore/miradouro-portas-do-sol.jpg',
    rating: 4.7,
    category: 'Viewpoint',
    coordinates: {
      lat: 38.7119,
      lng: -9.1299
    },
    address: 'Largo Portas do Sol, 1100-411 Lisboa, Portugal',
    openingHours: 'Always open',
    price: 'n/a',
    heroImg: '/images/explore/miradouro-portas-do-sol.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7119,-9.1299'
  },
  {
    id: '27',
    slug: 'miradouro-santa-luzia',
    title: 'Miradouro de Santa Luzia',
    description: 'A romantic terrace offering stunning views of Alfama and the Tagus River, decorated with beautiful azulejos panels depicting historical scenes.',
    image: '/images/explore/miradouro-santa-luzia.jpg',
    rating: 4.7,
    category: 'Viewpoint',
    coordinates: {
      lat: 38.7126,
      lng: -9.1302
    },
    address: 'Largo de Santa Luzia, 1100-487 Lisboa, Portugal',
    openingHours: 'Always open',
    price: 'n/a',
    heroImg: '/images/explore/miradouro-santa-luzia.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7126,-9.1302'
  },
  {
    id: '28',
    slug: 'monumento-dos-restauradores',
    title: 'Monumento dos Restauradores',
    description: 'An obelisk commemorating Portugal\'s independence from Spain in 1640, located in the beautiful Restauradores Square.',
    image: '/images/explore/monumento-dos-restauradores.jpg',
    rating: 4.5,
    category: 'Monument',
    coordinates: {
      lat: 38.7157,
      lng: -9.1416
    },
    address: 'Praça dos Restauradores, 1250-188 Lisboa, Portugal',
    openingHours: 'n/a',
    price: 'n/a',
    heroImg: '/images/explore/monumento-dos-restauradores.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7157,-9.1416'
  },
  {
    id: '29',
    slug: 'statue-of-john-i',
    title: 'Statue Of John I',
    description: 'A historic equestrian statue honoring King John I of Portugal, located in Praça da Figueira, celebrating one of Portugal\'s most important monarchs.',
    image: '/images/explore/statue-of-john-i.jpg',
    rating: 4.4,
    category: 'Monument',
    coordinates: {
      lat: 38.7136,
      lng: -9.1379
    },
    address: 'Praça da Figueira, Lisboa, Portugal',
    openingHours: 'n/a',
    price: 'n/a',
    heroImg: '/images/explore/statue-of-john-i.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7136,-9.1379'
  },
  {
    id: '30',
    slug: 'bairro-alto',
    title: 'Bairro Alto',
    description: 'A bohemian neighborhood known for its vibrant nightlife, traditional restaurants, and alternative shops. By day, it\'s a cultural hub; by night, it transforms into Lisbon\'s party central.',
    image: '/images/explore/bairro-alto.jpg',
    rating: 4.5,
    category: 'District',
    coordinates: {
      lat: 38.7127,
      lng: -9.1462
    },
    address: 'Bairro Alto, Lisboa, Portugal',
    openingHours: 'n/a',
    price: 'n/a',
    heroImg: '/images/explore/bairro-alto.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7127,-9.1462'
  },
  {
    id: '31',
    slug: 'parque-eduardo-vii',
    title: 'Parque Eduardo VII',
    description: 'Lisbon\'s largest central park, featuring geometrically designed gardens, a stunning view over the city and the Tagus River, and the impressive greenhouse Estufa Fria.',
    image: '/images/explore/parque-eduardo-vii.jpg',
    rating: 4.6,
    category: 'Park',
    coordinates: {
      lat: 38.7283,
      lng: -9.1526
    },
    address: 'Parque Eduardo VII, 1070-051 Lisboa, Portugal',
    openingHours: 'n/a',
    price: 'n/a',
    heroImg: '/images/explore/parque-eduardo-vii.jpg',
    gmapsUrl: 'https://www.google.com/maps?q=38.7283,-9.1526'
  }
]; 