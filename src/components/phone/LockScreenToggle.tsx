import React from "react";
import { useLockScreen } from "@/contexts/LockScreenContext";

export function LockScreenToggle() {
  const { isLocked, lock, unlock } = useLockScreen();

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={isLocked ? unlock : lock}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        {isLocked ? "🔓 Unlock" : "🔒 Lock"}
      </button>
    </div>
  );
}
