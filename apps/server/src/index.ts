import express from "express";
import { Sandbox } from "e2b";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { tools } from "./tools";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
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

        let interaction = await gemini.interactions.create({
            model: "gemini-3.6-flash",

            input:
                "Create a file called test.py containing a Python program that prints 'Hello from Python', then run that program.",

            tools,
        });

        while (interaction.status === "requires_action") {

            console.log(
                "Gemini interaction status:",
                interaction.status
            );

            const functionCall = interaction.steps.find(
                (step) => step.type === "function_call"
            );

            if (
                !functionCall ||
                functionCall.type !== "function_call"
            ) {
                throw new Error(
                    "Gemini requires action but no function call was found"
                );
            }

            const args =
                functionCall.arguments as Record<string, string>;

            console.log(
                "Gemini wants to call:",
                functionCall.name
            );

            console.log("Arguments:", args);

            let toolResult;

            if (functionCall.name === "update_file") {

                const filePath = args.path.startsWith("/home/user/")
                    ? args.path
                    : `/home/user/${args.path}`;

                await sandbox.files.write(
                    filePath,
                    args.content
                );

                console.log(
                    "File written successfully:",
                    filePath
                );

                toolResult = {
                    type: "function_result" as const,
                    call_id: functionCall.id,
                    name: functionCall.name,

                    result: {
                        success: true,
                        path: args.path,
                        message: "File was successfully written",
                    },
                };

            } else if (functionCall.name === "run_command") {

                console.log(
                    "Running command:",
                    args.command
                );

                const result = await sandbox.commands.run(
                    args.command
                );

                console.log(
                    "Command output:",
                    result.stdout
                );

                console.log(
                    "Command error:",
                    result.stderr
                );

                toolResult = {
                    type: "function_result" as const,
                    call_id: functionCall.id,
                    name: functionCall.name,

                    result: {
                        success: true,
                        stdout: result.stdout,
                        stderr: result.stderr,
                    },
                };

            } else {
                throw new Error(
                    `Unknown tool: ${functionCall.name}`
                );
            }

            console.log(
                "Sending tool result to Gemini:",
                toolResult
            );

            interaction = await gemini.interactions.create({
                model: "gemini-3.6-flash",

                previous_interaction_id: interaction.id,

                input: [toolResult],
            });

            console.log(
                "Next Gemini status:",
                interaction.status
            );
        }

        // IMPORTANT:
        // This must be OUTSIDE the while loop.
        console.log(
            "Gemini completed:",
            interaction.output_text
        );

        return res.json({
            success: true,
            output: interaction.output_text,
        });

    } catch (error) {

        console.error(
            "Gemini error:",
            error
        );

        return res.status(500).json({
            success: false,

            error:
                error instanceof Error
                    ? error.message
                    : String(error),
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