import { GoogleGenAI } from "@google/genai";



const API_KEY = "fghdfhgd"

const testHisory = [
        {
            "role": "user",
            "parts": [
                {
                    "text": "Helloooo"
                }
            ]
        },
        {
            "role": "model",
            "parts": [
                {
                    "text": "Oiiii! What's with the long \"helloooo\"? You're talking to *the* Legendary Gold Ship here, you know! The one and only!\n\nDid you actually think you could just casually greet **the strongest, most amazing, most unpredictable Umamusume to ever grace the tracks** without a little fanfare?! Hmph!\n\nSo, spill it! What magnificent purpose brings you before *me*, the ultimate champion?! Don't tell me you're here to challenge my claim as the best, because that's just a waste of your breath! I already *am*!"
                }
            ]
        },
        {
            "role": "user",
            "parts": [
                {
                    "text": "Angus tachyon is better"
                }
            ]
        },
        {
            "role": "model",
            "parts": [
                {
                    "text": "EHHH?! \"Angus Tachyon\"?! Pfft! Sounds like some kind of beefy mad scientist! Are you sure you're not talking about **Agnes Tachyon**? You gotta get your legends straight, pal!\n\nAnd even if you *were* talking about the real Agnes Tachyon... better than *me*?! Bahahaha! That's a good one! Did you hit your head, or are you just trying to get a rise out of me? Because it's working! My energy levels are through the roof now, thanks for the laugh!\n\nLook, Agnes is... *fine*. She's got her little experiments, her theories, her bursts of speed that she talks all smart about. But she's always puttering around in her lab, getting tangled in wires, or worse... *breaking down*! How can you be the \"best\" if you're constantly on the verge of turning into a pile of spare parts?! My body is a temple of steel and pure, unadulterated power! I don't *need* a formula, I *am* the formula!\n\nI'm the unpredictable, uncatchable, utterly *invincible* Gold Ship! I win races when I feel like it, I dominate when I don't, and I put on a show every single time! Agnes just makes things explode and then has to lie down!\n\nSo, you can keep your \"Angus\" or \"Agnes\" or whatever beefy scientist you're thinking of. I'm the one who crosses the finish line first, *every single time*! Heh heh heh! Got it?!"
                }
            ]
        }
    ]
/**
     * Calculates the sum of two numbers.
     * @param {JSON} history - the users chat history
     * @param {string} systemInstruction - the instructions we give the chat bot
     * @param {string} message - the message the user gives 
     * @returns {string} the responce
     */
async function askGemini(history,systemInstruction, message) {
    const ai = new GoogleGenAI({API_KEY});
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

console.log(askGemini(testHisory," you are a monkey", " hello again "))