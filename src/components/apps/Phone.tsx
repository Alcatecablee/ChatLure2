import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Phone as PhoneIcon, Delete } from "lucide-react";

interface PhoneAppProps {
  onBack: () => void;
}

export function PhoneApp({ onBack }: PhoneAppProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const dialpadButtons = [
    { number: "1", letters: "" },
    { number: "2", letters: "ABC" },
    { number: "3", letters: "DEF" },
    { number: "4", letters: "GHI" },
    { number: "5", letters: "JKL" },
    { number: "6", letters: "MNO" },
    { number: "7", letters: "PQRS" },
    { number: "8", letters: "TUV" },
    { number: "9", letters: "WXYZ" },
    { number: "*", letters: "" },
    { number: "0", letters: "+" },
    { number: "#", letters: "" },
  ];

  const handleNumberPress = (number: string) => {
    setPhoneNumber((prev) => prev + number);
  };

  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (phoneNumber) {
      alert(`Calling ${phoneNumber}...`);
    }
  };

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
        <h1 className="text-lg font-semibold">Phone</h1>
        <div className="w-10"></div>
      </div>

      {/* Phone Number Display */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-3xl font-light tracking-widest min-h-[1.2em] mb-8">
            {phoneNumber || "Enter number"}
          </div>
        </div>
      </div>

      {/* Dialpad */}
      <div className="px-6 pb-12">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {dialpadButtons.map((button, index) => (
            <motion.button
              key={button.number}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumberPress(button.number)}
              className="w-20 h-20 mx-auto bg-gray-800/30 rounded-full flex flex-col items-center justify-center text-white hover:bg-gray-700/30 transition-colors"
            >
              <span className="text-2xl font-light">{button.number}</span>
              {button.letters && (
                <span className="text-xs text-gray-400 font-medium">
                  {button.letters}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleBackspace}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800/30"
            disabled={!phoneNumber}
          >
            <Delete
              size={20}
              className={phoneNumber ? "text-white" : "text-gray-600"}
            />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCall}
            className="w-16 h-16 bg-ios-green rounded-full flex items-center justify-center shadow-lg"
            disabled={!phoneNumber}
          >
            <PhoneIcon size={24} className="text-white" />
          </motion.button>

          <div className="w-12"></div>
        </div>
      </div>
    </motion.div>
  );
}
