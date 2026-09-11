const BASE_URL = "http://localhost:5000";



export async function Signup(username: string, email: string, password: string) {

  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      
    },
    body: JSON.stringify({
      username,
      email,
      password
    })
  })

  return response.json();
}