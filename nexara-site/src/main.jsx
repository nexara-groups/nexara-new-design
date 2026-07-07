import React from "react";
import ReactDOM from "react-dom/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DATA } from "./data.js";
import App from "./app.jsx";

import "./index.css";
import "./legacy/base.css";
import "./legacy/gateway.css";
import "./legacy/neo.css";
import "./legacy/trust.css";
import "./legacy/neo-guide.css";
import "./consent.css";

gsap.registerPlugin(ScrollTrigger);
Object.assign(window, { React, gsap, ScrollTrigger, NEXARA: DATA });

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
