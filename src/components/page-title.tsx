import { ReactNode } from "react";

export function PageTitle({
  title,
  menu,
}: {
  title: ReactNode;
  menu?: ReactNode;
}) {
  return (
    <nav className="bg-background/[95%] backdrop-blur sticky top-0 z-10 py-3 flex justify-between items-center">
      <h1 className="text-primary font-bold text-lg">{title}</h1>

      {menu && menu}
    </nav>
  );
}
