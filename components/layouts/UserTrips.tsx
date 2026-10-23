"use client";

import Link from "next/link";

import type { Trip } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/contexts/locale";

type Props = {
  trips: Trip[];
};

export default function UserTrips({ trips }: Props) {
  const { formatDate } = useLocale();

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Your Recent Trips</h2>
      {trips.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-8">
            <h3 className="text-xl font-medium"> No trips yet.</h3>
            <p className="mb-2 max-w-md text-center">
              Start planning your adventure by creating your first trip.
            </p>
            <Button asChild>
              <Link href="/trips/new">Create Trip</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTrips.slice(0, 6).map((trip, key) => (
            <Link key={key} href={`/trips/${trip.id}`}>
              <Card className="h-full transition-colors hover:bg-secondary/80 active:bg-card">
                <CardHeader>
                  <CardTitle className="line-clamp-1 font-semibold">{trip.title}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <p className="line-clamp-2 text-sm">{trip.description}</p>
                  <div className="text-sm">
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
