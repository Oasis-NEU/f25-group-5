import { GoogleGenAI } from "@google/genai";



const API_KEY = "YOUR API KEY HERE"


/**
     * Calculates the sum of two numbers.
     * @param {JSON} history - the users chat history
     * @param {string} systemInstruction - the instructions we give the chat bot
     * @param {string} message - the message the user gives 
     * @returns {string} the responce
     */
async function askGemini(history,systemInstruction, message) {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const chat = ai.chats.create({
        history: history,
        model: "gemini-2.5-flash"
    })

    const response = await chat.sendMessage({
    message: message,
    systemInstructions: systemInstruction,
  });
    
    return response.text
    
    
}
