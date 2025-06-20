import { createContext, useContext, ReactNode, useState } from "react";
import { useBattery, BatteryState } from "@/hooks/useBattery";

interface BatteryContextType {
  battery: BatteryState;
  drainBattery: (amount?: number) => void;
  startCharging: () => void;
  stopCharging: () => void;
  instantCharge: () => void;
  resetBattery: () => void;
}

const BatteryContext = createContext<BatteryContextType | undefined>(undefined);

interface BatteryProviderProps {
  children: ReactNode;
  isPremium?: boolean;
}

export function BatteryProvider({
  children,
  isPremium = false,
}: BatteryProviderProps) {
  const batteryHook = useBattery(isPremium);

  return (
    <BatteryContext.Provider value={batteryHook}>
      {children}
    </BatteryContext.Provider>
  );
}

export function useBatteryContext() {
  const context = useContext(BatteryContext);
  if (context === undefined) {
    throw new Error("useBatteryContext must be used within a BatteryProvider");
  }
  return context;
}
