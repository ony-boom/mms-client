import * as React from "react";
import { MouseEventHandler } from "react";
import { Check, SortAsc, SortDesc } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SortOrder, TrackSortField } from "@/api";

const sortFields = [
  {
    value: TrackSortField.TITLE,
    label: "Title",
  },
  {
    value: TrackSortField.DATE_ADDED,
    label: "Date Added",
  },
  {
    value: TrackSortField.ALBUM_TITLE,
    label: "Album Title",
  },
  {
    value: TrackSortField.NONE,
    label: "None",
  },
];

export function TrackMenuSort({ value, onValueChange }: TrackMenuSortProps) {
  const [open, setOpen] = React.useState(false);

  const handleSortDirectionChange: MouseEventHandler<HTMLButtonElement> = (
    e,
  ) => {
    e.stopPropagation();
    onValueChange(
      value.field ?? TrackSortField.NONE,
      value.direction === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC,
    );
  };

  const getSortFieldLabel = (field: TrackSortField) => {
    const sortField = sortFields.find((f) => f.value === field);
    if (!sortField || sortField.value === TrackSortField.NONE) return "Sort by";
    return sortField.label;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="bg-primary group hover:bg-primary/90 flex items-center overflow-hidden rounded-full">
          <Button
            role="combobox"
            size={"sm"}
            aria-expanded={open}
            className="justify-between rounded-full bg-transparent"
          >
            {getSortFieldLabel(value.field)}
          </Button>

          <Button
            onClick={handleSortDirectionChange}
            size={"sm"}
            title={value.direction === SortOrder.ASC ? "Sort Desc" : "Sort Asc"}
            disabled={value?.field === TrackSortField.NONE}
            className="rounded-full bg-transparent"
          >
            {value.direction === SortOrder.ASC ? <SortAsc /> : <SortDesc />}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="mt-2 w-max p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {sortFields.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value ?? ""}
                  className="w-full flex-row-reverse justify-between gap-2"
                  onSelect={(currentValue) => {
                    const realValue =
                      currentValue === value.field
                        ? TrackSortField.NONE
                        : (currentValue as TrackSortField);
                    onValueChange(realValue as TrackSortField, value.direction);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.field === framework.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export type TrackMenuSortProps = {
  value: {
    field: TrackSortField;
    direction: SortOrder;
  };
  onValueChange: (value: TrackSortField, direction: SortOrder) => void;
};
