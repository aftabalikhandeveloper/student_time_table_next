"use client";

import { useEffect } from "react";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // Once Clerk is loaded, decide what to do
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      router.replace("/time-table");
    }
  }, [isLoaded, isSignedIn, router]);

  // While waiting or not signed in
  if (!isLoaded) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Checking your session...</p>
      </main>
    );
  }

  // If user is signed out, show Clerk sign-in
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // Otherwise show nothing (redirect already triggered)
  return null;
}
