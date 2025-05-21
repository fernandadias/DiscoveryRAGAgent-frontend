import { ObjectiveClassification } from "../types/ObjectiveClassification";

/**
 * Serviço para classificação automática de objetivos
 */
export const ObjectiveClassifierService = {
  /**
   * Classifica automaticamente o objetivo de uma pergunta
   * @param query Texto da pergunta do usuário
   * @returns Promessa com a classificação do objetivo
   */
  classifyObjective: async (query: string): Promise<ObjectiveClassification> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/objectives/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error(`Erro ao classificar objetivo: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao classificar objetivo:', error);
      throw error;
    }
  }
};
