"use client";

import dynamic from "next/dynamic";

// Client-only on purpose: the tool reads DEV-ONLY localStorage on start, which
// does not exist during server rendering.
const DecoratorApp = dynamic(() => import("./DecoratorApp"), { ssr: false });

export default function DecoratorPage() {
  return <DecoratorApp />;
}
