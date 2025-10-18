"use client";

import { useState, useEffect } from "react";

export default function NotificationButton() {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);

  // Initialize permission only on client
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("Notifications are not supported in this browser!");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const sendNotification = () => {
    if (!("Notification" in window)) {
      alert("Notifications are not supported in this browser!");
      return;
    }

    if (permission === "granted") {
      const notification = new Notification("🚀 Hello from Next.js!", {
        body: "This is a sample notification",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/badge-72x72.png",
        data: { id: 1, message: "Next.js test", url: "/dashboard" }, // Optional metadata
      });

      notification.onclick = function (event) {
        event.preventDefault(); // Prevent default browser behavior
        window.focus(); // Bring your tab to front if minimized
        // open url based on notification data
        window.location.href = notification.data.url; // Navigate to desired route
      };
    } else {
      alert("You need to allow notifications first!");
    }
  };


  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      {permission !== "granted" && (
        <button
          onClick={requestPermission}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Enable Notifications
        </button>
      )}
      <button
        onClick={sendNotification}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Send Test Notification
      </button>
    </div>
  );
}
