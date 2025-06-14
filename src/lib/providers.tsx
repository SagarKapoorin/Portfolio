"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps the app in NextAuth's SessionProvider for useSession hook.
 */
export default function Providers({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}