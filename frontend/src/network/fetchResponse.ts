

export async function fetchResponse(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init) ; 
    if (response.ok) {
        return response ; 
    } else {
        const errorBody = await response.json() ; 
        const errorMsg = errorBody.error ; 
        throw Error(errorMsg) ; 
    }
}
