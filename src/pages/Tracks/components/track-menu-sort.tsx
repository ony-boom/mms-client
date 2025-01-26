import * as React from "react";
import { Check, SortAsc } from "lucide-react";

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
import { TrackSortField } from "@/api";

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          size={"sm"}
          aria-expanded={open}
          className="justify-between rounded-full"
        >
          {value
            ? sortFields.find((framework) => framework.value === value)?.label
            : "Sort by"}
          <SortAsc className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
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
                    onValueChange(
                      (currentValue === value
                        ? ""
                        : currentValue) as TrackSortField,
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0",
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
  value?: TrackSortField;
  onValueChange: (value: TrackSortField) => void;
};
