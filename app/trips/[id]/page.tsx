import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import TripDetail from "@/components/layouts/TripDetail";
import { prisma } from "@/lib/prisma";

export default async function TripsIDPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  const trip = await prisma.trip.findFirst({
    where: { id, userId: session.user?.id },
    include: { locations: true },
  });

  if (!trip) {
    return notFound();
  }

  return <TripDetail trip={trip} />;
}
