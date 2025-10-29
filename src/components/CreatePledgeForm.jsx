import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import postCreatePledge from "../api/create-pledge.js";
import { useAuth } from "../hooks/use-auth.js";

function CreatePledgeForm({ fundraiserId: propFundraiserId, onSuccess }) {
    const navigate = useNavigate();
    const { id: paramId } = useParams();
    const fundraiserId = propFundraiserId ?? paramId;
    const { auth } = useAuth();

    const [form, setForm] = useState({
        amount: "",
        comment: "",
        anonymous: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
        setForm((p) => ({
            ...p,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

    if (!fundraiserId) {
        setError("No fundraiser selected.");
        return;
    }

    const amountNumber = Number(form.amount);
    if (!amountNumber || amountNumber <= 0) {
        setError("Please enter a valid amount greater than 0.");
        return;
    }

    const payload = {
        amount: amountNumber,
        comment: form.comment || undefined,
        anonymous: !!form.anonymous,
    };

    setLoading(true);
    try {
        await postCreatePledge(fundraiserId, payload, auth?.token);
        if (onSuccess) {
        onSuccess();
        } else {
            navigate(`/fundraisers/${fundraiserId}`);
        }
    } catch (err) {
        console.error(err);
        setError(err?.message || "Failed to create pledge");
    } finally {
        setLoading(false);
    }
    };

    return (
        <form onSubmit={handleSubmit}>
        <div>
        <label htmlFor="amount">Amount</label>
        <input
            id="amount"
            type="number"
            min="1"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            required
        />
        </div>

        <div>
            <label htmlFor="comment">Comment (optional)</label>
            <textarea
            id="comment"
            value={form.comment}
            onChange={handleChange}
        />
        </div>

        <div>
        <label htmlFor="anonymous">
            <input
                id="anonymous"
                type="checkbox"
                checked={form.anonymous}
                onChange={handleChange}
            />
            Pledge anonymously
        </label>
        </div>

        {error && <div className="error" role="alert">{error}</div>}

        <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Make Pledge"}
        </button>
    </form>
    );
}

export default CreatePledgeForm;