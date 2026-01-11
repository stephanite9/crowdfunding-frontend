async function postCreateFundraiser(fundraiserData, token) {
    const url = `${import.meta.env.VITE_API_URL}/fundraisers/`;

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(fundraiserData), // Make sure this isn't double-encoding
    });

    if (!response.ok) {
        const fallbackError = `Error creating fundraiser`;
        const data = await response.json().catch(() => null);
        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}

export default postCreateFundraiser;