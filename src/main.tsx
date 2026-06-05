// src/main.tsx

import { createRoot } from "react-dom/client";
import App from "./components/App/App";

import "modern-normalize";

createRoot(document.getElementById("root") as HTMLElement).render(<App />);