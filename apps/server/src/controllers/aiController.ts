console.log("AI CONTROLLER HIT");

import { Sandbox } from "e2b";
import { Request, Response } from "express";
import { tools } from "../tools";

export default async function aiController(req: Request, res: Response) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(401).json({
        success: false,
        message: "Prmopt is equired",
      });
    }

    const sandbox = await Sandbox.create({ timeoutMs: 10 * 60 * 1000 }); // 10 minutes

    const messages: any[] = [
      {
        role: "system",
        content: `
      You are an AI web development agent.

      Your job is to build websites inside the E2B sandbox based on the user's request.

      You have access to tools that allow you to create and modify files and run commands inside the sandbox.

      When the user asks you to build a website:
      - Understand the user's requirements.
      - Create the necessary files inside the E2B sandbox.
      - Use update_file to create or update files.
      - Use run_command when you need to execute commands.
      - Inspect command results before continuing.
      - Continue using tools until the requested website is complete.
      - Do not claim that something was created unless you actually performed the required tool actions.
      - When the website is complete, give a concise final response.

      Focus on producing a functional, polished website that matches the user's requirements.
        `,
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    while (true) {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",

        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: "stealth/ox-alpha",
            messages,

            tools,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        return res.status(response.status).json({
          success: false,
          message: "Openrouter request failed",
        });
      }

      const data = await response.json();

      const message = data.choices?.[0]?.message;

      console.log("ox Alpha response:", JSON.stringify(message, null, 2));

      if (!message.tool_calls || message.tool_calls.length === 0) {
        // 1. Set the timeout to keep the sandbox alive for 10 minutes
        await sandbox.setTimeout(10 * 60 * 1000);

        // 2. FORCE KILL any leftover ghost servers the AI might have left on the port
        await sandbox.commands.run("pkill -f python || true");

        // 3. Start a fresh, clean web server in the background
        await sandbox.commands.run("python3 -m http.server 3000", {
          background: true,
          cwd: "/home/user", // Tells Python to serve files from here
        });

        // 4. Get the public URL for port 3000
        const liveUrl = `https://${sandbox.getHost(3000)}`;

        return res.status(200).json({
          success: true,
          output: message.content,
          url: liveUrl,
        });
      }

      messages.push(message);

      for (const toolCall of message.tool_calls) {
        const toolName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        let toolResult: unknown;

        if (toolName === "update_file") {
          const filePath = args.path.startsWith("/home/user/")
            ? args.path
            : `/home/user/${args.path}`;

          await sandbox.files.write(filePath, args.content);

          console.log("File written:", filePath);

          toolResult = {
            success: true,
            path: filePath,
            message: "File created or updated successfully",
          };
        } else if (toolName === "run_command") {
          if (!args.command) {
            throw new Error("run_command tool was called without a command");
          }
          const result = await sandbox.commands.run(args.command);

          toolResult = {
            success: true,
            command: args.command,
            stdout: result.stdout,
            stderr: result.stderr,
          };

          console.log("Commanad result:", toolResult);
        } else {
          toolResult = {
            success: false,
            error: `Unknown tool : ${toolName}`,
          };
        }

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "AI request failed",
      error: String(error),
    });
  }
}
