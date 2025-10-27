import { useState, useEffect } from "react";

import getUser from "../api/get-user";

export default function useUser(userId) {
    const [user, setUser] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
    // Here we pass the fundraiserId to the getFundraiser function.
    getUser(userId)
        .then((user) => {
            setUser(user);
            setIsLoading(false);
        })
        .catch((error) => {
            setError(error);
            setIsLoading(false);
        });

    // This time we pass the fundraiserId to the dependency array so that the hook will re-run if the fundraiserId changes.
    }, [userId]);

    return { user, isLoading, error };
}