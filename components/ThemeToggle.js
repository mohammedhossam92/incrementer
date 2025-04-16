"use client"; // Required for hooks
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  // Destructure resolvedTheme to know the *actual* applied theme (handles 'system')
  const { theme, setTheme, resolvedTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render nothing on the server or until mounted on the client
  if (!mounted) {
    return null;
  }

  // Remove the nested ThemeToggle function as it's not needed
  // and replace the toggleTheme reference with an inline function

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="theme-toggle-btn" // Ensure this class exists in your CSS
      aria-label="Toggle Dark Mode"
    >
      {/* Display the correct icon/text based on the resolved theme */}
      {resolvedTheme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}