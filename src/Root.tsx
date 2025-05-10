import { StrictMode, useEffect } from "react";
import App from "./App";

function Root() {
  useEffect(() => {
    // Globally disable browser right-click context menu.
    // Most browsers still have an alternative built-in way to open the context menu,
    // e.g Shift + right click
    document.body.oncontextmenu = () => false;

    // Globally prevent scroll restoration.
    // Some browsers, such as Firefox, automatically restore scroll position on refresh,
    // however we dont want that.
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }

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
