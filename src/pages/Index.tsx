import { useState } from "react";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { PhoneInterface } from "@/components/phone/PhoneInterface";
import { BatteryProvider } from "@/contexts/BatteryContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [showPhone, setShowPhone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <Card className="bg-gray-800 border-gray-700 max-w-md">
          <CardHeader>
            <CardTitle className="text-red-400">Error Loading App</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Reload App</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!showPhone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-white mb-4">
              Chat<span className="text-purple-400">Lure</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Experience viral drama and suspense through interactive chat
              stories. Dive into scandals, secrets, and shocking revelations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-purple-400">
                  📱 Chat Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Immersive WhatsApp-style stories with drama, secrets, and
                  viral content. Watch conversations unfold in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-blue-400">
                  🔥 Viral Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Stories sourced from real drama across social media, adapted
                  for maximum engagement and emotional impact.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => {
                try {
                  setShowPhone(true);
                } catch (err) {
                  setError(`Failed to load phone interface: ${err}`);
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg"
              size="lg"
            >
              📱 Launch Chat Experience
            </Button>

            <div className="text-center">
              <a
                href="/admin"
                className="text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Admin Dashboard →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  try {
    return (
      <BatteryProvider isPremium={false}>
        <PhoneFrame>
          <PhoneInterface />
        </PhoneFrame>
      </BatteryProvider>
    );
  } catch (err) {
    setError(`Phone interface error: ${err}`);
    return null;
  }
};

export default Index;
