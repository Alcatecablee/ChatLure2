import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { PhoneInterface } from "@/components/phone/PhoneInterface";
import { BatteryProvider } from "@/contexts/BatteryContext";

const Index = () => {
  return (
    <BatteryProvider isPremium={false}>
      <PhoneFrame>
        <PhoneInterface />
      </PhoneFrame>
    </BatteryProvider>
  );
};

export default Index;
