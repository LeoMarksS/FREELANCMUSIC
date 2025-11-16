import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI | null => {
  if (!API_KEY) {
    return null;
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
};

export const generateBio = async (keywords: string): Promise<string> => {
  const aiClient = getAiClient();

  if (!aiClient) {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
    return "Chave de API não configurada. Adicione sua Chave de API para usar este recurso.";
  }

  try {
    const prompt = `Gere uma biografia de músico curta, profissional e envolvente com base nestas palavras-chave: "${keywords}". A biografia deve ser em primeira pessoa, com cerca de 50-70 palavras. Destaque suas habilidades, experiência e paixão pela música.`;
    
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Erro ao gerar bio com a API Gemini:", error);
    return "Ocorreu um erro ao gerar a biografia. Por favor, tente novamente ou escreva a sua própria.";
  }
};
