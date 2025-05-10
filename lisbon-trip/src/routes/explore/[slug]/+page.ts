import { exploreLocations } from '$lib/data/explore';
import { error } from '@sveltejs/kit';

export const load = async ({ params }: { params: { slug: string } }) => {
  const item = exploreLocations.find(loc => loc.slug === params.slug);
  
  if (!item) {
    throw error(404, {
      message: `Location "${params.slug}" not found`
    });
  }

  return {
    item
  };
}; 