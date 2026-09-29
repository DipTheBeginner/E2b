const BASE_URL = "http://localhost:5000";

export async function Signup(
  username: string,
  email: string,
  password: string,
) {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  return response.json();
}

export async function Signin(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return response.json();
}

export async function getProjects() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/projects`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}

export async function createProjects(name: string) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      name,
    }),
  });

  return response.json();
}

export async function generateAI(prompt: string, projectId: string | null , onEvent ? :(event :any)=> void) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/ai`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      prompt,
      projectId,
    }),
  });

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let finalResult;

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");

    buffer = events.pop() ?? "";

    for (const rawEvent of events) {
      const line = rawEvent
        .split("\n")
        .find((line) => line.startsWith("data:"));

      if (!line) {
        continue;
      }

      const eventText = line.slice(5).trim();

      if (!eventText) {
        continue;
      }

      try {
        const event = JSON.parse(eventText);

        console.log("SSE event:", event);

        onEvent?.(event);

        if (event.type === "status") {
          console.log("AI Status:", event.message);
        }
        if (event.type === "tool") {
          console.log("AI Tool:", event.tool);
        }

        if (event.type === "done") {
          finalResult = {
            success: true,
            output: event.output,
          };
        }

        if (event.type === "error") {
          finalResult = {
            success: false,
            message: event.message,
            error: event.error,
          };
        }
      } catch (error) {
        console.error("Failed to parse SSE event:", eventText);
      }
    }
  }

  return (
    finalResult ?? {
      success: false,
      message: "AI stream ended without a final response",
    }
  );
}
