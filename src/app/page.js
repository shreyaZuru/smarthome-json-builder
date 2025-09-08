import { AppProvider } from "../context/AppContext";
import DemoScreen from "../screens/DemoScreen";

export default function Home() {
  return (
    <AppProvider>
      <DemoScreen />
    </AppProvider>
  );
}
