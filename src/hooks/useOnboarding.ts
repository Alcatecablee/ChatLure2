import { useState, useEffect } from "react";

export type OnboardingStep =
  | "phone-off"
  | "booting"
  | "lock-screen"
  | "permissions"
  | "voyeur-intro"
  | "stalking-rules"
  | "battery-tutorial"
  | "first-peek"
  | "complete";

export interface OnboardingState {
  currentStep: OnboardingStep;
  isFirstTime: boolean;
  hasSeenIntro: boolean;
  permissions: {
    notifications: boolean;
    location: boolean;
    camera: boolean;
    microphone: boolean;
  };
}

export function useOnboarding() {
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(
    () => {
      const saved = localStorage.getItem("chatlure-onboarding");

      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }

      const initialState = {
        currentStep: "phone-off" as OnboardingStep,
        isFirstTime: true,
        hasSeenIntro: false,
        permissions: {
          notifications: false,
          location: false,
          camera: false,
          microphone: false,
        },
      };

      return initialState;
    },
  );

  // Save onboarding state
  useEffect(() => {
    localStorage.setItem(
      "chatlure-onboarding",
      JSON.stringify(onboardingState),
    );
  }, [onboardingState]);

  const nextStep = () => {
    const stepOrder: OnboardingStep[] = [
      "phone-off",
      "booting",
      "voyeur-intro",
      "complete"
    ];

    const currentIndex = stepOrder.indexOf(onboardingState.currentStep);
    const nextIndex = Math.min(currentIndex + 1, stepOrder.length - 1);

    setOnboardingState((prev) => ({
      ...prev,
      currentStep: stepOrder[nextIndex],
    }));
  };

  const skipOnboarding = () => {
    setOnboardingState((prev) => ({
      ...prev,
      currentStep: "complete",
      hasSeenIntro: true,
      isFirstTime: false,
    }));
  };

  const powerOnPhone = () => {
    setOnboardingState((prev) => ({
      ...prev,
      currentStep: "booting",
    }));
  };

  const grantPermission = (
    permission: keyof OnboardingState["permissions"],
  ) => {
    setOnboardingState((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: true,
      },
    }));
  };

  const completeOnboarding = () => {
    setOnboardingState((prev) => ({
      ...prev,
      currentStep: "complete",
      hasSeenIntro: true,
      isFirstTime: false,
    }));
  };

  const resetOnboarding = () => {
    localStorage.removeItem("chatlure-onboarding");
    setOnboardingState({
      currentStep: "phone-off",
      isFirstTime: true,
      hasSeenIntro: false,
      permissions: {
        notifications: false,
        location: false,
        camera: false,
        microphone: false,
      },
    });
  };

  return {
    onboardingState,
    nextStep,
    skipOnboarding,
    powerOnPhone,
    grantPermission,
    completeOnboarding,
    resetOnboarding,
    isOnboardingComplete: onboardingState.currentStep === "complete",
  };
}
