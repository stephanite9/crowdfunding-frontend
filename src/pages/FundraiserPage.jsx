import { Link, Outlet, useParams} from "react-router-dom";
import CreatePledgeForm from "../components/CreatePledgeForm.jsx";
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

    const totalPledged = Array.isArray(fundraiser.pledges)
        ? fundraiser.pledges.reduce((sum, p) => sum + Number(p?.amount ?? 0), 0)
        : 0;

    const goalReached = totalPledged >= Number(fundraiser.goal);

    return (
        <div>
            <h1 className="underline">{fundraiser.title}</h1>
            <h3 className="text-center">Created by: {fundraiser.username} on {formatDate(fundraiser.date_created)}</h3>
            <h3 className="text-center">{fundraiser.description}</h3>
            <h3>-----</h3>
            <h3>Goal: ${Number(fundraiser.goal)}</h3>
            <h3>Production location: {fundraiser.location}</h3>
            <h3>Media type: {fundraiser.media}</h3>
            <h3>Status: {fundraiser?.is_open ? "Open for pledges!" : "Funding closed"}</h3>
            <h3>Pledges:</h3>
            <ul>
                {fundraiser.pledges.map((pledgeData, key) => {
                    return (
                        <li key={key}>
                            ${pledgeData.amount} from {pledgeData.username} - "{pledgeData.comment}"
                        </li>
                    );
                })}
            </ul>

            <p>
                Current total pledged: ${totalPledged} of ${Number(fundraiser.goal)}
                {goalReached && <strong> - Goal reached!</strong>}
            </p>

            <CreatePledgeForm
                fundraiserId={id}
                onSuccess={() => window.location.reload()} // replace with a refetch if available
            />

            <div>
                <Link to="update">Update fundraiser</Link>
                <Outlet />
            </div>
        </div>
    );
}

export default FundraiserPage;