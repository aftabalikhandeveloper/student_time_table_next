"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, CalendarDays, Home as HomeIcon, TableProperties } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: <HomeIcon className="h-4 w-4" /> },
  { label: "Time Table", href: "/time-table", icon: <CalendarDays className="h-4 w-4" /> },
  { label: "Weekly", href: "/weekly-time-table", icon: <TableProperties className="h-4 w-4" /> },
  { label: "Today", href: "/today-classes", icon: <CalendarDays className="h-4 w-4" /> },
];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar({
  brand = "UNI TRACK",
  items = navItems,
}: {
  brand?: string;
  items?: NavItem[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for pathname-based active link
  useEffect(() => setMounted(true), []);

  // Close drawer on route change
  useEffect(() => {
    if (!mounted) return;
    setOpen(false);
  }, [pathname, mounted]);

  // Prevent background scroll when drawer open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const Active = (href: string) => (mounted ? pathname === href : false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#18171c]/80 backdrop-blur supports-[backdrop-filter]:bg-[#18171c]/60 border-b border-[#2a2a2e]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Left: Mobile menu button */}
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex items-center justify-center rounded-md p-2 text-[#ffffff] hover:text-[#f97316] hover:bg-[#232326] focus:outline-none focus:ring-2 focus:ring-[#f97316] md:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Brand */}
            <Link href="/" className="flex items-center gap-2">
              {/* <div className="h-6 w-6 rounded bg-[#f97316]" /> */}
              <span className="text-white font-extrabold tracking-wide">{brand}</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                    Active(item.href)
                      ? "text-[#18171c] bg-[#f97316]"
                      : "text-[#ffffff] hover:text-[#f97316] hover:bg-[#232326]"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right actions (example notification icon placeholder) */}
            {/* <div className="hidden md:flex items-center">
              <Link
                href="/today-classes"
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-[#ffffff] hover:text-[#18171c] hover:bg-[#f97316] transition-colors"
              >
                <Bell className="h-4 w-4" />
                Alerts
              </Link>
            </div> */}

            {/* Mobile placeholder to balance spacing */}
            <div className="md:hidden w-10" />
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      <div
        className={classNames(
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      {/* Mobile drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
        className={classNames(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#18171c] border-r border-[#2a2a2e] shadow-2xl transform transition-transform md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between px-4 border-b border-[#2a2a2e]">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="h-6 w-6 rounded bg-[#f97316]" />
            <span className="text-white font-extrabold tracking-wide">{brand}</span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            className="rounded-md p-2 text-[#ffffff] hover:text-[#f97316] hover:bg-[#232326] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={classNames(
                "mt-1 flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold",
                Active(item.href) ? "bg-[#232326] text-[#f97316]" : "text-[#ffffff] hover:bg-[#232326]"
              )}
            >
              {/* clone icon with mobile size if provided */}
              {item.icon && <span className="text-[#f97316]">{item.icon}</span>}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
