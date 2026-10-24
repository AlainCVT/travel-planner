"use server";

import type { GeocodingFeature } from "@maptiler/client";
import { config, geocoding } from "@maptiler/client";

function configureMapTiler() {
  const apiKey = process.env.MAPTILER_KEY;
  if (!apiKey) {
    throw new Error("Missing MAPTILER_KEY environment variable.");
  }

  config.apiKey = apiKey;
}

export async function searchLocations(query: string): Promise<GeocodingFeature[]> {
  configureMapTiler();

  const result = await geocoding.forward(query);
  return result.features;
}

export async function getCountryFromCoordinates(lat: number, lng: number) {
  configureMapTiler();

  return geocoding.reverse([lng, lat], {
    types: ["country"],
    language: ["en"],
  });
}
