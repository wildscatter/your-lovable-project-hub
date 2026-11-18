import { BrowserRouter } from "react-router-dom";
import Index from "./pages/Index";

// The public landing page does not use account, chat or notification providers.
export const HomeContent = () => <Index />;

export default function HomeApp() {
  return <BrowserRouter><HomeContent /></BrowserRouter>;
}
