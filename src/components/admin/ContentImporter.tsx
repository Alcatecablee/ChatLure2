import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Zap, CheckCircle, AlertCircle } from "lucide-react";

interface ImportedStory {
  title: string;
  characters: string[];
  messages: ImportedMessage[];
  genre: string;
  estimatedViralScore: number;
}

interface ImportedMessage {
  timestamp: string;
  sender: string;
  message: string;
  emotion: string;
  isCliffhanger: boolean;
}

export function ContentImporter({
  onImport,
}: {
  onImport: (stories: ImportedStory[]) => void;
}) {
  const [importMethod, setImportMethod] = useState<"csv" | "text" | "json">(
    "text",
  );
  const [inputContent, setInputContent] = useState("");
  const [parsedStories, setParsedStories] = useState<ImportedStory[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleFormats = {
    text: `STORY: The Office Affair
GENRE: scandal
CHARACTER: Sarah (victim) 👩‍💼
CHARACTER: Mark (cheater) 👨‍💼  
CHARACTER: Lisa (affair partner) 👩‍🎨

MESSAGE: Sarah: I think something's wrong with Mark lately...
DELAY: 2min
MESSAGE: Sarah: He's been working "late" every night this week
EMOTION: suspicious
DELAY: 5min  
MESSAGE: Sarah: I found receipts for a restaurant I've never been to
CLIFFHANGER: true
EMOTION: shocked`,

    csv: `story_title,genre,sender,message,delay_minutes,emotion,cliffhanger
The Office Affair,scandal,Sarah,I think something's wrong with Mark lately...,0,suspicious,false
The Office Affair,scandal,Sarah,He's been working late every night this week,2,worried,false
The Office Affair,scandal,Sarah,I found receipts for a restaurant I've never been to,5,shocked,true`,

    json: `{
  "stories": [
    {
      "title": "The Office Affair",
      "genre": "scandal", 
      "characters": [
        {"name": "Sarah", "role": "victim", "avatar": "👩‍💼"},
        {"name": "Mark", "role": "cheater", "avatar": "👨‍💼"}
      ],
      "messages": [
        {
          "sender": "Sarah",
          "message": "I think something's wrong with Mark lately...",
          "delay": 0,
          "emotion": "suspicious",
          "cliffhanger": false
        }
      ]
    }
  ]
}`,
  };

  const parseTextFormat = (content: string): ImportedStory[] => {
    const stories: ImportedStory[] = [];
    const lines = content.split("\n").filter((line) => line.trim());

    let currentStory: Partial<ImportedStory> = {};
    let currentMessages: ImportedMessage[] = [];
    let currentCharacters: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("STORY:")) {
        // Save previous story if exists
        if (currentStory.title) {
          stories.push({
            ...currentStory,
            characters: currentCharacters,
            messages: currentMessages,
            estimatedViralScore: calculateViralScore(currentMessages),
          } as ImportedStory);
        }

        // Start new story
        currentStory = { title: trimmed.replace("STORY:", "").trim() };
        currentMessages = [];
        currentCharacters = [];
      } else if (trimmed.startsWith("GENRE:")) {
        currentStory.genre = trimmed.replace("GENRE:", "").trim();
      } else if (trimmed.startsWith("CHARACTER:")) {
        currentCharacters.push(trimmed.replace("CHARACTER:", "").trim());
      } else if (trimmed.startsWith("MESSAGE:")) {
        const messagePart = trimmed.replace("MESSAGE:", "").trim();
        const [sender, message] = messagePart.split(":").map((s) => s.trim());

        currentMessages.push({
          timestamp: Date.now().toString(),
          sender,
          message,
          emotion: "neutral",
          isCliffhanger: false,
        });
      } else if (trimmed.startsWith("EMOTION:")) {
        if (currentMessages.length > 0) {
          currentMessages[currentMessages.length - 1].emotion = trimmed
            .replace("EMOTION:", "")
            .trim();
        }
      } else if (trimmed.startsWith("CLIFFHANGER:")) {
        if (currentMessages.length > 0) {
          currentMessages[currentMessages.length - 1].isCliffhanger =
            trimmed.replace("CLIFFHANGER:", "").trim() === "true";
        }
      }
    }

    // Save last story
    if (currentStory.title) {
      stories.push({
        ...currentStory,
        characters: currentCharacters,
        messages: currentMessages,
        estimatedViralScore: calculateViralScore(currentMessages),
      } as ImportedStory);
    }

    return stories;
  };

  const parseCSVFormat = (content: string): ImportedStory[] => {
    const lines = content.split("\n").filter((line) => line.trim());
    const header = lines[0].split(",");
    const stories: { [key: string]: ImportedStory } = {};

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const row: { [key: string]: string } = {};

      header.forEach((col, index) => {
        row[col.trim()] = values[index]?.trim() || "";
      });

      const storyTitle = row.story_title;
      if (!stories[storyTitle]) {
        stories[storyTitle] = {
          title: storyTitle,
          genre: row.genre,
          characters: [],
          messages: [],
          estimatedViralScore: 0,
        };
      }

      stories[storyTitle].messages.push({
        timestamp: Date.now().toString(),
        sender: row.sender,
        message: row.message,
        emotion: row.emotion || "neutral",
        isCliffhanger: row.cliffhanger === "true",
      });
    }

    return Object.values(stories).map((story) => ({
      ...story,
      estimatedViralScore: calculateViralScore(story.messages),
    }));
  };

  const calculateViralScore = (messages: ImportedMessage[]): number => {
    let score = 50; // Base score

    // More messages = higher engagement potential
    score += Math.min(messages.length * 5, 30);

    // Cliffhangers boost viral potential
    const cliffhangers = messages.filter((m) => m.isCliffhanger).length;
    score += cliffhangers * 15;

    // Strong emotions boost viral potential
    const strongEmotions = messages.filter((m) =>
      ["shocked", "angry", "devastated", "terrified"].includes(m.emotion),
    ).length;
    score += strongEmotions * 10;

    // Viral keywords in messages
    const viralKeywords = [
      "can't believe",
      "shocking",
      "betrayed",
      "devastating",
      "explosive",
    ];
    const keywordMatches = messages.reduce((count, m) => {
      return (
        count +
        viralKeywords.filter((keyword) =>
          m.message.toLowerCase().includes(keyword),
        ).length
      );
    }, 0);
    score += keywordMatches * 8;

    return Math.min(score, 100);
  };

  const processContent = async () => {
    setIsProcessing(true);

    try {
      let parsed: ImportedStory[] = [];

      switch (importMethod) {
        case "text":
          parsed = parseTextFormat(inputContent);
          break;
        case "csv":
          parsed = parseCSVFormat(inputContent);
          break;
        case "json":
          const jsonData = JSON.parse(inputContent);
          parsed = jsonData.stories || [];
          break;
      }

      setParsedStories(parsed);
    } catch (error) {
      console.error("Parse error:", error);
    }

    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <Upload className="text-blue-400" />
          <span>Content Importer</span>
        </h1>
      </div>

      {/* Import Method Selection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">📥 Import Format</h2>
        <div className="grid grid-cols-3 gap-4">
          {(["text", "csv", "json"] as const).map((method) => (
            <button
              key={method}
              onClick={() => setImportMethod(method)}
              className={`p-4 rounded-lg border-2 transition-all ${
                importMethod === method
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-600 bg-gray-800 hover:border-gray-500"
              }`}
            >
              <FileText size={24} className="mx-auto mb-2" />
              <div className="font-semibold">{method.toUpperCase()}</div>
              <div className="text-xs text-gray-400 mt-1">
                {method === "text" && "Simple text format"}
                {method === "csv" && "Spreadsheet format"}
                {method === "json" && "Advanced format"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sample Format */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">
          📋 Sample Format ({importMethod.toUpperCase()})
        </h3>
        <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto text-green-400">
          {sampleFormats[importMethod]}
        </pre>
      </div>

      {/* Content Input */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">✏️ Paste Your Content</h3>
        <textarea
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          className="w-full h-64 bg-gray-800 border border-gray-600 rounded-lg p-4 text-white font-mono text-sm"
          placeholder={`Paste your ${importMethod.toUpperCase()} content here...`}
        />
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-400">
            {inputContent.length} characters
          </div>
          <button
            onClick={processContent}
            disabled={!inputContent.trim() || isProcessing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Zap size={16} />
                <span>Parse Content</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Parsed Results */}
      {parsedStories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-4">
            📊 Parsed Stories ({parsedStories.length})
          </h3>
          <div className="space-y-4">
            {parsedStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 p-4 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">{story.title}</h4>
                    <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded text-xs">
                      {story.genre}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`flex items-center space-x-1 ${
                        story.estimatedViralScore >= 80
                          ? "text-green-400"
                          : story.estimatedViralScore >= 60
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {story.estimatedViralScore >= 80 ? (
                        <CheckCircle size={16} />
                      ) : story.estimatedViralScore >= 60 ? (
                        <AlertCircle size={16} />
                      ) : (
                        <AlertCircle size={16} />
                      )}
                      <span className="text-sm font-bold">
                        {story.estimatedViralScore}% viral
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Characters:</span>
                    <div className="mt-1">
                      {story.characters.map((char, i) => (
                        <span
                          key={i}
                          className="inline-block bg-gray-700 px-2 py-1 rounded mr-1 mb-1 text-xs"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">
                      Messages: {story.messages.length}
                    </span>
                    <div className="mt-1 text-xs text-gray-500">
                      Cliffhangers:{" "}
                      {story.messages.filter((m) => m.isCliffhanger).length}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => onImport(parsedStories)}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 mx-auto"
            >
              <CheckCircle size={20} />
              <span>Import {parsedStories.length} Stories</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
