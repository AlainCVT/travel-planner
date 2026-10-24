"use client";

import { clsx } from "cn";
import { Loader2, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useContext, useEffect, useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";

import type { TripLocation } from "@/app/api/trips/route";
import Container from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeContext } from "@/contexts/theme";
import { pluralize } from "@/utils/string";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  ),
});

export default function GlobePage() {
  const { theme } = useContext(ThemeContext);

  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [globeSize, setGlobeSize] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [locations, setLocations] = useState<TripLocation[]>([]);
  const [visitedCountries, setVisitedCountries] = useState<Set<string>>(new Set());

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      setGlobeSize(Math.floor(width));
    });

    observer.observe(wrapper);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const trips = await fetch("/api/trips").then<TripLocation[]>((response) => response.json());
        setLocations(trips);
        setVisitedCountries(new Set<string>(trips.map((location) => location.country)));
      } catch (error) {
        console.error("error", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleGlobeReady = () => {
    const globe = globeRef.current;
    if (!globe) return;

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
  };

  return (
    <Container className="grid grid-cols-[2fr_1fr] gap-6">
      <h1 className="col-span-full text-3xl font-bold tracking-tight">Your Travel Journey</h1>
      <Card ref={wrapperRef} className="overflow-hidden p-0">
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <Globe
            ref={globeRef}
            onGlobeReady={handleGlobeReady}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0, 0, 0, 0)"
            pointColor={() => (theme === "light" ? "#4f39f6" : "#615fff")}
            pointLabel="name"
            pointsData={locations}
            pointRadius={0.5}
            pointAltitude={0.1}
            pointsMerge={true}
            width={globeSize}
            height={globeSize}
          />
        )}
      </Card>
      <Card
        className={clsx("sticky top-[calc(54px+var(--spacing)*16)] self-start", {
          "p-0": isLoading,
        })}
      >
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Countries Visited</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="rounded-sm bg-sidebar-primary/20 px-2 py-1 text-sm text-sidebar-primary">
                You have visited <strong>{visitedCountries.size}</strong>{" "}
                {pluralize(visitedCountries.size, "country", () => "countries")}.
              </p>
              <ul className="-m-(--card-spacing) mt-0 grid max-h-128 gap-2 overflow-auto p-(--card-spacing)">
                {Array.from(visitedCountries)
                  .sort()
                  .map((country, key) => (
                    <li
                      key={key}
                      className="flex items-center gap-2 rounded-lg border p-2 transition-colors"
                    >
                      <MapPin className="size-4 text-sidebar-primary" />
                      <span className="font-medium">{country}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </>
        )}
      </Card>
    </Container>
  );
}
