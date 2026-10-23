"use client";

import { config, geocoding, type GeocodingFeature } from "@maptiler/client";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldLabel } from "@/components/ui/field";
import { addLocation } from "@/lib/actions/add-location";

config.apiKey = process.env.MAPTILER_KEY!;

type Props = {
  id: string;
};

export default function NewLocation({ id }: Props) {
  const [currentGeocode, setCurrentGeocode] = useState<GeocodingFeature | null>(null);
  const [suggestions, setSuggestions] = useState<GeocodingFeature[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const [isPending, startTransition] = useTransition();

  const search = useDebouncedCallback(async (value: string) => {
    if (value.length < 2) {
      return;
    }

    const result = await geocoding.forward(value);
    setSuggestions(result.features);
  }, 500);

  return (
    <Container className="flex min-h-[calc(100vh-5.375rem)] items-center justify-center">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              <h1>Add New Location</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-6"
              action={(formData) => {
                startTransition(() => {
                  addLocation(formData, id, currentGeocode);
                });
              }}
            >
              <Field>
                <FieldLabel htmlFor="input-field-address">Address</FieldLabel>
                <Combobox
                  items={suggestions}
                  open={isFocused && suggestions.length > 0}
                  filter={null}
                  onInputValueChange={(value) => {
                    if (value.length < 2) {
                      setCurrentGeocode(null);
                      setSuggestions([]);
                    }
                    search(value);
                  }}
                >
                  <ComboboxInput
                    id="input-field-address"
                    name="address"
                    showTrigger={false}
                    showClear
                    onFocus={(event) => {
                      setIsFocused(true);
                      search(event.target.value);
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                    }}
                  />
                  {!!suggestions.length && (
                    <ComboboxContent>
                      <ComboboxList>
                        {(item: GeocodingFeature, index) => (
                          <ComboboxItem
                            key={index}
                            value={item.place_name}
                            onClick={() => {
                              setCurrentGeocode(item);
                              setIsFocused(false);
                            }}
                          >
                            {item.place_name}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  )}
                </Combobox>
              </Field>
              <Button type="submit" className="w-full" disabled={isPending || !currentGeocode}>
                {isPending ? <Loader2 className="animate-spin" /> : "Add Location"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
