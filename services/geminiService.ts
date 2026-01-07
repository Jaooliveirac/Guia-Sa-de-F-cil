
import { GoogleGenAI, Type } from "@google/genai";
import { UserAssessment, EducationalResult } from "../types";

export async function getEducationalGuidance(assessment: UserAssessment): Promise<EducationalResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Aja como um assistente virtual de saúde experiente. Analise os seguintes sintomas e dados do usuário para fornecer orientações EDUCATIVAS.
    Sempre reforce que esta análise NÃO substitui uma consulta médica.
    
    DADOS DO USUÁRIO:
    - Localização: ${assessment.location || 'Não informada'}
    - IMC: ${assessment.bmi ? assessment.bmi.toFixed(1) : 'Não calculado'} (Peso: ${assessment.weight}kg, Altura: ${assessment.height}cm)
    - Sintomas selecionados: ${assessment.selectedSymptoms.join(', ')}
    - Descrição adicional: ${assessment.description || 'Nenhuma'}
    - Intensidade relatada: ${assessment.intensity}
    - Medicamentos em uso contínuo: ${assessment.continuousMedication || 'Nenhum'}
    - Alergias conhecidas: ${assessment.allergies || 'Nenhuma'}

    REGRAS DE ANÁLISE:
    1. Considere a LOCALIZAÇÃO: Se houver surtos regionais conhecidos (ex: Dengue, gripe sazonal, viroses), riscos climáticos (frio extremo, ar seco) ou poluição, inclua isso na explicação.
    2. Considere o IMC: Se o IMC estiver muito acima ou abaixo do normal, avalie se isso pode estar agravando sintomas como fadiga, dores articulares ou falta de ar.
    3. Sugira uma condição potencial (ex: gripe, enxaqueca, estresse, arbovirose).
    4. Forneça uma explicação sobre a relação entre os sintomas e os fatores externos (clima/local).
    5. Informe sobre medicamentos de venda livre (OTC) comuns, respeitando alergias citadas.
    6. Liste sinais de alerta (red flags).
    7. Determine se o caso é urgente.

    RESPONDA EM JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            potentialCondition: { type: Type.STRING },
            explanation: { type: Type.STRING },
            generalMedicationInfo: { type: Type.STRING },
            warningSigns: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            isUrgent: { type: Type.BOOLEAN },
            bmiContext: { type: Type.STRING, description: "Breve comentário educativo sobre o impacto do IMC nos sintomas" },
            locationContext: { type: Type.STRING, description: "Breve comentário sobre riscos regionais ou climáticos" }
          },
          required: ["potentialCondition", "explanation", "generalMedicationInfo", "warningSigns", "isUrgent"]
        }
      }
    });

    const text = response.text;
    return JSON.parse(text || '{}') as EducationalResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Não foi possível gerar a orientação agora. Por favor, tente novamente mais tarde ou consulte um médico.");
  }
}
