import { useState, useCallback } from "react";

export type AppId =
  | "home"
  | "phone"
  | "messages"
  | "settings"
  | "camera"
  | "calculator"
  | "mail"
  | "clock"
  | "maps"
  | "music"
  | "photos"
  | "safari"
  | "calendar";

export function usePhoneNavigation() {
  const [currentApp, setCurrentApp] = useState<AppId>("home");
  const [appHistory, setAppHistory] = useState<AppId[]>(["home"]);

  const navigateToApp = useCallback((appId: AppId) => {
    setCurrentApp(appId);
    setAppHistory((prev) => [...prev, appId]);
  }, []);

  const goBack = useCallback(() => {
    if (appHistory.length > 1) {
      const newHistory = appHistory.slice(0, -1);
      const previousApp = newHistory[newHistory.length - 1];
      setAppHistory(newHistory);
      setCurrentApp(previousApp);
    }
  }, [appHistory]);

  const goHome = useCallback(() => {
    setCurrentApp("home");
    setAppHistory(["home"]);
  }, []);

  return {
    currentApp,
    navigateToApp,
    goBack,
    goHome,
    canGoBack: appHistory.length > 1,
  };
}
