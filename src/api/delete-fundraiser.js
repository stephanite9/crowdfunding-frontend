async function deleteFundraiser(fundraiserId, token) {
    const url = `${import.meta.env.VITE_API_URL}/fundraisers/${fundraiserId}/`;

    const headers = {
        "Authorization": `Token ${token}`,
    };

    const response = await fetch(url, {
        method: "DELETE",
        headers,
    });

    if (!response.ok) {
        const fallbackError = `Error trying to delete fundraiser`;
        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });
        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return;
}

export default deleteFundraiser;