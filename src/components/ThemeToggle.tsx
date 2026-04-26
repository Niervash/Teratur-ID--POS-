import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  large?: boolean;
}

export const ThemeToggle = ({ large = false }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div 
      className="flex items-center gap-2 cursor-pointer select-none group"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <div className={`relative ${large ? 'w-12 h-6' : 'w-10 h-5'} rounded-full transition-colors duration-300 flex items-center ${isDark ? 'bg-primary' : 'bg-muted-foreground/20'}`}>
        <div 
          className={`absolute ${large ? 'w-5 h-5' : 'w-4 h-4'} bg-white rounded-full shadow-sm transition-transform duration-300 flex items-center justify-center ${isDark ? (large ? 'translate-x-[25px]' : 'translate-x-[22px]') : 'translate-x-[2px]'}`}
        >
          {isDark ? (
            <Moon className={`${large ? 'w-3 h-3' : 'w-2.5 h-2.5'} text-primary`} strokeWidth={3} />
          ) : (
            <Sun className={`${large ? 'w-3 h-3' : 'w-2.5 h-2.5'} text-amber-500`} strokeWidth={3} />
          )}
        </div>
      </div>
      <span className={`${large ? 'text-xs' : 'text-[10px]'} font-bold text-muted-foreground uppercase tracking-wider hidden lg:block group-hover:text-primary transition-colors`}>
        {isDark ? 'Dark' : 'Light'}
      </span>
    </div>
  );
};
