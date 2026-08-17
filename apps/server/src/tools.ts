export const tools = [
  {
    type: "function" as const,
    name: "update_file",
    description: "Create or update a file inside the E2B sandbox.",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path of the file relative to /home/user.",
        },
        content: {
          type: "string",
          description: "Complete content of the file.",
        },
      },
      required: ["path", "content"],
    },
  },

  {
    type: "function" as const,
    name: "run_command",
    description:
      "Run a shell command inside the E2B sandbox. Use this to execute programs, inspect files, install dependencies, or start processes.",
    parameters: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "The shell command to execute.",
        },
      },
      required: ["command"],
    },
  },

  {
    type: "function" as const,
    name: "read_file",
    description: "Read the contents of file inside the sandbox",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path of the file to read",
        },
      },

      required: ["path"],
    },
  },

  {
    type: "function" as const,
    name: "delete_file",
    description: "Delete a file inside the sandbox",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path of the file to delete",
        },
      },

      required: ["path"],
    },
  },

  {
    type: "function" as const,
    name: "start_server",
    description:
      "Start a web server inside the E2B sandbox and return its preview URL",
    parameters: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "Command that starts the web server",
        },
        port: {
          type: "number",
          description: "Port on which the web server will listen",
        },
      },

      required: ["command", "port"],
    },
  },
];
