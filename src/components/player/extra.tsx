import { Settings2 as ExtraIcon } from "lucide-react";
import { Button } from "../ui/button";

export function Extra() {
  return (
    <div className="flex">
      <Button size={"icon"}>
        <ExtraIcon />
      </Button>
    </div>
  );
}
