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

    const sandbox = await Sandbox.create();

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
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
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

    if (!message) {
      throw new Error("No mesasge returned from ox alpha");
    }

    if (!message.tool_calls || message.tool_calls.length === 0) {
      return res.status(200).json({
        success: true,
        output: message.content,
      });
    }

    for (const toolCall of message.tool_calls) {
      const toolName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);

      if (toolName === "update_file") {
        const filePath = args.path.startsWith("/home/user/")
          ? args.path
          : `/home/user/${args.path}`;

        await sandbox.files.write(filePath, args.content);

        console.log("File written:", filePath);
      }

      if (toolName === "run_command") {
        if (!args.command) {
          throw new Error("run_command tool was called without a command");
        }
        const result = await sandbox.commands.run(args.commands);

        if (result.stderr) {
          console.log("Command error:", result.stderr);
        }
      }
    }

    return res.status(200).json({
      success: true,
      output: message?.content,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "AI request failed",
      error: String(error),
    });
  }
}
