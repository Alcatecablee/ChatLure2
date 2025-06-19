import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Battery, Zap, Crown, ArrowRight, AlertTriangle } from "lucide-react";

interface BatteryTutorialProps {
  onContinue: () => void;
}

export function BatteryTutorial({ onContinue }: BatteryTutorialProps) {
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [showDrainDemo, setShowDrainDemo] = useState(false);
  const [showChargeDemo, setShowChargeDemo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Your Voyeur Energy",
      description:
        "Stalking conversations drains your battery. The more you watch, the more energy you consume.",
      action: "start-demo",
    },
    {
      title: "Battery Drain",
      description:
        "Each conversation you open drains 1% battery. Each new message drains 0.5% more.",
      action: "drain-demo",
    },
    {
      title: "Phone Death",
      description:
        "When your battery hits 0%, the phone shuts down. No more stalking until you recharge!",
      action: "death-demo",
    },
    {
      title: "Charging System",
      description:
        "Plug in to recharge slowly over time, or upgrade to Premium for instant charging.",
      action: "charge-demo",
    },
  ];

  useEffect(() => {
    if (showDrainDemo) {
      const interval = setInterval(() => {
        setBatteryLevel((prev) => {
          if (prev <= 10) {
            clearInterval(interval);
            setTimeout(() => setShowChargeDemo(true), 1000);
            return 0;
          }
          return prev - 8;
        });
      }, 800);

      return () => clearInterval(interval);
    }
  }, [showDrainDemo]);

  useEffect(() => {
    if (showChargeDemo) {
      const interval = setInterval(() => {
        setBatteryLevel((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 15;
        });
      }, 600);

      return () => clearInterval(interval);
    }
  }, [showChargeDemo]);

  const nextStep = () => {
    if (currentStep === 0) {
      setShowDrainDemo(true);
    } else if (currentStep === 2 && batteryLevel <= 0) {
      setShowChargeDemo(true);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onContinue();
    }
  };
  const getBatteryColor = () => {
    if (batteryLevel <= 10) return "text-red-500";
    if (batteryLevel <= 20) return "text-orange-500";
    return "text-green-500";
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center px-8 relative overflow-hidden">
      {/* Clear interaction zone for buttons */}
      <div className="absolute bottom-32 left-0 right-0 h-32 z-40 pointer-events-none" />

      {/* Background energy particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              y: [0, -200],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: "100%",
            }}
          >
            ⚡
          </motion.div>
        ))}
      </div>

      {/* Giant Battery Display */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mb-8"
      >
        <div className="relative">
          {/* Battery Body */}
          <div className="w-32 h-60 bg-gray-800 rounded-2xl border-4 border-gray-600 relative overflow-hidden">
            {/* Battery Level */}
            <motion.div
              animate={{ height: `${batteryLevel}%` }}
              transition={{ duration: 0.5 }}
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${
                batteryLevel > 20
                  ? "from-green-400 to-green-300"
                  : batteryLevel > 10
                    ? "from-orange-400 to-orange-300"
                    : "from-red-500 to-red-400"
              } rounded-xl`}
            />

            {/* Battery Percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-2xl font-bold ${batteryLevel < 50 ? "text-white" : "text-gray-800"}`}
              >
                {Math.floor(batteryLevel)}%
              </span>
            </div>

            {/* Warning flash when low */}
            {batteryLevel <= 10 && (
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute inset-0 bg-red-500/50 rounded-xl"
              />
            )}
          </div>

          {/* Battery Terminal */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gray-600 rounded-t-md" />

          {/* Charging indicator */}
          {showChargeDemo && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-6 top-1/2 transform -translate-y-1/2"
            >
              <Zap size={24} className="text-yellow-400" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="text-center mb-8 max-w-sm"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            {currentStepData.title}
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {currentStepData.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Demo Actions */}
      {currentStep === 1 && showDrainDemo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
            <AlertTriangle className="text-red-400 mx-auto mb-2" size={24} />
            <p className="text-red-400 text-sm font-semibold">
              Battery draining rapidly!
            </p>
          </div>
        </motion.div>
      )}

      {/* Premium Teaser */}
      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <Crown className="text-yellow-400" size={20} />
            <div className="text-left">
              <p className="text-white font-semibold text-sm">
                Premium Benefits
              </p>
              <p className="text-gray-300 text-xs">
                ⚡ Instant charging • 🔋 150% capacity • 🐌 50% slower drain
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col items-center space-y-4 z-50 relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            console.log("Continue clicked, step:", currentStep);
            if (currentStep === steps.length - 1) {
              onContinue();
            } else {
              nextStep();
            }
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-12 rounded-xl font-semibold shadow-lg transition-all duration-200 relative overflow-hidden group"
          style={{
            userSelect: "none",
            touchAction: "manipulation",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/50 to-pink-400/0 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
          <div className="relative flex items-center justify-center space-x-2">
            <span>{currentStep === steps.length - 1 ? "Start Stalking" : "Continue"}</span>
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            console.log("Skip clicked");
            onContinue();
          }}
          className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80 text-white py-3 px-8 rounded-lg text-sm font-medium shadow-lg transition-all duration-200 relative overflow-hidden group"
          style={{
            userSelect: "none",
            touchAction: "manipulation",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-400/0 via-gray-400/20 to-gray-400/0 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
          <span>Skip Tutorial</span>
        </motion.button>
      </div>

      {/* Progress */}
      <div className="flex space-x-2 mt-6">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index <= currentStep ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Death screen overlay */}
      {batteryLevel <= 0 && currentStep >= 2 && !showChargeDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10"
          style={{ pointerEvents: "none" }}
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              💀
            </motion.div>
            <h3 className="text-2xl font-bold text-red-400 mb-2">
              Phone Died!
            </h3>
            <p className="text-gray-300 text-sm">
              Your voyeur energy is depleted
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
