"use client";

import { useEffect, useState } from "react";
import { AnnouncementBar } from "./announcement-bar";
import { Navbar } from "./navbar";
import { MobileMenu } from "./mobile-menu";

const DISMISS_KEY = "gn-announcement-dismissed";

export function SiteHeader() {
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") {
        setAnnouncementVisible(false);
      }
    } catch {
      // ignore storage access issues (private browsing, etc.)
    }
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 4);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function dismissAnnouncement() {
    setAnnouncementVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  return (
    <header className="sticky top-0 z-40">
      {announcementVisible && <AnnouncementBar onClose={dismissAnnouncement} />}
      <div
        className={`bg-gn-black/90 backdrop-blur-md transition-shadow duration-200 ${
          scrolled ? "shadow-[0_1px_0_0_rgba(255,255,255,0.08)]" : ""
        }`}
      >
        <Navbar onOpenMobileMenu={() => setMobileOpen(true)} />
      </div>

      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
    </header>
  );
}
