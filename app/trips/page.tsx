import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Container from "@/components/Container";
import UserTrips from "@/components/layouts/UserTrips";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { pluralize } from "@/utils/string";

export default async function TripsPage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  const trips = await prisma.trip.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const upcomingTrips = trips.filter((trip) => new Date(trip.startDate) >= today);

  return (
    <Container className="space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/trips/new">New Trip</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Welcome back, {session.user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {trips.length === 0 ? (
              <>Start planning your first trip.</>
            ) : (
              <>
                You have {pluralize.withCount(trips.length, "trip")} planned including upcoming{" "}
                {pluralize.withCount(upcomingTrips.length, "trip")}.
              </>
            )}
          </p>
        </CardContent>
      </Card>
      <UserTrips trips={trips} />
    </Container>
  );
}
