
import React from 'react';
import { auth, currentUser } from '@clerk/nextjs/server'
import Home from '@/components/Home';
import Link from 'next/link';





export default async function MainPage() {

 

  return (
    <main>
      <Home />

    </main>
  )
}
