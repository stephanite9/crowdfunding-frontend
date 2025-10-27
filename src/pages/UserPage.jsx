import {useParams} from "react-router-dom";
import useFundraiser from "../hooks/use-fundraiser";

function FundraiserPage() {
    // Here we use a hook that comes for free in react router called `useParams` to get the id from the URL so that we can pass it to our useFundraiser hook.
    const { id } = useParams();

    // useFundraiser returns three pieces of info, so we need to grab them all here
    const { fundraiser, isLoading, error } = useFundraiser(id);
    
    if (isLoading) {
        return (<p>loading...</p>)
    }

    if (error) {
        return (<p>{error.message}</p>)
    }

    const formatDate = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }); // en-GB gives DD/MM/YYYY
    };

    return (
        <div>
            <h2>{fundraiser.title}</h2>
            <h3>{fundraiser.description}</h3>
            <h3>Goal: ${Number(fundraiser.goal)}</h3>
            <h3>Production location: {fundraiser.location}</h3>
            <h3>Media type: {fundraiser.media}</h3>
            <h3>Created on: {formatDate(fundraiser.date_created)}</h3>
            <h3>Status: {fundraiser?.is_open ? "Open for pledges!" : "Funding closed"}</h3>
            <h3>Pledges:</h3>
            <ul>
                {fundraiser.pledges.map((pledgeData, key) => {
                    return (
                        <li key={key}>
                            ${pledgeData.amount} from {pledgeData.supporter}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default FundraiserPage;