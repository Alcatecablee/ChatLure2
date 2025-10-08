import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper function for consistent responses
function sendResponse(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return res.end(JSON.stringify(data));
}

const STORY_GENRES = {
  scandal: "Infidelity, secrets, and shocking revelations",
  drama: "Emotional relationship conflicts and family drama",
  mystery: "Unexplained events and hidden secrets",
  family: "Family conflicts, strict parents, and teen drama",
  moral: "Moral dilemmas and ethical conflicts",
  entitled: "Entitled behavior and unreasonable demands",
  confession: "Secret confessions and hidden truths",
};

export default async function handler(req, res) {
  const { method } = req;

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return sendResponse(res, 200, {});
  }

  if (method !== "POST") {
    return sendResponse(res, 405, {
      error: `Method ${method} not allowed`,
    });
  }

  try {
    const { genre, storyPrompt, length = "medium" } = req.body;

    if (!genre && !storyPrompt) {
      return sendResponse(res, 400, {
        error: "Either genre or storyPrompt is required",
      });
    }

    // Determine message count based on length
    const messageCount =
      length === "short" ? "8-12" : length === "long" ? "20-30" : "12-18";

    const genreDescription = STORY_GENRES[genre] || "dramatic story";

    const systemPrompt = `You are a creative story writer for ChatLure, a voyeur-style messaging app where users watch dramatic text conversations unfold in real-time.

Your task is to generate engaging, dramatic stories told through text messages between characters.

Story Requirements:
- Genre: ${storyPrompt || genreDescription}
- Create ${messageCount} text messages total
- Include 2-4 characters with distinct personalities
- Build tension with cliffhangers and emotional moments
- Use realistic texting language (abbreviations, emojis, typos)
- Include viral triggers like shocking revelations, betrayals, or confrontations

Format your response as a JSON object with this structure:
{
  "title": "Engaging story title (max 60 characters)",
  "description": "Brief description of the story premise",
  "genre": "${genre || "drama"}",
  "characters": [
    {
      "name": "Character name",
      "avatar": "emoji representing character",
      "personality": "Brief personality description",
      "role": "protagonist/supporting/antagonist"
    }
  ],
  "messages": [
    {
      "sender": "character name (must match a character from characters array)",
      "message": "The actual text message",
      "emotion": "shocked/angry/devastated/excited/nervous/casual/explaining",
      "isCliffhanger": false,
      "timestamp": "relative timestamp like '2m ago' or 'Just now'"
    }
  ],
  "viralScore": number between 60-99,
  "tags": ["relevant", "tags", "for", "story"]
}`;

    const userPrompt = storyPrompt
      ? `Create a dramatic text message story about: ${storyPrompt}`
      : `Create a dramatic text message story in the ${genre} genre.`;

    console.log("Generating story with Groq...");

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.9,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const generatedContent = completion.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error("No content generated from Groq");
    }

    let storyData;
    try {
      storyData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error("Failed to parse Groq response:", generatedContent);
      throw new Error(
        "AI generated invalid response format. Please try again.",
      );
    }

    // Validate required fields
    if (!storyData.title || !storyData.characters || !storyData.messages) {
      throw new Error(
        "AI response missing required fields. Please try again.",
      );
    }

    // Add metadata
    const story = {
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...storyData,
      source: "ai-generated",
      isActive: true,
      createdAt: new Date().toISOString(),
      stats: {
        views: 0,
        completions: 0,
        shares: 0,
        avgRating: 0,
        completionRate: 0,
      },
    };

    return sendResponse(res, 200, {
      success: true,
      story,
    });
  } catch (error) {
    console.error("AI Story Generation error:", error);
    return sendResponse(res, 500, {
      error: "Failed to generate story",
      details: error.message,
    });
  }
}
