import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle } from "lucide-react";

interface MessagesAppProps {
  onBack: () => void;
}

export function MessagesApp({ onBack }: MessagesAppProps) {
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
        <h1 className="text-lg font-semibold">Messages</h1>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle size={64} className="mx-auto mb-4 text-ios-blue" />
          <h2 className="text-xl font-semibold mb-2">No Messages</h2>
          <p className="text-gray-400">Your messages will appear here</p>
        </div>
      </div>
    </motion.div>
  );
}
