import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateAIResponse = async (apiKey, modelName, history, systemPrompt) => {
    if (!apiKey) {
        return "CHYBA: Chybí API klíč. Jdi do Nastavení a vlož ho.";
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName || "gemini-1.5-flash" });

        // Construct history
        let chatHistory = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        // Remove the last message because we will send it via sendMessage
        const lastMessage = chatHistory[chatHistory.length - 1];
        const historyForInit = chatHistory.slice(0, -1);

        // Ensure history starts with user if it's not empty and starts with model
        if (historyForInit.length > 0 && historyForInit[0].role === 'model') {
            historyForInit.unshift({
                role: 'user',
                parts: [{ text: "Start simulation." }]
            });
        }

        // Prepend system prompt to the first message or the current message
        if (systemPrompt) {
            const promptPrefix = `INSTRUKCE: ${systemPrompt}\n\nKONVERZACE:\n`;

            if (historyForInit.length > 0) {
                // Prepend to the very first message in history
                historyForInit[0].parts[0].text = promptPrefix + historyForInit[0].parts[0].text;
            } else {
                // If no history, prepend to the message we are about to send
                lastMessage.parts[0].text = promptPrefix + lastMessage.parts[0].text;
            }
        }

        const chatSession = model.startChat({
            history: historyForInit,
        });

        const result = await chatSession.sendMessage(lastMessage.parts[0].text);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("AI Error:", error);
        return `CHYBA AI: ${error.message}`;
    }
};
