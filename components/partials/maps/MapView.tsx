"use client";

import "leaflet/dist/leaflet.css";
import "@/lib/SmoothWheelZoom";

import L from "leaflet";
import { useMemo, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { Location } from "@/app/generated/prisma/client";
import Icon from "@/components/Icon";
import MapScrollAlert from "@/components/partials/maps/MapScrollAlert";
import MapScrollZoomController from "@/components/partials/maps/MapScrollZoomController";

type Props = {
  itineraries: Location[];
};

const MarkerIcon = L.divIcon({
  html: renderToString(<Icon name="Marker" size={48} className="absolute text-primary" />),
  className: "flex! justify-center items-end",
});

export default function MapView({ itineraries }: Props) {
  const center = useMemo<[number, number]>(() => {
    if (itineraries.length === 0) return [0, 0];

    const sum = itineraries.reduce(
      (acc, itinerary) => ({ lat: acc.lat + itinerary.lat, lng: acc.lng + itinerary.lng }),
      { lat: 0, lng: 0 },
    );

    return [sum.lat / itineraries.length, sum.lng / itineraries.length];
  }, [itineraries]);

  const points = useMemo<[number, number][]>(
    () => itineraries.map((itinerary) => [itinerary.lat, itinerary.lng]),
    [itineraries],
  );

  const alertScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [shouldAlertScroll, setShouldAlertScroll] = useState<boolean>(false);

  const clearAlertScrollTimer = () => {
    if (alertScrollTimerRef.current) {
      clearTimeout(alertScrollTimerRef.current);
      alertScrollTimerRef.current = null;
    }
  };

  const displayAlertScroll = () => {
    clearAlertScrollTimer();
    setShouldAlertScroll(true);

    alertScrollTimerRef.current = setTimeout(() => {
      setShouldAlertScroll(false);
    }, 1000);
  };

  const stopAlertScrollTimer = () => {
    clearAlertScrollTimer();
    setShouldAlertScroll(false);
  };

  return (
    <MapContainer
      {...(points.length ? { center, bounds: points } : { center: [20, 0], zoom: 2 })}
      maxBoundsViscosity={1}
      minZoom={1}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: "var(--radius)" }}
      touchZoom={true}
      zoomControl={false}
    >
      <MapScrollZoomController
        displayAlertScroll={displayAlertScroll}
        stopAlertScrollTimer={stopAlertScrollTimer}
      />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {itineraries.map((itinerary) => (
        <Marker key={itinerary.id} position={[itinerary.lat, itinerary.lng]} icon={MarkerIcon}>
          <Popup>{itinerary.title}</Popup>
        </Marker>
      ))}
      <MapScrollAlert shouldAlertScroll={shouldAlertScroll} />
    </MapContainer>
  );
}
