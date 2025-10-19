'use client'
import { useState, useEffect } from "react"

export default function PushManager() {
  const [permission, setPermission] = useState(Notification.permission)
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Convert base64 VAPID key to Uint8Array (required by Push API)
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Register service worker and check existing subscription
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(async (reg) => {
        console.log("✅ Service Worker registered", reg)

        const sub = await reg.pushManager.getSubscription()
        if (sub) setIsSubscribed(true)
      })
    } else {
      console.warn("Push messaging not supported")
    }
  }, [])

  // Ask permission for notification
  const requestPermission = async () => {
    const result = await Notification.requestPermission()
    setPermission(result)
    if (result !== "granted") alert("Permission denied for notifications")
  }

  // Subscribe user and send subscription to backend
  const subscribeUser = async () => {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    console.log("🔔 Subscription:", sub)

    // Send subscription object to backend for later push use
    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    })

    setIsSubscribed(true)
  }

  // Unsubscribe user (optional)
  const unsubscribeUser = async () => {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.getSubscription()
    if (sub) {
      await sub.unsubscribe()
      await fetch("/api/unsubscribe", { method: "POST" })
      setIsSubscribed(false)
    }
  }

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg">
      <h2 className="font-bold text-lg mb-2">Push Notifications</h2>
      <p>Status: {permission}</p>

      {permission !== "granted" && (
        <button onClick={requestPermission} className="bg-blue-600 px-3 py-1 rounded">
          Enable Notifications
        </button>
      )}

      {permission === "granted" && !isSubscribed && (
        <button onClick={subscribeUser} className="bg-green-600 px-3 py-1 rounded">
          Subscribe
        </button>
      )}

      {isSubscribed && (
        <button onClick={unsubscribeUser} className="bg-red-600 px-3 py-1 rounded">
          Unsubscribe
        </button>
      )}
    </div>
  )
}
