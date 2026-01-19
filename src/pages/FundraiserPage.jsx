import { Link, Outlet, useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import CreatePledgeForm from "../components/CreatePledgeForm.jsx";
import useFundraiser from "../hooks/use-fundraiser";
import "./FundraiserPage.css";
import deleteFundraiser from "../api/delete-fundraiser"; // add this import

function FundraiserPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();

    const { fundraiser, isLoading, error } = useFundraiser(id);
    
    // Check if logged-in user is the owner
    const ownerUsername =
    fundraiser?.owner_username ?? fundraiser?.username ?? fundraiser?.owner ?? "";
const isOwner = !!fundraiser && !!auth?.username && auth.username === ownerUsername;

console.debug("Owner check:", {
    authUser: auth?.username,
    ownerField: fundraiser?.owner,
    usernameField: fundraiser?.username,
    ownerUsername,
    isOwner,
});

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
        });
    };

    const totalPledged = Array.isArray(fundraiser.pledges)
        ? fundraiser.pledges.reduce((sum, p) => sum + Number(p?.amount ?? 0), 0)
        : 0;

    const goalReached = totalPledged >= Number(fundraiser.goal);

    // Handler for update button
    const handleUpdateClick = () => {
        navigate(`/fundraisers/${id}/update`);
    };

    // Handler for delete button
    const handleDeleteClick = async () => {
        if (!window.confirm("Are you sure you want to delete this fundraiser?")) {
            return;
        }

        try {
            await deleteFundraiser(id, auth.token);
            alert("Fundraiser deleted successfully!");
            navigate("/");
        } catch (err) {
            console.error("Delete failed:", err);
            alert(`Failed to delete fundraiser: ${err.message}`);
        }
    };

    return (
        <div className="fundraiser-page">
            <h1 className="underline">{fundraiser.title}</h1>
            <h3 className="text-center">
                Created by: <Link to={`/users/${fundraiser.owner}`}>{fundraiser.username}</Link> on {formatDate(fundraiser.date_created)}
            </h3>
            <div className="description-text" dangerouslySetInnerHTML={{ __html: fundraiser.description }} />
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
                            ${pledgeData.amount} from <Link to={`/users/${pledgeData.supporter}`}>{pledgeData.username}</Link> - "{pledgeData.comment}"
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
                onSuccess={() => window.location.reload()}
            />

            {isOwner && (
                <div className="owner-actions">
                    <button
                        type="button"
                        className="btn-update"
                        onClick={handleUpdateClick}
                    >
                        Update Fundraiser
                    </button>
                    <button
                        type="button"
                        className="btn-delete"
                        onClick={handleDeleteClick}
                    >
                        Delete Fundraiser
                    </button>
                </div>
            )}

            <Outlet />
        </div>
    );
}

export default FundraiserPage;