import { NextRequest, NextResponse } from "next/server";

const NOMINATIM_SEARCH_API = "https://nominatim.openstreetmap.org/search";

type NominatimResult = {
  lat: string;
  lon: string;
  display_name?: string;
  address?: Record<string, string>;
};

async function searchAddress(query: string) {
  const params = new URLSearchParams({
    format: "jsonv2",
    q: query,
    addressdetails: "1",
    limit: "1",
    "accept-language": "th",
    countrycodes: "th",
  });

  const response = await fetch(`${NOMINATIM_SEARCH_API}?${params.toString()}`, {
    headers: {
      "User-Agent": "PhuketGrocery/1.0 (contact@phuketgrocery.com)",
    },
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed geocode: ${response.status}`);
  }

  const payload = (await response.json()) as NominatimResult[];
  return payload[0] ?? null;
}

function buildResponse(result: NominatimResult, fallbackLabel: string) {
  const address = result.address ?? {};

  return {
    lat: Number(result.lat),
    lon: Number(result.lon),
    displayName: result.display_name ?? fallbackLabel,
    province: address.state || address.province || address.region || "",
    district:
      address.city_district ||
      address.county ||
      address.state_district ||
      address.city ||
      "",
    subDistrict:
      address.suburb ||
      address.neighbourhood ||
      address.quarter ||
      address.village ||
      address.town ||
      "",
    postalCode: address.postcode || "",
    addressLine1:
      [address.house_number, address.road].filter(Boolean).join(" ") ||
      fallbackLabel,
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const queryParts = query
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    const fallbackQueries = [
      query,
      queryParts.slice(-5).join(", "),
      queryParts.slice(-4).join(", "),
      queryParts.slice(-3).join(", "),
      queryParts.slice(-2).join(", "),
      queryParts.filter((part) => /^\d{5}$/.test(part) === false).join(", "),
    ].filter(Boolean);

    for (const candidate of [...new Set(fallbackQueries)]) {
      const result = await searchAddress(candidate);
      if (result) {
        return NextResponse.json(buildResponse(result, candidate));
      }
    }

    return NextResponse.json({ error: "No results found" }, { status: 404 });
  } catch {
    return NextResponse.json(
      { error: "Unable to geocode address" },
      { status: 500 }
    );
  }
}
