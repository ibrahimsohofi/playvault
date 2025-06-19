import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { HelmetProvider } from 'react-helmet-async';

// Initialize app with proper error handling
console.log('PlayVault: Starting app initialization...');

// Add error boundary for uncaught errors - console logging only for now
window.addEventListener('error', (event) => {
  console.error('PlayVault: Uncaught error:', event.error || event.message || 'Unknown error');
  // Only show visible errors in development mode
  if (import.meta.env.DEV && !document.getElementById('error-display')) {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-display';
    errorDiv.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: red;
      color: white;
      padding: 10px;
      z-index: 9999;
      max-width: 90%;
      font-size: 12px;
    `;
    errorDiv.textContent = `Dev Error: ${event.error?.message || 'Unknown error'}`;
    document.body.appendChild(errorDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('PlayVault: Unhandled promise rejection:', event.reason);
  // Only show visible errors in development mode
  if (import.meta.env.DEV && !document.getElementById('promise-error-display')) {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'promise-error-display';
    errorDiv.style.cssText = `
      position: fixed;
      top: 50px;
      left: 10px;
      background: orange;
      color: white;
      padding: 10px;
      z-index: 9999;
      max-width: 90%;
      font-size: 12px;
    `;
    errorDiv.textContent = `Dev Promise: ${event.reason?.message || event.reason}`;
    document.body.appendChild(errorDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("PlayVault: Root element not found!");
  // Show a basic error message to user
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif; color: #333;">
      <h1>PlayVault Loading Error</h1>
      <p>The application failed to initialize. Please check your browser's developer console for more details.</p>
    </div>
  `;
  throw new Error("Failed to find root element");
}

console.log('PlayVault: Root element found, rendering app...');

try {
  createRoot(rootElement).render(
    <HelmetProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </HelmetProvider>
  );
  console.log('PlayVault: App rendered successfully');
} catch (error) {
  console.error('PlayVault: Error rendering app:', error);
  // Show error to user
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; color: #333;">
        <h1>PlayVault Rendering Error</h1>
        <p>Failed to render the application: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    `;
  }
}
