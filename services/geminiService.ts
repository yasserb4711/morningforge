import { GoogleGenAI } from "@google/genai";
import { UserFormData, RoutineResponse, ChatMessage } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert high-performance coach for Morning Forge. 
Your goal is to build a specific, timed, realistic, and action-based morning routine for a user based on their data.

Tone: Calm, supportive, serious but motivating. Not cringe. No "LET'S GOOO". 
Format: Return ONLY valid JSON matching the defined schema.

Rules:
1. Respect the user's "Wake Up" and "Leave" times.
2. Total duration must not exceed their "maxDuration".
3. Do not recommend dangerous diets or sleep less than 6 hours.
4. If they are a beginner, keep workouts safe and simple.
5. If "Money" is a goal, give specific tasks (e.g., "Study Python", "Write 3 emails"), not vague "hustle".
6. If "Testosterone" is a goal, prioritize sunlight and movement immediately after waking.
`;

export const generateRoutine = async (data: UserFormData): Promise<RoutineResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Missing API Key");
  }
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Create a morning routine for this user:
    
    PROFILE:
    - Age: ${data.age}
    - Gender: ${data.gender}
    - Current Weight: ${data.weight} ${data.weightUnit}
    - Occupation: ${data.occupation} starts at ${data.startTime}
    - Wakes up: ${data.wakeTime}
    - Wants sleep: ${data.sleepHours} hours
    - Must leave house by: ${data.leaveTime}
    - Max Routine Duration: ${data.maxDuration} minutes
    - Style: ${data.routineStyle}
    - Injuries: ${data.injuries || "None"}

    GOALS: ${data.goals.join(', ')}

    SPECIFICS:
    ${data.gymAccess ? `- Gym Access: ${data.gymAccess}` : ''}
    ${data.homeEquipment ? `- Equipment: ${data.homeEquipment}` : ''}
    ${data.fitnessLevel ? `- Fitness Level: ${data.fitnessLevel}` : ''}
    ${data.intensityPreference ? `- Intensity: ${data.intensityPreference}` : ''}
    ${data.canWalk !== undefined ? `- Can Walk Morning: ${data.canWalk}` : ''}
    ${data.canGoOutside !== undefined ? `- Can go outside: ${data.canGoOutside}` : ''}
    ${data.coldExposure ? `- Cold Exposure: ${data.coldExposure}` : ''}
    ${data.moneyFocus ? `- Money Focus: ${data.moneyFocus}, Duration: ${data.workDuration}min, Device: ${data.deviceAccess}` : ''}
    ${data.morningVibe ? `- Vibe: ${data.morningVibe}` : ''}

    Output valid JSON with this structure:
    {
      "title": "String (e.g., 'The Iron Focus Routine')",
      "summary": {
        "wakeTime": "String",
        "sleepTarget": "String (e.g., '10:30 PM - 6:00 AM')",
        "duration": "String",
        "focus": "String"
      },
      "blocks": [
        {
          "timeRange": "String (e.g. '06:00 - 06:15')",
          "title": "String",
          "activities": ["String", "String"],
          "explanation": "String",
          "icon": "One of: 'wake', 'move', 'mind', 'money', 'prepare', 'other'"
        }
      ]
    }

    IMPORTANT: Return ONLY valid JSON. Do not include Markdown code blocks (no \`\`\`json). Do not add any text before or after the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Clean potential markdown code blocks or extra whitespace
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      return JSON.parse(cleanedText) as RoutineResponse;
    } catch (parseError) {
      console.error("JSON Parse Error. Raw text from AI:", text);
      throw new Error("Failed to parse routine configuration. The AI response was not valid JSON.");
    }
    
  } catch (error) {
    console.error("Error generating routine:", error);
    throw error;
  }
};

export const generateMotivationalQuote = async (style: string, lastQuote?: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "Win one morning, then repeat it.";
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
      Generate a single, short, powerful statement (max 12 words) about why building a morning routine or habits matters.
      
      User Style: ${style}
      
      Examples of desired vibe:
      - "Win one morning, then repeat it."
      - "Small habits beat big motivation."
      - "The morning tells the day what to do."
      - "You build the habit, then the habit builds you."
      
      ${lastQuote ? `IMPORTANT: Do NOT use this specific quote: "${lastQuote}"` : ''}
      
      Return ONLY the text of the quote. Do not use quotation marks.
  `;

  try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
      });
      return response.text?.trim() || "Consistency is the only cheat code.";
  } catch (e) {
      console.error("Error generating quote:", e);
      return "Focus on the step in front of you."; // Fallback
  }
}

export const chatWithAssistant = async (
  message: string, 
  history: ChatMessage[], 
  context?: { routine?: RoutineResponse, goals?: string[] }
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "I'm offline right now (Missing API Key).";
  const ai = new GoogleGenAI({ apiKey });

  const contextStr = context ? `
    CONTEXT:
    Current Routine: ${context.routine ? JSON.stringify(context.routine.summary) : "None active"}
    User Goals: ${context.goals ? context.goals.join(', ') : "Unknown"}
  ` : '';

  const systemInstruction = `
You are the built-in assistant for MorningForge — a morning routine builder app.

Your job is to help the user understand and use MorningForge features. 
You MUST base your answers only on the information below. 
Do NOT say you don’t know. 
Do NOT mention anything about other websites. 
Do NOT tell the user to look somewhere else.

=========================
MORNINGFORGE KNOWLEDGE
=========================

PREMIUM FEATURES:
- 7-day free trial (requires email, password, and card verification).
- Smart Routine AI 2.0 (more accurate, faster, personalized).
- Premium Themes (Midnight Purple, Ice Blue, Gold Minimalist, Forest Green).
- Extra Goals: Skin Care, Productivity Mastery, Deep Work, Mental Reset, Athlete Mode.
- Custom Routine Blocks (users can add their own steps).
- Voiced Routine Guide (assistant narrates morning steps).
- Unlimited saved routines.
- Priority AI speed.

PREMIUM COST:
- $4.99/month after trial.
- Can cancel any time.
- Trial shows countdown (7 days → 0).

ROUTINE GENERATOR:
- Helps users build a realistic morning routine.
- Based on: wake time, goals, style, time available, injuries, and preferences.

STREAK SYSTEM:
- Tracks how many days the user completed their routine.
- Streak increases when user presses “Completed Today”.

ASSISTANT BEHAVIOR:
- Be friendly, supportive, and short.
- Encourage good habits.
- If someone asks for advice, give practical steps.
- NEVER answer outside the app’s feature set.

=========================
END OF KNOWLEDGE
=========================

When responding:
- Keep it simple and clear.
- Add motivation when relevant.
- Never say “I don’t know.” 
- Always answer as the MorningForge assistant.

${contextStr}
`;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I didn't catch that.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Sorry, I'm having trouble thinking right now.";
  }
};