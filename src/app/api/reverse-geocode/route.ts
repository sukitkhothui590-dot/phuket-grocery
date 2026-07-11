import { NextRequest, NextResponse } from "next/server";

const NOMINATIM_REVERSE_API = "https://nominatim.openstreetmap.org/reverse";

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat");
  const lon = request.nextUrl.searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Missing lat or lon" },
      { status: 400 }
    );
  }

  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      lat,
      lon,
      addressdetails: "1",
      "accept-language": "th",
      zoom: "18",
    });

    const response = await fetch(`${NOMINATIM_REVERSE_API}?${params.toString()}`, {
      headers: {
        "User-Agent": "PhuketGrocery/1.0 (contact@phuketgrocery.com)",
      },
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed reverse geocode: ${response.status}`);
    }

    const payload = await response.json();
    const address = payload.address ?? {};

    return NextResponse.json({
      lat: Number(lat),
      lon: Number(lon),
      displayName: payload.display_name ?? "",
      province:
        address.state || address.province || address.region || "",
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
        payload.name ||
        "",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to reverse geocode location" },
      { status: 500 }
    );
  }
}
