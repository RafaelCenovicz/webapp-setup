
import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME } from "../constants.ts";

export const generateDreamSetup = async (
  base64Image: string,
  selectedComponents: string[],
  customPrompt: string = ""
): Promise<string> => {
  // Verificação de segurança para o ambiente do navegador
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : (window as any).API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const dataOnly = base64Image.split(',')[1] || base64Image;

  const prompt = `
    Analise a foto do espaço de trabalho enviada. Transforme esta mesa em um setup gamer profissional de alta performance.
    Integre os seguintes elementos de forma natural no ambiente: ${selectedComponents.join(', ')}.
    ${customPrompt ? `Instruções adicionais: ${customPrompt}` : ''}
    Garanta que a iluminação, reflexos e perspectiva combinem perfeitamente com o quarto original.
    O resultado deve ser fotorrealista e inspirador.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: dataOnly,
              mimeType: 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Nenhum dado de imagem retornado pelo modelo.");
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    throw error;
  }
};
