import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";

export default async function TripsPage() {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  return (
    <Container className="space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/trips/new">New Trip</Link>
        </Button>
      </div>
    </Container>
  );
}
