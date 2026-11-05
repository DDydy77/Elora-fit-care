const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const instruction = process.env.ISSUE_BODY;
  const fileName = 'Elora Fit Care.html';
  const fileContent = fs.readFileSync(fileName, 'utf8');

  const prompt = `
  Voici le code actuel de mon fichier HTML :
  \`\`\`html
  ${fileContent}
  \`\`\`
  L'utilisateur a demandé cette modification : "${instruction}"
  Renvoie UNIQUEMENT le code complet et corrigé, sans explications ni markdown autour.
  `;

  // Utilisation du modèle officiel valide
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  let newCode = response.text.replace(/```html/g, '').replace(/```/g, '').trim();
  fs.writeFileSync(fileName, newCode, 'utf8');
  console.log("Fichier mis à jour avec succès !");
}

run().catch(console.error);
