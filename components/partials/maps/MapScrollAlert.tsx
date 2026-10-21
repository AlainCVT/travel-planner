import clsx from "clsx";

import { isMac } from "@/utils/navigator";

type Props = {
  shouldAlertScroll: boolean;
};

export default function MapScrollAlert({ shouldAlertScroll }: Props) {
  return (
    <div
      className={clsx(
        "pointer-events-none absolute inset-0 flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm transition-opacity duration-400",
        {
          "opacity-0": !shouldAlertScroll,
        },
      )}
    >
      <span className="text-center">
        Use{" "}
        <span className="mx-1 rounded-sm border border-border bg-background px-1 py-0.5 text-muted-foreground">
          {isMac() ? "⌘" : "Ctrl"}
        </span>{" "}
        + scroll to zoom the map
      </span>
    </div>
  );
}
