import { motion, AnimatePresence } from "framer-motion";
import { Eye, Users, Zap, Crown, ArrowRight } from "lucide-react";
import { useState } from "react";

interface VoyeurIntroProps {
  onContinue: () => void;
}

export function VoyeurIntro({ onContinue }: VoyeurIntroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to ChatLure",
      subtitle: "The Ultimate Voyeur Experience",
      content:
        "You're about to witness real conversations unfold in real-time. What you see may shock, surprise, or scandal you.",
      icon: <Eye size={64} className="text-purple-400" />,
      bg: "from-purple-900/20 to-pink-900/20",
    },
    {
      title: "Join the Community",
      subtitle: "Thousands are watching right now",
      content:
        "You're not alone. Join thousands of other secret watchers as dramatic conversations unfold live.",
      icon: <Users size={64} className="text-blue-400" />,
      bg: "from-blue-900/20 to-cyan-900/20",
    },
    {
      title: "Live Drama Unfolds",
      subtitle: "Real-time conversations",
      content:
        "Watch as secrets are revealed, relationships crumble, and scandals explode - all happening right now.",
      icon: <Zap size={64} className="text-orange-400" />,
      bg: "from-orange-900/20 to-red-900/20",
    },
    {
      title: "Unlock Premium Secrets",
      subtitle: "The juiciest content awaits",
      content:
        "Premium members get access to the most scandalous conversations and exclusive insider drama.",
      icon: <Crown size={64} className="text-yellow-400" />,
      bg: "from-yellow-900/20 to-orange-900/20",
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onContinue();
    }
  };
  const currentSlideData = slides[currentSlide];

  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${currentSlideData.bg} flex flex-col relative overflow-hidden`}
    >
      {/* Background particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center space-x-2 pt-16 pb-8">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-8 h-1 rounded-full transition-all duration-300 ${
              index <= currentSlide ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {currentSlide === 0 ? (
                <img
                  src="https://cdn.builder.io/api/v1/assets/9af82e6ddd6549809662cfc01aa22662/favico-c760c4?format=webp&width=800"
                  alt="ChatLure Logo"
                  className="w-16 h-16 rounded-xl"
                />
              ) : (
                currentSlideData.icon
              )}
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                {currentSlideData.title}
              </h1>
              <h2 className="text-lg text-gray-300 font-medium">
                {currentSlideData.subtitle}
              </h2>
            </motion.div>

            {/* Content */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 leading-relaxed max-w-sm"
            >
              {currentSlideData.content}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pb-8 px-8 bg-gradient-to-t from-black/20 to-transparent">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={nextSlide}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg transition-all duration-200"
        >
          <span>
            {currentSlide === slides.length - 1 ? "Enter ChatLure" : "Continue"}
          </span>
          <ArrowRight size={20} />
        </motion.button>

        {/* Skip option */}
        {currentSlide < slides.length - 1 && (
          <button
            onClick={onContinue}
            className="w-full mt-3 text-gray-400 text-sm py-2 hover:text-white transition-colors"
          >
            Skip introduction
          </button>
        )}
      </div>

      {/* Floating eyes */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-20 right-8 text-2xl opacity-30"
      >
        👁️
      </motion.div>
      <motion.div
        animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute bottom-32 left-8 text-2xl opacity-30"
      >
        👁️
      </motion.div>
    </div>
  );
}
