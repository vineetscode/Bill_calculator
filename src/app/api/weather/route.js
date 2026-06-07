import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const state = searchParams.get("state") || "CA";

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Missing required query parameters: lat and lon coordinates must be provided." },
        { status: 400 }
      );
    }

    // Proxy query to Open-Meteo
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto`;
    
    const response = await fetch(url, {
      next: { revalidate: 43200 } // Next.js native cache for 12 hours
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to retrieve forecast data from upstream weather provider." },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Cache the response at the edge for 12 hours
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=43200, s-maxage=43200, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[Flowtix Weather API] Proxy Error:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred while retrieving weather alerts." },
      { status: 500 }
    );
  }
}
