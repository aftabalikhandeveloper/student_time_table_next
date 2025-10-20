"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function AuthHeader() {
  return (
    <div className="absolute top-4 right-4 z-50">
      <SignedIn>
        <UserButton />
      </SignedIn>

      <SignedOut>
        <SignInButton>
          <button className="px-4 py-2 bg-[#f97316] text-[#18171c] font-bold text-lg rounded-lg hover:scale-105 hover:shadow-2xl hover:shadow-[#f97316]/50 transition-all duration-300">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
