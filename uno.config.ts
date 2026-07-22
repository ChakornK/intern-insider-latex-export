import { defineConfig, presetWind4, transformerDirectives } from "unocss";

export default defineConfig({
  content: {
    filesystem: ["**/*.{js,ts,jsx,tsx}"],
  },
  presets: [presetWind4()],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      "background": "#ffffff",
      "foreground": "#0a0a0a",
      "card": "#ffffff",
      "card-foreground": "#0a0a0a",
      "popover": "#ffffff",
      "popover-foreground": "#0a0a0a",
      "primary": "#5048e5",
      "primary-foreground": "#fafafa",
      "secondary": "#f5f5f5",
      "secondary-foreground": "#171717",
      "muted": "#f5f5f5",
      "muted-foreground": "hsl(0 0% 45.1%)",
      "accent": "#f5f5f5",
      "accent-foreground": "#171717",
      "destructive": "#ef4444",
      "destructive-foreground": "#fafafa",
      "border": "#e5e5e5",
      "input": "#e5e5e5",
    },
  },
});
