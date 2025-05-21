import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

interface FlightInfoResponse {
    data: Array<{
        carrier: {
            iata: string;
            icao: string;
        };
        flightNumber: number;
        departure: {
            airport: {
                iata: string;
                icao: string;
            };
            terminal: string;
            date: {
                local: string;
                utc: string;
            };
            time: {
                local: string;
                utc: string;
            };
        };
        arrival: {
            airport: {
                iata: string;
                icao: string;
            };
            terminal: string;
            date: {
                local: string;
                utc: string;
            };
            time: {
                local: string;
                utc: string;
            };
        };
        elapsedTime: number;
        statusDetails: Array<{
            state: string;
            updatedAt: string;
            departure: {
                offGround: {
                    utc: string;
                };
            };
        }>;
    }>;
}

async function fetchFlight(carrierCode: string, flightNumber: string, departureDateTime: string, fetchFn: typeof fetch) {
    const url = `https://flight-info-api.p.rapidapi.com/status?DepartureDateTime=${encodeURIComponent(
        departureDateTime
    )}&CarrierCode=${encodeURIComponent(carrierCode)}&FlightNumber=${encodeURIComponent(
        flightNumber
    )}&version=v2&CodeType=IATA`;

    console.log('Fetching flight data from:', url);

    const res = await fetchFn(url, {
        headers: {
            'X-RapidAPI-Key': env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'flight-info-api.p.rapidapi.com'
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch flight data');
    }

    const body = (await res.json()) as FlightInfoResponse;
    console.log('API Response:', JSON.stringify(body, null, 2));
    return body.data?.[0]; // first (most current) match
}

export const GET: RequestHandler = async ({ url, fetch }) => {
    const carrierCode = url.searchParams.get('carrierCode')?.trim() ?? '';
    const flightNumber = url.searchParams.get('flightNumber')?.trim() ?? '';
    const departureDateTime = url.searchParams.get('departureDateTime')?.trim() ?? '';

    if (!carrierCode || !flightNumber || !departureDateTime) {
        return json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (!env.RAPIDAPI_KEY) {
        return json({ error: 'Server not configured with RAPIDAPI_KEY' }, { status: 500 });
    }

    try {
        const flightData = await fetchFlight(carrierCode, flightNumber, departureDateTime, fetch);
        
        if (!flightData) {
            return json({ error: 'Flight not found' }, { status: 404 });
        }

        console.log('Processing flight data:', JSON.stringify(flightData, null, 2));

        // Format duration from elapsedTime (minutes)
        const duration = flightData.elapsedTime 
            ? `${Math.floor(flightData.elapsedTime / 60)}h ${flightData.elapsedTime % 60}m`
            : '';

        const statusDetails = flightData.statusDetails?.[0];
        const status = statusDetails?.state || 'Status Unknown';
        const lastUpdated = statusDetails?.updatedAt || 'Not updated yet';
        const actualDeparture = statusDetails?.departure?.offGround?.utc || 'Not updated yet';

        const flight = {
            id: `${carrierCode}${flightNumber}`,
            airline: carrierCode,
            airlineCode: carrierCode,
            departure: {
                airport: flightData.departure.airport.iata || '',
                time: `${flightData.departure.date.local}T${flightData.departure.time.local}`,
                terminal: flightData.departure.terminal || ''
            },
            arrival: {
                airport: flightData.arrival.airport.iata || '',
                time: `${flightData.arrival.date.local}T${flightData.arrival.time.local}`,
                terminal: flightData.arrival.terminal || ''
            },
            duration,
            status,
            statusDetails: {
                lastUpdated,
                actualDeparture
            },
            type: 'outbound' // This will be set by the frontend
        };

        console.log('Mapped flight data:', JSON.stringify(flight, null, 2));

        return json({ flights: [flight] });
    } catch (err) {
        console.error('flight-info-api error:', err);
        return json({ error: 'Failed to fetch flight data' }, { status: 502 });
    }
};
