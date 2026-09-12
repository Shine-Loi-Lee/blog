import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const OUTPUT_FILE = path.resolve('src/data/liquid-evals.json');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let evalData = {};
if (fs.existsSync(OUTPUT_FILE)) {
  evalData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    scores: {
      type: Type.OBJECT,
      properties: {
        fluidity: { 
          type: Type.NUMBER, 
          description: 'Score from 1 to 10 evaluating intellectual fluidity and seamless logical flow.' 
        },
        interconnectivity: { 
          type: Type.NUMBER, 
          description: 'Score from 1 to 10 evaluating interdisciplinary bridges across concepts.' 
        },
        adaptability: { 
          type: Type.NUMBER, 
          description: 'Score from 1 to 10 evaluating receptiveness to counterexamples and shifting contexts.' 
        },
        nonFixity: { 
          type: Type.NUMBER, 
          description: 'Score from 1 to 10 evaluating resistance to rigid dogma and epistemic absolutes.' 
        },
        openness: { 
          type: Type.NUMBER, 
          description: 'Score from 1 to 10 evaluating the degree to which it stimulates reader inquiry.' 
        },
        clarity: { 
          type: Type.NUMBER, 
          description: 'Score from 1 to 10 evaluating logical precision, conciseness, and structural density.' 
        },
      },
      required: ['fluidity', 'interconnectivity', 'adaptability', 'nonFixity', 'openness', 'clarity'],
    },
    totalScore: { 
      type: Type.NUMBER, 
      description: 'Overall weighted average score rounded to one decimal place.' 
    },
    comment: { 
      type: Type.STRING, 
      description: 'A concise critical synthesis (2-3 sentences) evaluating the text from the perspective of Liquid philosophy.' 
    },
  },
  required: ['scores', 'totalScore', 'comment'],
};

const SYSTEM_INSTRUCTION = `
You are an expert epistemic critic evaluating technical, mathematical, and philosophical manuscripts through the framework of "Liquid Philosophy".
Assess the provided document critically and objectively across six dimensions on a strict 1-10 scale:

[Evaluation Axes]
1. Fluidity: Does the argument flow naturally without being constrained by rigid pedagogical conventions?
2. Interconnectivity: Does the text construct meaningful connections across distinct domains, paradigms, or disciplines?
3. Adaptability: Is the reasoning structured to withstand alternative perspectives, edge cases, and evolving contexts?
4. Non-Fixity: Does it reject unreflective dogmatism, framing knowledge as an evolving landscape rather than a static monument?
5. Openness: Does the discourse invite the reader into active intellectual exploration and further inquiry?
6. Clarity: While remaining conceptually fluid, does the exposition preserve mathematical/technical rigor, brevity, and conceptual density?

Provide the output strictly conforming to the requested JSON schema.
`;

async function runEvaluation() {
  const files = await glob('src/content/docs/**/*.{md,mdx}');
  let evaluatedCount = 0;

  for (const filePath of files) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    if (frontmatter.template === 'splash' || content.trim().length < 100) continue;
    if (frontmatter.liquidEval === false) continue;

    let docId = path.relative('src/content/docs', filePath).replace(/\\/g, '/');
    docId = docId.replace(/\.(md|mdx)$/, '');

    if (evalData[docId]) continue;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Title: ${frontmatter.title || 'Untitled'}\n\nContent:\n${content}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });

      evalData[docId] = JSON.parse(response.text);
      evaluatedCount++;
      console.log(`[EVALUATED] ${docId} -> ${evalData[docId].totalScore}/10`);

      await sleep(7000);
    } catch (err) {
      console.error(`[FAILED] ${docId}:`, err.message);
    }
  }

  const dir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(evalData, null, 2), 'utf-8');

  if (evaluatedCount > 0) {
    console.log(`Successfully updated ${evaluatedCount} file(s) in ${OUTPUT_FILE}`);
  }
}

runEvaluation();