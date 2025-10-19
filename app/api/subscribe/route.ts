import { NextResponse } from "next/server"

type PushSubscription = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

let savedSubscription: PushSubscription | null = null // temporary in-memory storage

export async function POST(req: Request) {
  try {
    const data = await req.json()
    savedSubscription = data
    console.log("✅ Subscription saved")
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("❌ Error saving subscription", err)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}

export function getSubscription() {
  return savedSubscription
}
