import { useState, useEffect, useCallback } from "react";

export interface BatteryState {
  level: number; // 0-100
  isCharging: boolean;
  isDead: boolean;
  lastUsed: number;
  maxCapacity: number;
  isPremium: boolean;
}

export function useBattery(isPremium: boolean = false) {
  const [battery, setBattery] = useState<BatteryState>(() => {
    const saved = localStorage.getItem("chatlure-battery");
    const defaultState = {
      level: 100,
      isCharging: false,
      isDead: false,
      lastUsed: Date.now(),
      maxCapacity: isPremium ? 150 : 100, // Premium gets 50% more capacity
      isPremium,
    };

    if (saved) {
      const parsed = JSON.parse(saved);
      // Calculate natural recharge since last use
      const timePassed = Date.now() - parsed.lastUsed;
      const hoursPassedReal = timePassed / (1000 * 60 * 60);
      const rechargeRate = isPremium ? 25 : 10; // Premium recharges 2.5x faster
      const naturalRecharge = Math.floor(hoursPassedReal * rechargeRate);

      return {
        ...parsed,
        level: Math.min(parsed.level + naturalRecharge, parsed.maxCapacity),
        isDead: parsed.level <= 0,
        maxCapacity: isPremium ? 150 : 100,
        isPremium,
      };
    }

    return defaultState;
  });

  // Save battery state to localStorage
  useEffect(() => {
    localStorage.setItem("chatlure-battery", JSON.stringify(battery));
  }, [battery]);

  // Auto-recharge while charging
  useEffect(() => {
    if (battery.isCharging && battery.level < battery.maxCapacity) {
      const interval = setInterval(() => {
        setBattery((prev) => {
          const chargeRate = prev.isPremium ? 5 : 2; // Premium charges 2.5x faster
          const newLevel = Math.min(prev.level + chargeRate, prev.maxCapacity);
          const isFullyCharged = newLevel >= prev.maxCapacity;

          return {
            ...prev,
            level: newLevel,
            isCharging: !isFullyCharged,
            isDead: false,
          };
        });
      }, 1000); // Charge every second when plugged in

      return () => clearInterval(interval);
    }
  }, [battery.isCharging, battery.level, battery.maxCapacity]);

  const drainBattery = useCallback((amount: number = 1) => {
    setBattery((prev) => {
      const drainRate = prev.isPremium ? 0.5 : 1; // Premium drains 50% slower
      const actualDrain = amount * drainRate;
      const newLevel = Math.max(0, prev.level - actualDrain);

      return {
        ...prev,
        level: newLevel,
        isDead: newLevel <= 0,
        lastUsed: Date.now(),
      };
    });
  }, []);

  const startCharging = useCallback(() => {
    setBattery((prev) => ({ ...prev, isCharging: true }));
  }, []);

  const stopCharging = useCallback(() => {
    setBattery((prev) => ({ ...prev, isCharging: false }));
  }, []);

  const instantCharge = useCallback(() => {
    setBattery((prev) => ({
      ...prev,
      level: prev.maxCapacity,
      isDead: false,
      isCharging: false,
    }));
  }, []);

  const resetBattery = useCallback(() => {
    setBattery((prev) => ({
      ...prev,
      level: prev.maxCapacity,
      isDead: false,
      isCharging: false,
      lastUsed: Date.now(),
    }));
  }, []);

  return {
    battery,
    drainBattery,
    startCharging,
    stopCharging,
    instantCharge,
    resetBattery,
  };
}
