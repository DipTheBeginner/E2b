console.log("AI CONTROLLER HIT");

import { Sandbox } from "e2b";
import { Request, Response } from "express";
import { tools } from "../tools";

const SYSTEM_PROMPT = `
You are an AI coding agent.

Your job is to execute the user's coding requests inside an E2B sandbox.

You have access to these tools:
- update_file: create or update files
- run_command: execute shell commands
- start_server: start a web server and generate a preview URL

Rules:

1. Understand what the user wants before acting.
2. When the user asks you to create or modify a website, actually create or modify the files in the E2B sandbox.
3. Use update_file to create or update files.
4. Use run_command when you need to execute commands.
5. When a website needs to be previewed, use start_server.
6. After completing the task, give the user a short summary of what was done.
7. If a preview URL is available, include it in the final response.
8. Do not only explain code when the user asks you to build something. Actually perform the task using the available tools.
`;

export async function aiController(req: Request, res: Response) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(401).json({
        success: false,
        message: "Prmopt is equired",
      });
    }

    const sandbox = await Sandbox.create();

    const messages: any[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
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
            model: "z-ai/glm-5.2",
            max_tokens: 8000,
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
          error: errorText,
        });
      }

      const data = await response.json();

      const message = data.choices?.[0]?.message;

      console.log("ox Alpha response:", JSON.stringify(message, null, 2));

      if (!message) {
        throw new Error("No mesasge returned from ox alpha");
      }

      if (!message.tool_calls || message.tool_calls.length === 0) {
        return res.status(200).json({
          success: true,
          output: message.content,
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
        } else if (toolName === "start_server") {
          if (!args.port) {
            throw new Error("start_server tool was called without a port");
          }
          const port = args.port;
          const result = await sandbox.commands.run(
            `python3 -m http.server ${port} --directory /home/user`,
            {
              background: true,
            },
          );

          console.log("Server command result:", result);

          const host = sandbox.getHost(port);
          const previewUrl = `https://${host}`;

          toolResult = {
            success: true,
            port,
            previewUrl,
            message: "Web server started successfully",
          };
          console.log("previewUrl", previewUrl);
        } else if (toolName === "read_file") {
          const filePath = args.path.startsWith("/home/user/")
            ? args.path
            : `/home/user/${args.path}`;

          const content = await sandbox.files.read(filePath);

          toolResult = {
            success: true,
            path: filePath,
            content,
          };

          console.log("File read:", filePath);
        } else if (toolName === "delete_file") {
          const filePath = args.path.startsWith("/home/user/")
            ? args.path
            : `/home/user/${args.path}`;

          await sandbox.files.remove(filePath);

          toolResult = {
            success: true,
            path: filePath,
            message: "File deleted successfully",
          };

          console.log("File deleted:", filePath);
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
