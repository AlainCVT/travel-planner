"use client";

import { Loader2, Trash } from "lucide-react";
import Image from "next/image";
import { type SubmitEvent, useState } from "react";

import Container from "@/components/Container";
import DateField from "@/components/forms/DateField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTrip, type CreateTripErrors } from "@/lib/actions/create-trip";
import { deleteImage } from "@/lib/actions/delete-image";
import { UploadDropzone } from "@/lib/uploadthing";

export default function TripsNewPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState<CreateTripErrors>({});
  const [isPending, setIsPending] = useState<boolean>(false);
  const [image, setImage] = useState<{ name: string; extension?: string; url: string } | null>(
    null,
  );

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setIsPending(true);

    try {
      const formData = new FormData(event.currentTarget);

      if (image) {
        formData.append("image", image.url);
      }

      await createTrip(formData);
    } catch (error) {
      setErrors(error instanceof Error ? (error.cause as CreateTripErrors) : {});
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Container className="py-8">
      <Card className="mx-auto w-lg">
        <CardHeader>
          <CardTitle>Add a new trip</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Field>
              <FieldLabel htmlFor="input-field-title">Title</FieldLabel>
              <Input
                id="input-field-title"
                name="title"
                type="text"
                placeholder={`e.g. Japan ${new Date().getFullYear() + 1}`}
                required
              />
              {errors?.["title"] && (
                <p role="alert" className="text-xs text-destructive">
                  {errors["title"]}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="textarea-description">Description</FieldLabel>
              <Textarea
                id="textarea-description"
                name="description"
                placeholder="e.g. 4 days in Tokyo, 2 days in Kyoto and 3 days in Osaka"
                required
              />
              {errors?.["description"] && (
                <p role="alert" className="text-xs text-destructive">
                  {errors["description"]}
                </p>
              )}
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <DateField
                date={startDate}
                setDate={(date) => {
                  setStartDate(date);
                  if (date && endDate && date > endDate) setEndDate(date);
                }}
                label="Start Date"
                name="startDate"
                error={errors?.["start-date"]}
                disabled={{ before: new Date() }}
              />
              <DateField
                date={endDate}
                setDate={setEndDate}
                label="End Date"
                name="endDate"
                error={errors?.["end-date"]}
                disabled={{ before: startDate || new Date() }}
              />
            </div>
            <Field>
              <FieldLabel>Trip Image</FieldLabel>
              <UploadDropzone
                appearance={{
                  container: "group cursor-pointer mt-0! dark:border-border",
                  button:
                    "ut-readying:bg-primary/80 ut-ready:bg-primary ut-uploading:bg-primary/80 after:bg-primary after:opacity-0 ut-uploading:after:opacity-100 text-xs h-8! focus-within:ring-primary!",
                  label: "group-hover:text-primary hover:text-primary",
                }}
                endpoint="imageUploader"
                config={{ mode: "auto" }}
                onClientUploadComplete={async (res) => {
                  if (res && res[0].ufsUrl) {
                    if (image?.url) {
                      await deleteImage(image.url);
                    }

                    const { name: filename, ufsUrl: url } = res[0];
                    const [name, extension] = filename.split(".");
                    setImage({ name, extension, url });
                  }
                }}
                onUploadError={(error) => {
                  console.error("Upload error:", error);
                }}
              />
              {image && (
                <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
                  <div className="flex items-center gap-4 overflow-hidden font-semibold text-muted-foreground">
                    <Image
                      src={image.url}
                      alt={image.name}
                      className="size-12 shrink-0 rounded-md object-cover"
                      width={640}
                      height={640}
                      draggable={false}
                    />
                    <span className="flex justify-start overflow-hidden">
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {image.name}
                      </span>
                      {image.extension && <span className="shrink-0">.{image.extension}</span>}
                    </span>
                  </div>
                  <Button
                    type="button"
                    aria-label="Delete image"
                    size="icon"
                    variant="destructive"
                    onClick={async () => {
                      setImage(null);
                      await deleteImage(image.url);
                    }}
                  >
                    <Trash />
                  </Button>
                </div>
              )}
            </Field>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "Create Trip"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
