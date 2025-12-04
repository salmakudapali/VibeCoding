import { GoogleGenAI, Type } from "@google/genai";
import { GameContent, Subject } from "../types";

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

// Static fallback data for "Classic" mode to ensure speed and offline capability
const CLASSIC_ENGLISH: Partial<GameContent>[] = [
  { text: "Which letter comes after A?", answer: "B", options: ["B", "D", "C"], visualType: "alphabet" },
  { text: "Which word rhymes with Cat?", answer: "Bat", options: ["Bat", "Dog", "Fish"], visualType: "cat" },
  { text: "Find the animal:", answer: "Dog", options: ["Dog", "Car", "Ball"], visualType: "dog" },
  { text: "What is the opposite of Up?", answer: "Down", options: ["Down", "Left", "Right"], visualType: "arrow" },
  { text: "Which letter starts the word Apple?", answer: "A", options: ["A", "P", "L"], visualType: "apple" }
];

const CLASSIC_SCIENCE: Partial<GameContent>[] = [
  { text: "Which one is an animal?", answer: "Cow", options: ["Cow", "Car", "Rock"], visualType: "cow" },
  { text: "Where does rain come from?", answer: "Clouds", options: ["Clouds", "Ground", "Trees"], visualType: "cloud" },
  { text: "What color is the Sun?", answer: "Yellow", options: ["Yellow", "Purple", "Green"], visualType: "sun" },
  { text: "Which animal can fly?", answer: "Bird", options: ["Bird", "Dog", "Fish"], visualType: "bird" },
  { text: "What do plants need to grow?", answer: "Water", options: ["Water", "Candy", "Toys"], visualType: "leaf" }
];

export const generateGameContent = async (subject: Subject): Promise<GameContent | null> => {
  if (!apiKey) {
    console.warn("No API Key found for Gemini.");
    return null;
  }

  const prompts = {
    [Subject.MATH]: "Create a fun, very short (1 sentence) math story problem for a 5-year-old using simple addition or subtraction (results under 15).",
    [Subject.ENGLISH]: "Create a simple English question for a 5-year-old (spelling, rhyming, or vocabulary). Keep it fun and short.",
    [Subject.SCIENCE]: "Create a simple Science question for a 5-year-old (animals, plants, weather, or nature). Keep it fun and short."
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompts[subject]} Return strictly valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The question to ask." },
            story: { type: Type.STRING, description: "A short context or story (optional)." },
            answer: { type: Type.STRING, description: "The correct answer." },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Array of 3 options including the answer." 
            },
            visualType: { 
              type: Type.STRING, 
              description: "A visual keyword (e.g., apple, cat, sun, star, fish)." 
            },
            mathParams: {
              type: Type.OBJECT,
              description: "Only for Math questions.",
              properties: {
                num1: { type: Type.INTEGER },
                num2: { type: Type.INTEGER },
                operator: { type: Type.STRING, enum: ["+", "-"] }
              },
              nullable: true
            }
          },
          required: ["text", "answer", "options", "visualType"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        id: Date.now().toString(),
        subject,
        ...data
      } as GameContent;
    }
    return null;
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
};

export const getClassicContent = (subject: Subject): GameContent => {
  if (subject === Subject.ENGLISH) {
    const item = CLASSIC_ENGLISH[Math.floor(Math.random() * CLASSIC_ENGLISH.length)];
    return { id: Date.now().toString(), subject, ...item } as GameContent;
  } 
  if (subject === Subject.SCIENCE) {
    const item = CLASSIC_SCIENCE[Math.floor(Math.random() * CLASSIC_SCIENCE.length)];
    return { id: Date.now().toString(), subject, ...item } as GameContent;
  }
  
  // Classic Math Generator (Fallback)
  const isAddition = Math.random() > 0.3;
  const num1 = Math.floor(Math.random() * 6) + 1;
  const num2 = Math.floor(Math.random() * 5) + 1;
  let answer = 0;
  let operator: '+' | '-' = '+';
  let finalNum1 = num1;
  let finalNum2 = num2;

  if (isAddition) {
    answer = num1 + num2;
  } else {
    finalNum1 = Math.max(num1, num2);
    finalNum2 = Math.min(num1, num2);
    operator = '-';
    answer = finalNum1 - finalNum2;
  }

  // Generate options
  const opts = new Set<string>();
  opts.add(answer.toString());
  while (opts.size < 3) {
    const offset = Math.floor(Math.random() * 5) - 2;
    const candidate = answer + offset;
    if (candidate >= 0 && candidate !== answer && candidate <= 20) {
      opts.add(candidate.toString());
    }
  }

  const visuals = ['apple', 'fish', 'star', 'cookie', 'rocket'];
  return {
    id: Date.now().toString(),
    subject: Subject.MATH,
    text: `What is ${finalNum1} ${operator} ${finalNum2}?`,
    answer: answer.toString(),
    options: Array.from(opts).sort(() => Math.random() - 0.5),
    mathParams: { num1: finalNum1, num2: finalNum2, operator },
    visualType: visuals[Math.floor(Math.random() * visuals.length)]
  };
};