import { ReactNode } from "react";

export function PageTitle({
  title,
  menu,
}: {
  title: ReactNode;
  menu?: ReactNode;
}) {
  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between bg-background py-3">
      <h1 className="text-lg font-bold text-primary">{title}</h1>

      {menu && menu}
    </nav>
  );
}
