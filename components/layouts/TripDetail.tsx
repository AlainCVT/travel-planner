"use client";

import {
  ArrowLeft,
  Calendar,
  LayoutDashboard,
  type LucideIcon,
  Map,
  MapPin,
  Plus,
  Route,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Prisma, PrismaClient } from "@/app/generated/prisma/client";
import Container from "@/components/Container";
import SortableItinerary from "@/components/partials/SortableItinerary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/contexts/locale";
import { pluralize } from "@/utils/string";

type TripWithLocations = NonNullable<
  Prisma.Result<PrismaClient["trip"], { include: { locations: true } }, "findFirst">
>;

type Props = {
  trip: TripWithLocations;
};

const tabs: Array<{
  name: string;
  icon: LucideIcon;
  label: string;
}> = [
  {
    name: "overview",
    icon: LayoutDashboard,
    label: "Overview",
  },
  {
    name: "itinerary",
    icon: Route,
    label: "Itinerary",
  },
  {
    name: "map",
    icon: Map,
    label: "Map",
  },
];

type TabsNames = "overview" | "itinerary" | "map";

const MapView = dynamic(() => import("@/components/partials/maps/MapView"), {
  ssr: false,
  loading: () => <div />,
});

export default function TripDetail({ trip }: Props) {
  const { formatDate } = useLocale();

  const [activeTab, setActiveTab] = useState<TabsNames>("overview");

  const getDaysGap = (startDate: Date, endDate: Date) =>
    Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Container className="space-y-8 pb-12">
      {trip.image && (
        <div className="relative h-72 w-full overflow-hidden rounded-xl md:h-96">
          <Image src={trip.image} alt={trip.title} className="object-cover" fill priority />
        </div>
      )}
      <Card className="flex flex-col items-start justify-between gap-4 rounded-lg p-6 shadow md:flex-row md:items-center">
        <div className="grid gap-2">
          <h1 className="text-4xl font-extrabold">{trip.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-5" />
            <span className="text-lg">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>
        </div>
        <Button asChild>
          <Link href={`/trips/${trip.id}/itinerary/new`}>
            <Plus className="size-5" /> Add Location
          </Link>
        </Button>
      </Card>
      <div>
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as TabsNames);
          }}
        >
          <TabsList className="mb-6">
            {tabs.map(({ name, icon: Icon, label }) => (
              <TabsTrigger key={name} value={name} className="text-lg">
                <Icon />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid items-start gap-6 md:grid-cols-2">
              <div className="grid gap-4">
                <h2 className="text-2xl font-semibold">Trip Summary</h2>
                <p className="leading-relaxed text-secondary-foreground">{trip.description}</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Calendar className="size-6" />
                    <div>
                      <p className="font-semibold text-secondary-foreground">Dates</p>
                      <p className="text-sm">
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        <br />
                        {pluralize.withCount(getDaysGap(trip.startDate, trip.endDate), "day")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="size-6" />
                    <div>
                      <p className="font-semibold text-secondary-foreground">Destinations</p>
                      <p className="text-sm">
                        {pluralize.withCount(trip.locations.length, "location")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="h-72 w-full overflow-hidden rounded-lg bg-muted shadow">
                  <MapView itineraries={trip.locations} />
                </div>
                {trip.locations.length === 0 && (
                  <div className="grid justify-items-center gap-2 py-8 text-center">
                    <span className="text-secondary-foreground">
                      Add locations to see them on the map.
                    </span>
                    <Button asChild>
                      <Link href={`/trips/${trip.id}/itinerary/new`}>
                        <Plus className="size-5" /> Add Location
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="itinerary" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Full Itinerary</h2>
            </div>
            {trip.locations.length === 0 ? (
              <div className="grid justify-items-center gap-2 py-8 text-center">
                <span className="text-secondary-foreground">
                  Add locations to see them on the itinerary.
                </span>
                <Button asChild>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Plus className="size-5" /> Add Location
                  </Link>
                </Button>
              </div>
            ) : (
              <SortableItinerary locations={trip.locations} />
            )}
          </TabsContent>
          <TabsContent value="map" className="space-y-6">
            <div className="h-144 overflow-hidden rounded-lg bg-muted shadow">
              <MapView itineraries={trip.locations} />
            </div>
            {trip.locations.length === 0 && (
              <div className="grid justify-items-center gap-2 py-8 text-center">
                <span className="text-secondary-foreground">
                  Add locations to see them on the map.
                </span>
                <Button asChild>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Plus className="size-5" /> Add Location
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Button asChild variant="outline">
        <Link href="/trips">
          <ArrowLeft className="size-5" /> Back to Trips
        </Link>
      </Button>
    </Container>
  );
}
