import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { PhoneOff } from "./PhoneOff";
import { BootSequence } from "./BootSequence";
import { VoyeurIntro } from "./VoyeurIntro";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const {
    onboardingState,
    nextStep,
    powerOnPhone,
    completeOnboarding,
    resetOnboarding,
  } = useOnboarding();

  // Handle completion in an effect instead of during render
  useEffect(() => {
    if (onboardingState.currentStep === "complete") {
      onComplete();
    }
  }, [onboardingState.currentStep, onComplete]);

  const handleBootComplete = () => {
    nextStep(); // Move to voyeur-intro
  };

  const handleIntroComplete = () => {
    completeOnboarding(); // Complete onboarding after voyeur intro
  };

  const renderCurrentStep = () => {
    switch (onboardingState.currentStep) {
      case "phone-off":
        return <PhoneOff onPowerOn={powerOnPhone} />;

      case "booting":
        return <BootSequence onBootComplete={handleBootComplete} />;

      case "voyeur-intro":
        return <VoyeurIntro onContinue={handleIntroComplete} />;

      case "complete":
        return null;

      default:
        return <PhoneOff onPowerOn={powerOnPhone} />;
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>
    </div>
  );
}
