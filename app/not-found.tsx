import Link from "next/link";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[calc(100vh-5.375rem)] flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mb-4 text-lg font-semibold">Not Found</p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </Container>
  );
}
