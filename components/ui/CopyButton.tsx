"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
      title="Copy to clipboard"
    >
      <div className="text-gray-600">{copied ? "✓ Copied" : "Copy"}</div>
    </button>
  );
}
