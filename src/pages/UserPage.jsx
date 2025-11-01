import {Link, Outlet, useParams} from "react-router-dom";
import useUser from "../hooks/use-user";

function UserPage() {
    // Here we use a hook that comes for free in react router called `useParams` to get the id from the URL so that we can pass it to our useFundraiser hook.
    const { id } = useParams();

    // useUser returns three pieces of info, so we need to grab them all here
    const { user, isLoading, error } = useUser(id);
    
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
            <h2>{user.username}</h2>
            <h2>Date joined: {formatDate(user.date_joined)}</h2>
        
        <div className="update-user-button">
                <Link to="update">
                    <button>Update user</button>
                </Link>
                <Outlet />
            </div>
        </div>
    );
}

export default UserPage;