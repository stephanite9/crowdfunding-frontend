import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import putUpdateFundraiser from "../api/update-fundraiser.js";
import { useAuth } from "../hooks/use-auth.js";

function UpdateFundraiserForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { auth } = useAuth();

    const [newfundraiserform, setNewfundraiserform] = useState({
        title: "",
        description: "",
        location: "",
        media: "",
        goal: "",
        imageUrl: ""
    });

    useEffect(() => {
        if (!auth?.token) {
            navigate("/login");
        }
    }, [auth, navigate]);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { id, value } = event.target;
        setNewfundraiserform(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        // basic validation
        if (!newfundraiserform.title || !newfundraiserform.description || !newfundraiserform.goal) {
            setError("Title, description and goal are required.");
            return;
        }

        const newfundraiserpayload = {
            title: newfundraiserform.title,
            description: newfundraiserform.description,
            location: newfundraiserform.location,
            media: newfundraiserform.media,
            goal: Number(newfundraiserform.goal),
            image: newfundraiserform.imageUrl || "https://placehold.co/600x400",
            is_open: true
        };

        setLoading(true);
        try {
            const created = await putUpdateFundraiser(newfundraiserpayload, auth?.token);
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
    <form>
        <div>
            <label htmlFor="title">Title:</label>
            <input 
                type="text"
                id="title"
                placeholder="Create fundraiser title"
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label htmlFor="description">Description:</label>
            <input 
                type="text" 
                id="description" 
                placeholder="Enter description of fundraiser"
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label htmlFor="location">Location:</label>
            <select 
                id="location" 
                onChange={handleChange}
                required
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
                onChange={handleChange}
                required
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
                placeholder="Enter fundraising goal amount"
                onChange={handleChange}
                required
            />
        </div>
        <div>
                <label htmlFor="imageUrl">Image URL (optional)</label>
                <input id="imageUrl" onChange={handleChange} />
        </div>
        <button type="submit" onClick={handleSubmit}>Update Fundraiser</button>
    </form>
    );
}

export default UpdateFundraiserForm;