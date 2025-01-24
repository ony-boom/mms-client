import { HTMLProps } from "react";
import { cn } from "@/lib/utils.ts";

export function Player({ className, ...rest }: PlayerProps) {
  return (
    <div className={cn("bg-background py-4", className)} {...rest}>
      text
    </div>
  );
}

export type PlayerProps = HTMLProps<HTMLDivElement> & {};
