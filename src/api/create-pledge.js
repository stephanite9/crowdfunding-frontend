/**
 * Create a pledge for an existing fundraiser.
 * @param {string|number} fundraiserId - ID of the fundraiser
 * @param {object} payload - { amount: number, comment?: string, anonymous?: boolean }
 * @param {string} [token] - auth token (will be sent as "Authorization: Token <token>")
 * @returns {Promise<object>} created pledge JSON
 */
async function postCreatePledge(fundraiserId, payload, token) {
    const url = `${import.meta.env.VITE_API_URL}/pledges/`;
    const {amount, comment, anonymous} = payload

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
            "amount": amount,
            "comment": comment,
            "anonymous": anonymous,
            "fundraiser": fundraiserId
        }),
    });

    if (!response.ok) {
        const fallbackError = `Error trying to create pledge`;
        const data = await response.json().catch(() => null);
        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}

export default postCreatePledge;