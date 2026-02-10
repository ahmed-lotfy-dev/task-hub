import { useState, useEffect } from "react";
import { Monitor, Type, Moon, Sun, Laptop, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

type FontOption = {
  id: string;
  name: string;
  family: string;
  description: string;
  googleFont: string;
};

const fontOptions: FontOption[] = [
  {
    id: "inter",
    name: "Inter",
    family: "Inter, system-ui, sans-serif",
    description: "Clean and modern - perfect for productivity",
    googleFont: "Inter",
  },
  {
    id: "geist",
    name: "Geist",
    family: "Geist, system-ui, sans-serif",
    description: "Vercel's technical font - crisp and professional",
    googleFont: "Geist",
  },
  {
    id: "manrope",
    name: "Manrope",
    family: "Manrope, system-ui, sans-serif",
    description: "Friendly geometric sans - warm and approachable",
    googleFont: "Manrope",
  },
  {
    id: "dm-sans",
    name: "DM Sans",
    family: "DM Sans, system-ui, sans-serif",
    description: "Google's modern grotesque - highly readable",
    googleFont: "DM+Sans",
  },
  {
    id: "plus-jakarta",
    name: "Plus Jakarta Sans",
    family: "Plus Jakarta Sans, system-ui, sans-serif",
    description: "Indonesian-inspired - unique and fresh",
    googleFont: "Plus+Jakarta+Sans",
  },
];

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [selectedFont, setSelectedFont] = useState<string>("manrope");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedFont = localStorage.getItem("taskhub-font") || "manrope";
    setSelectedFont(savedFont);
    applyFont(savedFont);
  }, []);

  const applyFont = (fontId: string) => {
    const font = fontOptions.find((f) => f.id === fontId);
    if (font) {
      document.documentElement.style.setProperty("--font-sans", font.family);
      document.body.style.fontFamily = font.family;
      
      // Load font from Google Fonts if needed
      const existingLink = document.getElementById("dynamic-font");
      if (existingLink) {
        existingLink.remove();
      }
      
      if (fontId !== "manrope") {
        const link = document.createElement("link");
        link.id = "dynamic-font";
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}:wght@300;400;500;600;700&display=swap`;
        document.head.appendChild(link);
      }
    }
  };

  const handleFontChange = (fontId: string) => {
    setSelectedFont(fontId);
    localStorage.setItem("taskhub-font", fontId);
    applyFont(fontId);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Theme Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Theme
          </CardTitle>
          <CardDescription>
            Choose your preferred color theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              className={cn(
                "flex flex-col items-center gap-2 h-auto py-4",
                theme === "light" && "ring-2 ring-primary"
              )}
              onClick={() => setTheme("light")}
            >
              <Sun className="w-6 h-6" />
              <span className="text-sm font-medium">Light</span>
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              className={cn(
                "flex flex-col items-center gap-2 h-auto py-4",
                theme === "dark" && "ring-2 ring-primary"
              )}
              onClick={() => setTheme("dark")}
            >
              <Moon className="w-6 h-6" />
              <span className="text-sm font-medium">Dark</span>
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              className={cn(
                "flex flex-col items-center gap-2 h-auto py-4",
                theme === "system" && "ring-2 ring-primary"
              )}
              onClick={() => setTheme("system")}
            >
              <Laptop className="w-6 h-6" />
              <span className="text-sm font-medium">System</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Font Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Font Style
          </CardTitle>
          <CardDescription>
            Select a font that suits your reading preference
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {fontOptions.map((font) => (
              <button
                key={font.id}
                onClick={() => handleFontChange(font.id)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border-2 text-left transition-all",
                  "hover:border-primary/50 hover:bg-muted/50",
                  selectedFont === font.id
                    ? "border-primary bg-primary/5"
                    : "border-muted bg-card"
                )}
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-foreground">
                    {font.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {font.description}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-2xl text-muted-foreground"
                    style={{ fontFamily: font.family }}
                  >
                    Aa
                  </span>
                  {selectedFont === font.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
