import { useState } from "react";
import { useNavigate } from "react-router-dom";
import postCreateUser from "../api/create-user.js";
import { useAuth } from "../hooks/use-auth.js";

function CreateUserForm() {
    const navigate = useNavigate();
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
            const created = await postCreateUser(newuserpayload);
            // navigate to created fundraiser page or home
            navigate(`/users/${created.id}`);
        } catch (err) {
            console.error(err);
            setError(err?.message || "Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    return (
    <form>
        <div>
            <label htmlFor="username">Username:</label>
            <input 
                type="text"
                id="username"
                placeholder="Username"
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label htmlFor="first-name">First name:</label>
            <input 
                type="text" 
                id="first-name" 
                placeholder="First name"
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label htmlFor="last-name">Last name:</label>
            <input 
                id="last-name"
                placeholder="Last name"
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label htmlFor="email">Email:</label>
            <input 
                id="email"
                placeholder="Email"
                onChange={handleChange}
                required
            />
        </div>
        <div>
            <label htmlFor="password">Password:</label>
            <input 
                id="password"
                placeholder="Password"
                onChange={handleChange}
                required
            />
        </div>
        <button type="submit" onClick={handleSubmit}>Create New User</button>
    </form>
    );
}

export default CreateUserForm;