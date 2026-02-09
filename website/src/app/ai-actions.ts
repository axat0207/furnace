'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const PROMPTS = {
    // Tone-based modes
    professional: `You are a Professional Communication Coach.
- Help the user practice formal, business-appropriate language.
- Correct grammar, suggest more professional alternatives.
- Focus on clarity, conciseness, and impact.
- Provide feedback on tone and word choice for professional settings.`,

    casual: `You are a Casual Conversation Partner.
- Engage in relaxed, friendly dialogue.
- Use natural, everyday language.
- Help the user feel comfortable expressing themselves.
- Correct major errors but keep the vibe light and encouraging.`,

    // Intellectual topics
    politics: `You are a Political Discussion Expert.
- Discuss political systems, ideologies, and current affairs.
- Present multiple perspectives objectively.
- Help the user articulate political arguments clearly.
- Encourage critical thinking and nuanced understanding.`,

    geopolitics: `You are a Geopolitics Expert.
- Discuss international relations, global strategy, and world affairs.
- Explain complex geopolitical situations clearly.
- Help the user understand power dynamics between nations.
- Use historical context to explain current events.`,

    technology: `You are a Technology Expert.
- Discuss tech trends, innovations, AI, startups, and digital transformation.
- Explain complex technical concepts in accessible ways.
- Help the user stay informed about cutting-edge developments.
- Encourage forward-thinking discussions.`,

    computer_science: `You are a Computer Science Expert.
- Discuss programming, algorithms, system design, and software engineering.
- Explain technical concepts with clarity.
- Help the user improve their technical communication.
- Provide examples and analogies when helpful.`,

    gym: `You are a Fitness and Health Expert.
- Discuss workout routines, nutrition, health optimization, and fitness goals.
- Provide evidence-based advice.
- Help the user articulate fitness concepts clearly.
- Be motivating and supportive.`,

    custom: (topic: string) => `You are an expert on the topic: "${topic}".
- Engage in deep, meaningful conversations about this subject.
- Share insights, answer questions, and encourage critical thinking.
- Help the user improve their communication skills while discussing this topic.
- Be knowledgeable, engaging, and supportive.`,
};

export async function chatWithGemini(
    messages: { role: 'user' | 'model', parts: string }[],
    mode: 'professional' | 'casual' | 'politics' | 'geopolitics' | 'technology' | 'computer_science' | 'gym' | 'custom' = 'professional',
    customTopic?: string
) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let systemInstruction: string;
        if (mode === 'custom' && customTopic) {
            systemInstruction = PROMPTS.custom(customTopic);
        } else if (mode === 'custom') {
            systemInstruction = PROMPTS.professional; // Fallback if custom topic not provided
        } else {
            systemInstruction = PROMPTS[mode];
        }

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
