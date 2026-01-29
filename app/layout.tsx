import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const navigationItems = [
  { href: "/lehrpersonen", label: "Lehrpersonen" },
  { href: "/abwesenheiten", label: "Abwesenheiten" },
  { href: "/vertretungen-erzeugen", label: "Vertretungen erzeugen" },
  { href: "/historie", label: "Historie" },
  { href: "/druckansicht", label: "Druckansicht" },
  { href: "/admin-demo-reset", label: "Admin (Demo-Reset)" }
];

export const metadata: Metadata = {
  title: "Vertretungsplan Demo",
  description: "Minimale Demo-Oberfläche für Vertretungsplanung"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <header>
          <h1>Vertretungsplan Demo</h1>
          <nav aria-label="Hauptnavigation">
            <ul>
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
