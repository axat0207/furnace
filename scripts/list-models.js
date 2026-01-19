const KEY = "AIzaSyCGJX265eZBPLP2xi8fRUE9gz3k0zLVUlc";

async function listModels() {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${KEY}`
        );

        if (!response.ok) {
            console.error("Error:", response.status, response.statusText);
            const text = await response.text();
            console.error("Response:", text);
            return;
        }

        const data = await response.json();
        console.log("Available models:");
        data.models?.forEach(model => {
            console.log(`- ${model.name}`);
            console.log(`  Supported methods: ${model.supportedGenerationMethods?.join(', ')}`);
        });
    } catch (e) {
        console.error("Failed to list models:", e.message);
    }
}

listModels();
