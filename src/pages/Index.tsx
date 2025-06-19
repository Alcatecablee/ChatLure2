import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [showPhone, setShowPhone] = useState(false);

  // For now, let's show the landing page without the phone interface
  // to ensure the app loads properly
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white mb-4">
            Chat<span className="text-purple-400">Lure</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience viral drama and suspense through interactive chat
            stories. Dive into scandals, secrets, and shocking revelations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-purple-400">📱 Chat Stories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Immersive WhatsApp-style stories with drama, secrets, and viral
                content. Watch conversations unfold in real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-blue-400">🔥 Viral Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Stories sourced from real drama across social media, adapted for
                maximum engagement and emotional impact.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowPhone(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg"
              size="lg"
            >
              📱 Launch Chat Experience
            </Button>

            <Button
              onClick={() => (window.location.href = "/admin")}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10 px-8 py-4 text-lg"
              size="lg"
            >
              ⚙️ Admin Dashboard
            </Button>
          </div>

          <div className="text-center">
            <a
              href="/test"
              className="text-gray-400 hover:text-gray-300 text-sm underline"
            >
              Test Page →
            </a>
          </div>
        </div>

        {showPhone && (
          <Card className="bg-gray-800/90 border-gray-700 backdrop-blur p-6">
            <CardContent>
              <p className="text-yellow-400 mb-4">
                📱 Phone interface is being developed...
              </p>
              <p className="text-gray-300 text-sm">
                The chat experience will be available soon. For now, check out
                the admin dashboard to create and manage stories.
              </p>
              <Button
                onClick={() => setShowPhone(false)}
                variant="outline"
                className="mt-4"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
