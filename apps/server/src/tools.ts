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
                    description: "Absolute path of the file.",
                },
                content: {
                    type: "string",
                    description: "Complete content of the file.",
                },
            },
            required: ["path", "content"],
        },
    },
];