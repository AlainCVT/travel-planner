"use client";

import { Loader2 } from "lucide-react";
import { SubmitEvent, useState } from "react";

import Container from "@/components/Container";
import DateField from "@/components/forms/DateField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTrip, CreateTripErrors } from "@/lib/actions/create-trip";

export default function TripsNewPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState<CreateTripErrors>({});
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setIsPending(true);

    try {
      await createTrip(new FormData(event.currentTarget));
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
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "Create Trip"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
