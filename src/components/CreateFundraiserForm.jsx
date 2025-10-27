import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import postCreateFundraiser from "../api/create-fundraiser.js";
import { useAuth } from "../hooks/use-auth.js";

function CreateFundraiserForm() {
    const navigate = useNavigate();
    const { auth } = useAuth();

    const [fundraiserform, setFundraiserform] = useState({
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
        setFundraiserform(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        // basic validation
        if (!fundraiserform.title || !fundraiserform.description || !fundraiserform.goal) {
            setError("Title, description and goal are required.");
            return;
        }

        const newfundraiserpayload = {
            title: fundraiserform.title,
            description: fundraiserform.description,
            location: fundraiserform.location,
            media: fundraiserform.media,
            goal: Number(fundraiserform.goal),
            image: fundraiserform.imageUrl || "https://placehold.co/600x400",
            is_open: true
        };

        setLoading(true);
        try {
            const created = await postCreateFundraiser(newfundraiserpayload, auth?.token);
            // navigate to created fundraiser page or home
            navigate(`/fundraisers/${created.id}`);
        } catch (err) {
            console.error(err);
            setError(err?.message || "Failed to create fundraiser");
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
        <button type="submit" onClick={handleSubmit}>Submit New Fundraiser</button>
    </form>
    );
}

export default CreateFundraiserForm;