"use client";
import { useEffect } from "react";
import { timetable } from "@/data/timetabledata";

type DayKey = keyof typeof timetable;

function getTodayKey(): DayKey | null {
  const name = new Date().toLocaleDateString("en-US", { weekday: "long" }) as string;
  return (Object.keys(timetable) as DayKey[]).includes(name as DayKey) ? (name as DayKey) : null;
}

function parseFromTo(from_to: string): { start: Date; end: Date } | null {
  const [startStr, endStr] = from_to.split(" to ");
  const toDate = (s: string) => {
    const m = s.match(/(\d+):(\d+)\s(AM|PM)/);
    if (!m) return null;
    const [, hh, mm, ap] = m;
    const d = new Date();
    d.setSeconds(0, 0);
    d.setHours((parseInt(hh) % 12) + (ap === "PM" ? 12 : 0), parseInt(mm), 0, 0);
    return d;
  };
  const start = toDate(startStr);
  const end = toDate(endStr);
  if (!start || !end) return null;
  return { start, end };
}

export default function PWARegister() {
  useEffect(() => {
    // Register service worker
    if (typeof window === "undefined") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Ask for notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Schedule notifications for today's classes when tab is open
    const day = getTodayKey();
    if (!day) return;
    const raw = timetable[day].filter((c): c is NonNullable<typeof c> => c !== null);

    const timers: number[] = [];
    const now = Date.now();

    const post = (title: string, body: string, tag: string) => {
      if (!navigator.serviceWorker.controller) return;
      navigator.serviceWorker.controller.postMessage({
        type: "SHOW_NOTIFICATION",
        payload: { title, body, tag },
      });
    };

    for (const cls of raw) {
      const parsed = parseFromTo(cls.from_to);
      if (!parsed) continue;
      const { start, end } = parsed;
      const msToStart = start.getTime() - now;
      const msToEnd = end.getTime() - now;

      // Only schedule future notifications this session
      if (msToStart > 0) {
        timers.push(
          window.setTimeout(() => {
            post("Class started", `${cls.subject} with ${cls.teacher} @ ${cls.room}`, `${day}-${cls.from_to}-start`);
          }, msToStart)
        );
      }
      if (msToEnd > 0) {
        timers.push(
          window.setTimeout(() => {
            post("Class ended", `${cls.subject} finished.`, `${day}-${cls.from_to}-end`);
          }, msToEnd)
        );
      }
    }

    return () => {
      for (const id of timers) clearTimeout(id);
    };
  }, []);

  return null;
}
