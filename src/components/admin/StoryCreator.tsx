import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Save, Copy, Shuffle, Sparkles, TrendingUp } from "lucide-react";

interface StoryTemplate {
  id: string;
  name: string;
  genre: "scandal" | "drama" | "romance" | "mystery";
  description: string;
  characters: Character[];
  plotPoints: PlotPoint[];
  estimatedDuration: string;
  viralPotential: number;
}

interface Character {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  role: "protagonist" | "antagonist" | "supporting";
  secrets: string[];
}

interface PlotPoint {
  id: string;
  trigger: "time" | "user_action" | "previous_message";
  delay: number;
  message: string;
  sender: string;
  emotions: string[];
  cliffhanger: boolean;
  viralMoment: boolean;
}

export function StoryCreator({
  onSave,
}: {
  onSave: (story: StoryTemplate) => void;
}) {
  const [currentStory, setCurrentStory] = useState<Partial<StoryTemplate>>({
    genre: "scandal",
    characters: [],
    plotPoints: [],
    viralPotential: 50,
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const storyTemplates: StoryTemplate[] = [
    {
      id: "cheating-scandal",
      name: "The Cheating Scandal",
      genre: "scandal",
      description:
        "Someone discovers their partner's affair through text evidence",
      estimatedDuration: "45 minutes",
      viralPotential: 95,
      characters: [
        {
          id: "victim",
          name: "Sarah",
          avatar: "👩‍💼",
          personality: "Trusting, shocked, becoming vengeful",
          role: "protagonist",
          secrets: ["Suspects something but hopes she's wrong"],
        },
        {
          id: "cheater",
          name: "Marcus",
          avatar: "👨‍💼",
          personality: "Manipulative, careless, desperate when caught",
          role: "antagonist",
          secrets: ["Having affair for 6 months", "Planning to leave wife"],
        },
        {
          id: "affair-partner",
          name: "Jessica",
          avatar: "👩‍🎨",
          personality: "Confident, manipulative, doesn't care about marriage",
          role: "antagonist",
          secrets: [
            "Wants Marcus to leave his wife",
            "Pregnant with his child",
          ],
        },
      ],
      plotPoints: [
        {
          id: "discovery",
          trigger: "time",
          delay: 0,
          message: "I saw something today that I can't get out of my head...",
          sender: "victim",
          emotions: ["confused", "worried"],
          cliffhanger: true,
          viralMoment: false,
        },
        {
          id: "evidence",
          trigger: "time",
          delay: 300000, // 5 minutes
          message:
            "I found Marcus's other phone. You won't believe what I saw.",
          sender: "victim",
          emotions: ["shocked", "betrayed"],
          cliffhanger: true,
          viralMoment: true,
        },
        {
          id: "revelation",
          trigger: "time",
          delay: 600000, // 10 minutes
          message: "Jessica is PREGNANT. The timeline matches perfectly.",
          sender: "victim",
          emotions: ["devastated", "angry"],
          cliffhanger: false,
          viralMoment: true,
        },
      ],
    },
    {
      id: "mystery-package",
      name: "The Mysterious Package",
      genre: "mystery",
      description:
        "A package arrives with no sender, containing disturbing contents",
      estimatedDuration: "30 minutes",
      viralPotential: 80,
      characters: [
        {
          id: "recipient",
          name: "Alex",
          avatar: "👨‍💻",
          personality: "Cautious, investigative, paranoid",
          role: "protagonist",
          secrets: ["Used to work for government agency"],
        },
        {
          id: "unknown",
          name: "Unknown",
          avatar: "🕵️",
          personality: "Mysterious, threatening, knows too much",
          role: "antagonist",
          secrets: ["Knows Alex's past", "Has been watching for months"],
        },
      ],
      plotPoints: [
        {
          id: "arrival",
          trigger: "time",
          delay: 0,
          message:
            "A package just arrived. No return address. Should I open it?",
          sender: "recipient",
          emotions: ["curious", "nervous"],
          cliffhanger: true,
          viralMoment: false,
        },
        {
          id: "contents",
          trigger: "time",
          delay: 240000, // 4 minutes
          message:
            "Inside: photos of me from last week. Someone's been watching.",
          sender: "recipient",
          emotions: ["terrified", "paranoid"],
          cliffhanger: true,
          viralMoment: true,
        },
      ],
    },
  ];

  const viralMessageTemplates = [
    "I can't believe what I just found out...",
    "My whole world just fell apart in 10 seconds",
    "I'm literally shaking right now",
    "This changes EVERYTHING",
    "I should have trusted my instincts",
    "Wait... there's more",
    "You're not going to believe this",
    "I found the smoking gun",
    "This is so much worse than I thought",
    "I need to tell someone before I explode",
  ];

  const generateViralMessage = () => {
    const template =
      viralMessageTemplates[
        Math.floor(Math.random() * viralMessageTemplates.length)
      ];
    return template;
  };

  const loadTemplate = (templateId: string) => {
    const template = storyTemplates.find((t) => t.id === templateId);
    if (template) {
      setCurrentStory(template);
      setSelectedTemplate(templateId);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-900 text-white rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <Sparkles className="text-purple-400" />
          <span>ChatLure Story Creator</span>
        </h1>
        <button
          onClick={() => onSave(currentStory as StoryTemplate)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Save size={16} />
          <span>Save Story</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-purple-400">
            📚 Story Templates
          </h2>
          <div className="space-y-3">
            {storyTemplates.map((template) => (
              <motion.button
                key={template.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => loadTemplate(template.id)}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  selectedTemplate === template.id
                    ? "bg-purple-600/30 border border-purple-500"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{template.name}</h3>
                  <div className="flex items-center space-x-1">
                    <TrendingUp size={12} className="text-orange-400" />
                    <span className="text-xs text-orange-400">
                      {template.viralPotential}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  {template.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-purple-600/20 px-2 py-1 rounded text-purple-400">
                    {template.genre}
                  </span>
                  <span className="text-gray-500">
                    {template.estimatedDuration}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3 text-gray-400">
              ⚡ Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() =>
                  setCurrentStory((prev) => ({
                    ...prev,
                    plotPoints: [
                      ...(prev.plotPoints || []),
                      {
                        id: Date.now().toString(),
                        trigger: "time",
                        delay: 300000,
                        message: generateViralMessage(),
                        sender: "victim",
                        emotions: ["shocked"],
                        cliffhanger: true,
                        viralMoment: true,
                      },
                    ],
                  }))
                }
                className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 p-2 rounded text-sm flex items-center space-x-2"
              >
                <Sparkles size={14} />
                <span>Add Viral Message</span>
              </button>
              <button
                onClick={() => {
                  const randomMessage = generateViralMessage();
                  navigator.clipboard.writeText(randomMessage);
                }}
                className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 p-2 rounded text-sm flex items-center space-x-2"
              >
                <Copy size={14} />
                <span>Copy Viral Template</span>
              </button>
              <button className="w-full bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 p-2 rounded text-sm flex items-center space-x-2">
                <Shuffle size={14} />
                <span>Random Plot Twist</span>
              </button>
            </div>
          </div>
        </div>

        {/* Story Builder */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">📝 Story Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Story Name
                  </label>
                  <input
                    type="text"
                    value={currentStory.name || ""}
                    onChange={(e) =>
                      setCurrentStory((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="Enter story name..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Genre
                  </label>
                  <select
                    value={currentStory.genre || ""}
                    onChange={(e) =>
                      setCurrentStory((prev) => ({
                        ...prev,
                        genre: e.target.value as any,
                      }))
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="scandal">🔥 Scandal</option>
                    <option value="drama">🎭 Drama</option>
                    <option value="romance">💕 Romance</option>
                    <option value="mystery">🔍 Mystery</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  value={currentStory.description || ""}
                  onChange={(e) =>
                    setCurrentStory((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20"
                  placeholder="Describe the story premise..."
                />
              </div>
            </div>

            {/* Characters */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">👥 Characters</h3>
                <button className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm flex items-center space-x-1">
                  <Plus size={14} />
                  <span>Add Character</span>
                </button>
              </div>
              <div className="space-y-3">
                {currentStory.characters?.map((character, index) => (
                  <div
                    key={character.id}
                    className="bg-gray-700 p-3 rounded flex items-center space-x-3"
                  >
                    <div className="text-2xl">{character.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold">{character.name}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            character.role === "protagonist"
                              ? "bg-green-600/20 text-green-400"
                              : character.role === "antagonist"
                                ? "bg-red-600/20 text-red-400"
                                : "bg-blue-600/20 text-blue-400"
                          }`}
                        >
                          {character.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {character.personality}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plot Points */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">📖 Plot Timeline</h3>
                <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm flex items-center space-x-1">
                  <Plus size={14} />
                  <span>Add Message</span>
                </button>
              </div>
              <div className="space-y-3">
                {currentStory.plotPoints?.map((point, index) => (
                  <div key={point.id} className="bg-gray-700 p-3 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">
                          #{index + 1}
                        </span>
                        {point.viralMoment && (
                          <span className="text-xs bg-orange-600/20 text-orange-400 px-2 py-1 rounded">
                            🔥 VIRAL
                          </span>
                        )}
                        {point.cliffhanger && (
                          <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                            ⚡ CLIFFHANGER
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.floor(point.delay / 60000)}m delay
                      </span>
                    </div>
                    <p className="text-white">{point.message}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-400">
                        From: {point.sender}
                      </span>
                      <div className="flex space-x-1">
                        {point.emotions.map((emotion) => (
                          <span
                            key={emotion}
                            className="text-xs bg-gray-600 px-2 py-1 rounded"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
