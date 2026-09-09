const BASE_URL = "http://localhost:5000";



export async function signup(username: string, email: string, password: string) {

    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",

        },
        body: JSON.stringify({
            username,
            email,
            password,
        })


    })



    return response.json();




}


export async function login(email: string, password: string) {


    const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            email,
            password
        })


    })

    return response.json()



}


export function getCurrentUserId() {

    console.log("localStorage:", localStorage);
    console.log("window.localStorage:", window.localStorage);
    console.log("typeof localStorage:", typeof localStorage);
    console.log("typeof window.localStorage:", typeof window.localStorage);

    const token = window.localStorage.getItem("token");

    //const token = localStorage.getItem("token");

    if (typeof window === "undefined") {
        return null;
    }

    if (!token) {
        return null;
    }


    try {

        const parts = token.split(".")
        const payload = parts[1];

        if (!payload) {
            return null;
        }

        const decoded = JSON.parse(atob(payload))
        return decoded.id as string;
    } catch (error) {
        console.error("Failed to decode token", error)
        return null;
    }

}
