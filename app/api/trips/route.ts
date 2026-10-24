import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getCountryFromCoordinates } from "@/lib/actions/geocode";
import { prisma } from "@/lib/prisma";

export type TripLocation = {
  name: string;
  lat: number;
  lng: number;
  country: string;
};

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    const locations = await prisma.location.findMany({
      where: {
        trip: {
          userId: session.user.id,
        },
      },
      select: {
        title: true,
        lat: true,
        lng: true,
        trip: {
          select: {
            title: true,
          },
        },
      },
    });

    const transformedLocations = await Promise.all(
      locations.map(async (location) =>
        getCountryFromCoordinates(location.lat, location.lng).then((geocodeResult) => ({
          name: location.trip.title,
          lat: location.lat,
          lng: location.lng,
          country: geocodeResult.features[0].place_name,
        })),
      ),
    );

    return NextResponse.json<TripLocation[]>(transformedLocations);
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
