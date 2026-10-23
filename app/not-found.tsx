import Link from "next/link";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex h-full flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mb-4 text-lg font-semibold">Not Found</p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </Container>
  );
}
