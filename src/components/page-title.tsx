import { ReactNode } from "react";

export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-primary font-bold text-lg">{children}</h1>;
}
