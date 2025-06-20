import { motion } from "framer-motion";
import { Power } from "lucide-react";
import { useState, useEffect } from "react";

interface PhoneOffProps {
  onPowerOn: () => void;
}

export function PhoneOff({ onPowerOn }: PhoneOffProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            animate={{
              x: [0, 300, 0],
              y: [0, -200, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Mysterious Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center mb-32 px-6"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-4 relative"
        >
          <img
            src="https://cdn.builder.io/api/v1/assets/4fad96d56bab4dd5bf3f69370c695246/default-12-6ca444?format=webp&width=800"
            alt="ChatLure Logo"
            className="w-20 h-20 rounded-xl mx-auto"
          />
          <motion.div
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -inset-4 bg-purple-500/20 rounded-2xl blur-xl"
          />
        </motion.div>
        <h1 className="text-2xl font-bold text-white mb-2">
          You found someone's phone...
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          It's locked, but you can see notifications lighting up.
          <br />
          What secrets are hidden inside?
        </p>
      </motion.div>

      {/* Power Button */}
      <motion.div
        className="relative z-50 mb-32"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute -inset-8 bg-purple-600/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.button
          onClick={onPowerOn}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg hover:shadow-purple-500/50 transition-all"
          whileTap={{ scale: 0.95 }}
        >
          <Power className="w-12 h-12 text-white" />
        </motion.button>
      </motion.div>

      {/* Warning text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 text-center px-6"
      >
        <p className="text-red-400 text-xs font-medium">
          ⚠️ Warning: You're about to access private conversations
        </p>
        <p className="text-gray-500 text-xs mt-1">
          What you see may shock you...
        </p>
      </motion.div>

      {/* Ambient sound waves */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-4 right-4 w-8 h-8 border border-purple-500/30 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-4 left-4 w-6 h-6 border border-cyan-500/30 rounded-full"
      />
    </div>
  );
}
