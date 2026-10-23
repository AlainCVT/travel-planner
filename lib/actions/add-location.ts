"use server";

import type { GeocodingFeature } from "@maptiler/client";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function addLocation(
  formData: FormData,
  tripId: string,
  geocode: GeocodingFeature | null,
) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated.");
  }

  const address = formData.get("address")?.toString();

  if (!address) {
    throw new Error("Missing address.");
  }

  if (!geocode) {
    throw new Error("Missing geocode.");
  }

  const [lng, lat] = geocode.center;

  const count = await prisma.location.count({
    where: { tripId },
  });

  await prisma.location.create({
    data: {
      title: address,
      lat,
      lng,
      tripId,
      order: count,
    },
  });

  redirect(`/trips/${tripId}`);
}
