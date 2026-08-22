export const tools = [
  {
    type: "function" as const,
    function: {
      name: "update_file",
      description: "Create or update a file inside the E2B sandbox",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Path relative to /home/user",
          },
          content: {
            type: "string",
            description: "Complete content of the file",
          },
        },
        required: ["path", "content"],
      },
    },
  },

  {
    type: "function" as const,
    function: {
      name: "run_command",
      description: "run a shell command inside E2B sandbox",
      parameter: {
        type: "object",
        properties: {
          command: {
            type: "string",
            description:
              "The exact shell command to execute, for example: pwd, ls -la, npm install, or npm run dev.",
          },
        },
        required: ["command"],
      },
    },
  },
];
