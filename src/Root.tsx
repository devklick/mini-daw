import { StrictMode, useEffect } from "react";
import App from "./App";

function Root() {
  // Globally disable browser right-click context menu.
  // Most browsers still have an alternative built-in way to open the context menu,
  // e.g Shift + right click
  useEffect(() => {
    document.body.oncontextmenu = () => false;
    return () => {
      document.body.oncontextmenu = null;
    };
  });
  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

export default Root;
