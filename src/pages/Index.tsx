import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { PhoneInterface } from "@/components/phone/PhoneInterface";
import { BatteryProvider } from "@/contexts/BatteryContext";
import { AppProvider } from "@/contexts/AppContext";

const Index = () => {
  return (
    <AppProvider>
      <BatteryProvider>
        <PhoneFrame>
          <PhoneInterface />
        </PhoneFrame>
      </BatteryProvider>
    </AppProvider>
  );
};

export default Index;
