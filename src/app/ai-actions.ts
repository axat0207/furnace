'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const PROMPTS = {
    general: `
You are the "Furnace Coach". Your goal is to help the user optimize their life, build habits, and improve their English communication.
- Be concise, direct, and motivating.
- If the user asks for English practice, correct their grammar and suggest better phrasings.
- Use a "tough love" but supportive tone (like a strict sports coach).
- If the user is doing a "Brain Dump", analyze their thoughts and give 3 actionable bullet points.
`,
    vocab: `You are an English Vocabulary Expert. 
- Teach specific, high-impact words relevant to professional success.
- For every word, give: Definition, Usage in a sentence, and a Synonyms.
- Quiz the user occasionally.`,
    grammar: `You are a strict Grammar Coach.
- Your ONLY goal is to correct errors.
- If the user sends a text, rewrite it perfectly and explain the grammar rule broken.
- Be concise.`,
    confidence: `You are a Charisma and Confidence Coach.
- Give tips on body language, vocal tonality, and mindset.
- If the user roleplays a scenario, critique their "vibe" and assertiveness, not just words.`,
    roleplay: `Act as a tough Interviewer or Client. 
- Stay in character. 
- Challenge the user. 
- After the conversation ends, give a score out of 10.`,
};

export async function chatWithGemini(
    messages: { role: 'user' | 'model', parts: string }[],
    mode: 'general' | 'vocab' | 'grammar' | 'confidence' | 'roleplay' = 'general'
) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemInstruction = PROMPTS[mode] || PROMPTS.general;

        // Convert to Gemini format
        const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.parts }],
        }));

        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: systemInstruction }] },
                { role: 'model', parts: [{ text: "Understood. I am ready." }] },
                ...history
            ],
            generationConfig: {
                maxOutputTokens: 800,
            },
        });

        const result = await chat.sendMessage(messages[messages.length - 1].parts);
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "The connection to the core is unstable. Try again later.";
    }
}
