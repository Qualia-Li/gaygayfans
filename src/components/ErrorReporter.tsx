"use client";

import { useEffect } from "react";

function reportError(context: string, message: string, stack?: string) {
  fetch("/api/notify/error", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context, message, stack }),
  }).catch(() => {});
}

export default function ErrorReporter() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      reportError(
        `window.onerror @ ${event.filename}:${event.lineno}`,
        event.message,
        event.error?.stack
      );
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const err = event.reason;
      reportError(
        "unhandledrejection",
        err?.message || String(err),
        err?.stack
      );
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
