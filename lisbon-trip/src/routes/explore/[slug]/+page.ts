import type { ExploreItem } from '$lib/types/explore';

export const load = async ({ params }: { params: { slug: string } }) => {
  // In a real app, this would fetch from an API
  // For now, we'll use static data
  const item: ExploreItem = {
    slug: params.slug,
    title: "Castelo de São Jorge",
    description: "Perched on a hilltop, this medieval castle offers panoramic views of Lisbon and the Tagus River. The castle's history dates back to the 11th century when it was built by the Moors. Today, it's one of Lisbon's most iconic landmarks, featuring ancient walls, towers, and a beautiful garden with peacocks.",
    heroImage: "/assets/castle.jpg",
    price: {
      amount: 15,
      currency: "€"
    },
    openingHours: {
      monday: "09:00-18:00",
      tuesday: "09:00-18:00",
      wednesday: "09:00-18:00",
      thursday: "09:00-18:00",
      friday: "09:00-18:00",
      saturday: "09:00-18:00",
      sunday: "09:00-18:00"
    },
    location: {
      lat: 38.7139,
      lng: -9.1334,
      address: "R. de Santa Cruz do Castelo, 1100-129 Lisboa, Portugal"
    },
    category: "Historical Site",
    rating: 4.5
  };

  return {
    item
  };
}; 