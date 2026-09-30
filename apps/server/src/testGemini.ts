import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { tools } from "./tools";

const ai = new GoogleGenAI({});

const response = await ai.models.generateContent({
  model: "gemini-3.8-flash",
  contents:
    "Create a simple website with an index.html file containing a Hello World heading.",
  config: {
    tools,
  },
});

console.log(JSON.stringify(response, null, 2));