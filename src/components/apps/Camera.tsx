import { motion } from "framer-motion";
import { ArrowLeft, Camera as CameraIcon, RotateCcw } from "lucide-react";

interface CameraAppProps {
  onBack: () => void;
}

export function CameraApp({ onBack }: CameraAppProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="w-full h-full bg-black text-white flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-16">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/50"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Camera</h1>
        <div className="w-10"></div>
      </div>

      {/* Camera Viewfinder */}
      <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 relative">
        <div className="absolute inset-4 border-2 border-white/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <CameraIcon size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400">Camera Preview</p>
          </div>
        </div>
      </div>

      {/* Camera Controls */}
      <div className="p-6 flex items-center justify-center space-x-8">
        <button className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center">
          <RotateCcw size={20} />
        </button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 shadow-lg"
        >
          <div className="w-full h-full rounded-full bg-white"></div>
        </motion.button>

        <div className="w-12"></div>
      </div>
    </motion.div>
  );
}
