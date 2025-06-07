import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { initAdBlueMediaIntegration } from "./utils/adblueMediaHelper";
import { register, initNetworkStatusMonitoring } from "./utils/serviceWorker";
import { UserProvider } from "./context/UserContext.tsx";

// Initialize AdBlueMedia integration
initAdBlueMediaIntegration();

// Register service worker
register({
  onSuccess: () => {
    console.log('App is cached and ready for offline use');
  },
  onUpdate: () => {
    console.log('New content is available, please refresh');
  }
});

// Initialize network status monitoring
initNetworkStatusMonitoring();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

createRoot(rootElement).render(
  <UserProvider>
    <App />
  </UserProvider>
);
