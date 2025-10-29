async function putUpdateFundraiser(fundraiserId, payload, token) {
    const url = `${import.meta.env.VITE_API_URL}/fundraisers/${fundraiserId}`;
    
    const headers = {
        "Content-Type": "application/json",
    };
    
    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }
    
    const response = await fetch(url, {
        method: "PUT", // We need to tell the server that we are sending JSON data so we set the Content-Type header to application/json
        headers,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const fallbackError = `Error trying to create fundraiser`;

        const data = await response.json().catch(() => {
        throw new Error(fallbackError);
    });

    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
    }

    return await response.json();
}

export default putUpdateFundraiser;