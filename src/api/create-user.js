async function postCreateUser(payload) {
    const url = `${import.meta.env.VITE_API_URL}/users/`;
    
    const headers = {
        "Content-Type": "application/json",
    };
    
    const response = await fetch(url, {
        method: "POST", // We need to tell the server that we are sending JSON data so we set the Content-Type header to application/json
        headers,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const fallbackError = `Error trying to create user`;

        const data = await response.json().catch(() => {
        throw new Error(fallbackError);
    });

    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
    }

    return await response.json();
}

export default postCreateUser;