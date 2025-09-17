import { AppProvider } from "../context/AppContext";
import { ToastProvider } from "../context/ToastContext";
import DemoScreen from "../screens/DemoScreen";

export default function Home() {
  return (
    <ToastProvider>
      <AppProvider>
        <DemoScreen />
      </AppProvider>
    </ToastProvider>
  );
}
