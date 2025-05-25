# Lisbon Zones System

This document describes the geographical zone system implemented for the Lisbon trip app.

## Overview

The app now categorizes all attractions into 7 distinct geographical zones, each with a unique color for easy visual identification.

## Zones

### 1. Sintra (Purple - #8B5CF6)
- **Description**: Historic town with palaces and castles
- **Key Attractions**: Palácio da Pena, Quinta da Regaleira, Castelo dos Mouros, National Palace of Sintra

### 2. Belém (Red - #EF4444)
- **Description**: Riverside district with monuments and museums
- **Key Attractions**: Belém Tower, Jerónimos Monastery, Padrão dos Descobrimentos

### 3. Alfama & Historic Center (Orange - #F59E0B)
- **Description**: Historic neighborhoods with castles and viewpoints
- **Key Attractions**: Castelo de São Jorge, Alfama District, Lisbon Cathedral, Panteão Nacional

### 4. Baixa & Chiado (Green - #10B981)
- **Description**: Downtown area with squares and shopping
- **Key Attractions**: Praça do Comércio, Rossio Square, Santa Justa Lift, Arco da Rua Augusta

### 5. Parque das Nações (Blue - #3B82F6)
- **Description**: Modern district with contemporary attractions
- **Key Attractions**: Oceanário de Lisboa, Parque das Nações

### 6. Avenidas Novas & Northern Areas (Light Pink - #F8BBD9)
- **Description**: Northern areas with parks and modern attractions
- **Key Attractions**: Parque Eduardo VII, Museu Nacional do Azulejo

### 7. Western Lisbon (Pink - #EC4899)
- **Description**: Western central areas including MAAT and surroundings
- **Key Attractions**: MAAT Museum

## Implementation

### Visual Indicators

1. **Explore Page (List View)**:
   - Left border of each attraction card uses the zone color
   - Zone name badge displayed next to the attraction title

2. **Map View**:
   - Custom colored pins for each zone
   - Zone legend in the bottom-left corner
   - Zone name in popup information

3. **Individual Attraction Pages**:
   - Zone badge displayed in the hero section next to the category

### Technical Details

- Zone boundaries are defined using latitude/longitude coordinates
- Each location is automatically assigned to a zone based on its coordinates
- Default gray color (#6B7280) is used for any locations that don't fall within defined zones
- Zone data is stored in `src/lib/data/zones.ts`
- Zone assignment happens automatically when location data is loaded

## Files Modified

- `src/lib/data/zones.ts` - Zone definitions and utility functions
- `src/lib/data/explore.ts` - Added zone property to location interface
- `src/lib/components/MapView.svelte` - Zone-colored pins and legend
- `src/routes/explore/+page.svelte` - Zone indicators in list view
- `src/routes/explore/[slug]/+page.svelte` - Zone badge in detail view

## Benefits

- **Visual Organization**: Easy to see which area of Lisbon each attraction is located in
- **Trip Planning**: Helps group attractions by proximity for efficient itinerary planning
- **Navigation**: Quick visual reference on maps and lists
- **User Experience**: Consistent color coding across all views for better usability 