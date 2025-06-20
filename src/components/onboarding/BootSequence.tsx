import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Smartphone, Wifi, Shield, Eye } from "lucide-react";

interface BootSequenceProps {
  onBootComplete: () => void;
}

export function BootSequence({ onBootComplete }: BootSequenceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const bootSteps = [
    {
      text: "Initializing system...",
      icon: <Smartphone size={20} />,
      delay: 1000,
    },
    { text: "Connecting to network...", icon: <Wifi size={20} />, delay: 1500 },
    { text: "Bypassing security...", icon: <Shield size={20} />, delay: 2000 },
    { text: "Accessing private data...", icon: <Eye size={20} />, delay: 1000 },
    { text: "Welcome to ChatLure", icon: <Eye size={20} />, delay: 1500 },
  ];

  useEffect(() => {
    let stepTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const runBootSequence = () => {
      // Progress bar animation
      progressTimer = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressTimer);
            setTimeout(onBootComplete, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      // Step progression
      stepTimer = setTimeout(() => {
        setCurrentStep((prev) => {
          if (prev < bootSteps.length - 1) {
            setTimeout(runBootSequence, bootSteps[prev + 1].delay);
            return prev + 1;
          }
          return prev;
        });
      }, bootSteps[currentStep]?.delay || 1000);
    };

    runBootSequence();

    return () => {
      clearTimeout(stepTimer);
      clearInterval(progressTimer);
    };
  }, [currentStep]);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Matrix-like background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-400 text-xs font-mono"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: "100vh", opacity: [0, 1, 0] }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
            }}
          >
            {Math.random() > 0.5 ? "01" : "10"}
          </motion.div>
        ))}
      </div>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, type: "spring" }}
        className="mb-8"
      >
        <div className="relative">
          <img
            src="https://cdn.builder.io/api/v1/assets/4fad96d56bab4dd5bf3f69370c695246/default-12-6ca444?format=webp&width=800"
            alt="ChatLure Logo"
            className="w-24 h-24 rounded-2xl shadow-2xl"
          />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20"
          />
        </div>
      </motion.div>

      {/* Boot Steps */}
      <div className="w-80 space-y-4">
        <AnimatePresence mode="wait">
          {bootSteps.map(
            (step, index) =>
              index <= currentStep && (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: currentStep === index ? 1 : 0.5 }}
                  exit={{ x: 50, opacity: 0 }}
                  className="flex items-center space-x-3 text-white"
                >
                  <motion.div
                    animate={currentStep === index ? { rotate: 360 } : {}}
                    transition={{
                      duration: 1,
                      repeat: currentStep === index ? Infinity : 0,
                    }}
                    className={`${currentStep === index ? "text-green-400" : "text-gray-500"}`}
                  >
                    {step.icon}
                  </motion.div>
                  <span
                    className={`text-sm font-mono ${currentStep === index ? "text-green-400" : "text-gray-500"}`}
                  >
                    {step.text}
                  </span>
                  {currentStep === index && (
                    <motion.div
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="text-green-400"
                    >
                      _
                    </motion.div>
                  )}
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="w-80 mt-8">
        <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-green-400 to-blue-400"
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Initializing ChatLure...</span>
          <span>{Math.floor(loadingProgress)}%</span>
        </div>
      </div>

      {/* Warning Messages */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: currentStep >= 2 ? 1 : 0 }}
        className="absolute bottom-8 text-center px-6"
      >
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-400 text-xs font-medium">
            🔓 Security bypassed - Private access granted
          </p>
          <p className="text-gray-400 text-xs mt-1">
            You now have access to private conversations
          </p>
        </div>
      </motion.div>

      {/* Scanning effect */}
      <motion.div
        animate={{ y: ["0%", "100%", "0%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/10 to-transparent h-4"
      />
    </div>
  );
}
