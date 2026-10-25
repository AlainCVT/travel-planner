import {
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  type LucideIcon,
  Map as MapIcon,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { auth } from "@/auth";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/lib/actions/auth";

const features: Array<{
  icon: LucideIcon;
  title: string;
  text: string;
  color: string;
}> = [
  {
    icon: MapIcon,
    title: "Interactive Maps",
    text: "Visualize your trip with interactive maps. See your entire itinerary at a glance.",
    color: "oklch(62.3% 0.214 259.815)",
  },
  {
    icon: ClockIcon,
    title: "Day-by-Day Itineraries",
    text: "Organize your trip day by day. Never miss a beat with structured planning.",
    color: "oklch(76.9% 0.188 70.08)",
  },
  {
    icon: CalendarIcon,
    title: "Drag & Drop Planning",
    text: "Easily rearrange your itinerary with simple drag and drop functionality.",
    color: "oklch(72.3% 0.219 149.579)",
  },
];

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <main>
      <section className="relative border-b border-b-primary/20 bg-linear-to-b from-background to-primary/5 py-20 md:py-32 dark:to-primary/20">
        <Container className="grid justify-items-center text-center">
          <h1 className="max-w-3xl text-4xl font-bold md:text-6xl">
            Plan your perfect trip, every time
          </h1>
          <p className="mt-6 mb-8 max-w-xl text-lg text-foreground/60 md:text-xl">
            Create itineraries, organize destinations, and share your travel plans all in one place.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            {isLoggedIn ? (
              <Button asChild>
                <Link href="/trips">Check it out</Link>
              </Button>
            ) : (
              <Button onClick={login}>
                Sign in
                <Icon name="Logo/GitHub" />
              </Button>
            )}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="grid gap-12">
          <h2 className="text-center text-3xl font-bold">Plan with confidence</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text, color }, index) => (
              <Card
                className="bg-(--feature-color)/5 ring-(--feature-color)/20"
                key={index}
                style={{ "--feature-color": color } as CSSProperties}
              >
                <CardHeader>
                  <CardTitle className="grid gap-2">
                    <span className="flex size-12 items-center justify-center rounded-full bg-(--feature-color)/10">
                      <Icon className="size-1/2 text-(--feature-color)" />
                    </span>
                    <h3 className="text-xl font-semibold">{title}</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-foreground/60">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="-mb-12 py-16 md:py-24">
        <Container className="container mx-auto px-4 text-center">
          <Card className="py-8">
            <CardHeader>
              <CardTitle>
                <h2 className="text-2xl font-bold md:text-3xl">
                  Ready to plan your next adventure?
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid justify-items-center gap-4">
              <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                Join thousands of travelers who plan better trips with TripPlanner.
              </p>
              {isLoggedIn ? (
                <Button asChild variant="outline">
                  <Link href="/trips">Check it out</Link>
                </Button>
              ) : (
                <Button variant="outline" onClick={login}>
                  Sign in
                </Button>
              )}
            </CardContent>
          </Card>
        </Container>
      </section>
    </main>
  );
}
