"use client";

import { SessionProvider } from "next-auth/react";

import React from "react";
import { redirect, usePathname } from "next/navigation";

const SessionWrapper = ({ children }) => {
  // const pathname = usePathname();

  // if (!session && pathname !== "/") {
  //   redirect("/");
  // }

  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionWrapper;
