"use client";

import { format } from "date-fns";
import {
  type ComponentProps,
  Dispatch,
  type ReactElement,
  SetStateAction,
  useId,
  useState,
} from "react";
import { DayPicker } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = ComponentProps<typeof DayPicker> & {
  date: Date | undefined;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
  label: ReactElement | string;
  placeholder?: ReactElement | string;
  name: string;
  error?: string;
};

export default function DateField({
  date,
  setDate,
  label,
  placeholder,
  name,
  error,
  ...props
}: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const id = useId();

  return (
    <Field className="mx-auto">
      <FieldLabel htmlFor={`date-${id}`}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" id={`date-${id}`} className="justify-start font-normal">
            {date ? date.toLocaleDateString() : (placeholder ?? "Select date")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            {...props}
            mode="single"
            selected={date}
            defaultMonth={date}
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
            required
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
      <input type="hidden" value={date ? format(date, "yyyy-MM-dd") : ""} name={name} />
    </Field>
  );
}
