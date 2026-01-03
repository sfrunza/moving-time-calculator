import { NextRequest } from 'next/server';
import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');

  if (!origin || !destination) {
    return new Response(JSON.stringify({ error: 'Missing origin or destination' }), {
      status: 400,
    });
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: origin,
        destinations: destination,
        key: GOOGLE_API_KEY,
        units: 'imperial',
      },
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error fetching distance from Google' }), {
      status: 500,
    });
  }
}
