import { Sort } from "../sort";
import { Button } from "../ui/button";
import { Shuffle } from "lucide-react";
import { usePlaylist } from "@/hooks";
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Search } from "lucide-react";
import { SortOrder, TrackSortField } from "@/api";
import { useFilterStore, usePlayerStore } from "@/stores";
// import { ModeToggle } from "../mode-toggle";

export function Extra() {
  const { resetPlaylist } = usePlaylist();
  const { setSort, sort } = useFilterStore();
  const { setOpenSearchComponent } = useFilterStore();
  const { toggleShuffle, playTrackAtIndex } = usePlayerStore();
  const [openExtra, setOpenExtra] = useState(false);

  const handleExtraClick = () => {
    setOpenExtra((old) => !old);
  };

  const onTrackSortChange = (value: TrackSortField, direction: SortOrder) => {
    setSort({ field: value, order: direction });
  };

  const handleShuffle = useCallback(() => {
    resetPlaylist();
    toggleShuffle(true, true);
    playTrackAtIndex(0);
  }, [resetPlaylist, toggleShuffle, playTrackAtIndex]);

  const handleSearchClick = () => {
    setOpenSearchComponent(true);
  };

  return (
    <motion.div className="relative flex w-full justify-end gap-2 overflow-hidden rounded-md">
      <AnimatePresence>
        {openExtra && (
          <motion.div
            className="absolute right-12 flex gap-2"
            initial={{ translateX: "100%" }}
            animate={{ translateX: "0%" }}
            exit={{ translateX: "120%" }}
          >
            <Sort
              onValueChange={onTrackSortChange}
              value={
                sort ?? { order: SortOrder.ASC, field: TrackSortField.NONE }
              }
            />
            <Button onClick={handleShuffle}>
              Shuffle
              <Shuffle />
            </Button>

            <Button onClick={handleSearchClick} size={"icon"}>
              <Search />
            </Button>

            {/*<ModeToggle />*/}
          </motion.div>
        )}
      </AnimatePresence>

      <Button size="icon" className="z-10" onClick={handleExtraClick}>
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: openExtra ? 45 : 0 }}
        >
          <Plus />
        </motion.span>
      </Button>
    </motion.div>
  );
}
