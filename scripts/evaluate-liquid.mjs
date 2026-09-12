import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

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
        linkedKnowledge: { 
          type: Type.NUMBER, 
          description: 'L - Score (1-10): Knowledge interconnectivity and contextual expansion across concepts.' 
        },
        intuitiveInterface: { 
          type: Type.NUMBER, 
          description: 'I - Score (1-10): Clarity, logical progression, and frictionless cognitive flow for newcomers.' 
        },
        qualitativeLearning: { 
          type: Type.NUMBER, 
          description: 'Q - Score (1-10): Depth and conceptual substance prioritized over mere quantity of information.' 
        },
        understandableExplanation: { 
          type: Type.NUMBER, 
          description: 'U - Score (1-10): Precision, conciseness, and rigor in explaining core mechanisms.' 
        },
        interactiveExperience: { 
          type: Type.NUMBER, 
          description: 'I - Score (1-10): Reader engagement, inquiry stimulation, and active cognitive exploration.' 
        },
        deepDive: { 
          type: Type.NUMBER, 
          description: 'D - Score (1-10): Thoroughness from fundamental definitions to complete theoretical mastery.' 
        },
      },
      required: [
        'linkedKnowledge', 
        'intuitiveInterface', 
        'qualitativeLearning', 
        'understandableExplanation', 
        'interactiveExperience', 
        'deepDive'
      ],
    },
    totalScore: { 
      type: Type.NUMBER, 
      description: 'Overall arithmetic mean score rounded to one decimal place.' 
    },
    comment: { 
      type: Type.STRING, 
      description: 'A critical synthesis (2-3 sentences) evaluating the document strictly against the LIQUID philosophy.' 
    },
  },
  required: ['scores', 'totalScore', 'comment'],
};

const SYSTEM_INSTRUCTION = `
You are an expert curriculum and epistemic critic evaluating educational and technical manuscripts through the framework of the "LIQUID Philosophy".
Critically assess the provided document on a strict 1–10 scale across the following 6 core pillars:

[LIQUID Evaluation Pillars]
1. [L] Linked Knowledge: Knowledge is not isolated data, but expands in meaning through interconnected concepts. Does the text weave interdisciplinary bridges and conceptual relationships rather than treating facts in isolation?
2. [I] Intuitive Interface: The structural layout and pedagogical flow should allow even first-time readers to grasp the progression effortlessly. Is the conceptual sequence natural, frictionless, and intuitively structured?
3. [Q] Qualitative Learning: Prioritize intellectual depth and substantive insight over sheer volume. Does the exposition emphasize conceptual essence and genuine understanding rather than superficial cataloging?
4. [U] Understandable Explanation: Clarity establishes credibility. Is the core exposition logically precise, mathematically rigorous, and articulate without unnecessary verbosity?
5. [I] Interactive Experience: Transcend one-way didactic delivery by empowering readers to direct their own cognitive path. Does the discourse stimulate active inquiry, reflection, and self-guided exploration rather than passive reception?
6. [D] Deep Dive: Pursue uncompromising thoroughness from foundational primitives to comprehensive theoretical mastery. Does the manuscript systematically build from first principles to exhaustive conceptual fluency?

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