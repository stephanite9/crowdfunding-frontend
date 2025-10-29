import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import putUpdateFundraiser from "../api/update-fundraiser.js";
import { useAuth } from "../hooks/use-auth.js";

function UpdateFundraiserForm({initialData = {}, onSubmit}) {
    const navigate = useNavigate();
    // const { id } = useParams();
    const { auth } = useAuth();

    const [updateFundraiserdata, setUpdatefundraiserdata] = useState(initialData || {});
    const initializedRef = useRef(false);

    useEffect(() => {
    if (!initializedRef.current && initialData && Object.keys(initialData).length) {
        setUpdatefundraiserdata(initialData);
        initializedRef.current = true;
    }
}, [initialData]);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { id, value } = event.target;
        setUpdatefundraiserdata(prevData => ({ ...prevData, [id]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (onSubmit) onSubmit(updateFundraiserdata);
        setError(null);

        // // basic validation
        // if (!updateFundraiserdata.title || !updateFundraiserdata.description || !updateFundraiserdata.goal) {
        //     setError("Title, description and goal are required.");
        //     return;
        // }

        setLoading(true);
        try {
            // build payload from current state
            const payload = {
                title: updateFundraiserdata.title,
                description: updateFundraiserdata.description,
                location: updateFundraiserdata.location,
                media: updateFundraiserdata.media,
                goal: Number(updateFundraiserdata.goal),
                image: updateFundraiserdata.imageUrl || updateFundraiserdata.image || "https://placehold.co/600x400",
                is_open: updateFundraiserdata.is_open ?? true
            };
            const created = await putUpdateFundraiser(payload, auth?.token);
            // navigate to created fundraiser page or home
            navigate(`/fundraisers/${created.id}`);
        } catch (err) {
            console.error(err);
            setError(err?.message || "Failed to update fundraiser");
        } finally {
            setLoading(false);
        }
    };

    return (
    <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="title">Title:</label>
            <input 
                type="text"
                id="title"
                value={updateFundraiserdata.title ?? ""}
                onChange={handleChange}
            />
        </div>
        <div>
            <label htmlFor="description">Description:</label>
            <input 
                type="text" 
                id="description" 
                value={updateFundraiserdata.description ?? ''}
                onChange={handleChange}
            />
        </div>
        <div>
            <label htmlFor="location">Location:</label>
            <select 
                id="location"
                value={updateFundraiserdata.location ?? ""} 
                onChange={handleChange}
            >
                <option value="">--Please choose an option--</option>
                <option value="australia">Australia</option>
                <option value="newzealand">New Zealand</option>
                <option value="canada">Canada</option>
                <option value="japan">Japan</option>
            </select>
        </div>
        <div>
            <label htmlFor="media">Media type:</label>
            <select 
                id="media"
                value={updateFundraiserdata.media ?? ""}
                onChange={handleChange}
            >
                <option value="">--Please choose an option--</option>
                <option value="film">Film</option>
                <option value="tv">Television</option>
            </select>
        </div>
        <div>
            <label htmlFor="goal">Goal:</label>
            <input 
                type="number" 
                id="goal" 
                value={updateFundraiserdata.goal || ''}
                onChange={handleChange}
            />
        </div>
        <div>
                <label htmlFor="imageUrl">Image URL (optional)</label>
                <input
                id="imageUrl"
                value={updateFundraiserdata.imageUrl ?? updateFundraiserdata.image ?? ""}
                onChange={handleChange}
            />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Fundraiser"}
        </button>
    </form>
    );
}

export default UpdateFundraiserForm;