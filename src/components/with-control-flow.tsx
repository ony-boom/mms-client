import { ReactNode, useEffect } from "react";
import { useColorFlow, useTheme } from "@/hooks";
import { hexFromArgb } from "@material/material-color-utilities";

function setCssVar(vars: string, value: string): void;
function setCssVar(vars: Record<string, string>): void;
function setCssVar(
  vars: string | Record<string, string>,
  value?: string,
): void {
  if (typeof vars === "string") {
    document.documentElement.style.setProperty(vars, value!);
  } else {
    Object.entries(vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
}
export function WithColorFlow({ children }: { children: ReactNode }) {
  const colorFlow = useColorFlow();
  const { theme } = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";

  useEffect(() => {
    if (!colorFlow) return;
    const color = colorFlow.schemes[currentTheme];

    setCssVar({
      "--color-background": hexFromArgb(color.background),
      "--color-foreground": hexFromArgb(color.onBackground),
      "--color-primary": hexFromArgb(color.primary),
      "--color-accent": hexFromArgb(color.tertiary),
      "--color-destructive": hexFromArgb(color.error),
      "--color-accent-foreground": hexFromArgb(color.onTertiary),
      "--color-popover": hexFromArgb(color.background),
      "--color-popover-foreground": hexFromArgb(color.onBackground),
      "--color-secondary": hexFromArgb(color.secondaryContainer),
      "--color-primary-foreground": hexFromArgb(color.onPrimary),
      "--color-secondary-foreground": hexFromArgb(color.onSecondaryContainer),
    });
  }, [colorFlow, currentTheme]);

  return <>{children}</>;
}
