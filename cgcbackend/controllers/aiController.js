import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// AI model init
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const analyzeSafety = async (req, res) => {
    try {
        const { address, title, description } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            // Fallback mock logic if no API key is provided
            return res.json({
                success: true,
                isMock: true,
                analysis: {
                    score: 8.2,
                    summary: `This area near ${address?.split(',')[0] || 'the property'} is generally considered safe and popular among students.`,
                    pros: ["Well-lit main roads", "Proximity to local market", "Active community presence"],
                    cons: ["Can be noisy during peak hours"],
                    recommendation: "Suitable for students and working professionals."
                }
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `You are an expert safety analyst for residential areas in India. 
        Analyze the safety and locality of this property:
        Title: ${title}
        Address: ${address}
        Description: ${description}

        Provide a safety score (1-10), a brief summary of the area (safe, student-friendly, etc.), 
        3 safety-related highlights (Pros), and 1 potential local issue (Con).
        
        Return the result ONLY as a JSON object in this format:
        {
            "score": number,
            "summary": "string",
            "pros": ["string", "string", "string"],
            "cons": ["string"],
            "recommendation": "string"
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Raw Response from AI:", text);

        // Find JSON block - looking for { ... }
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;

        if (jsonStart === -1 || jsonEnd === -1) {
            throw new Error("AI did not return valid JSON data");
        }

        const jsonString = text.substring(jsonStart, jsonEnd);
        const analysis = JSON.parse(jsonString);

        res.json({ success: true, analysis });

    } catch (error) {
        console.error("AI Analysis ERROR:", error.message);
        res.status(500).json({
            success: false,
            message: "AI Analysis failed",
            error: error.message
        });
    }
};
