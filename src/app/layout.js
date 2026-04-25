import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Native Garden App",
  description: "Native gardening social platform"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
