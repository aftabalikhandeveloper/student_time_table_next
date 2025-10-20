import React from 'react'
import { SignedIn, SignedOut, SignUp } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const page = () => {
    return (
        <div>
            <SignedIn>
                {redirect('/time-table')}
            </SignedIn>
            <SignedOut>
                <SignUp />
            </SignedOut>
        </div>
    )
}

export default page
