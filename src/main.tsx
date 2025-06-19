import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AppMinimal from "./App-minimal.tsx";
import "./index.css";

// Try minimal app first to test basic functionality
const isDev = import.meta.env.DEV;
const useMinimal = false; // Set to true to test minimal version

createRoot(document.getElementById("root")!).render(
  useMinimal ? <AppMinimal /> : <App />,
);
