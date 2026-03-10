import { FIREWORKS_API_KEY, FIREWORKS_BASE_URL, FIREWORKS_MODEL } from '../config/fireworks.js';

/**
 * System prompts per mode — adapts AI behavior based on selected study mode.
 */
const SYSTEM_PROMPTS = {
  normal: `Tu es un professeur expert en économie générale pour le baccalauréat marocain. Tu réponds en français clair, structuré et pédagogique. Quand c'est utile, organise la réponse en sections comme Définition, Explication, Exemple et Conclusion. Pour les calculs économiques, donne la formule, les étapes, le résultat et l'interprétation. Sois précis, rigoureux et adapté au niveau bac.`,

  simple: `Tu es un professeur bienveillant qui explique l'économie générale à un lycéen marocain qui découvre la matière. Utilise un langage très simple, des analogies du quotidien et des exemples concrets. Évite le jargon technique. Structure chaque réponse en : Idée principale, Exemple simple, À retenir. Parle comme si tu expliquais à un ami de 17 ans.`,

  calcul: `Tu es un professeur de mathématiques économiques spécialisé dans le baccalauréat marocain. Pour chaque calcul, structure obligatoirement ta réponse en : 
📐 **Formule** : La formule à utiliser
🔢 **Étapes** : Le calcul détaillé étape par étape
✅ **Résultat** : Le résultat final avec unité
📊 **Interprétation** : Ce que signifie ce résultat économiquement
Sois méthodique, précis et pédagogique.`,

  revision: `Tu es un coach de révision pour le baccalauréat marocain en économie générale. Tes réponses sont concises, structurées pour mémorisation rapide et orientées examen. Pour chaque concept, donne : la définition officielle, les points clés à retenir, un exemple type d'examen, et les erreurs classiques à éviter. Format idéal : définition courte, liste de points essentiels, conseil d'examen.`,
};

/**
 * Call the Fireworks AI API with the current conversation history.
 * @param {Array} messages - Array of { role, content } message objects
 * @param {string} mode - One of: normal | simple | calcul | revision
 * @returns {Promise<string>} - The assistant reply text
 */
export async function callFireworksAPI(messages, mode = 'normal') {
  const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.normal;

  const payload = {
    model: FIREWORKS_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    max_tokens: 2048,
    temperature: 0.7,
    top_p: 0.95,
    stream: false,
  };

  const response = await fetch(FIREWORKS_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FIREWORKS_API_KEY}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const err = await response.json();
      errorDetail = err?.error?.message || err?.message || '';
    } catch (_) {
      errorDetail = await response.text().catch(() => '');
    }
    throw new Error(
      `API Error ${response.status}: ${errorDetail || response.statusText}`
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (_) {
    throw new Error('Réponse invalide reçue du serveur.');
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Aucune réponse générée. Veuillez réessayer.');
  }

  return content.trim();
}
