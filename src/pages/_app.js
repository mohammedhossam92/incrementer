import { ThemeProvider } from "next-themes";
import "../styles/globals.css"; // Ensure this path is correct

export default function App({ Component, pageProps }) {
  return (
    // Ensure attribute="class" is present
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}