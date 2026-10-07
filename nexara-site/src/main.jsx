import React from "react";
import ReactDOM from "react-dom/client";
import App, { loadPresentation } from "./app.jsx";
import { parseRoute } from "./shared.js";

import "./index.css";
import "./legacy/base.css";
import "./consent.css";
import "./refinements.css";

// Keep the complete static page visible until its interactive presentation is ready.
loadPresentation(parseRoute()).then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
}).catch(error => console.error('Nexara could not load the interactive presentation.', error));
