import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface CalculatorAppProps {
  onBack: () => void;
}

export function CalculatorApp({ onBack }: CalculatorAppProps) {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (
    firstValue: number,
    secondValue: number,
    operation: string,
  ): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    if (operation && previousValue !== null) {
      const inputValue = parseFloat(display);
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clearAll = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay("0");
    setWaitingForOperand(false);
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const buttons = [
    { text: "AC", type: "function", action: clearAll },
    { text: "C", type: "function", action: clearEntry },
    {
      text: "±",
      type: "function",
      action: () => setDisplay(String(-parseFloat(display))),
    },
    { text: "÷", type: "operator", action: () => inputOperation("÷") },
    { text: "7", type: "number", action: () => inputNumber("7") },
    { text: "8", type: "number", action: () => inputNumber("8") },
    { text: "9", type: "number", action: () => inputNumber("9") },
    { text: "×", type: "operator", action: () => inputOperation("×") },
    { text: "4", type: "number", action: () => inputNumber("4") },
    { text: "5", type: "number", action: () => inputNumber("5") },
    { text: "6", type: "number", action: () => inputNumber("6") },
    { text: "-", type: "operator", action: () => inputOperation("-") },
    { text: "1", type: "number", action: () => inputNumber("1") },
    { text: "2", type: "number", action: () => inputNumber("2") },
    { text: "3", type: "number", action: () => inputNumber("3") },
    { text: "+", type: "operator", action: () => inputOperation("+") },
    { text: "0", type: "number", action: () => inputNumber("0"), span: true },
    { text: ".", type: "number", action: inputDecimal },
    { text: "=", type: "operator", action: performCalculation },
  ];

  const getButtonStyle = (type: string) => {
    switch (type) {
      case "function":
        return "bg-gray-400 text-black";
      case "operator":
        return "bg-ios-orange text-white";
      default:
        return "bg-gray-800 text-white";
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
        <h1 className="text-lg font-semibold">Calculator</h1>
        <div className="w-10"></div>
      </div>

      {/* Display */}
      <div className="flex-1 flex items-end justify-end px-6 pb-4">
        <div className="text-right">
          <div className="text-5xl font-thin text-white break-all">
            {display}
          </div>
        </div>
      </div>

      {/* Button Grid */}
      <div className="px-4 pb-8">
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((button, index) => (
            <motion.button
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.02, duration: 0.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={button.action}
              className={`
                h-16 rounded-full text-xl font-medium transition-all duration-150 
                ${getButtonStyle(button.type)}
                ${button.text === "0" ? "col-span-2" : ""}
                hover:opacity-80 active:opacity-60
              `}
            >
              {button.text}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
