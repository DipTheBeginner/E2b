import express from "express";
import { Sandbox } from "e2b";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { tools } from "./tools";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        message: "E2B Agent Server is running",
    });
});

const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

app.get("/ai", async (_req, res) => {
    try {
        const sandbox = await Sandbox.create();

        const interaction = await gemini.interactions.create({
            model: "gemini-3.6-flash",

            input: "Create a file called hello.txt containing exactly 'Hello World.'",

            tools: [
                {
                    type: "function",
                    name: "update_file",
                    description: "Create or update a file inside the E2B sandbox.",
                    parameters: {
                        type: "object",
                        properties: {
                            path: {
                                type: "string",
                                description: "The path of the file to create or update.",
                            },
                            content: {
                                type: "string",
                                description: "The content to write into the file.",
                            },
                        },
                        required: ["path", "content"],
                    },
                },
            ],
        });

        console.log("Gemini interaction:", interaction);


        // 👇 ADD THIS HERE

        const functionCall = interaction.steps.find(
            (step) => step.type === "function_call"
        );


        if (
            functionCall &&
            functionCall.type === "function_call" &&
            functionCall.name === "update_file"
        ) {
            const args = functionCall.arguments as {
                path: string;
                content: string;
            };

            console.log("Gemini wants to update:", args);


            // Actually write the file into E2B
            await sandbox.files.write(
                `/home/user/${args.path}`,
                args.content
            );

            console.log("File written successfully!");


            // Read it back to verify
            const content = await sandbox.files.read(
                `/home/user/${args.path}`
            );

            console.log("File content:", content);
        }


        res.json({
            success: true,
        });

    } catch (error) {
        console.error("Gemini error:", error);

        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : String(error),
        });
    }
});


app.get("/sandbox", async (_req, res) => {
    try {
        const sandbox = await Sandbox.create();

        const result = await sandbox.commands.run("echo Hello from E2B");


        await sandbox.files.write(
            "/home/user/index.html",
            `
<!DOCTYPE html>
<html>
<head>
  <title>E2B Test</title>
</head>
<body>
  <h1>Hello from my E2B sandbox 🚀</h1>
  <p>This page is running inside an E2B sandbox.</p>
</body>
</html>
`,
        );

        await sandbox.commands.run(
            "cd /home/user && python3 -m http.server 8000",
            {
                background: true,
            }
        );

        const host = sandbox.getHost(8000);

        const previewUrl = `https://${host}`;


        res.json({
            success: true,
            previewUrl
        });
    } catch (error) {
        console.error("E2B error:", error);

        res.status(500).json({
            success: false,
            error: "Failed to create E2B sandbox",
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});