import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { clsx } from "cn";
import { useId, useState } from "react";

import type { Location } from "@/app/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reorderItinerary } from "@/lib/actions/reorder-itineraty";

type Props = {
  locations: Location[];
};

function SortableItem({ item }: { item: Location }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={clsx(
        "transition-colors hover:bg-secondary/80 active:bg-card",
        isDragging ? "cursor-grabbing" : "cursor-grab",
      )}
    >
      <CardHeader>
        <CardTitle>
          <h4 className="font-semibold">{item.title}</h4>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>
          <strong>Latitude:</strong> {item.lat}
        </p>
        <p>
          <strong>Longitude:</strong> {item.lng}
        </p>
      </CardContent>
    </Card>
  );
}

export default function SortableItinerary({ locations }: Props) {
  const [currentLocations, setCurrentLocations] = useState<Location[]>(locations);
  const id = useId();

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = currentLocations.findIndex((item) => item.id === active.id);
      const newIndex = currentLocations.findIndex((item) => item.id === over!.id);

      const newLocationsOrder = arrayMove(currentLocations, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          order: index,
        }),
      );

      setCurrentLocations(newLocationsOrder);

      await reorderItinerary(newLocationsOrder.map((item) => item.id));
    }
  };

  return (
    <DndContext id={id} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={currentLocations.map(({ id }) => id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {currentLocations.map((item, key) => (
            <SortableItem key={key} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
