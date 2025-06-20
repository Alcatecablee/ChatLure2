import { useState, useEffect } from "react";
import { useBatteryContext } from "@/contexts/BatteryContext";

export function StatusBar() {
  const [time, setTime] = useState(new Date());

  // Safe battery context access with fallback
  let battery;
  let usingFallback = false;
  try {
    const context = useBatteryContext();
    battery = context.battery;
  } catch (error) {
    // Fallback when BatteryProvider is not available
    usingFallback = true;
    battery = {
      level: 100,
      isCharging: false,
      isDead: false,
      lastUsed: Date.now(),
      maxCapacity: 100,
      isPremium: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getBatteryColor = () => {
    if (battery.isCharging) return "text-ios-green";
    if (battery.level <= 10) return "text-red-500";
    if (battery.level <= 20) return "text-orange-500";
    return "text-white";
  };

  const getBatteryIcon = () => {
    if (battery.isCharging)
      return <Zap size={16} className={getBatteryColor()} />;
    if (battery.level <= 15)
      return <BatteryLow size={16} className={getBatteryColor()} />;
    return <Battery size={16} className={getBatteryColor()} />;
  };

  return (
    <div className="absolute top-0 left-0 right-0 h-statusbar bg-transparent z-40 flex items-center justify-between px-6 pt-4">
      {/* Left side - Time */}
      <div className="text-white text-sm font-semibold">{formatTime(time)}</div>

      {/* Right side - Status icons */}
      <div className="flex items-center space-x-2">
        <span className="text-white text-sm">📶</span>
        <span className="text-white text-sm">📶</span>
        <span className="text-white text-sm">📶</span>
        <span className="text-white text-sm">📞</span>
        <span className="text-white text-sm">📡</span>
        <div className="flex items-center space-x-1">
          <span className={`text-xs ${getBatteryColor()}`}>
            {Math.floor(battery.level)}%
          </span>
          <span className={`text-sm ${getBatteryColor()}`}>
            {battery.isCharging ? "🔋" : battery.level <= 15 ? "🪫" : "🔋"}
          </span>
          {battery.isPremium && (
            <span className="text-yellow-400 text-xs">⚡</span>
          )}
        </div>
      </div>
    </div>
  );
}
