import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import putUpdateFundraiser from "../api/update-fundraiser.js";
import { useAuth } from "../hooks/use-auth.js";

function UpdateFundraiserForm() {
    const navigate = useNavigate();
    const { id } = useParams(); // get fundraiser id from URL
    const { auth } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        media: "",
        goal: "",
        imageUrl: "",
        is_open: true
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch existing fundraiser data to prefill form
    useEffect(() => {
        if (!auth?.token) {
            navigate("/login");
            return;
        }

        const fetchFundraiser = async () => {
            try {
                const url = `${import.meta.env.VITE_API_URL}/fundraisers/${id}/`;
                const res = await fetch(url, {
                    headers: { Authorization: `Token ${auth.token}` }
                });
                if (!res.ok) throw new Error("Failed to load fundraiser");
                const data = await res.json();
                setFormData({
                    title: data.title ?? "",
                    description: data.description ?? "",
                    location: data.location ?? "",
                    media: data.media ?? "",
                    goal: data.goal ?? "",
                    imageUrl: data.image ?? "",
                    is_open: data.is_open ?? true
                });
            } catch (err) {
                console.error(err);
                setError("Failed to load fundraiser data");
            }
        };

        fetchFundraiser();
    }, [auth, id, navigate]);

    const handleChange = (event) => {
        const { id, value, type, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        // Validation
        if (!formData.title || !formData.description || !formData.goal) {
            setError("Title, description and goal are required.");
            return;
        }

        const payload = {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            media: formData.media,
            goal: Number(formData.goal),
            image: formData.imageUrl || "https://placehold.co/600x400",
            is_open: formData.is_open
        };

        setLoading(true);
        try {
            const updated = await putUpdateFundraiser(id, payload, auth?.token);
            navigate(`/fundraisers/${updated.id}`);
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
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="location">Location:</label>
                <select
                    id="location"
                    value={formData.location}
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
                    value={formData.media}
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
                    value={formData.goal}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="imageUrl">Image URL (optional)</label>
                <input
                    id="imageUrl"
                    type="text"
                    value={formData.imageUrl}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="is_open">
                    <input
                        id="is_open"
                        type="checkbox"
                        checked={formData.is_open}
                        onChange={handleChange}
                    />
                    Open for pledges
                </label>
            </div>

            {error && <div className="error" role="alert">{error}</div>}

            <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Fundraiser"}
            </button>
        </form>
    );
}

export default UpdateFundraiserForm;