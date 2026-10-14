"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteImage(imageUrl: string) {
  const key = new URL(imageUrl).pathname.split("/").pop();

  if (!key) throw new Error("Image key not found.");

  await utapi.deleteFiles(key);
}
