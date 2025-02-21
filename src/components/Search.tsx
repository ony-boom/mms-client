import { useFilterStore } from "@/stores";
import { AnimatePresence, motion } from "motion/react";
import { ChangeEvent, FormEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks";

export function Search() {
  const { query, setQuery, setOpenSearchComponent, openSearchComponent } =
    useFilterStore();
  const debouncedValue = useDebounce(query?.title, 500);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery({ title: event.target.value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpenSearchComponent(false);
  };

  useEffect(() => {
    setQuery({ title: debouncedValue });
  }, [debouncedValue, setQuery]);

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

  return (
    <AnimatePresence>
      {openSearchComponent && (
        <motion.div
          layout
          aria-modal
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-background/80 fixed top-0 left-0 z-[60] grid h-full w-full justify-center"
          onClick={() => setOpenSearchComponent(false)}
        >
          <form onSubmit={handleSubmit}>
            <Input
              autoFocus
              value={query?.title || ""}
              onChange={handleInputChange}
              placeholder="Search..."
              className="with-blur mt-32 h-12 min-w-xl rounded"
              onClick={(e) => e.stopPropagation()}
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
