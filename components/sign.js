"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export const Sign = ({ session }) => {
//   const { data: sessions, status } = useSession();
//   console.log("sessions", sessions);
  return (
    <div>
      {!session && (
        <>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            onClick={() => signIn("cognito")}
          >
            Login with Google
          </a>
        </>
      )}
      {session && (
        <>
          <p>Welcome, {session.user.name}</p>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            onClick={() => signOut()}
          >
            Sign out
          </a>
        </>
      )}
    </div>
  );
};
