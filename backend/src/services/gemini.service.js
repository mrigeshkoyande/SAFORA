const { GoogleGenAI } = require('@google/genai');

const getEscapeCoachAdvice = async (history, newQuestion) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
      return "Take a deep breath and keep your phone accessible. If you feel unsafe, head toward a crowded, well-lit public space immediately or hold the covert SOS button to alert your Guardian Circle.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Construct prompt from history if needed
    let prompt = "You are SAFORA's Escape Coach, an expert in women's safety. Provide short, calm, and actionable advice to help someone in potential danger. Keep responses under 3 sentences if possible.\n\n";
    
    if (history && history.length > 0) {
      prompt += "Context of previous messages:\n";
      history.forEach(h => {
        prompt += `User: ${h.prompt || h.question}\nCoach: ${h.response || h.answer}\n`;
      });
    }

    prompt += `\nUser: ${newQuestion}\nCoach:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error('Gemini API Error or Rate Limit:', error.message);
    return "Trust your instincts right now. Move quickly toward a public area with CCTV, and if someone is following you, call 112 or activate Guardian Mode right away.";
  }
};

module.exports = {
  getEscapeCoachAdvice,
};
