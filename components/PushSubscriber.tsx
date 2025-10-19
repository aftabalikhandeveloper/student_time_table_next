"use client";
import { useEffect } from "react";

// Helper to convert base64 string to Uint8Array for VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushSubscriber() {
  useEffect(() => {
    async function setupPush() {
      if (typeof window === "undefined") return;
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn("⚠️ Push notifications not supported");
        return;
      }

      try {
        // Register service worker
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("✅ Service worker registered");

        // Wait for service worker to be ready
        await navigator.serviceWorker.ready;

        // Ask for notification permission
        let permission = Notification.permission;
        if (permission === "default") {
          permission = await Notification.requestPermission();
        }

        if (permission !== "granted") {
          console.warn("⚠️ Notification permission denied");
          return;
        }

        console.log("✅ Notification permission granted");

        // Check if already subscribed
        let subscription = await registration.pushManager.getSubscription();
        
        if (!subscription) {
          // Subscribe to push notifications
          const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          if (!vapidPublicKey) {
            console.error("❌ VAPID public key not found");
            return;
          }

          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
          });

          console.log("✅ Push subscription created");
        } else {
          console.log("✅ Already subscribed to push");
        }

        // Send subscription to server
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription.toJSON())
        });

        if (response.ok) {
          console.log("✅ Subscription sent to server");
        } else {
          console.error("❌ Failed to send subscription to server");
        }
      } catch (error) {
        console.error("❌ Push setup failed:", error);
      }
    }

    setupPush();
  }, []);

  return null;
}
