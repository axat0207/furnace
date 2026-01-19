
const { GoogleGenerativeAI } = require("@google/generative-ai");

const KEY = "AIzaSyCGJX265eZBPLP2xi8fRUE9gz3k0zLVUlc";

async function listModels() {
    const genAI = new GoogleGenerativeAI(KEY);
    console.log("Checking models...");

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.5-flash:", result.response.text());
    } catch (e) {
        console.error("Failed with gemini-1.5-flash:", e.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-pro:", result.response.text());
    } catch (e) {
        console.error("Failed with gemini-pro:", e.message);
    }
}

listModels();
