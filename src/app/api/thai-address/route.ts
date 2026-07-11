import { NextRequest, NextResponse } from "next/server";

const THAI_GEOGRAPHY_SOURCE =
  "https://cdn.jsdelivr.net/gh/thailand-geography-data/thailand-geography-json@main/src/geography.json";

type ThaiGeographyEntry = {
  provinceNameTh: string;
  districtNameTh: string;
  subdistrictNameTh: string;
  postalCode: number;
};

let geographyCache: ThaiGeographyEntry[] | null = null;

async function getGeographyData() {
  if (geographyCache) {
    return geographyCache;
  }

  const response = await fetch(THAI_GEOGRAPHY_SOURCE, {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Thai geography: ${response.status}`);
  }

  geographyCache = (await response.json()) as ThaiGeographyEntry[];
  return geographyCache;
}

function unique(items: string[]) {
  return [...new Set(items)];
}

export async function GET(request: NextRequest) {
  try {
    const data = await getGeographyData();
    const searchParams = request.nextUrl.searchParams;
    const level = searchParams.get("level");
    const province = searchParams.get("province");
    const district = searchParams.get("district");
    const subdistrict = searchParams.get("subdistrict");

    if (level === "provinces") {
      return NextResponse.json({
        items: unique(data.map((item) => item.provinceNameTh)),
      });
    }

    if (level === "districts") {
      if (!province) {
        return NextResponse.json({ items: [] });
      }

      return NextResponse.json({
        items: unique(
          data
            .filter((item) => item.provinceNameTh === province)
            .map((item) => item.districtNameTh)
        ),
      });
    }

    if (level === "subdistricts") {
      if (!province || !district) {
        return NextResponse.json({ items: [] });
      }

      return NextResponse.json({
        items: unique(
          data
            .filter(
              (item) =>
                item.provinceNameTh === province &&
                item.districtNameTh === district
            )
            .map((item) => item.subdistrictNameTh)
        ),
      });
    }

    if (level === "postalcodes") {
      if (!province || !district || !subdistrict) {
        return NextResponse.json({ items: [] });
      }

      return NextResponse.json({
        items: unique(
          data
            .filter(
              (item) =>
                item.provinceNameTh === province &&
                item.districtNameTh === district &&
                item.subdistrictNameTh === subdistrict
            )
            .map((item) => String(item.postalCode))
        ),
      });
    }

    return NextResponse.json(
      { error: "Invalid level" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to load Thai address data" },
      { status: 500 }
    );
  }
}
