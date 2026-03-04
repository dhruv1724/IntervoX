import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import React from 'react'
import toast from 'react-hot-toast'

function HomePage() {
  //tanstack to fetch data
  return (
    <div>
      <h1 className='text-red-500 bg-orange-400 p-10 text-3xl' onClick={() =>toast.success("This is a success toast")}>Welcome to IntervoX</h1>

      <SignedOut>
        <SignInButton mode='modal'>
          <button>Login</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton/>
      </SignedIn>

      <UserButton/>
    </div>
  )
}

export default HomePage