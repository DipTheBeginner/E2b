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





export async function Signin(email: string, password: string) {

  const response = await fetch(`${BASE_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      
    },
    body: JSON.stringify({
      email,
      password
    })
  })

  return response.json();
}





export async function getProjects() {
  const token = localStorage.getItem("token");


  const response = await fetch(`${BASE_URL}/projects`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });


  return response.json();

  
}


export async function createProjects(name:string) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "content-type":"application/json",
      Authorization:`Bearer ${token}`
    },

    body: JSON.stringify({
      name,
      
    })
  })

  return response.json();

  
}



export async function generateAI(prompt: string, projectId: string | null) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/ai`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      
    },

    body: JSON.stringify({
      prompt,
      projectId
    })
  })


  return response.json()
}