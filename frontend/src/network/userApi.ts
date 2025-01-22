import { fetchResponse } from "./fetchResponse" ;


export async function getUserLoggedIn() {
    const response = await fetchResponse(`${process.env.REACT_APP_BACKEND_URL}/api/users/`, { 
        method: "POST",
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }) ; 
    return response.json() ;  
}


export interface SignUpInfo {
    username: string,
    email: string,
    password: string
}

export async function signUp(signUpInfo: SignUpInfo) {
    const response = await fetchResponse(`${process.env.REACT_APP_BACKEND_URL}/api/users/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(signUpInfo)
    }) ; 
    return response.json() ; 
}

export interface LogInInfo {
    username: string,
    email: string,
    password: string
}


export async function logIn(logInInfo: LogInInfo) {
    const response = await fetchResponse(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(logInInfo)
    }) ; 
    return response.json() ; 
}


export async function logOut() {
    await fetchResponse(`${process.env.REACT_APP_BACKEND_URL}/api/users/logout`, { 
        method: "POST",
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }) ; 
}
