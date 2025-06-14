"use client";
import { useEffect } from 'react';
import posthog from 'posthog-js';
import { usePathname } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default function PostHogProvider({ children }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_API_HOST || 'https://app.posthog.com';
    if (key && !posthog.__loaded) {
      posthog.init(key, { api_host: host });
    }
  }, []);

  useEffect(() => {
    if (posthog && pathname) {
      posthog.capture('$pageview');
    }
  }, [pathname]);

  return <>{children}</>;
}