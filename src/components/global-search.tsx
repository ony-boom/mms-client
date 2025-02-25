import { Badge } from "./ui/badge";
import { QueryField, useFilterStore } from "@/stores";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import { ChangeEvent, FormEvent, useEffect } from "react";

export function GlobalSearch() {
  const {
    query,
    setQuery,
    setOpenSearchComponent,
    setQueryField,
    queryField,
    openSearchComponent,
  } = useFilterStore();

  const inputVal = queryField === "*" ? query?.title : query?.[queryField];

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (queryField === "*") {
      setQuery({ title: event.target.value });
      return;
    }
    setQuery({ [queryField]: event.target.value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpenSearchComponent(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "f" && e.ctrlKey) {
        setOpenSearchComponent(true);
        e.preventDefault();
      }
      if (e.key === "Escape") {
        setOpenSearchComponent(false);
      }
    });
  }, [setOpenSearchComponent]);

  const onBadgeClick = (field: string) => {
    if (field === queryField) {
      setQueryField("*");
      setQuery({ [queryField]: "" });
    } else {
      setQueryField(field as QueryField);
    }
  };

  return (
    <AnimatePresence>
      {openSearchComponent && (
        <motion.div
          layout
          aria-modal
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-background/60 fixed top-0 left-0 z-[60] grid h-full w-full justify-center"
          onClick={() => setOpenSearchComponent(false)}
        >
          <form
            onSubmit={handleSubmit}
            className="with-blur mt-32 h-max overflow-hidden rounded-md"
          >
            <Input
              autoFocus
              value={inputVal ?? ""}
              onChange={handleInputChange}
              placeholder="Search..."
              className="border-b-foreground/10 focus-visible:border-b-foreground/30 h-12 min-w-xl rounded-none focus-visible:ring-0"
              onClick={(e) => e.stopPropagation()}
            />

            <div
              className="flex gap-2 px-2 py-4"
              onClick={(e) => e.stopPropagation()}
            >
              {searchField.map((field) => (
                <Badge
                  key={field.value}
                  onClick={() => onBadgeClick(field.value)}
                  variant={queryField === field.value ? "default" : "outline"}
                >
                  {field.label}
                </Badge>
              ))}
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const searchField = [
  {
    label: "Artist",
    value: "artistName",
  },
  {
    label: "Album",
    value: "albumTitle",
  },
];
