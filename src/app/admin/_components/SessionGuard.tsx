"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function SessionGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok && !aborted) {
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        }
      } catch {
        if (!aborted) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [router, pathname]);

  return null;
}
