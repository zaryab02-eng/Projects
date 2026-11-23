import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes.jsx";
import "./index.css";

// Pre-renders every page at build time, so search engines get the text in the first HTML.
export const createRoot = ViteReactSSG({ routes });
