import { motion } from "framer-motion";
import { Zap, Clock, Crown } from "lucide-react";
import { useBatteryContext } from "@/contexts/BatteryContext";
import { useState, useEffect } from "react";

interface PhoneShutdownProps {
  onPremiumUpgrade: () => void;
}

export function PhoneShutdown({ onPremiumUpgrade }: PhoneShutdownProps) {
  const { battery, startCharging, instantCharge } = useBatteryContext();
  const [timeToFullCharge, setTimeToFullCharge] = useState(0);

  useEffect(() => {
    // Calculate time to full charge
    const remaining = battery.maxCapacity - battery.level;
    const chargeRate = battery.isPremium ? 5 : 2; // charge per second
    const secondsToFull = remaining / chargeRate;
    setTimeToFullCharge(Math.ceil(secondsToFull));
  }, [battery.level, battery.maxCapacity, battery.isPremium]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center p-6 text-center">
      {/* Phone Death Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="mb-8"
      >
        <div className="relative">
          <div className="text-6xl mb-4">🔋</div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-8 -right-8"
          >
            <img
              src="https://cdn.builder.io/api/v1/assets/9af82e6ddd6549809662cfc01aa22662/favico-c760c4?format=webp&width=800"
              alt="ChatLure Logo"
              className="w-12 h-12 rounded-lg opacity-50"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Death Message */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-2">
          Your Voyeur Energy is Depleted
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Your addiction to stalking conversations has drained your battery.
          <br />
          The secrets must wait while you recharge...
        </p>
      </motion.div>

      {/* Battery Status */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs mb-8"
      >
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300 text-sm">Battery Level</span>
            <span className="text-red-400 font-semibold">
              {Math.floor(battery.level)}%
            </span>
          </div>

          {/* Battery Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${battery.level}%` }}
              transition={{ duration: 0.5 }}
              className={`h-3 rounded-full ${
                battery.level > 20
                  ? "bg-ios-green"
                  : battery.level > 10
                    ? "bg-orange-500"
                    : "bg-red-500"
              }`}
            ></motion.div>
          </div>

          {battery.isCharging ? (
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-ios-green">
                <Zap size={16} />
                <span className="text-sm">Charging...</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Full charge in {formatTime(timeToFullCharge)}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-400">
                <Clock size={16} />
                <span className="text-sm">Not charging</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Charging Options */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-xs space-y-4"
      >
        {/* Start Charging */}
        {!battery.isCharging && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={startCharging}
            className="w-full bg-ios-green text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
          >
            <Zap size={20} />
            <span>Start Charging</span>
          </motion.button>
        )}

        {/* Premium Instant Charge */}
        {!battery.isPremium && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onPremiumUpgrade}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
          >
            <Crown size={20} />
            <span>Instant Charge - Upgrade to Premium</span>
          </motion.button>
        )}

        {/* Premium Instant Charge Button */}
        {battery.isPremium && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={instantCharge}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
          >
            <Zap size={20} />
            <span>Instant Charge ⚡ Premium</span>
          </motion.button>
        )}
      </motion.div>

      {/* Premium Benefits */}
      {!battery.isPremium && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl"
        >
          <h3 className="text-purple-400 font-semibold mb-2 text-sm">
            Premium Battery Perks
          </h3>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>⚡ Instant charging anytime</li>
            <li>🔋 50% more battery capacity</li>
            <li>⏱️ 2.5x faster charging speed</li>
            <li>🛡️ 50% slower battery drain</li>
          </ul>
        </motion.div>
      )}

      {/* Time Display */}
      <div className="absolute bottom-4 text-gray-500 text-xs">
        Come back when your battery recharges to continue stalking...
      </div>
    </div>
  );
}
