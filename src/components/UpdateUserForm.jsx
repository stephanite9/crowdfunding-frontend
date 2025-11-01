import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import putUpdateUser from "../api/update-user.js";
import { useAuth } from "../hooks/use-auth.js";

function UpdateUserForm() {
    const navigate = useNavigate();
    const { id } = useParams(); // get fundraiser id from URL
    const { auth } = useAuth();

    const [userform, setUserform] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { id, value } = event.target;
        setUserform(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        // basic validation
        if (!userform.username || !userform.email || !userform.password) {
            setError("Username, password and email are required.");
            return;
        }

        const newuserpayload = {
            username: userform.username,
            first_name: userform.first_name,
            last_name: userform.last_name,
            email: userform.email,
            password: userform.password
        };

        setLoading(true);
                try {
                    const updated = await putUpdateUser(id, newuserpayload, auth?.token);
                    navigate(`/users/${updated.id}`);
                } catch (err) {
                    console.error(err);
                    setError(err?.message || "Failed to update user");
                } finally {
                    setLoading(false);
                }
            };

    return (
    <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="username">Username:</label>
            <input 
                type="text"
                id="username"
                value={userform.username}
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label htmlFor="first_name">First name:</label>
            <input 
                type="text" 
                id="first_name" 
                value={userform.first_name}
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label htmlFor="last_name">Last name:</label>
            <input 
                id="last_name"
                value={userform.last_name}
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label htmlFor="email">Email:</label>
            <input 
                id="email"
                value={userform.email}
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label htmlFor="password">Password:</label>
            <input 
                id="password"
                value={userform.password}
                onChange={handleChange}
                required
            />
        </div>
        {error && <div className="error" role="alert">{error}</div>}

            <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update user"}
            </button>
        </form>
    );
}

export default UpdateUserForm;