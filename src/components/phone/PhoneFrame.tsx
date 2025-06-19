import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PhoneFrameProps {
  children: ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        {/* Phone Outer Frame */}
        <div className="relative w-phone-lg h-phone-lg bg-phone-bezel rounded-phone shadow-2xl p-bezel">
          {/* Screen Container */}
          <div className="relative w-full h-full bg-black rounded-screen overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-7 bg-black rounded-full border border-gray-800 z-50"></div>

            {/* Screen Content */}
            <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black">
              {children}
            </div>

            {/* Screen Reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
          </div>

          {/* Side Buttons */}
          <div className="absolute left-0 top-20 w-1 h-12 bg-phone-button rounded-r-sm -ml-1"></div>
          <div className="absolute left-0 top-36 w-1 h-8 bg-phone-button rounded-r-sm -ml-1"></div>
          <div className="absolute left-0 top-48 w-1 h-8 bg-phone-button rounded-r-sm -ml-1"></div>
          <div className="absolute right-0 top-32 w-1 h-20 bg-phone-button rounded-l-sm -mr-1"></div>
        </div>

        {/* Ambient Light */}
        <div className="absolute -inset-8 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
      </motion.div>
    </div>
  );
}
