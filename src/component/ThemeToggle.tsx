import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react"; // يمكنك استخدام أي أيقونة أو SVG

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // استعادة الوضع من localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  // تبديل الثيم
  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-2 left-2 p-2 rounded-full border border-border dark:border-dark-border bg-card dark:bg-dark-card text-primary dark:text-dark-accent transition-all duration-500 shadow hover:scale-110"
      title="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
