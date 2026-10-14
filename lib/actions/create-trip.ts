"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type CreateTripErrors = Partial<
  Record<"title" | "description" | "start-date" | "end-date", string>
>;

export async function createTrip(formData: FormData) {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("You must be signed in to create a trip.");
  }

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const image = formData.get("image")?.toString();
  const startDate = formData.get("startDate")?.toString();
  const endDate = formData.get("endDate")?.toString();

  const causes: CreateTripErrors = {};

  if (!title || !description || !startDate || !endDate) {
    if (!title) {
      causes["title"] = "Title is required.";
    }

    if (!description) {
      causes["description"] = "Description is required.";
    }

    if (!startDate) {
      causes["start-date"] = "Start date is required.";
    }

    if (!endDate) {
      causes["end-date"] = "End date is required.";
    }

    const error = new Error();
    error.name = "all";
    error.message = "All fields are required.";
    error.cause = causes;
    throw error;
  }

  await prisma.trip.create({
    data: {
      title,
      description,
      image,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId: session.user.id,
    },
  });

  redirect("/trips");
}
