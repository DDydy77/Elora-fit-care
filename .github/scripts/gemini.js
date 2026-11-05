const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const instruction = process.env.ISSUE_BODY;
  const fileName = 'index.html';
  const fileContent = fs.readFileSync(fileName, 'utf8');

  const prompt = `
  Voici le code actuel du fichier HTML (${fileName}) :
  \`\`\`html
  ${fileContent}
  \`\`\`

  Demande de modification : "${instruction}"

  Consignes strictes :
  1. Applique la modification demandée directement dans le code HTML.
  2. Renvoie l'INTÉGRALITÉ du code HTML corrigé.
  3. Ne mets aucun texte explicatif avant ou après le code.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  let newCode = response.text.replace(/^```html\s*/i, '').replace(/```\s*$/i, '').trim();
  fs.writeFileSync(fileName, newCode, 'utf8');
  console.log("Fichier mis à jour avec succès !");
}

run().catch(console.error);
